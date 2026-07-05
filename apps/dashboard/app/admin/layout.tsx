"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";
import { ShieldAlert, Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { firebaseToken } = useAuthStore();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        if (!firebaseToken) {
            window.location.href = `${process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3001"}/login`;
            return;
        }

        // Verify ADMIN role securely via backend API
        const verifyAdmin = async () => {
            try {
                const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
                const res = await fetch(`${backendUrl}/api/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${firebaseToken}`
                    }
                });

                if (!res.ok) throw new Error("Unauthorized");
                const dbUser = await res.json();
                
                if (dbUser.role === "ADMIN") {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            } catch (err) {
                setIsAuthorized(false);
            }
        };

        verifyAdmin();
    }, [firebaseToken, router]);

    if (isAuthorized === null) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 text-gray-800">
                <Loader2 className="h-10 w-10 animate-spin text-[#0C3278]" />
                <p className="mt-4 font-semibold">Verifying Admin Access...</p>
            </div>
        );
    }

    if (isAuthorized === false) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-6 text-center">
                <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
                <p className="text-gray-500 mb-6 max-w-md">
                    You do not have the required permissions to view this dashboard. Hackers step back! 
                </p>
                <button
                    onClick={() => router.replace("/dashboard/organizer")}
                    className="bg-[#012972] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#0C3278] transition-colors"
                >
                    Return to User Dashboard
                </button>
            </div>
        );
    }

    return <div className="bg-gray-50 min-h-screen">{children}</div>;
}
