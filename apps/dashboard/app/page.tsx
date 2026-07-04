"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function DashboardRoot() {
    useEffect(() => {
        redirect("/dashboard/organizer");
    }, []);
    return null; // Prevent layout flash
}
