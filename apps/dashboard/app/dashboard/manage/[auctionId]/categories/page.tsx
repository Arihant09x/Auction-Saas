"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutList, Tag, Trash2, Pencil, X, Plus } from "lucide-react";
import { useAuthStore } from "../../../../../store/auth.store";
import { categorySchema, formatZodErrors } from "../../../../../lib/validations";
import { useCategories } from "../../../../../hooks/useManageAuction";
import { useQueryClient } from "@tanstack/react-query";

export default function ManageCategoriesPage() {
    const router = useRouter();
    const params = useParams();
    const { firebaseToken } = useAuthStore();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const auctionId = params.auctionId as string;

    const queryClient = useQueryClient();
    const { data: categories = [], isLoading: isFetching } = useCategories(auctionId);

    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // MANUAL DATA
    const [categoryData, setCategoryData] = useState({
        name: "", color: "#e2e8f0", baseBid: "", minIncrement: "", minPlayersPerTeam: "", maxPlayersPerTeam: ""
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [editingCatId, setEditingCatId] = useState<string | null>(null);

    const startEditing = (cat: any) => {
        setEditingCatId(cat.id);
        setShowForm(true);
        setCategoryData({
            name: cat.name,
            color: cat.color || "#e2e8f0",
            baseBid: cat.baseBid?.toString() || "",
            minIncrement: cat.minIncrement?.toString() || "",
            minPlayersPerTeam: cat.minPlayersPerTeam?.toString() || "",
            maxPlayersPerTeam: cat.maxPlayersPerTeam?.toString() || ""
        });
        setFormErrors({});
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEditing = () => {
        setEditingCatId(null);
        setShowForm(false);
        setCategoryData({ name: "", color: "#e2e8f0", baseBid: "", minIncrement: "", minPlayersPerTeam: "", maxPlayersPerTeam: "" });
        setFormErrors({});
    };

    const handleManualAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = categorySchema.safeParse(categoryData);
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
                ...categoryData,
                auctionId,
                baseBid: categoryData.baseBid ? Number(categoryData.baseBid) : null,
                minIncrement: categoryData.minIncrement ? Number(categoryData.minIncrement) : null,
                minPlayersPerTeam: categoryData.minPlayersPerTeam ? Number(categoryData.minPlayersPerTeam) : null,
                maxPlayersPerTeam: categoryData.maxPlayersPerTeam ? Number(categoryData.maxPlayersPerTeam) : null
            };

            const endpoint = editingCatId ? `${apiUrl}/category/${editingCatId}` : `${apiUrl}/category`;
            const method = editingCatId ? "PATCH" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${firebaseToken}` },
                body: JSON.stringify(payload)
            });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || (editingCatId ? "Failed to update category" : "Failed to add category"));

            toast.success(editingCatId ? "Category updated!" : "Category saved!");
            setEditingCatId(null);
            setShowForm(false);
            setCategoryData({ name: "", color: "#e2e8f0", baseBid: "", minIncrement: "", minPlayersPerTeam: "", maxPlayersPerTeam: "" });
            queryClient.invalidateQueries({ queryKey: ['categories', auctionId] });
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteCategory = async (categoryId: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            const res = await fetch(`${apiUrl}/category/${categoryId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${firebaseToken}` }
            });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || "Failed to delete category");

            toast.success("Category deleted");
            queryClient.invalidateQueries({ queryKey: ['categories', auctionId] });
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const listVariants: any = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants: any = { hidden: { opacity: 0, x: -15 }, show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

    if (isFetching) {
        return (
            <div className="w-full pb-20 animate-pulse font-poppins">
                <div className="flex items-center gap-2 mb-6">
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-3 w-3 bg-gray-200 rounded" />
                    <div className="h-3 w-28 bg-gray-200 rounded" />
                </div>
                <div className="h-8 w-52 bg-gray-300/60 rounded mb-8" />
                <div className="grid lg:grid-cols-[1fr_400px] gap-8">
                    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-8 flex flex-col gap-5">
                        <div className="h-5 w-40 bg-gray-200 rounded" />
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="flex flex-col gap-1.5">
                                    <div className="h-3 w-20 bg-gray-200 rounded" />
                                    <div className="h-10 bg-gray-200 rounded-lg" />
                                </div>
                            ))}
                        </div>
                        <div className="h-12 w-full bg-gray-300/60 rounded-xl" />
                    </div>
                    <div className="bg-gray-50 rounded-[20px] shadow-inner border border-gray-200 p-6 flex flex-col gap-3 h-[400px]">
                        <div className="h-5 w-32 bg-gray-200 rounded" />
                        {[1, 2].map(i => (
                            <div key={i} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center gap-3">
                                <div className="w-4 h-10 bg-gray-200 rounded" />
                                <div className="flex flex-col gap-1 flex-1">
                                    <div className="h-4 w-28 bg-gray-200 rounded" />
                                    <div className="h-2 w-24 bg-gray-200 rounded" />
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
                <span className="text-[#012972] font-semibold">Categories</span>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
                <h1 className="text-2xl sm:text-[32px] font-bold text-gray-900 drop-shadow-sm">Manage Categories</h1>
                <button
                    onClick={() => {
                        if (showForm && !editingCatId) {
                            setShowForm(false);
                        } else {
                            cancelEditing(); // Reset state first
                            setShowForm(true);
                        }
                    }}
                    className="w-full sm:w-auto bg-[#0C3278] flex gap-2 justify-center items-center text-white px-6 py-2.5 text-sm rounded-full font-bold shadow-md hover:bg-[#082254] transition-colors border border-[#FFBA00]"
                >
                    {showForm && !editingCatId ? <> <X size={20} />Close</> : <> <Plus size={20} /> Add Category</>}
                </button>
            </div>

            <div className={`grid gap-8 ${showForm ? "lg:grid-cols-[1fr_400px]" : "grid-cols-1"}`}>

                {/* DB PREVIEW SECTION */}
                <div className="bg-gray-50 rounded-[20px] shadow-inner border border-gray-200 p-6 flex flex-col min-h-[600px] order-2 lg:order-1">
                    <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                        <Tag size={20} className="text-[#012972]" /> Active Categories <span className="text-sm font-normal text-gray-400 bg-white px-2 py-0.5 rounded-full border">{categories.length} Total</span>
                    </h3>

                    {categories.length === 0 ? (
                        <div className="flex-1 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 font-medium">No custom categories defined.</div>
                    ) : (
                        <motion.div variants={listVariants} initial="hidden" animate="show" className={`grid gap-3 overflow-y-auto pr-2 custom-scrollbar flex ${showForm ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
                            <AnimatePresence>
                                {categories.map((c: any, idx: number) => (
                                    <motion.div variants={itemVariants} exit={{ opacity: 0, scale: 0.95 }} key={c.id || idx} className="bg-white h-full border border-gray-200 rounded-xl flex flex-col justify-between shadow-sm gap-2 relative group overflow-hidden pl-4 p-2">
                                        {/* Color Indicator Bar */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: c.color || "#ccc" }} />

                                        <div className="flex justify-between items-center w-full mt-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: c.color || "#ccc" }} />
                                                <span className="font-bold text-gray-900 leading-tight">{c.name}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            {c.baseBid && <div className="text-[10px] font-bold text-gray-500 bg-gray-50 p-1.5 rounded">Base: <span className="text-green-600 block text-xs">₹{c.baseBid}</span></div>}
                                            {c.minIncrement && <div className="text-[10px] font-bold text-gray-500 bg-gray-50 p-1.5 rounded">Inc: <span className="text-blue-600 block text-xs">₹{c.minIncrement}</span></div>}
                                            {c.maxPlayersPerTeam && <div className="text-[10px] font-bold text-gray-500 bg-gray-50 p-1.5 rounded">Cap: <span className="text-indigo-600 block text-xs">Max {c.maxPlayersPerTeam} / Tm</span></div>}
                                        </div>
                                        <div className="absolute top-2 right-2 flex items-center gap-1 lg:opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur rounded-lg shadow-sm border border-gray-100 p-1">
                                            <button onClick={() => startEditing(c)} className="text-gray-600 hover:text-blue-600 transition-colors p-1.5"><Pencil size={14} /></button>
                                            <button onClick={() => deleteCategory(c.id)} className="text-gray-600 hover:text-red-500 transition-colors p-1.5"><Trash2 size={14} /></button>
                                        </div>
                                    </motion.div>

                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>

                {/* FORM SECTION */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-8 flex flex-col h-fit sticky top-6 order-1 lg:order-2">

                            <form onSubmit={handleManualAdd} className="flex flex-col gap-5">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <LayoutList className="text-[#012972]" size={24} />
                                        <h3 className="font-bold text-gray-800 text-lg">
                                            {editingCatId ? "Edit Player Set" : "Define Player Sets"}
                                        </h3>
                                    </div>
                                    {editingCatId && (
                                        <button type="button" onClick={cancelEditing} className="text-gray-400 hover:text-gray-600">
                                            <X size={20} />
                                        </button>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 mt(-4)">Categories allow you to group players (e.g., Marquee, Set 1) and enforce specific custom limits.</p>

                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <InputField label="Category Name" req name="name" value={categoryData.name} onChange={(e: any) => setCategoryData({ ...categoryData, name: e.target.value })} placeholder="e.g. Marquee" error={formErrors.name} />
                                    <div className="flex flex-col gap-1.5 w-full">
                                        <label className="text-[13px] font-semibold text-gray-700">Category Color <span className="text-gray-400 font-normal ml-1 text-[11px]">(Optional)</span></label>
                                        <input
                                            type="color"
                                            name="color"
                                            value={categoryData.color}
                                            onChange={(e: any) => setCategoryData({ ...categoryData, color: e.target.value })}
                                            className="border border-gray-300 rounded-[8px] px-1 py-1 w-full outline-none focus:ring-2 focus:ring-[#0C3278] h-[42px] cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="h-[1px] bg-gray-100 my-2" />
                                <h4 className="font-bold text-gray-700 text-sm">Custom Limit Overrides</h4>

                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Base Bid Override" type="number" name="baseBid" value={categoryData.baseBid} onChange={(e: any) => setCategoryData({ ...categoryData, baseBid: e.target.value })} placeholder="e.g. 20000000" error={formErrors.baseBid} />
                                    <InputField label="Bid Increment Override" type="number" name="minIncrement" value={categoryData.minIncrement} onChange={(e: any) => setCategoryData({ ...categoryData, minIncrement: e.target.value })} placeholder="e.g. 1000000" error={formErrors.minIncrement} />
                                    <InputField label="Min Players Bound" type="number" name="minPlayersPerTeam" value={categoryData.minPlayersPerTeam} onChange={(e: any) => setCategoryData({ ...categoryData, minPlayersPerTeam: e.target.value })} placeholder="e.g. 1" error={formErrors.minPlayersPerTeam} />
                                    <InputField label="Max Players Bound" type="number" name="maxPlayersPerTeam" value={categoryData.maxPlayersPerTeam} onChange={(e: any) => setCategoryData({ ...categoryData, maxPlayersPerTeam: e.target.value })} placeholder="e.g. 4" error={formErrors.maxPlayersPerTeam} />
                                </div>

                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="mt-4 w-full bg-[#0C3278] text-white font-bold py-3.5 rounded-xl hover:opacity-90 cursor-pointer border border-[#FFBA00] shadow-md transition-colors disabled:opacity-70 shadow-lg shadow-[#0C3278]/20">
                                    {isLoading ? "Saving..." : (editingCatId ? "Update Category System" : "Create Category System")}
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
