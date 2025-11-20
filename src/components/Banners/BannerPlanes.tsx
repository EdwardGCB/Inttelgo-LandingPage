import Menu from "@/Layouts/Menu";
import Graph from "@/components/Canvas/Graph";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BannerPlanesProps {
  image: string;
  className?: string;
  children?: ReactNode;
}

const BannerPlanes = ({
  image = "",
  className = "",
  children,
}: BannerPlanesProps) => {
  return (
    <div className={cn("relative overflow-hidden mb-12", className)}>
      <Graph />
      <Menu
        className={"text-white hover:text-white/80 bg-transparent"}
        logo="logo-monocromatico.svg"
      />
      <div
        className={cn(
          "flex items-center px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12 md:py-16 lg:py-20",
          children
            ? "flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8"
            : "justify-center"
        )}
      >
        <div
          className={cn(
            "flex-shrink-0",
            children
              ? "hidden sm:block w-full sm:w-2/3 lg:w-1/3"
              : "w-full flex justify-center"
          )}
        >
          <img
            src={`/banners/plan/${image}`}
            alt="Banner Planes"
            className={cn(
              "w-full h-auto object-contain animate-zoom-in-out",
              children
                ? "max-w-xs sm:max-w-sm md:max-w-md mx-auto lg:mx-0"
                : "w-full h-auto object-contain"
            )}
            style={{
              animation: "zoom-in-out 3s ease-in-out infinite",
            }}
          />
        </div>
        {children && (
          <div className="flex-1 flex items-center justify-center order-2 lg:order-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerPlanes;
