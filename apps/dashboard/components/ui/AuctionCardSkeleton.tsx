import { FC } from "react";

export const AuctionCardSkeleton: FC<{ layout?: "horizontal" | "vertical" }> = ({
  layout = "vertical"
}) => {
  if (layout === "horizontal") {
    // Today Auction Style (Horizontal)
    return (
      <div className="w-[300px] sm:w-[240px] lg:w-[271px] rounded-[12px] bg-white border border-gray-100 shadow-sm p-3 flex items-center gap-3 shrink-0 animate-pulse">
        <div className="w-[68px] h-[68px] rounded-full bg-gray-200 shrink-0" />
        <div className="flex flex-col gap-2 justify-center w-full">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  // Upcoming Auction Style (Vertical/Card) - Exactly matching `my-auction` card
  return (
    <div className="bg-white rounded-2xl flex flex-col shadow-sm border border-gray-100 overflow-hidden animate-pulse w-full">
      <div className="p-5 flex flex-col gap-4">
        {/* Top Metadata Row */}
        <div className="flex justify-between items-start w-full">
          <div className="flex flex-col gap-1">
            <div className="h-2.5 bg-gray-200 rounded w-24" />
            <div className="h-5 bg-gray-300/60 rounded w-16 mt-0.5" />
          </div>
          {/* Plan Tier Pillar */}
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
        </div>

        {/* Profile Row */}
        <div className="flex gap-4 items-center mt-1">
          <div className="w-[65px] h-[65px] rounded-2xl bg-gray-200 shrink-0" />
          <div className="flex flex-col gap-2.5 justify-center w-full">
            <div className="h-4 bg-gray-300/60 rounded w-[85%]" />
            <div className="flex flex-col gap-1.5">
              <div className="h-3 bg-gray-200 rounded w-[60%]" />
              <div className="h-3 bg-gray-200 rounded w-[45%]" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-gray-100 mt-1" />

        {/* Stats Rows */}
        <div className="flex flex-col gap-3 mt-1">
          <div className="flex justify-between items-center w-[100%]">
            <div className="h-3 bg-gray-200 rounded w-[30%]" />
            <div className="h-3 bg-gray-200 rounded w-[30%]" />
          </div>
          <div className="flex justify-between items-center w-[100%]">
            <div className="h-3 bg-gray-200 rounded w-[30%]" />
            <div className="h-3 bg-gray-200 rounded w-[30%]" />
          </div>
        </div>
      </div>

      {/* Action Bar Header Skeleton */}
      <div className="bg-gray-100 py-3.5 flex justify-between items-center px-4 mt-auto border-t border-gray-200">
        {/* Left Action Buttons */}
        <div className="flex gap-4">
          <div className="w-6 h-6 rounded-full bg-gray-300" />
          <div className="w-6 h-6 rounded-full bg-gray-300" />
          <div className="w-6 h-6 rounded-full bg-gray-300" />
          <div className="w-6 h-6 rounded-full bg-gray-300" />
        </div>

        <div className="w-[1px] h-6 bg-gray-300 mx-1"></div>

        {/* Right Action Buttons */}
        <div className="flex gap-4">
          <div className="w-6 h-6 rounded-full bg-gray-300" />
          <div className="w-6 h-6 rounded-full bg-gray-300" />
          <div className="w-6 h-6 rounded-full bg-gray-300" />
        </div>
      </div>
    </div>
  );
};
