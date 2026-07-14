"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Users, Trash2, Pencil, X, Plus } from "lucide-react";
import { useAuthStore } from "../../../../../store/auth.store";
import { teamSchema, formatZodErrors } from "../../../../../lib/validations";
import { useTeams, useAuctionDetails } from "../../../../../hooks/useManageAuction";
import { uploadImage } from "../../../../../app/actions/cloudinary";
import { useQueryClient } from "@tanstack/react-query";

export default function ManageTeamsPage() {
    const router = useRouter();
    const params = useParams();
    const { firebaseToken } = useAuthStore();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const auctionId = params.auctionId as string;

    const queryClient = useQueryClient();
    const { data: teams = [], isLoading: isFetching } = useTeams(auctionId);
    const { data: auction = null } = useAuctionDetails(auctionId);

    const getTeamLimit = (tier: string): number => {
        switch (tier) {
            case "FREE": return 2;
            case "BASIC": return 4;
            case "STANDARD": return 8;
            case "PREMIUM": return 12;
            case "ELITE": return 16;
            case "ULTIMATE": return 20;
            case "MEGA": return 30;
            default: return 2;
        }
    };
    const teamLimit = auction ? getTeamLimit(auction.planTier) : 2;

    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // MANUAL DATA
    const [teamData, setTeamData] = useState({
        name: "", shortName: "", shortcutKey: "", logo: ""
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [editingTeamId, setEditingTeamId] = useState<string | null>(null);

    const startEditing = (team: any) => {
        setEditingTeamId(team.id);
        setShowForm(true);
        setTeamData({
            name: team.name || "",
            shortName: team.shortName || "",
            shortcutKey: team.shortcutKey || "",
            logo: team.logo || ""
        });
        setFormErrors({});
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEditing = () => {
        setEditingTeamId(null);
        setShowForm(false);
        setTeamData({ name: "", shortName: "", shortcutKey: "", logo: "" });
        setFormErrors({});
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                toast.info("Uploading the logo... Please wait.");
                const formData = new FormData();
                formData.append("file", file);
                const url = await uploadImage(formData);
                callback(url);
                toast.success("Logo uploaded successfully!");
            } catch (error: any) {
                console.error("Upload error:", error);
                toast.error("We couldn't upload the logo. Please try again.");
            }
        }
    };

    const handleManualAdd = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check for duplicates (case-insensitive)
        const isDuplicateName = teams.some((t: any) =>
            t.id !== editingTeamId &&
            t.name.toLowerCase() === teamData.name.trim().toLowerCase()
        );
        const isDuplicateShortName = teams.some((t: any) =>
            t.id !== editingTeamId &&
            t.shortName.toLowerCase() === teamData.shortName.trim().toLowerCase()
        );

        if (isDuplicateName) {
            toast.error(`A team with the name "${teamData.name}" already exists in this auction.`);
            return;
        }
        if (isDuplicateShortName) {
            toast.error(`A team with the short name "${teamData.shortName.toUpperCase()}" already exists in this auction.`);
            return;
        }

        if (!editingTeamId && teams.length >= teamLimit) {
            toast.error(`Plan Limit Reached: Your ${auction?.planTier || "FREE"} plan allows up to ${teamLimit} teams. Upgrade your plan in the Details section to add more.`);
            return;
        }

        const result = teamSchema.safeParse(teamData);
        if (!result.success) {
            setFormErrors(formatZodErrors(result.error));
            const firstErr = result.error.issues[0]?.message;
            if (firstErr) toast.error(firstErr);
            return;
        }
        setFormErrors({});
        setIsLoading(true);

        try {
            const endpoint = editingTeamId ? `${apiUrl}/team/${editingTeamId}` : `${apiUrl}/team`;
            const method = editingTeamId ? "PATCH" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${firebaseToken}` },
                body: JSON.stringify({
                    ...teamData,
                    auctionId,
                    shortName: teamData.shortName.toUpperCase(),
                    shortcutKey: teamData.shortcutKey.toUpperCase()
                })
            });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || (editingTeamId ? "Failed to update team" : "Failed to add team"));

            toast.success(editingTeamId ? "Team details updated!" : "Team added successfully!");
            setEditingTeamId(null);
            setShowForm(false);
            setTeamData({ name: "", shortName: "", shortcutKey: "", logo: "" });
            queryClient.invalidateQueries({ queryKey: ['teams', auctionId] });
        } catch (error: any) {
            toast.error("Something went wrong while saving the team.");
        } finally {
            setIsLoading(false);
        }
    };

    const deleteTeam = async (teamId: string) => {
        if (!confirm("Are you sure you want to delete this team?")) return;
        try {
            const res = await fetch(`${apiUrl}/team/${teamId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${firebaseToken}` }
            });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || "Failed to delete team");

            toast.success("The team has been removed.");
            queryClient.invalidateQueries({ queryKey: ['teams', auctionId] });
        } catch (error: any) {
            toast.error("We couldn't delete the team. Please try again.");
        }
    };

    const listVariants: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants: any = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } } };

    if (isFetching) {
        return (
            <div className="w-full pb-20 animate-pulse font-poppins">
                <div className="flex items-center gap-2 mb-6">
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-3 w-3 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
                <div className="h-8 w-44 bg-gray-300/60 rounded mb-8" />
                <div className="grid lg:grid-cols-[1fr_400px] gap-8">
                    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-8 flex flex-col gap-5">
                        <div className="h-5 w-36 bg-gray-200 rounded" />
                        <div className="h-24 w-full bg-gray-100 rounded-xl border-2 border-dashed border-gray-200" />
                        <div className="h-10 w-full bg-gray-200 rounded-lg" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-10 bg-gray-200 rounded-lg" />
                            <div className="h-10 bg-gray-200 rounded-lg" />
                        </div>
                        <div className="h-12 w-full bg-gray-300/60 rounded-xl" />
                    </div>
                    <div className="bg-gray-50 rounded-[20px] shadow-inner border border-gray-200 p-6 flex flex-col gap-3 h-[400px]">
                        <div className="h-5 w-32 bg-gray-200 rounded" />
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                                <div className="flex flex-col gap-1">
                                    <div className="h-4 w-32 bg-gray-200 rounded" />
                                    <div className="h-2 w-16 bg-gray-200 rounded" />
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
                <span className="text-[#012972] font-semibold">Teams</span>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl sm:text-[32px] font-bold text-gray-900 drop-shadow-sm">Manage Teams</h1>
                    {auction && (
                        <span className="text-xs font-semibold text-gray-500">
                            Plan Limit: <span className="text-[#0C3278]">{auction.planTier}</span> ({teams.length} / {teamLimit} teams added)
                        </span>
                    )}
                </div>
                <button
                    onClick={() => {
                        if (showForm && !editingTeamId) {
                            setShowForm(false);
                        } else {
                            cancelEditing(); // Reset first
                            setShowForm(true);
                        }
                    }}
                    className="w-full sm:w-auto bg-[#0C3278] flex gap-2 justify-center items-center text-white px-6 py-2.5 text-sm rounded-full font-bold shadow-md hover:bg-[#082254] transition-colors border border-[#FFBA00]"
                >
                    {showForm && !editingTeamId ? <> <X size={20} />Close</> : <> <Plus size={20} /> Add Team</>}
                </button>
            </div>

            <div className={`grid gap-8 ${showForm ? "lg:grid-cols-[1fr_400px]" : "grid-cols-1"}`}>

                {/* DB PREVIEW SECTION */}
                <div className="bg-gray-50 rounded-[20px] shadow-inner border border-gray-200 p-6 flex flex-col min-h-[600px] order-2 lg:order-1">
                    <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                        <Users size={20} className="text-[#012972]" /> Franchise Roster <span className="text-sm font-normal text-gray-400 bg-white px-2 py-0.5 rounded-full border">{teams.length} Teams</span>
                    </h3>

                    {teams.length === 0 ? (
                        <div className="flex-1 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 font-medium">No teams added yet.</div>
                    ) : (
                        <motion.div variants={listVariants} initial="hidden" animate="show" className={`grid gap-5  overflow-y-auto pr-2 custom-scrollbar flex ${showForm ? "grid-cols-1 lg:grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}>
                            <AnimatePresence>
                                {teams.map((t: any, idx: number) => (
                                    <motion.div variants={itemVariants} exit={{ opacity: 0, scale: 0.9 }} key={t.id || idx} className="bg-white h-full  border border-gray-200 p-4 rounded-xl flex flex-col gap-3 shadow-sm relative group overflow-hidden">
                                        <div className="flex items-center gap-3">
                                            {t.logo ? (
                                                <img src={t.logo} alt={t.shortName} className="w-12 h-12 rounded-lg object-cover border border-gray-100 shadow-sm" />
                                            ) : (
                                                <img src={`https://ui-avatars.com/api/?name=${t.shortName}&background=gray&color=fff&size=128&text=T`} alt={t.shortName} className="w-12 h-12 rounded-lg object-cover border border-gray-100 shadow-sm grayscale opacity-70" />
                                            )}
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 leading-tight">{t.name}</span>
                                                <span className="text-[11px] text-gray-500 font-semibold mt-0.5">Purse Left: ₹{Number(t.originalPurse) - Number(t.purseSpent || 0)}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 text-[10px] text-gray-500 mt-1 flex-wrap">
                                            <span className="bg-gray-100 px-2 py-0.5 rounded">ShortName: {t.shortName || ' -----'}</span>
                                            <span className="bg-gray-100 px-2 py-0.5 rounded">Key: {t.shortcutKey || ' -----'}</span>
                                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{t.playersCount || 0} Players</span>
                                        </div>
                                        <div className="absolute top-2 right-2 flex items-center gap-1 lg:opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur rounded-lg shadow-sm border border-gray-100 p-1">
                                            <button onClick={() => startEditing(t)} className="text-gray-600 hover:text-blue-600 transition-colors p-1.5"><Pencil size={14} /></button>
                                            <button onClick={() => deleteTeam(t.id)} className="text-gray-600 hover:text-red-500 transition-colors p-1.5"><Trash2 size={14} /></button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>

                {/* UPLOAD FORM SECTION */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-8 flex flex-col h-fit sticky top-6 order-1 lg:order-2">

                            <form onSubmit={handleManualAdd} className="flex flex-col gap-5">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-gray-800 text-lg">
                                        {editingTeamId ? "Edit Team Details" : "New Team Details"}
                                    </h3>
                                    {editingTeamId && (
                                        <button type="button" onClick={cancelEditing} className="text-gray-400 hover:text-gray-600">
                                            <X size={20} />
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 border-2 border-dashed border-gray-300 rounded-xl p-6 bg-white justify-center relative hover:bg-gray-50 transition-colors">
                                    <UploadCloud className="text-gray-400" size={32} />
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[#012972] text-[14px]">Upload Logo <span className="text-gray-400 font-normal ml-1 text-[11px]">(Optional)</span></span>
                                        <span className="text-[12px] text-gray-500">Max size 2MB</span>
                                    </div>
                                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, (url) => setTeamData({ ...teamData, logo: url }))} />
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <InputField label="Team Name" req name="name" value={teamData.name} onChange={(e: any) => setTeamData({ ...teamData, name: e.target.value })} placeholder="e.g. Royal Challengers Bangalore" error={formErrors.name} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Short Name" req name="shortName" value={teamData.shortName} onChange={(e: any) => setTeamData({ ...teamData, shortName: e.target.value })} placeholder="e.g. RCB" error={formErrors.shortName} />
                                    <InputField label="Shortcut Key" name="shortcutKey" value={teamData.shortcutKey} onChange={(e: any) => setTeamData({ ...teamData, shortcutKey: e.target.value })} placeholder="e.g. R" error={formErrors.shortcutKey} />
                                </div>

                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="mt-4 w-full flex items-center gap-2 justify-center bg-[#0C3278] text-white font-bold py-3.5 rounded-xl hover:opacity-90 cursor-pointer border border-[#FFBA00] shadow-md transition-colors disabled:opacity-70 shadow-lg shadow-[#0C3278]/20">
                                    {isLoading ? "Saving..." : (editingTeamId ? <> <Pencil size={15} /> Update</> : <> <Plus size={20} /> Add</>)}
                                </motion.button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
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
