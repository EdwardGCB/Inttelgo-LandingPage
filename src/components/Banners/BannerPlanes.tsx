import { lazy, Suspense } from "react";
import Menu from "@/Layouts/Menu";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const Graph = lazy(() => import("@/components/Canvas/Graph"));

interface BannerPlanesProps {
  image: string;
  className?: string;
  children?: ReactNode;
  /** Desde este breakpoint la imagen ocupa 90% del ancho y los children se ocultan (para contenido solo móvil). */
  imageFullWidthFromMd?: boolean;
}

const BannerPlanes = ({
  image = "",
  className = "",
  children,
  imageFullWidthFromMd = false,
}: BannerPlanesProps) => {
  const hasMobileOnlyChildren = Boolean(children && imageFullWidthFromMd);

  return (
    <div className={cn("relative overflow-hidden mb-10 ", className)}>
      <Suspense fallback={null}>
        <Graph />
      </Suspense>
      <Menu
        className={"text-white hover:text-white/80 bg-transparent"}
        logo="logo-monocromatico.svg"
      />
      <div
        className={cn(
          "flex items-center px-4 sm:px-6 md:px-12 lg:px-20 pb-10",
          children
            ? "flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8"
            : "justify-center",
          hasMobileOnlyChildren && "md:flex-row md:justify-center"
        )}
      >
        <div
          className={cn(
            "flex-shrink-0",
            children
              ? hasMobileOnlyChildren
                ? "hidden sm:block w-full sm:w-2/3 md:w-[90%] md:max-w-7xl md:mx-auto lg:w-[90%] xl:w-[90%]"
                : "hidden sm:block w-full sm:w-2/3 lg:w-3/5 xl:w-2/4"
              : "w-full flex justify-center"
          )}
        >
          <img
            src={`/banners/plan/${image}`}
            alt="Banner de planes Inttelgo - Internet, TV y Telefonía"
            className={cn(
              "w-full h-auto object-contain animate-zoom-in-out",
              children
                ? hasMobileOnlyChildren
                  ? "max-w-xs sm:max-w-sm md:max-w-none md:w-full lg:max-w-none xl:max-w-none mx-auto"
                  : "max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto lg:mx-0"
                : "w-full h-auto object-contain"
            )}
            style={{
              animation: "zoom-in-out 3s ease-in-out infinite",
            }}
          />
        </div>
        {children && (
          <div
            className={cn(
              "flex-1 lg:flex-initial lg:w-2/5 xl:w-1/2 flex items-center justify-center order-2 lg:order-2",
              hasMobileOnlyChildren && "md:hidden"
            )}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerPlanes;
