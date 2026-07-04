import { FC } from "react";
import { Users, Calendar, MapPin, Wallet } from "lucide-react";

export const AuctionCardSkeleton: FC<{ layout?: "horizontal" | "vertical" }> = ({
  layout = "vertical"
}) => {
  if (layout === "horizontal") {
    // Today Auction Style (Horizontal)
    return (
      <div className="w-[300px] sm:w-[240px] lg:w-[271px] rounded-[12px] bg-white border-2 border-gray-100 shadow-sm p-3 flex items-center gap-3 shrink-0">
        <div className="w-[68px] h-[68px] rounded-full object-cover shrink-0 skeleton skeleton-animated" />
        <div className="flex flex-col gap-2 justify-center w-full">
          <div className="h-4 w-3/4 skeleton skeleton-animated rounded" />
          <div className="flex flex-col gap-2 mt-1">
            <div className="h-3 w-1/2 skeleton skeleton-animated rounded" />
            <div className="h-3 w-2/3 skeleton skeleton-animated rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Upcoming Auction Style (Vertical/Card)
  return (
    <div className="bg-white rounded-[16px] w-[300px] sm:w-[371px] h-[200px] sm:h-[271px] flex flex-col overflow-hidden relative shadow-sm shrink-0 border border-gray-100 gap-8">
      <div className="w-full h-[145px] relative rounded-t-[16px] overflow-hidden bg-gray-50 p-[2px] flex justify-center items-center">
        <div className="w-full h-full skeleton skeleton-animated rounded-t-[12px]" />
      </div>
      <div className="p-4 flex flex-col grid grid-cols-2 gap-4 w-full">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-gray-300" />
          <div className="h-4 w-2/3 skeleton skeleton-animated rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Wallet size={18} className="text-gray-300" />
          <div className="h-4 w-2/3 skeleton skeleton-animated rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Users size={18} className="text-gray-300" />
          <div className="h-4 w-2/3 skeleton skeleton-animated rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-gray-300" />
          <div className="h-4 w-1/2 skeleton skeleton-animated rounded" />
        </div>
      </div>
    </div>
  );
};
