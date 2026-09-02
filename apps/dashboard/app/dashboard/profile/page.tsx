"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "../../../store/auth.store";
import { useAuctions, useJoinedAuctions } from "../../../hooks/useAuctions";
import { User, Mail, Award, MapPin, Gavel, Users, Loader2 } from "lucide-react";

export default function ProfilePage() {
    const { user, isInitialized } = useAuthStore();
    const { data: createdAuctions = [], isLoading: loadingCreated } = useAuctions();
    const { data: joinedAuctions = [], isLoading: loadingJoined } = useJoinedAuctions();

    if (!isInitialized || !user) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-[#012972]" size={32} />
            </div>
        );
    }

    const userData = {
        name: (user as any).name || "User",
        email: (user as any).email || "No email",
        uid: (user as any).id || "N/A",
        photoURL: (user as any).profileUrl || null,
        role: (user as any).role || "USER",
        phone: (user as any).mobile || "Not provided",
        city: (user as any).city || "Not provided",
        plan: (user as any).plan || "Organizer Plan",
        joinedDate: (user as any).createdAt ? new Date((user as any).createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently",
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };
    const itemVariants: any = { hidden: { opacity: 0, y: 15, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } } };


    return (
        <div className="relative w-full min-h-full flex flex-col pb-20 font-sans">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium mb-4 px-2">
                <Link href="/dashboard/organizer" className="hover:text-[#012972]">Dashboard</Link>
                <span>/</span>
                <span className="text-[#012972] font-semibold">My Profile</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">My Profile</h1>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6 max-w-[900px]">
                {/* Profile Header Card */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 shrink-0">
                        {userData.photoURL ? (
                            <img src={userData.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <span className="text-gray-600 text-2xl font-bold uppercase">{userData.name.charAt(0)}</span>
                        )}
                    </div>
                    <div className="flex flex-col items-center sm:items-start gap-1">
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">{userData.name}</h2>
                        <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
                            <Mail size={14} className="text-gray-400" /> {userData.email}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-gray-200 text-gray-600 bg-gray-50 uppercase">
                                {userData.role}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">Since {userData.joinedDate}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Live Stats & Derived Row */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                        <Award size={20} className="text-gray-400 shrink-0" strokeWidth={1.5} />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Plan</span>
                            <span className="text-base font-bold text-gray-800">{userData.plan}</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                        <MapPin size={20} className="text-gray-400 shrink-0" strokeWidth={1.5} />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</span>
                            <span className="text-base font-bold text-gray-800">{userData.city}</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                        <Gavel size={20} className="text-gray-400 shrink-0" strokeWidth={1.5} />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Auctions Created</span>
                            <span className="text-base font-bold text-gray-800">
                                {loadingCreated ? (
                                    <Loader2 className="animate-spin text-gray-400" size={14} />
                                ) : (
                                    createdAuctions.length
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                        <Users size={20} className="text-gray-400 shrink-0" strokeWidth={1.5} />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Auctions Joined</span>
                            <span className="text-base font-bold text-gray-800">
                                {loadingJoined ? (
                                    <Loader2 className="animate-spin text-gray-400" size={14} />
                                ) : (
                                    joinedAuctions.length
                                )}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Account Details */}
                <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-50">
                        <User size={18} className="text-gray-500" strokeWidth={1.5} />
                        <h3 className="text-base font-bold text-gray-900">Account Details</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                        <DetailRow label="Full Name" value={userData.name} />
                        <DetailRow label="Email Address" value={userData.email} />
                        <DetailRow label="Phone Number" value={userData.phone} />
                        <DetailRow label="Member Since" value={userData.joinedDate} />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

function DetailRow({ label, value, className = "" }: { label: string; value: string; className?: string }) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
            <span className="text-sm font-semibold text-gray-700 bg-gray-50/50 border border-gray-100/50 rounded-xl px-4 py-2.5 break-all">
                {value}
            </span>
        </div>
    );
}
