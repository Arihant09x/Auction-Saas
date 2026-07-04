"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { createAuctionSchema, formatZodErrors } from "../../../../../lib/validations";
import { ArrowLeft, Save, Loader2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "../../../../../store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { useAuctionDetails } from "../../../../../hooks/useManageAuction";
import { uploadImage } from "../../../../actions/cloudinary";

export default function EditAuctionPage() {
    const router = useRouter();
    const params = useParams();
    const auctionId = params.auctionId as string;
    const { firebaseToken } = useAuthStore();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const queryClient = useQueryClient();

    const [isSaving, setIsSaving] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Auction form state — will be pre-filled on load
    const [formData, setFormData] = useState({
        name: "",
        auctionDate: "",
        location: "",
        season: "",
        auctionStartTime: "",
        budgetPerTeam: 0,
        minBid: 0,
        bidIncrease: 0,
        minPlayersPerTeam: 0,
        maxPlayersPerTeam: 0,
        sportsType: "Cricket",
        logo: ""
    });

    const [isUploadingLogo, setIsUploadingLogo] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploadingLogo(true);
            try {
                toast.info("Uploading new logo...");
                const formDataPayload = new FormData();
                formDataPayload.append("file", file);
                const url = await uploadImage(formDataPayload);
                setFormData(prev => ({ ...prev, logo: url }));
                toast.success("Logo uploaded!");
            } catch (error: any) {
                toast.error(error.message || "Failed to upload logo");
            } finally {
                setIsUploadingLogo(false);
            }
        }
    };

    const { data: auction, isLoading } = useAuctionDetails(auctionId);

    useEffect(() => {
        if (auction) {
            setFormData({
                name: auction.name || "",
                auctionDate: auction.auctionDate ? auction.auctionDate.split('T')[0] : "",
                location: auction.location || "",
                season: auction.season || "",
                auctionStartTime: auction.auctionStartTime || "",
                budgetPerTeam: auction.budgetPerTeam || 0,
                minBid: auction.minBid || 0,
                bidIncrease: auction.bidIncrease || 0,
                minPlayersPerTeam: auction.minPlayersPerTeam || 0,
                maxPlayersPerTeam: auction.maxPlayersPerTeam || 0,
                sportsType: auction.sportsType || "Cricket",
                logo: auction.logo || ""
            });
        }
    }, [auction]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear field error on edit
        if (formErrors[name]) {
            setFormErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = createAuctionSchema.safeParse(formData);
        if (!result.success) {
            setFormErrors(formatZodErrors(result.error));
            toast.error(result.error.issues[0]?.message || "Validation failed");
            return;
        }
        setFormErrors({});
        setIsSaving(true);

        try {
            const payload = {
                ...result.data,
                budgetPerTeam: Number(result.data.budgetPerTeam),
                minBid: Number(result.data.minBid),
                bidIncrease: Number(result.data.bidIncrease),
                minPlayersPerTeam: Number(result.data.minPlayersPerTeam),
                maxPlayersPerTeam: Number(result.data.maxPlayersPerTeam),
                auctionDate: new Date(result.data.auctionDate).toISOString(),
            };

            const res = await fetch(`${apiUrl}/auction/${auctionId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${firebaseToken}` },
                body: JSON.stringify(payload)
            });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || "Failed to update auction");

            toast.success("Auction updated successfully!");
            // Invalidate ALL queries across the board to ensure fresh team, players, location, and info payloads
            queryClient.invalidateQueries();
            router.push(`/dashboard/manage/${auctionId}/details`);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Animation
    const containerVariants: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
    const itemVariants: any = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } } };

    if (isLoading) {
        return (
            <div className="relative w-full min-h-full flex flex-col pb-20 font-poppins animate-pulse">
                <div className="flex items-center gap-2 mb-6">
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-3 w-3 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col gap-5">
                    <div className="h-6 w-48 bg-gray-300/60 rounded" />
                    <div className="grid grid-cols-2 gap-5">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="h-3 w-24 bg-gray-200 rounded" />
                                <div className="h-10 bg-gray-200 rounded-lg" />
                            </div>
                        ))}
                    </div>
                    <div className="h-12 w-full bg-gray-200 rounded-xl mt-4" />
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full min-h-full flex flex-col pb-20 font-poppins">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium mb-4 px-2">
                <Link href="/dashboard/my-auction" className="hover:text-[#012972]">My Auction</Link>
                <span>/</span>
                <Link href={`/dashboard/manage/${auctionId}/details`} className="hover:text-[#012972]">Details</Link>
                <span>/</span>
                <span className="text-[#012972] font-semibold">Edit Auction</span>
            </div>
            <motion.form onSubmit={handleSave} variants={containerVariants} initial="hidden" animate="show" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
                <motion.h2 variants={itemVariants} className="text-[22px] font-bold text-gray-900">Edit Auction Details</motion.h2>

                {/* Logo Upload / Preview */}
                <motion.div variants={itemVariants} className="flex items-center gap-6">
                    {formData.logo ? (
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-inner shrink-0 relative group">
                            <img src={formData.logo} alt="Logo" width={80} height={80} className="object-cover w-full h-full" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <label className="cursor-pointer text-white flex flex-col items-center">
                                    <UploadCloud size={20} />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploadingLogo} />
                                </label>
                            </div>
                        </div>
                    ) : (
                        <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors shrink-0">
                            {isUploadingLogo ? <Loader2 className="animate-spin text-gray-400" size={24} /> : <UploadCloud className="text-gray-400" size={24} />}
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploadingLogo} />
                        </label>
                    )}
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-gray-800">Auction Logo</span>
                        <span className="text-[11px] text-gray-500">
                            {isUploadingLogo ? "Uploading..." : "Click the image to replace or upload a new logo (PNG/JPG)."}
                        </span>
                    </div>
                </motion.div>

                {/* Row 1: Name + Sport */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <EditField label="Auction Name" name="name" value={formData.name} onChange={handleChange} error={formErrors.name} required />
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-semibold text-gray-700">Sports Type <span className="text-red-500">*</span></label>
                        <select name="sportsType" value={formData.sportsType} onChange={handleChange} className={`border rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#0C3278] text-sm bg-white ${formErrors.sportsType ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-300'}`}>
                            <option value="Cricket">Cricket</option>
                            <option value="Football">Football</option>
                            <option value="Kabaddi">Kabaddi</option>
                            <option value="Basketball">Basketball</option>
                        </select>
                        {formErrors.sportsType && <span className="text-[11px] text-red-500 font-medium">{formErrors.sportsType}</span>}
                    </div>
                </motion.div>

                {/* Row 2: Date + Time */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <EditField label="Auction Date" name="auctionDate" type="date" value={formData.auctionDate} onChange={handleChange} error={formErrors.auctionDate} required />
                    <EditField label="Start Time" name="auctionStartTime" type="time" value={formData.auctionStartTime} onChange={handleChange} error={formErrors.auctionStartTime} required />
                </motion.div>

                {/* Row 3: Location + Season */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <EditField label="Location" name="location" value={formData.location} onChange={handleChange} error={formErrors.location} required />
                    <EditField label="Season" type="number" name="season" value={formData.season} onChange={handleChange} error={formErrors.session} />
                </motion.div>

                {/* Divider */}
                <motion.div variants={itemVariants} className="h-[1px] bg-gray-100 my-2" />
                <motion.h3 variants={itemVariants} className="text-[16px] font-bold text-gray-800">Financial Settings</motion.h3>

                {/* Row 4: Budget + MinBid + Increment */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <EditField label="Budget Per Team (₹)" name="budgetPerTeam" type="number" value={formData.budgetPerTeam} onChange={handleChange} error={formErrors.budgetPerTeam} required />
                    <EditField label="Minimum Bid (₹)" name="minBid" type="number" value={formData.minBid} onChange={handleChange} error={formErrors.minBid} required />
                    <EditField label="Bid Increment (₹)" name="bidIncrease" type="number" value={formData.bidIncrease} onChange={handleChange} error={formErrors.bidIncrease} required />
                </motion.div>

                {/* Row 5: Player Limits */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <EditField label="Min Players / Team" name="minPlayersPerTeam" type="number" value={formData.minPlayersPerTeam} onChange={handleChange} error={formErrors.minPlayersPerTeam} required />
                    <EditField label="Max Players / Team" name="maxPlayersPerTeam" type="number" value={formData.maxPlayersPerTeam} onChange={handleChange} error={formErrors.maxPlayersPerTeam} required />
                </motion.div>

                {/* Action Buttons */}
                <motion.div variants={itemVariants} className="flex gap-4 mt-4">
                    <button type="button" onClick={() => router.push(`/dashboard/manage/${auctionId}/details`)} className="flex-1 py-3.5 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isSaving} className="flex-1 py-3.5 bg-[#0C3278] border border-[#FFBA00] text-white font-bold rounded-xl hover:opacity-90 transition-colors shadow-lg shadow-[#0C3278]/20 disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer">
                        {isSaving ? (<><Loader2 size={18} className="animate-spin" /> Saving...</>) : (<><Save size={18} /> Save Changes</>)}
                    </motion.button>
                </motion.div>
            </motion.form>
        </div>
    );
}

// Sub-component for editable fields with error display
function EditField({ label, name, value, onChange, error, type = "text", required = false }: any) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-gray-700">
                {label} {required && <span className="text-red-500">*</span>} {!required && <span className="text-gray-400 font-normal ml-1 text-[11px]">(Optional)</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={`border rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:border-transparent focus:ring-[#0C3278] text-sm bg-white text-gray-800 ${error ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-300'}`}
            />
            {error && <span className="text-[11px] text-red-500 font-medium">{error}</span>}
        </div>
    );
}
