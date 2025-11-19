import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export default function Timeline({ events, className = "" }: TimelineProps) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    itemRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleItems((prev) => new Set(prev).add(index));
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: "0px 0px -100px 0px",
        }
      );

      observer.observe(ref);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [events.length]);

  return (
    <div className={cn("relative py-12 md:py-20", className)}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Línea vertical */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-orange-400 to-orange-300 transform md:-translate-x-1/2" />

        <div className="space-y-12 md:space-y-20">
          {events.map((event, index) => {
            const isVisible = visibleItems.has(index);
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className={cn(
                  "relative flex items-center transition-all duration-1000 ease-out",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                )}
              >
                {/* Layout para desktop */}
                <div className="hidden md:grid md:grid-cols-2 md:gap-8 w-full items-center">
                  {/* Contenido izquierdo */}
                  <div
                    className={cn(
                      "transition-all duration-700 delay-200",
                      isEven ? "text-right pr-8" : "order-2 pl-8",
                      isVisible
                        ? "opacity-100 translate-x-0"
                        : isEven
                        ? "opacity-0 -translate-x-10"
                        : "opacity-0 translate-x-10"
                    )}
                  >
                    <div className="inline-block max-w-md">
                      <h3 className="text-4xl md:text-5xl font-bold text-orange-600 mb-4">
                        {event.year}
                      </h3>
                      <h4 className="text-xl md:text-2xl font-semibold text-secondary-foreground mb-3">
                        {event.title}
                      </h4>
                      <p className="text-base md:text-lg text-secondary-foreground/80 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Círculo central */}
                  <div
                    className={cn(
                      "absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-orange-500 border-4 border-white shadow-lg transition-all duration-500 delay-100",
                      isVisible ? "scale-100" : "scale-0"
                    )}
                  />

                  {/* Espacio derecho */}
                  <div className={cn(isEven ? "order-2" : "")} />
                </div>

                {/* Layout para móvil */}
                <div className="md:hidden flex gap-6 w-full pl-12">
                  {/* Círculo lateral */}
                  <div
                    className={cn(
                      "absolute left-8 transform -translate-x-1/2 w-5 h-5 rounded-full bg-orange-500 border-4 border-white shadow-lg transition-all duration-500 delay-100",
                      isVisible ? "scale-100" : "scale-0"
                    )}
                  />

                  {/* Contenido */}
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-orange-600 mb-3">
                      {event.year}
                    </h3>
                    <h4 className="text-lg font-semibold text-secondary-foreground mb-2">
                      {event.title}
                    </h4>
                    <p className="text-base text-secondary-foreground/80 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
