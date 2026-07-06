"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Users, Trash2, FileSpreadsheet, Pencil, X, AlertCircle, Check, Plus, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { useAuthStore } from "../../../../../store/auth.store";
import { playerSchema, formatZodErrors } from "../../../../../lib/validations";
import { usePlayers, useCategories, useTeams, useAuctionDetails } from "../../../../../hooks/useManageAuction";
import { useQueryClient } from "@tanstack/react-query";
import { SearchableSelect } from "../../../../../components/ui/SearchableSelect";
import { uploadImage } from "../../../../../app/actions/cloudinary";

export default function ManagePlayersPage() {
    const router = useRouter();
    const params = useParams();
    const { firebaseToken } = useAuthStore();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const auctionId = params.auctionId as string;

    const queryClient = useQueryClient();
    const { data: players = [], isLoading: isFetching } = usePlayers(auctionId);
    const { data: categories = [] } = useCategories(auctionId);
    const { data: teams = [] } = useTeams(auctionId);
    const { data: auction = null } = useAuctionDetails(auctionId);

    const getPlayerLimit = (tier: string): number => {
        switch (tier) {
            case "FREE": return 100;
            case "BASIC": return 200;
            case "STANDARD": return 400;
            case "PREMIUM": return 1200;
            case "ELITE": return 2500;
            case "ULTIMATE": return 5000;
            case "MEGA": return 10000;
            default: return 100;
        }
    };
    const playerLimit = auction ? getPlayerLimit(auction.planTier) : 100;

    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // UPLOAD STATES
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

    // MANUAL DATA
    const [playerData, setPlayerData] = useState({
        name: "", mobile: "", age: "", role: "BATSMAN", categoryId: "",
        basePrice: "", fatherName: "", battingStyle: "", bowlingStyle: "",
        tshirtSize: "", trouserSize: "", jerseyNumber: "", jerseyName: "",
        profilePic: ""
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);

    const startEditing = (player: any) => {
        setUploadMethod("MANUAL");
        setShowForm(true);
        setEditingPlayerId(player.id);
        setPlayerData({
            name: player.name || "",
            mobile: player.mobile || "",
            age: player.age?.toString() || "",
            role: player.role || "BATSMAN",
            categoryId: player.categoryId || "",
            basePrice: player.basePrice?.toString() || "",
            fatherName: player.fatherName || "",
            battingStyle: player.battingStyle || "",
            bowlingStyle: player.bowlingStyle || "",
            tshirtSize: player.tshirtSize || "",
            trouserSize: player.trouserSize || "",
            jerseyNumber: player.jerseyNumber?.toString() || "",
            jerseyName: player.jerseyName || "",
            profilePic: player.profilePic || ""
        });
        setFormErrors({});
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEditing = () => {
        setEditingPlayerId(null);
        setPlayerData({
            name: "", mobile: "", age: "", role: "BATSMAN", categoryId: "",
            basePrice: "", fatherName: "", battingStyle: "", bowlingStyle: "",
            tshirtSize: "", trouserSize: "", jerseyNumber: "", jerseyName: "",
            profilePic: ""
        });
        setFormErrors({});
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                toast.info("Uploading the profile picture... Please wait.");
                const formData = new FormData();
                formData.append("file", file);
                const url = await uploadImage(formData);
                callback(url);
                toast.success("Profile picture uploaded successfully!");
            } catch (error: any) {
                console.error("Upload error:", error);
                toast.error("We couldn't upload the profile picture. Please try again.");
            }
        }
    };

    const handleManualAdd = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingPlayerId && players.length >= playerLimit) {
            toast.error(`Plan Limit Reached: Your ${auction?.planTier || "FREE"} plan allows up to ${playerLimit} players. Upgrade your plan in the Details section to add more.`);
            return;
        }

        const result = playerSchema.safeParse(playerData);
        if (!result.success) {
            setFormErrors(formatZodErrors(result.error));
            const firstErr = result.error.issues[0]?.message;
            if (firstErr) toast.error(firstErr);
            return;
        }
        setFormErrors({});
        setIsLoading(true);

        try {
            const payload = {
                ...playerData,
                auctionId,
                age: playerData.age ? Number(playerData.age) : undefined,
                basePrice: playerData.basePrice ? Number(playerData.basePrice) : undefined,
                jerseyNumber: playerData.jerseyNumber ? Number(playerData.jerseyNumber) : undefined,
                categoryId: playerData.categoryId || undefined,
            };

            const endpoint = editingPlayerId ? `${apiUrl}/player/${editingPlayerId}` : `${apiUrl}/player`;
            const method = editingPlayerId ? "PATCH" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${firebaseToken}` },
                body: JSON.stringify(payload)
            });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || (editingPlayerId ? "Failed to update player" : "Failed to add player"));

            toast.success(editingPlayerId ? "Player details updated!" : "Player added successfully!");
            setEditingPlayerId(null);
            setShowForm(false);
            setPlayerData({
                name: "", mobile: "", age: "", role: "BATSMAN", categoryId: "",
                basePrice: "", fatherName: "", battingStyle: "", bowlingStyle: "",
                tshirtSize: "", trouserSize: "", jerseyNumber: "", jerseyName: "",
                profilePic: ""
            });
            queryClient.invalidateQueries({ queryKey: ['players', auctionId] });
        } catch (error: any) {
            toast.error(error.message || "Something went wrong while saving the player.");
        } finally {
            setIsLoading(false);
        }
    };

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

            // Store the full response structure
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

        if (players.length + bulkPreview.previewData.length > playerLimit) {
            toast.error(`Plan Limit Reached: Importing ${bulkPreview.previewData.length} players would exceed your plan limit of ${playerLimit} players (you currently have ${players.length} players). Please upgrade your plan or reduce row counts.`);
            return;
        }

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
            setBulkPreview(null);
            setCsvFile(null);
            queryClient.invalidateQueries({ queryKey: ['players', auctionId] });
        } catch (error: any) {
            toast.error(error.message || "Something went wrong during the upload. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const deletePlayer = async (playerId: string) => {
        if (!confirm("Are you sure you want to delete this player?")) return;
        try {
            const res = await fetch(`${apiUrl}/player/${playerId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${firebaseToken}` }
            });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || "Failed to delete player");

            toast.success("The player has been removed.");
            queryClient.invalidateQueries({ queryKey: ['players', auctionId] });
        } catch (error: any) {
            toast.error("We couldn't delete the player. Please try again.");
        }
    };

    // Framer variants
    const listVariants: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants: any = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } } };

    if (isFetching) {
        return (
            <div className="w-full pb-20 animate-pulse font-poppins">
                <div className="flex items-center gap-2 mb-6">
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-3 w-3 bg-gray-200 rounded" />
                    <div className="h-3 w-28 bg-gray-200 rounded" />
                </div>
                <div className="h-8 w-48 bg-gray-300/60 rounded mb-8" />
                <div className="grid lg:grid-cols-[1fr_400px] gap-8">
                    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-8 flex flex-col gap-5">
                        <div className="flex rounded-xl bg-gray-100 border border-gray-200 overflow-hidden h-11" />
                        <div className="h-5 w-36 bg-gray-200 rounded" />
                        <div className="h-24 w-full bg-gray-100 rounded-xl border-2 border-dashed border-gray-200" />
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="flex flex-col gap-1.5">
                                    <div className="h-3 w-16 bg-gray-200 rounded" />
                                    <div className="h-10 bg-gray-200 rounded-lg" />
                                </div>
                            ))}
                        </div>
                        <div className="h-12 w-full bg-gray-300/60 rounded-xl" />
                    </div>
                    <div className="bg-gray-50 rounded-[20px] shadow-inner border border-gray-200 p-6 flex flex-col gap-3 h-[500px]">
                        <div className="h-5 w-32 bg-gray-200 rounded" />
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                <div className="flex flex-col gap-1 flex-1">
                                    <div className="h-4 w-28 bg-gray-200 rounded" />
                                    <div className="h-2 w-20 bg-gray-200 rounded" />
                                </div>
                                <div className="flex flex-col gap-1 items-end">
                                    <div className="h-2 w-8 bg-gray-200 rounded" />
                                    <div className="h-4 w-16 bg-gray-200 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full pb-20">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium mb-4 px-2">
                <Link href="/dashboard/my-auction" className="hover:text-[#012972]">My Auction</Link>
                <span>/</span>
                <Link href={`/dashboard/manage/${auctionId}/details`} className="hover:text-[#012972]">Details</Link>
                <span>/</span>
                <span className="text-[#012972] font-semibold">Players</span>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl sm:text-[32px] font-bold text-gray-900 drop-shadow-sm">Manage Players</h1>
                    {auction && (
                        <span className="text-xs font-semibold text-gray-500">
                            Plan Limit: <span className="text-[#0C3278]">{auction.planTier}</span> ({players.length} / {playerLimit} players added)
                        </span>
                    )}
                </div>
                <button
                    onClick={() => {
                        if (showForm && !editingPlayerId) {
                            setShowForm(false);
                        } else {
                            cancelEditing();
                            setShowForm(true);
                        }
                    }}
                    className="w-full sm:w-auto bg-[#0C3278] flex gap-2 justify-center items-center text-white px-6 py-2.5 text-sm rounded-full font-bold shadow-md hover:bg-[#082254] transition-colors border border-[#FFBA00]"
                >
                    {showForm && !editingPlayerId ? <> <X size={20} />Close</> : <> <Plus size={20} /> Add Player</>}
                </button>
            </div>

            <div className={`grid gap-8 ${showForm ? "lg:grid-cols-[1fr_480px]" : "grid-cols-1"}`}>

                {/* DB PREVIEW SECTION (Left Side) */}
                <div className="bg-gray-50 rounded-[20px] shadow-inner border border-gray-200 p-6 flex flex-col min-h-[600px] order-2 lg:order-1">
                    <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                        <Users size={20} className="text-[#012972]" /> Auction Roster <span className="text-sm font-semibold text-gray-400 bg-white px-2 py-0.5 rounded-full border font-[Poppins]">{players.length} Total</span>
                    </h3>

                    {players.length === 0 ? (
                        <div className="flex-1 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 font-medium">No players added for this auction.</div>
                    ) : (
                        <motion.div variants={listVariants} initial="hidden" animate="show" className={`grid gap-3 overflow-y-auto pr-2 custom-scrollbar  flex-1 ${showForm ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
                            <AnimatePresence>
                                {players.map((p: any, idx: number) => (
                                    <motion.div variants={itemVariants} initial="hidden" animate="show" exit={{ opacity: 0, scale: 0.9 }} key={p.id || idx} className="bg-white border border-gray-200 p-4 rounded-xl flex flex-col gap-2 shadow-sm relative group overflow-hidden hover:translate-y-[-2px] h-[100%]">
                                        <div className="flex items-center gap-3">
                                            {p.profilePic ? (
                                                <img src={p.profilePic} alt={p.name} className="w-10 h-10 rounded-full object-cover border" />
                                            ) : (
                                                <img src={`https://ui-avatars.com/api/?name=${p.name}&background=012972&color=FFBA00&size=88`} alt={p.name} className="w-10 h-10 rounded-full object-cover border" />
                                            )}
                                            <div className="flex-1 flex flex-col">
                                                <span className="font-bold text-gray-900 leading-tight">{p.name} <span className="text-gray-400 font-normal text-xs">Age:{p.age || 'N/A'}</span></span>
                                                <span className="text-[10px] text-gray-500 font-semibold uppercase">{p.role}</span>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                {p.status === 'SOLD' ? (
                                                    <span className="bg-[#F0FDF4] border border-[#dcfce7] px-2 py-0.5 rounded text-[10px] font-bold text-[#166534]">SOLD: ₹{p.soldPrice}</span>
                                                ) : p.status === 'UNSOLD' ? (
                                                    <span className="bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[10px] font-bold text-red-600">UNSOLD</span>
                                                ) : (
                                                    <span className="bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold text-blue-600">UPCOMING</span>
                                                )}

                                                {p.status === 'SOLD' && p.teamId && (
                                                    <span className="text-[10px] font-bold text-gray-600">To: {teams.find((t: any) => t.id === p.teamId)?.shortName || 'Unknown'}</span>
                                                )}
                                                {p.status !== 'SOLD' && p.basePrice && (
                                                    <span className="text-[10px] font-bold text-gray-400 mt-0.5">Base: ₹{p.basePrice}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 text-[10px] text-gray-500 mt-1 flex-wrap">
                                            {p.battingStyle && <span className="bg-gray-100 px-2 py-0.5 rounded">{p.battingStyle}</span>}
                                            {p.bowlingStyle && <span className="bg-gray-100 px-2 py-0.5 rounded">{p.bowlingStyle}</span>}
                                            {p.jerseyNumber && <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">#{p.jerseyNumber}</span>}
                                        </div>
                                        <div className="absolute top-2 right-2 flex items-center gap-1 lg:opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur rounded-lg shadow-sm border border-gray-100 p-1">
                                            <button onClick={() => startEditing(p)} className="text-gray-600 hover:text-blue-600 transition-colors p-1.5"><Pencil size={14} /></button>
                                            <button onClick={() => deletePlayer(p.id)} className="text-gray-600 hover:text-red-500 transition-colors p-1.5"><Trash2 size={14} /></button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>

                {/* UPLOAD FORM SECTION (Right Sidebar) */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-8 flex flex-col h-fit sticky top-6 order-1 lg:order-2">
                            {!editingPlayerId && (
                                <div className="flex rounded-xl bg-gray-50 border border-gray-200 overflow-hidden shadow-sm mb-6">
                                    <button
                                        type="button"
                                        onClick={() => { setUploadMethod("MANUAL"); setBulkPreview(null); }}
                                        className={`flex-1 py-3 text-sm font-bold transition-colors ${uploadMethod === "MANUAL" ? "bg-[#012972] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                                    >
                                        Manual Upload
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUploadMethod("BULK")}
                                        className={`flex-1 py-3 text-sm font-bold transition-colors ${uploadMethod === "BULK" ? "bg-[#012972] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                                    >
                                        Bulk Import (Excel/CSV)
                                    </button>
                                </div>
                            )}

                            <AnimatePresence mode="wait">
                                {uploadMethod === "MANUAL" && (
                                    <motion.form key="manual" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleManualAdd} className="flex flex-col gap-4">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="font-bold text-gray-800 text-lg">
                                                {editingPlayerId ? "Edit Player Details" : "Player Details"}
                                            </h3>
                                            {editingPlayerId && (
                                                <button type="button" onClick={cancelEditing} className="text-gray-400 hover:text-gray-600">
                                                    <X size={20} />
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 border-2 border-dashed border-gray-300 rounded-xl p-6 bg-white justify-center relative hover:bg-gray-50 transition-colors mb-4">
                                            {playerData.profilePic ? (
                                                <img src={playerData.profilePic} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm" />
                                            ) : (
                                                <UploadCloud className="text-gray-400" size={32} />
                                            )}
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[#012972] text-[14px]">
                                                    {playerData.profilePic ? "Change Photo" : "Upload Photo"}
                                                    <span className="text-gray-400 font-normal ml-1 text-[11px]">(Optional)</span>
                                                </span>
                                                <span className="text-[12px] text-gray-500">Max size 2MB</span>
                                            </div>
                                            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, (url) => setPlayerData({ ...playerData, profilePic: url }))} />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField label="Name" req name="name" value={playerData.name} onChange={(e: any) => setPlayerData({ ...playerData, name: e.target.value })} error={formErrors.name} />
                                            <InputField label="Mobile" req name="mobile" value={playerData.mobile} onChange={(e: any) => setPlayerData({ ...playerData, mobile: e.target.value })} error={formErrors.mobile} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField label="Age" req name="age" type="number" value={playerData.age} onChange={(e: any) => setPlayerData({ ...playerData, age: e.target.value })} error={formErrors.age} />
                                            <InputField label="Father's Name" name="fatherName" value={playerData.fatherName} onChange={(e: any) => setPlayerData({ ...playerData, fatherName: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField label="Base Price (₹)" name="basePrice" type="number" value={playerData.basePrice} onChange={(e: any) => setPlayerData({ ...playerData, basePrice: e.target.value })} />
                                            <div className="flex flex-col gap-1.5 justify-end">
                                                <label className="text-[13px] font-semibold text-gray-700">Category</label>
                                                <SearchableSelect
                                                    options={categories.map((c: any) => ({ label: c.name, value: c.id }))}
                                                    value={playerData.categoryId}
                                                    onChange={(val) => setPlayerData({ ...playerData, categoryId: val })}
                                                    placeholder="Select Category"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5 z-10 relative">
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
                                            {formErrors.role && <span className="text-[11px] text-red-500 font-medium">{formErrors.role}</span>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField label="Batting Style" name="battingStyle" value={playerData.battingStyle} onChange={(e: any) => setPlayerData({ ...playerData, battingStyle: e.target.value })} placeholder="e.g. RHB" />
                                            <InputField label="Bowling Style" name="bowlingStyle" value={playerData.bowlingStyle} onChange={(e: any) => setPlayerData({ ...playerData, bowlingStyle: e.target.value })} placeholder="e.g. RAF" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField label="Jersey Number" name="jerseyNumber" type="number" value={playerData.jerseyNumber} onChange={(e: any) => setPlayerData({ ...playerData, jerseyNumber: e.target.value })} />
                                            <InputField label="Jersey Name" name="jerseyName" value={playerData.jerseyName} onChange={(e: any) => setPlayerData({ ...playerData, jerseyName: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField label="T-Shirt Size" name="tshirtSize" value={playerData.tshirtSize} onChange={(e: any) => setPlayerData({ ...playerData, tshirtSize: e.target.value })} />
                                            <InputField label="Trouser Size" name="trouserSize" value={playerData.trouserSize} onChange={(e: any) => setPlayerData({ ...playerData, trouserSize: e.target.value })} />
                                        </div>
                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="mt-4 w-full bg-[#0C3278] text-white font-bold py-3.5 rounded-xl hover:opacity-90 cursor-pointer border border-[#FFBA00] shadow-md transition-colors disabled:opacity-70 shadow-lg shadow-[#0C3278]/20">
                                            {isLoading ? "Saving..." : (editingPlayerId ? "Update Player" : "Add Player")}
                                        </motion.button>
                                    </motion.form>
                                )}

                                {uploadMethod === "BULK" && isLoading && (
                                    <motion.div key="bulk-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-12 bg-gray-50 border border-gray-200 rounded-2xl min-h-[300px]">
                                        <Loader2 className="h-10 w-10 animate-spin text-[#012972] mb-4" />
                                        <span className="font-bold text-gray-700 text-sm">
                                            {bulkPreview ? "Importing players to pool..." : "Uploading and parsing file..."}
                                        </span>
                                        <span className="text-xs text-gray-500 mt-1">
                                            {bulkPreview ? "Saving records to database..." : "Checking rows and mapping player roles..."}
                                        </span>
                                    </motion.div>
                                )}

                                {uploadMethod === "BULK" && !isLoading && !bulkPreview && (
                                    <motion.div key="bulk-drop" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col gap-5 mt-2">
                                        <h3 className="font-bold text-gray-800 text-lg">Upload Bulk Data</h3>
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
                                    </motion.div>
                                )}

                                {uploadMethod === "BULK" && !isLoading && bulkPreview && (
                                    <motion.div key="bulk-preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                                        <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                            <div>
                                                <h3 className="font-bold text-[#012972] flex items-center gap-2">
                                                    <Check size={20} className="text-green-600" /> Preview Summary
                                                </h3>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    Total: {bulkPreview.totalRows} rows | Valid: {bulkPreview.validCount} | Invalid: {bulkPreview.invalidCount}
                                                    <br />
                                                    Plan: {bulkPreview.plan} (Limit: {bulkPreview.planLimit}) | Existing: {bulkPreview.existingPlayers}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <button onClick={() => setBulkPreview(null)} className="text-xs font-bold text-red-500 hover:text-red-700 underline cursor-pointer">Cancel / New File</button>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsPreviewExpanded(true)}
                                                    className="flex items-center gap-1 text-[11px] text-[#012972] font-bold border border-[#012972]/20 px-2.5 py-1.5 rounded-lg hover:bg-[#012972]/10 cursor-pointer transition-colors bg-white shadow-sm"
                                                >
                                                    <Maximize2 size={12} /> Expand Preview
                                                </button>
                                            </div>
                                        </div>

                                        {/* Valid Records Table */}
                                        {bulkPreview.validCount > 0 && (
                                            <div>
                                                <h4 className="font-bold text-green-700 text-sm mb-2">✅ Valid Records (will be imported)</h4>
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

                                        {!bulkPreview.canProceed && (
                                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-medium flex items-center gap-2">
                                                <AlertCircle size={18} /> Cannot proceed because there are invalid records. Please fix the errors in your file and upload again.
                                            </div>
                                        )}

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={confirmBulkUpload}
                                            disabled={isLoading || !bulkPreview.canProceed}
                                            className="mt-2 w-full bg-[#0C3278] text-white font-bold py-3.5 rounded-xl hover:bg-[#082254] shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? "Processing Data..." : "Confirm & Import Valid Players"}
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
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
                                    className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 cursor-pointer border border-gray-250 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-semibold"
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
                                        className="px-5 py-2.5 text-sm font-semibold border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors shadow-sm bg-white"
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
                                        className="bg-[#0C3278] text-white font-bold px-6 py-2.5 text-sm rounded-xl hover:bg-[#082254] cursor-pointer shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    );
}

// Sub-component for clean inputs with error support
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
                className={`border rounded-[8px] px-3.5 py-2.5 outline-none focus:ring-2 focus:border-transparent focus:ring-[#0C3278] text-[14px] bg-white text-gray-800 ${error ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-300'}`}
            />
            {error && <span className="text-[11px] text-red-500 font-medium">{error}</span>}
        </div>
    )
}
