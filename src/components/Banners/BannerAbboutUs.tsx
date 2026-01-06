import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { lazy, Suspense } from "react";
import Menu from "@/Layouts/Menu";

const Graph = lazy(() => import("../Canvas/Graph"));

interface BannerAbboutUsProps {
  image?: string;
  className?: string;
  children?: ReactNode;
}

export default function BannerAbboutUs({
  image = "",
  className = "",
  children,
}: BannerAbboutUsProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden mb-12 min-h-[400px] lg:min-h-[500px]",
        className
      )}
    >
      {/* Graph - z-0 (más atrás) */}
      <div className="absolute inset-0 z-10">
        <Suspense fallback={null}>
          <Graph />
        </Suspense>
      </div>

      {/* Menu - z-50 (encima de todo) */}
      <div className="relative z-50">
        <Menu
          className={
            "text-white hover:text-white/80 bg-gradient-to-b from-black to-transparent"
          }
          detailsColor=""
          logo="logo-blanco.svg"
        />
      </div>

      {/* Imagen de fondo con difuminado */}
      {image && (
        <div className="absolute inset-0 z-[1]">
          {/* Móvil: imagen de fondo completa */}
          <div className="lg:hidden absolute inset-0">
            <img
              src={image}
              alt="Banner Inttelgo - Internet de alta velocidad para tu hogar"
              className="w-full h-full object-cover"
              width={1920}
              height={1080}
              style={{ aspectRatio: "16 / 9" }}
              loading="lazy"
              decoding="async"
            />
            {/* Gradiente de arriba hacia abajo en móvil */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/90" />
          </div>

          {/* Desktop: imagen a la derecha */}
          <div className="hidden lg:block absolute inset-0">
            <div className="relative w-full h-full flex">
              <div className="w-1/2 h-full bg-black" />
              <div className="w-1/2 h-full relative">
                <img
                  src={image}
                  alt="Banner Inttelgo - Internet de alta velocidad para tu hogar"
                  className="w-full h-full object-cover"
                  width={1920}
                  height={1080}
                  style={{ aspectRatio: "16 / 9" }}
                  loading="lazy"
                  decoding="async"
                />
                {/* Gradiente de derecha a izquierda en desktop */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/30 to-black" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido - z-10 */}
      <div
        className={cn(
          "relative z-10 flex items-center px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12 md:py-16 lg:py-20 min-h-[400px] lg:min-h-[500px]",
          children
            ? image
              ? "flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 lg:justify-start"
              : "justify-center"
            : "justify-center"
        )}
      >
        {children && (
          <div
            className={cn(
              "flex items-center justify-center",
              image ? "w-full lg:w-1/2 lg:justify-start" : "w-full"
            )}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
