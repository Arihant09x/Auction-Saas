import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function PageSkeleton() {
    return (
        <div className="w-full pb-20 animate-pulse font-sans">
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center gap-2 mb-6 w-fit bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <div className="h-3 w-20 bg-gray-200 rounded-md" />
                <div className="h-3 w-3 bg-gray-200 rounded-full" />
                <div className="h-3 w-24 bg-gray-200 rounded-md" />
            </div>

            {/* Header Skeleton */}
            <div className="flex justify-between items-center mb-8">
                <div className="h-10 w-64 bg-gray-200 rounded-lg" />
                <div className="h-10 w-32 bg-gray-200 rounded-full" />
            </div>

            {/* Content Body Grid */}
            <div className="grid lg:grid-cols-[1fr_400px] gap-8">
                {/* Left Side (Lists/Tables) */}
                <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-8 flex flex-col gap-6">
                    <div className="h-6 w-48 bg-gray-200 rounded-md mb-2" />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="h-32 bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                    <div className="flex flex-col gap-1.5">
                                        <div className="h-4 w-24 bg-gray-200 rounded-md" />
                                        <div className="h-2 w-16 bg-gray-200 rounded-md" />
                                    </div>
                                </div>
                                <div className="h-6 w-16 bg-gray-200 rounded-md self-end" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side (Forms/Details/Uploads) */}
                <div className="bg-gray-50 rounded-[20px] shadow-inner border border-gray-100 p-6 flex flex-col gap-5 h-[500px]">
                    <div className="h-6 w-36 bg-gray-200 rounded-md" />
                    
                    <div className="h-32 w-full bg-white rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                        <Loader2 className="animate-spin text-gray-300 w-8 h-8" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="h-3 w-16 bg-gray-200 rounded" />
                                <div className="h-10 w-full bg-white border border-gray-200 rounded-md" />
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto h-12 w-full bg-gray-200 rounded-xl" />
                </div>
            </div>
        </div>
    );
}
