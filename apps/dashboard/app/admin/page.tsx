"use client";

import { useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import { LogOut, Users, FileText, Database, MessageSquare, CheckCircle, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";

export default function AdminDashboardPage() {
    const { logout, firebaseToken } = useAuthStore();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("dashboard");

    const handleLogout = async () => {
        toast.success("Logged out successfully! Redirecting...");
        try {
            if (auth && typeof auth.signOut === "function") {
                await signOut(auth);
            }
        } catch (err) {
            console.error("Admin signout error:", err);
        }
        logout();
        if (typeof window !== "undefined") {
            localStorage.removeItem("bid-arena-auth");
            setTimeout(() => {
                window.location.href = process.env.NEXT_PUBLIC_LOGIN_URL || "http://localhost:3001/login";
            }, 1000);
        }
    };

    const { data: messages, isLoading: isLoadingMessages } = useQuery({
        queryKey: ["contact-messages"],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/contact`, {
                headers: {
                    Authorization: `Bearer ${firebaseToken}`
                }
            });
            if (!res.ok) throw new Error("Failed to fetch messages");
            return res.json();
        },
        enabled: activeTab === "contact" && !!firebaseToken
    });

    const markAsReadMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/contact/${id}/read`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${firebaseToken}`
                }
            });
            if (!res.ok) throw new Error("Failed to mark as read");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
            toast.success("Message marked as read");
        }
    });

    const deleteMessageMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/contact/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${firebaseToken}`
                }
            });
            if (!res.ok) throw new Error("Failed to delete message");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
            toast.success("Message deleted");
        }
    });

    return (
        <div className="flex h-screen w-full bg-slate-100 font-poppins">
            {/* Simple Sidebar */}
            <aside className="w-64 bg-[#072460] text-white flex flex-col items-center py-8">
                <h1 className="text-2xl font-bold mb-12 text-[#ffba00]">Auction 11</h1>
                
                <nav className="flex flex-col gap-4 w-full px-4 flex-1">
                    <button 
                        onClick={() => setActiveTab("dashboard")}
                        className={`flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors text-left ${activeTab === "dashboard" ? "bg-white/20" : "bg-white/5 hover:bg-white/10"}`}
                    >
                        <Database size={18} /> Dashboard
                    </button>
                    <button className="flex items-center gap-3 w-full bg-white/5 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-white/10 transition-colors text-left opacity-50 cursor-not-allowed">
                        <Users size={18} /> Manage Users
                    </button>
                    <button className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-semibold bg-white/5 hover:bg-white/10 transition-colors text-left opacity-50 cursor-not-allowed">
                        <FileText size={18} /> All Auctions
                    </button>
                    <button 
                        onClick={() => setActiveTab("contact")}
                        className={`flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors text-left ${activeTab === "contact" ? "bg-white/20" : "bg-white/5 hover:bg-white/10"}`}
                    >
                        <MessageSquare size={18} /> Contact Messages
                    </button>
                </nav>

                <div className="w-full px-4">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors text-left"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-10">
                {activeTab === "dashboard" && (
                    <>
                        <header className="mb-10">
                            <h2 className="text-3xl font-bold text-gray-900 drop-shadow-sm">Admin Dashboard</h2>
                            <p className="text-gray-500 mt-2">Welcome to the super-secret admin panel.</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Stats Cards Placeholder */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                                <span className="text-sm font-semibold text-gray-500">Total Users</span>
                                <span className="text-4xl font-black text-[#012972] mt-2">1,248</span>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                                <span className="text-sm font-semibold text-gray-500">Active Auctions</span>
                                <span className="text-4xl font-black text-[#012972] mt-2">45</span>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                                <span className="text-sm font-semibold text-gray-500">System Health</span>
                                <span className="text-4xl font-black text-emerald-500 mt-2">100%</span>
                            </div>
                        </div>

                        <div className="mt-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Recent System Activity</h3>
                            <div className="flex flex-col gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                                                Us
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm">New user registered</span>
                                                <span className="text-xs text-gray-400">user_{i}@example.com</span>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">{i} hour{i > 1 ? 's' : ''} ago</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === "contact" && (
                    <>
                        <header className="mb-10">
                            <h2 className="text-3xl font-bold text-gray-900 drop-shadow-sm">Contact Messages</h2>
                            <p className="text-gray-500 mt-2">Manage inquiries from the landing page contact form.</p>
                        </header>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {isLoadingMessages ? (
                                <div className="p-8 text-center text-gray-500">Loading messages...</div>
                            ) : messages && messages.length > 0 ? (
                                <div className="flex flex-col divide-y divide-gray-100">
                                    {messages.map((msg: any) => (
                                        <div key={msg.id} className={`p-6 flex flex-col gap-3 ${msg.isRead ? 'bg-white' : 'bg-blue-50/50'}`}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                                        {msg.name}
                                                        {!msg.isRead && <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">New</span>}
                                                    </h4>
                                                    <div className="text-sm text-gray-500 flex gap-4 mt-1">
                                                        <span><a href={`mailto:${msg.email}`} className="hover:text-[#012972] hover:underline">{msg.email}</a></span>
                                                        {msg.mobile && <span><a href={`tel:${msg.mobile}`} className="hover:text-[#012972] hover:underline">{msg.mobile}</a></span>}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</span>
                                                    {!msg.isRead && (
                                                        <button 
                                                            onClick={() => markAsReadMutation.mutate(msg.id)}
                                                            title="Mark as read"
                                                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => {
                                                            if (window.confirm("Are you sure you want to delete this message?")) {
                                                                deleteMessageMutation.mutate(msg.id);
                                                            }
                                                        }}
                                                        title="Delete message"
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap border border-gray-100">
                                                {msg.message}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                                    <MessageSquare size={48} className="text-gray-300 mb-4" />
                                    <h3 className="text-lg font-bold text-gray-700">No messages</h3>
                                    <p className="text-sm mt-1">You're all caught up! There are no contact inquiries right now.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
