"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../../store/auth.store";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { UploadCloud, ChevronRight, Check, UsersRound, ChevronLeft, AlertCircle, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { uploadImage } from "../../actions/cloudinary";
import { createAuctionSchema } from "../../../lib/validations";
import { formatZodErrors } from "../../../lib/validations";
import { SearchableSelect } from "../../../components/ui/SearchableSelect";
import { ChronoSelect } from "../../../components/ui/chrono-select";
import { TimePicker } from "../../../components/ui/time-picker";
import { format } from "date-fns";

const steps = ["Basic Auction Info", "Add Auction's Teams", "Add Auction's Players"];

export default function CreateAuctionWizard() {
    const router = useRouter();
    const { firebaseToken } = useAuthStore();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const [activeStep, setActiveStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [pageReady, setPageReady] = useState(false);

    // Simulate initial page load
    useState(() => { setTimeout(() => setPageReady(true), 400); });

    const [auctionId, setAuctionId] = useState("");
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // --- STEP 1: AUCTION STATE ---
    const [auctionData, setAuctionData] = useState({
        name: "", auctionDate: "", location: "", session: "",
        auctionStartTime: "", budgetPerTeam: 10000000, minBid: 5000,
        bidIncrease: 5000, minPlayersPerTeam: 11, maxPlayersPerTeam: 15,
        sportsType: "Cricket", logo: ""
    });

    const handleAuctionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAuctionData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
        }
    };



    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                toast.info("Uploading your image... Just a moment.");
                const formData = new FormData();
                formData.append("file", file);
                const url = await uploadImage(formData);
                callback(url);
                toast.success("Image uploaded successfully!");
            } catch (error: any) {
                console.error("Upload error:", error);
                toast.error("We couldn't upload the image. Please try again.");
            }
        }
    };

    const submitAuction = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Validate with Zod
            const validation = createAuctionSchema.safeParse(auctionData);
            if (!validation.success) {
                setFormErrors(formatZodErrors(validation.error));
                toast.error("Please check the highlighted fields and correct any errors.");
                setIsLoading(false);
                return;
            }
            setFormErrors({});

            // 2. Map frontend 'session' to backend 'season'
            const payload = {
                ...validation.data,
                season: (auctionData as any).session || "",
            };

            // 3. Real API Call
            const response = await fetch(`${apiUrl}/auction`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${firebaseToken}`
                },
                body: JSON.stringify(payload)
            });

            const resData = await response.json();

            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error(resData.message || "Auction limit reached for your plan.");
                }
                throw new Error(resData.message || "Failed to create auction");
            }

            setAuctionId(resData.data.id);
            toast.success("Hooray! Your auction has been created.");
            setActiveStep(1);
        } catch (error: any) {
            toast.error("Something went wrong while creating the auction. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- STEP 2: TEAM STATE ---
    const [addedTeams, setAddedTeams] = useState<any[]>([]);
    const [teamData, setTeamData] = useState({ name: "", shortName: "", shortcutKey: "", logo: "" });

    const addTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamData.name || !teamData.shortName) return toast.error("Please provide both the Team Name and Short Name.");
        if (!auctionId) return toast.error("Auction ID is missing. Please restart Step 1.");

        setIsLoading(true);
        try {
            const payload = {
                ...teamData,
                auctionId,
                shortName: teamData.shortName.toUpperCase(),
                shortcutKey: teamData.shortcutKey.toUpperCase()
            };

            const response = await fetch(`${apiUrl}/team`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${firebaseToken}`
                },
                body: JSON.stringify(payload)
            });

            const resData = await response.json();

            if (!response.ok) {
                throw new Error(resData.message || "Failed to add team");
            }

            setAddedTeams(prev => [...prev, resData.data]);
            setTeamData({ name: "", shortName: "", shortcutKey: "", logo: "" });
            toast.success("Team added to the pool!");
        } catch (error: any) {
            toast.error("We couldn't add the team. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- STEP 3: PLAYER STATE ---
    const [uploadMethod, setUploadMethod] = useState<"MANUAL" | "BULK">("MANUAL");
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [bulkPreview, setBulkPreview] = useState<{
        previewData: any[];
        errors: any[];
        canProceed: boolean;
        totalRows: number;
        validCount: number;
        invalidCount: number;
        plan: string;
        planLimit: number;
        existingPlayers: number;
    } | null>(null);
    const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

    const [addedPlayers, setAddedPlayers] = useState<any[]>([]);
    const [playerData, setPlayerData] = useState({
        name: "", mobile: "", fatherName: "", age: "", role: "BATSMAN",
        battingStyle: "", bowlingStyle: "", tshirtSize: "", trouserSize: "", basePrice: ""
    });

    const handleCsvPreview = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCsvFile(file);
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("auctionId", auctionId);

            const res = await fetch(`${apiUrl}/player/upload/preview`, {
                method: "POST",
                headers: { Authorization: `Bearer ${firebaseToken}` },
                body: formData
            });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || "Failed to preview file");

            setBulkPreview({
                previewData: resData.data.previewData || [],
                errors: resData.data.errors || [],
                canProceed: resData.data.canProceed,
                totalRows: resData.data.totalRows,
                validCount: resData.data.validCount,
                invalidCount: resData.data.invalidCount,
                plan: resData.data.plan,
                planLimit: resData.data.planLimit,
                existingPlayers: resData.data.existingPlayers
            });
            toast.success("File preview loaded successfully!");
        } catch (error: any) {
            toast.error("We couldn't read the file. Please check the format.");
            setCsvFile(null);
            setBulkPreview(null);
        } finally {
            setIsLoading(false);
        }
    };

    const confirmBulkUpload = async () => {
        if (!bulkPreview?.previewData.length) return;
        setIsLoading(true);

        try {
            const res = await fetch(`${apiUrl}/player/upload/confirm`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${firebaseToken}` },
                body: JSON.stringify({ auctionId, players: bulkPreview.previewData })
            });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || "Failed to upload players");

            toast.success(`${resData.data?.count || bulkPreview.previewData.length} players have been added to the pool!`);

            // Add successfully uploaded players to local state to reflect in UI
            setAddedPlayers(prev => [...prev, ...(resData.data?.players || bulkPreview.previewData)]);

            setBulkPreview(null);
            setCsvFile(null);
        } catch (error: any) {
            toast.error("Something went wrong during the upload. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const addPlayer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!playerData.name || !playerData.mobile || !playerData.age || !playerData.role) {
            return toast.error("Please fill in all the required player details.");
        }
        if (!auctionId) return toast.error("Auction ID is missing. Please restart Step 1.");

        setIsLoading(true);
        try {
            const payload = {
                ...playerData,
                auctionId,
                age: Number(playerData.age),
                basePrice: playerData.basePrice ? Number(playerData.basePrice) : undefined
            };

            const response = await fetch(`${apiUrl}/player`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${firebaseToken}`
                },
                body: JSON.stringify(payload)
            });

            const resData = await response.json();

            if (!response.ok) {
                throw new Error(resData.message || "Failed to add player");
            }

            setAddedPlayers(prev => [...prev, resData.data]);
            setPlayerData({
                name: "", mobile: "", fatherName: "", age: "", role: "BATSMAN",
                battingStyle: "", bowlingStyle: "", tshirtSize: "", trouserSize: "", basePrice: ""
            });
            toast.success("Player added to the pool!");
        } catch (error: any) {
            toast.error("We couldn't add the player. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Animation
    const containerVariants: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
    const itemVariants: any = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } } };

    // ───── SKELETON ─────
    if (!pageReady) {
        return (
            <div className="w-full min-h-full flex flex-col font-poppins animate-pulse">
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                    <div className="h-3 w-3 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
                <div className="h-8 w-44 bg-gray-300/60 rounded mb-8" />
                <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-8 w-full max-w-[1240px]">
                    {/* Stepper skeleton */}
                    <div className="flex justify-between items-center mb-12 px-12">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                <div className="h-3 w-20 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                    {/* Form skeleton */}
                    <div className="flex flex-col gap-6">
                        <div className="h-5 w-32 bg-gray-200 rounded" />
                        <div className="h-24 w-full bg-gray-100 rounded-xl border-2 border-dashed border-gray-200" />
                        <div className="grid grid-cols-2 gap-5">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="flex flex-col gap-1.5">
                                    <div className="h-3 w-24 bg-gray-200 rounded" />
                                    <div className="h-10 w-full bg-gray-100 rounded-lg" />
                                </div>
                            ))}
                        </div>
                        <div className="h-12 w-40 bg-gray-300/60 rounded-full self-end" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-full flex flex-col font-poppins">
            <div className="fixed inset-0 pointer-events-none z-0 hidden lg:block">
                <div className="sticky top-0 w-full h-screen overflow-hidden">
                    <div className="absolute" style={{ width: "140px", height: "200vh", background: "linear-gradient(80deg, #08245E, #0A307F)", transform: "rotate(18deg)", left: "70%", top: "-20%" }} />
                    <div className="absolute" style={{ width: "140px", height: "200vh", background: "#0A307F", transform: "rotate(18deg)", left: "63%", top: "-20%", filter: "drop-shadow(0 4px 20px #000)" }} />
                </div>
            </div>
            <div className="relative z-10 flex flex-col w-full max-w-[1400px] mx-auto">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium mb-4 px-2">
                    <Link href="/dashboard/organizer" className="hover:text-[#012972]">Dashboard</Link>
                    <span>/</span>
                    <span className="text-[#012972] font-semibold">Create Auction</span>
                </div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex justify-between items-center mb-8">
                    <h1 className="text-[28px] font-extrabold text-gray-900 drop-shadow-sm leading-tight">Create Auction</h1>
                </motion.div>

                {/* Stepper Wrapper */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-8 w-full max-w-[1240px]">

                    <div className="mb-12 px-0 md:px-12">
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label, index) => {
                                const stepProps: { completed?: boolean } = {};
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel
                                            StepIconProps={{
                                                classes: {
                                                    root: `!w-8 !h-8 !text-gray-400 [&.Mui-active]:!text-[#0C3278] [&.Mui-completed]:!text-green-500`,
                                                    text: `!fill-white !font-bold`
                                                }
                                            }}
                                        >
                                            <span className="font-semibold text-gray-700">{label}</span>
                                        </StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                    </div>

                    {/* --- RENDER LOGIC --- */}
                    {activeStep === 0 && (
                        <motion.form variants={containerVariants} initial="hidden" animate="show" onSubmit={submitAuction} className="flex flex-col gap-6 w-full">
                            <motion.h2 variants={itemVariants} className="text-[#012972] font-bold text-xl mb-2">Basic Auction Info</motion.h2>

                            <motion.div variants={itemVariants} className="flex flex-col gap-2 mb-4">
                                {auctionData.logo ? (
                                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 shadow-sm mx-auto md:mx-0 group">
                                        <img src={auctionData.logo} alt="Auction Logo" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                                            <label className="text-white text-xs font-semibold cursor-pointer bg-[#012972] px-3 py-1.5 rounded-full hover:bg-blue-800 flex items-center gap-1">
                                                <UploadCloud size={14} /> Re-upload
                                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setAuctionData({ ...auctionData, logo: url }))} />
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4 border-2 border-dashed border-gray-300 rounded-xl p-6 bg-white justify-center relative hover:bg-gray-50 transition-colors">
                                        <UploadCloud className="text-gray-400" size={32} />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[#012972] text-[14px]">Upload Auction Logo <span className="text-gray-400 font-normal ml-1 text-[11px]">(Optional)</span></span>
                                            <span className="text-[12px] text-gray-500">Max size 2MB</span>
                                        </div>
                                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, (url) => setAuctionData({ ...auctionData, logo: url }))} />
                                    </div>
                                )}
                            </motion.div>

                            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                                <InputField label="Auction Name" req name="name" value={auctionData.name} onChange={handleAuctionChange} placeholder="Enter auction name" />
                                <div className="flex flex-col gap-1.5 z-50">
                                    <label className="text-[14px] font-semibold text-gray-700">Sports Type</label>
                                    <SearchableSelect
                                        options={[
                                            { label: "Cricket", value: "CRICKET" },
                                            { label: "Football", value: "FOOTBALL" },
                                            { label: "Kabaddi", value: "KABADDI" }
                                        ]}
                                        value={auctionData.sportsType}
                                        onChange={(val) => setAuctionData(prev => ({ ...prev, sportsType: val }))}
                                        placeholder="Select Sports Type"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label className="text-[13px] font-semibold text-gray-700">Auction Date <span className="text-red-500">*</span></label>
                                    <ChronoSelect
                                        className="w-full h-[42px] border-gray-300 rounded-[8px]"
                                        value={auctionData.auctionDate ? new Date(auctionData.auctionDate) : undefined}
                                        onChange={(date: Date | undefined) => setAuctionData({ ...auctionData, auctionDate: date ? format(date, "yyyy-MM-dd") : "" })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label className="text-[13px] font-semibold text-gray-700">Auction Start Time <span className="text-red-500">*</span></label>
                                    <TimePicker
                                        className="w-full h-[42px] border-gray-300 rounded-[8px]"
                                        value={auctionData.auctionStartTime ? new Date(`1970-01-01T${auctionData.auctionStartTime}`) : new Date()}
                                        onChange={(date: Date) => setAuctionData({ ...auctionData, auctionStartTime: format(date, "HH:mm") })}
                                    />
                                </div>
                                <InputField label="Location" req type="text" name="location" value={auctionData.location} onChange={handleAuctionChange} />
                                <InputField label="Session" type="number" name="session" value={auctionData.session} onChange={handleAuctionChange} />
                            </motion.div>

                            <motion.div variants={itemVariants} className="h-[1px] w-full bg-gray-100 my-2" />

                            <motion.h2 variants={itemVariants} className="text-[#012972] font-bold text-xl mb-2">Rules & Budget</motion.h2>
                            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                                <InputField label="Budget Per Team" req type="number" name="budgetPerTeam" value={auctionData.budgetPerTeam.toString()} onChange={handleAuctionChange} />
                                <InputField label="Min Bid" req type="number" name="minBid" value={auctionData.minBid.toString()} onChange={handleAuctionChange} />
                                <InputField label="Bid Increase" req type="number" name="bidIncrease" value={auctionData.bidIncrease.toString()} onChange={handleAuctionChange} />
                                <InputField label="Min Players / Team" req type="number" name="minPlayersPerTeam" value={auctionData.minPlayersPerTeam.toString()} onChange={handleAuctionChange} />
                                <InputField label="Max Players / Team" req type="number" name="maxPlayersPerTeam" value={auctionData.maxPlayersPerTeam.toString()} onChange={handleAuctionChange} />
                            </motion.div>

                            <motion.div variants={itemVariants} className="mt-8 flex justify-end">
                                <button type="submit" disabled={isLoading} className="btn-primary">
                                    {isLoading ? "Processing..." : "Next Step"} <ChevronRight size={18} strokeWidth={3} />
                                </button>
                            </motion.div>
                        </motion.form>
                    )}


                    {activeStep === 1 && (
                        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6 w-full">
                            <motion.div variants={itemVariants} className="flex justify-between items-center bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                <div>
                                    <h2 className="text-[#012972] font-bold text-xl">Add Auction's Teams</h2>
                                    <p className="text-gray-500 text-sm mt-1">You can add teams now, or skip and add them later from your Auction Panel.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setActiveStep(2)} className="btn-primary">
                                        Skip to Players<ChevronRight size={18} strokeWidth={3} />
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-8">
                                <form onSubmit={addTeam} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col gap-5">
                                    <h3 className="font-bold text-gray-800">New Team Details</h3>
                                    <div className="flex flex-col gap-2">
                                        {teamData.logo ? (
                                            <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm mx-auto md:mx-0 group">
                                                <img src={teamData.logo} alt="Team Logo" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                                                    <label className="text-white text-[10px] font-semibold cursor-pointer bg-[#012972] px-2 py-1 rounded-full hover:bg-blue-800 flex items-center gap-1">
                                                        <UploadCloud size={12} /> Re-upload
                                                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setTeamData({ ...teamData, logo: url }))} />
                                                    </label>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-4 border-2 border-dashed border-gray-300 rounded-xl p-6 bg-white justify-center relative hover:bg-gray-50 transition-colors">
                                                <UploadCloud className="text-gray-400" size={32} />
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-[#012972] text-[14px]">Upload Logo <span className="text-gray-400 font-normal ml-1 text-[11px]">(Optional)</span></span>
                                                    <span className="text-[12px] text-gray-500">Max size 2MB</span>
                                                </div>
                                                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, (url) => setTeamData({ ...teamData, logo: url }))} />
                                            </div>
                                        )}
                                    </div>
                                    <InputField label="Team Name" req value={teamData.name} onChange={(e: any) => setTeamData({ ...teamData, name: e.target.value })} placeholder="e.g. Chennai Super Kings" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField label="Short Name" req value={teamData.shortName} onChange={(e: any) => setTeamData({ ...teamData, shortName: e.target.value })} placeholder="e.g. CSK" />
                                        <InputField label="Shortcut Key" value={teamData.shortcutKey} onChange={(e: any) => setTeamData({ ...teamData, shortcutKey: e.target.value })} placeholder="e.g. C" />
                                    </div>
                                    <button type="submit" disabled={isLoading} className="btn-primary">
                                        {isLoading ? "Saving..." : <><UsersRound size={20} />Add Team to Pool</>}
                                    </button>
                                </form>

                                <div className="flex flex-col gap-3">
                                    <h3 className="font-bold text-gray-800">Added Auction's Teams ({addedTeams.length})</h3>
                                    {addedTeams.length === 0 ? (
                                        <div className="flex-1 border border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 font-medium bg-gray-50/50 min-h-[200px]">
                                            No teams added yet
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                            {addedTeams.map((t, idx) => (
                                                <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * idx }} className="bg-white border border-gray-200 p-3 rounded-xl flex items-center gap-4 shadow-sm">
                                                    <div className="w-12 h-12 bg-[#012972] rounded-lg text-white font-bold flex items-center justify-center text-xs">{t.shortName}</div>
                                                    <div>
                                                        <p className="font-bold text-gray-800 leading-none mb-1">{t.name}</p>
                                                        <p className="text-xs text-gray-500 font-medium">Key: {t.shortcutKey || 'None'}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                            <div className="flex h-12 justify-between ">
                                <button onClick={() => setActiveStep(0)} className="btn-secondary">
                                    <ChevronLeft size={18} /> Go Back
                                </button>
                                <button type="submit" disabled={isLoading} className="btn-primary">
                                    {isLoading ? "Processing..." : "Next Step"} <ChevronRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}


                    {activeStep === 2 && (
                        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6 w-full">
                            <motion.div variants={itemVariants} className="flex justify-between items-center bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                <div>
                                    <h2 className="text-[#012972] font-bold text-xl">Add Auction's Players</h2>
                                    <p className="text-gray-500 text-sm mt-1">Add individual players to your auction pool, or skip and bulk upload via Excel later.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => router.push("/dashboard/my-auction")} className="btn-primary">
                                        Skip to Dashboard<ChevronRight size={18} strokeWidth={3} />
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-8">
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col gap-5">
                                    <div className="flex rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm">
                                        <button type="button" onClick={() => setUploadMethod("MANUAL")} className={`flex-1 py-3 text-sm font-bold transition-colors ${uploadMethod === "MANUAL" ? "bg-[#012972] text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                                            Manual Upload
                                        </button>
                                        <button type="button" onClick={() => setUploadMethod("BULK")} className={`flex-1 py-3 text-sm font-bold transition-colors ${uploadMethod === "BULK" ? "bg-[#012972] text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                                            Bulk Upload (Excel/CSV)
                                        </button>
                                    </div>

                                    {uploadMethod === "MANUAL" ? (
                                        <form onSubmit={addPlayer} className="flex flex-col gap-5 mt-2">
                                            <h3 className="font-bold text-gray-800">New Player Details</h3>
                                            <div className="flex flex-col gap-2">
                                                {(playerData as any).photo ? (
                                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm mx-auto md:mx-0 group">
                                                        <img src={(playerData as any).photo} alt="Player Photo" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                                                            <label className="text-white text-[10px] font-semibold cursor-pointer bg-[#012972] px-2 py-1 rounded-full hover:bg-blue-800 flex items-center gap-1">
                                                                <UploadCloud size={12} /> Re-upload
                                                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setPlayerData({ ...playerData, photo: url } as any))} />
                                                            </label>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-4 border-2 border-dashed border-gray-300 rounded-xl p-6 bg-white justify-center relative hover:bg-gray-50 transition-colors">
                                                        <UploadCloud className="text-gray-400" size={32} />
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-[#012972] text-[14px]">Upload Player Photo <span className="text-gray-400 font-normal ml-1 text-[11px]">(Optional)</span></span>
                                                            <span className="text-[12px] text-gray-500">Max size 2MB</span>
                                                        </div>
                                                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, (url) => setPlayerData({ ...playerData, photo: url } as any))} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <InputField label="Name" req value={playerData.name} onChange={(e: any) => setPlayerData({ ...playerData, name: e.target.value })} placeholder="Player Name" />
                                                <InputField label="Mobile" req type="tel" value={playerData.mobile} onChange={(e: any) => setPlayerData({ ...playerData, mobile: e.target.value })} placeholder="Phone number" />
                                                <InputField label="Age" req type="number" value={playerData.age} onChange={(e: any) => setPlayerData({ ...playerData, age: e.target.value })} placeholder="e.g. 24" />
                                                <div className="flex flex-col gap-1.5 justify-end z-40">
                                                    <label className="text-[13px] font-semibold text-gray-700">Role <span className="text-red-500">*</span></label>
                                                    <SearchableSelect
                                                        options={[
                                                            { label: "Batsman", value: "BATSMAN" },
                                                            { label: "Bowler", value: "BOWLER" },
                                                            { label: "All Rounder", value: "ALL_ROUNDER" },
                                                            { label: "Wicket Keeper", value: "WICKET_KEEPER" }
                                                        ]}
                                                        value={playerData.role}
                                                        onChange={(val) => setPlayerData({ ...playerData, role: val })}
                                                        placeholder="Select Role"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <InputField label="Base Price" value={playerData.basePrice} onChange={(e: any) => setPlayerData({ ...playerData, basePrice: e.target.value })} placeholder="e.g. 5000" />
                                                <InputField label="Father's Name" value={playerData.fatherName} onChange={(e: any) => setPlayerData({ ...playerData, fatherName: e.target.value })} placeholder="Optional" />
                                                <InputField label="Batting Style" value={playerData.battingStyle} onChange={(e: any) => setPlayerData({ ...playerData, battingStyle: e.target.value })} placeholder="Optional" />
                                                <InputField label="Bowling Style" value={playerData.bowlingStyle} onChange={(e: any) => setPlayerData({ ...playerData, bowlingStyle: e.target.value })} placeholder="Optional" />
                                                <InputField label="T-Shirt Size" value={playerData.tshirtSize} onChange={(e: any) => setPlayerData({ ...playerData, tshirtSize: e.target.value })} placeholder="Optional" />
                                                <InputField label="Trouser Size" value={playerData.trouserSize} onChange={(e: any) => setPlayerData({ ...playerData, trouserSize: e.target.value })} placeholder="Optional" />
                                            </div>
                                            <button type="submit" disabled={isLoading} className="btn-primary">
                                                {isLoading ? "Saving..." : <><UsersRound size={20} />Add Player to Pool</>}
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="flex flex-col gap-5 mt-2">
                                            {isLoading && (
                                                <div className="flex flex-col items-center justify-center p-12 bg-gray-50 border border-gray-200 rounded-2xl min-h-[300px]">
                                                    <Loader2 className="h-10 w-10 animate-spin text-[#012972] mb-4" />
                                                    <span className="font-bold text-gray-700 text-sm">
                                                        {bulkPreview ? "Importing players to pool..." : "Uploading and parsing file..."}
                                                    </span>
                                                    <span className="text-xs text-gray-500 mt-1">
                                                        {bulkPreview ? "Saving records to database..." : "Checking rows and mapping player roles..."}
                                                    </span>
                                                </div>
                                            )}

                                            {!isLoading && !bulkPreview && (
                                                <>
                                                    <h3 className="font-bold text-gray-800">Bulk Upload Data</h3>
                                                    <p className="text-sm text-gray-500">Upload a CSV or Excel file containing your players list. Ensure the file follows the required format.</p>

                                                    <div className="flex flex-col items-center gap-4 border-[3px] border-dashed border-gray-200 hover:border-[#012972]/50 rounded-2xl p-12 bg-gray-50 justify-center relative transition-colors cursor-pointer group">
                                                        <UploadCloud className="text-[#012972] group-hover:scale-110 transition-transform" size={48} />
                                                        <div className="flex flex-col items-center text-center">
                                                            <span className="font-bold text-[#012972] text-[16px]">Drag & Drop or Click</span>
                                                            <span className="text-[13px] text-gray-500 mt-1">.csv, .xlsx limits 5MB</span>
                                                        </div>
                                                        <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleCsvPreview} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                                    </div>

                                                    <a href="/template.csv" download className="text-[#012972] font-semibold text-sm underline mt-2 self-center hover:text-blue-800 flex items-center justify-center">
                                                        Download Sample Template
                                                    </a>
                                                </>
                                            )}

                                            {!isLoading && bulkPreview && (
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                                        <div>
                                                            <h3 className="font-bold text-[#012972] flex items-center gap-2">
                                                                <Check size={20} className="text-green-600" /> Preview Summary
                                                            </h3>
                                                            <p className="text-xs text-gray-600 mt-1">
                                                                Total: {bulkPreview.totalRows} rows | Valid: {bulkPreview.validCount} | Invalid: {bulkPreview.invalidCount}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-2">
                                                            <button onClick={() => { setBulkPreview(null); setCsvFile(null); }} className="text-xs font-bold text-red-500 hover:text-red-700 underline">Cancel / New File</button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setIsPreviewExpanded(true)}
                                                                className="flex items-center gap-1 text-[11px] text-[#012972] font-bold border border-[#012972]/20 px-2.5 py-1.5 rounded-lg hover:bg-[#012972]/10 transition-colors bg-white shadow-sm"
                                                            >
                                                                <Maximize2 size={12} /> Expand Preview
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Valid Records Table */}
                                                    {bulkPreview.validCount > 0 && (
                                                        <div>
                                                            <h4 className="font-bold text-green-700 text-sm mb-2 flex items-center gap-2">✅ Valid Records <span className="text-xs font-normal text-gray-500">(will be imported)</span></h4>
                                                            <div className="border border-green-200 rounded-xl overflow-auto max-h-[250px] max-w-full bg-white custom-scrollbar">
                                                                <table className="w-full text-left text-sm min-w-[900px]">
                                                                    <thead className="bg-green-50 sticky top-0 text-green-800 font-bold z-10 text-xs uppercase">
                                                                        <tr>
                                                                            <th className="p-3">Pic</th>
                                                                            <th className="p-3">Name</th>
                                                                            <th className="p-3">Age</th>
                                                                            <th className="p-3">Mobile</th>
                                                                            <th className="p-3">Role</th>
                                                                            <th className="p-3">Base Price</th>
                                                                            <th className="p-3">Batting Style</th>
                                                                            <th className="p-3">Bowling Style</th>
                                                                            <th className="p-3">Jersey No.</th>
                                                                            <th className="p-3">Jersey Name</th>
                                                                            <th className="p-3">T-Shirt</th>
                                                                            <th className="p-3">Trouser</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {bulkPreview.previewData.map((row, idx) => (
                                                                            <tr key={idx} className="border-t border-green-100 hover:bg-green-50/30 text-xs">
                                                                                <td className="p-3">
                                                                                    {row.profilePic ? (
                                                                                        <img src={row.profilePic} alt={row.name} className="w-6 h-6 rounded-full object-cover border" />
                                                                                    ) : (
                                                                                        "-"
                                                                                    )}
                                                                                </td>
                                                                                <td className="p-3 font-semibold text-gray-800">{row.name || "-"}</td>
                                                                                <td className="p-3 text-gray-600">{row.age || "-"}</td>
                                                                                <td className="p-3 text-gray-600">{row.mobile || "-"}</td>
                                                                                <td className="p-3 text-gray-600 font-bold uppercase">{row.role || "-"}</td>
                                                                                <td className="p-3 text-gray-600 font-semibold">₹{row.basePrice || 0}</td>
                                                                                <td className="p-3 text-gray-600">{row.battingStyle || "-"}</td>
                                                                                <td className="p-3 text-gray-600">{row.bowlingStyle || "-"}</td>
                                                                                <td className="p-3 text-gray-600">{row.jerseyNumber !== null && row.jerseyNumber !== undefined ? `#${row.jerseyNumber}` : "-"}</td>
                                                                                <td className="p-3 text-gray-600">{row.jerseyName || "-"}</td>
                                                                                <td className="p-3 text-gray-600">{row.tshirtSize || "-"}</td>
                                                                                <td className="p-3 text-gray-600">{row.trouserSize || "-"}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Invalid Records Table */}
                                                    {bulkPreview.invalidCount > 0 && (
                                                        <div>
                                                            <h4 className="font-bold text-red-700 text-sm mb-2 flex items-center gap-2">⚠️ Invalid Records <span className="text-xs font-normal text-gray-500">(will be skipped)</span></h4>
                                                            <div className="border border-red-200 rounded-xl overflow-y-auto max-h-[200px] bg-white custom-scrollbar">
                                                                <table className="w-full text-left text-sm">
                                                                    <thead className="bg-red-50 sticky top-0 text-red-800 font-bold z-10">
                                                                        <tr>
                                                                            <th className="p-3">Row</th>
                                                                            <th className="p-3">Name</th>
                                                                            <th className="p-3">Mobile</th>
                                                                            <th className="p-3">Role</th>
                                                                            <th className="p-3">Errors</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {bulkPreview.errors.map((err: any, idx) => (
                                                                            <tr key={idx} className="border-t border-red-100 hover:bg-red-50/30 text-xs">
                                                                                <td className="p-3 text-gray-500 font-medium">{err.rowNumber}</td>
                                                                                <td className="p-3 font-semibold text-gray-800">{err.name || "-"}</td>
                                                                                <td className="p-3 text-gray-600">{err.mobile || "-"}</td>
                                                                                <td className="p-3 text-gray-600 font-bold uppercase">{err.role || "-"}</td>
                                                                                <td className="p-3 text-red-600 text-xs">
                                                                                    {err.errors?.map((e: string, i: number) => (
                                                                                        <div key={i} className="mb-0.5">• {e}</div>
                                                                                    ))}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {!bulkPreview.canProceed && (
                                                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-medium flex items-start gap-2 mt-2">
                                                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                                            <span>Cannot proceed because there are invalid records. Please fix the errors in your file and upload again.</span>
                                                        </div>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={confirmBulkUpload}
                                                        disabled={isLoading || !bulkPreview.canProceed}
                                                        className="mt-4 w-full bg-[#0C3278] text-white font-bold py-3.5 rounded-xl hover:bg-[#082254] shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                    >
                                                        {isLoading ? "Processing Data..." : "Confirm & Import Valid Players"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <h3 className="font-bold text-gray-800">Added Players ({addedPlayers.length})</h3>
                                    {addedPlayers.length === 0 ? (
                                        <div className="flex-1 border border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 font-medium bg-gray-50/50 min-h-[200px]">
                                            No players added yet
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                            {addedPlayers.map((p, idx) => (
                                                <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * idx }} className="bg-white border border-gray-200 p-3 rounded-xl flex items-center gap-4 shadow-sm">
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">🏏</div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-gray-800 leading-none mb-1">{p.name} <span className="font-normal text-xs text-gray-500">({p.age})</span></p>
                                                        <p className="text-xs text-[#012972] font-extrabold">{p.role}</p>
                                                    </div>
                                                    {p.basePrice && (
                                                        <div className="text-right">
                                                            <p className="text-[10px] text-gray-500 font-bold uppercase">Base</p>
                                                            <p className="text-sm font-bold text-green-600">₹{p.basePrice}</p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                            <div className="flex h-12 justify-between ">
                                <button onClick={() => setActiveStep(1)} className="btn-secondary">
                                    <ChevronLeft size={18} strokeWidth={3} /> Go Back
                                </button>
                                <button onClick={() => router.push("/dashboard/my-auction")} className="btn-primary">
                                    Finish Setup <Check size={18} strokeWidth={3} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                    {/* FULLSCREEN PREVIEW MODAL */}
                    <AnimatePresence>
                        {isPreviewExpanded && bulkPreview && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
                            >
                                <motion.div
                                    initial={{ scale: 0.95, y: 15 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.95, y: 15 }}
                                    className="bg-white rounded-[24px] shadow-2xl border border-gray-150 p-6 w-full max-w-[95vw] lg:max-w-[85vw] max-h-[90vh] flex flex-col gap-4 overflow-hidden"
                                >
                                    {/* Modal Header */}
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                        <div>
                                            <h3 className="font-bold text-xl text-[#012972] flex items-center gap-2">
                                                <Check size={24} className="text-green-600" /> Bulk Import Preview
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Total: {bulkPreview.totalRows} rows | Valid: {bulkPreview.validCount} | Invalid: {bulkPreview.invalidCount}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsPreviewExpanded(false)}
                                            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-250 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-semibold"
                                        >
                                            <Minimize2 size={14} /> Minimize
                                        </button>
                                    </div>

                                    {/* Modal Content - Scrollable area */}
                                    <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-6 custom-scrollbar">
                                        {/* Valid Records Table */}
                                        {bulkPreview.validCount > 0 && (
                                            <div className="flex flex-col">
                                                <h4 className="font-bold text-green-700 text-sm mb-2 flex items-center gap-2">
                                                    <span>✅ Valid Records</span>
                                                    <span className="text-xs font-normal text-gray-500">({bulkPreview.validCount} rows will be imported)</span>
                                                </h4>
                                                <div className="border border-green-200 rounded-xl overflow-auto bg-white custom-scrollbar max-h-[450px]">
                                                    <table className="w-full text-left text-sm min-w-[1000px]">
                                                        <thead className="bg-green-50 sticky top-0 text-green-800 font-bold z-10 text-xs uppercase">
                                                            <tr>
                                                                <th className="p-3">Pic</th>
                                                                <th className="p-3">Name</th>
                                                                <th className="p-3">Age</th>
                                                                <th className="p-3">Mobile</th>
                                                                <th className="p-3">Role</th>
                                                                <th className="p-3">Base Price</th>
                                                                <th className="p-3">Batting Style</th>
                                                                <th className="p-3">Bowling Style</th>
                                                                <th className="p-3">Jersey No.</th>
                                                                <th className="p-3">Jersey Name</th>
                                                                <th className="p-3">T-Shirt</th>
                                                                <th className="p-3">Trouser</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {bulkPreview.previewData.map((row, idx) => (
                                                                <tr key={idx} className="border-t border-green-100 hover:bg-green-50/30 text-xs">
                                                                    <td className="p-3">
                                                                        {row.profilePic ? (
                                                                            <img src={row.profilePic} alt={row.name} className="w-8 h-8 rounded-full object-cover border" />
                                                                        ) : (
                                                                            "-"
                                                                        )}
                                                                    </td>
                                                                    <td className="p-3 font-semibold text-gray-800">{row.name || "-"}</td>
                                                                    <td className="p-3 text-gray-600">{row.age || "-"}</td>
                                                                    <td className="p-3 text-gray-600">{row.mobile || "-"}</td>
                                                                    <td className="p-3 text-gray-600 font-bold uppercase">{row.role || "-"}</td>
                                                                    <td className="p-3 text-gray-600 font-semibold">₹{row.basePrice || 0}</td>
                                                                    <td className="p-3 text-gray-600">{row.battingStyle || "-"}</td>
                                                                    <td className="p-3 text-gray-600">{row.bowlingStyle || "-"}</td>
                                                                    <td className="p-3 text-gray-600">{row.jerseyNumber !== null && row.jerseyNumber !== undefined ? `#${row.jerseyNumber}` : "-"}</td>
                                                                    <td className="p-3 text-gray-600">{row.jerseyName || "-"}</td>
                                                                    <td className="p-3 text-gray-600">{row.tshirtSize || "-"}</td>
                                                                    <td className="p-3 text-gray-600">{row.trouserSize || "-"}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        {/* Invalid Records Table */}
                                        {bulkPreview.invalidCount > 0 && (
                                            <div className="flex flex-col">
                                                <h4 className="font-bold text-red-700 text-sm mb-2 flex items-center gap-2">
                                                    <span>⚠️ Invalid Records</span>
                                                    <span className="text-xs font-normal text-gray-500">({bulkPreview.invalidCount} rows will be skipped)</span>
                                                </h4>
                                                <div className="border border-red-200 rounded-xl overflow-y-auto max-h-[300px] bg-white custom-scrollbar">
                                                    <table className="w-full text-left text-sm">
                                                        <thead className="bg-red-50 sticky top-0 text-red-800 font-bold z-10 text-xs uppercase">
                                                            <tr>
                                                                <th className="p-3">Row</th>
                                                                <th className="p-3">Name</th>
                                                                <th className="p-3">Mobile</th>
                                                                <th className="p-3">Role</th>
                                                                <th className="p-3">Errors</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {bulkPreview.errors.map((err: any, idx) => (
                                                                <tr key={idx} className="border-t border-red-100 hover:bg-red-50/30 text-xs">
                                                                    <td className="p-3 text-gray-500 font-medium">{err.rowNumber}</td>
                                                                    <td className="p-3 font-semibold text-gray-800">{err.name || "-"}</td>
                                                                    <td className="p-3 text-gray-600">{err.mobile || "-"}</td>
                                                                    <td className="p-3 text-gray-600 font-bold uppercase">{err.role || "-"}</td>
                                                                    <td className="p-3 text-red-600 text-xs font-medium">
                                                                        {err.errors?.map((e: string, i: number) => (
                                                                            <div key={i}>• {e}</div>
                                                                        ))}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center">
                                        {!bulkPreview.canProceed && (
                                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-xs font-medium flex items-center gap-2 flex-1">
                                                <AlertCircle size={16} /> Cannot proceed because there are invalid records. Please fix the errors in your file and upload again.
                                            </div>
                                        )}
                                        <div className="flex gap-3 justify-end sm:ml-auto w-full sm:w-auto">
                                            <button
                                                type="button"
                                                onClick={() => setIsPreviewExpanded(false)}
                                                className="px-5 py-2.5 text-sm font-semibold border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm bg-white"
                                            >
                                                Minimize
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsPreviewExpanded(false);
                                                    confirmBulkUpload();
                                                }}
                                                disabled={isLoading || !bulkPreview.canProceed}
                                                className="bg-[#0C3278] text-white font-bold px-6 py-2.5 text-sm rounded-xl hover:bg-[#082254] shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? "Processing..." : "Confirm & Import Players"}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}

function InputField({ label, req, name, value, onChange, type = "text", placeholder = "", error }: any) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[13px] font-semibold text-gray-700">
                {label} {req && <span className="text-red-500">*</span>} {!req && <span className="text-gray-400 font-normal ml-1 text-[11px]">(Optional)</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`border rounded-[8px] px-3.5 py-2.5 outline-none focus:ring-2 focus:border-transparent focus:ring-[#0C3278] text-[14px] bg-white transition-shadow text-gray-800 ${error ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-300'}`}
            />
            {error && <span className="text-[11px] text-red-500 font-medium">{error}</span>}
        </div>
    )
}
