import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo, memo, lazy, Suspense } from "react"
import { cn } from "@/lib/utils"
import { CardContent, Card } from "@/components/ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Check } from "lucide-react"
import type { Plan } from "@/interfaces/plan"
import { trackEvent } from "@/lib/analytics"

const Stars = lazy(() => import("@/components/Canvas/Stars"))

const MouseEnterContext = createContext<
    [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined)

interface PlanProps {
    plan: Plan;
}

export interface CardContainerProps {
    children?: React.ReactNode
    className?: string
    containerClassName?: string
}

// Throttle function para optimizar mouse move
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
    let inThrottle: boolean
    return ((...args: any[]) => {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => (inThrottle = false), limit)
        }
    }) as T
}

// Breakpoint para considerar "móvil" (sin mouse, efecto 3D por touch opcional)
const MOBILE_BREAKPOINT = 768

export const CardContainer = ({ children, className, containerClassName }: CardContainerProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isMouseEntered, setIsMouseEntered] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const rafRef = useRef<number | null>(null)
    const boundsRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null)

    // Detectar vista móvil (no hay mouse; usamos touch como alternativa)
    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
        const handler = () => setIsMobile(mq.matches)
        handler()
        mq.addEventListener("change", handler)
        return () => mq.removeEventListener("change", handler)
    }, [])

    // Cache bounds para evitar getBoundingClientRect en cada movimiento
    const updateBounds = useCallback(() => {
        if (containerRef.current) {
            boundsRef.current = containerRef.current.getBoundingClientRect()
        }
    }, [])

    const applyTilt = useCallback((clientX: number, clientY: number) => {
        if (!containerRef.current || !boundsRef.current) return
        const { left, top, width, height } = boundsRef.current
        const x = (clientX - left - width / 2) / 25
        const y = (clientY - top - height / 2) / 25
        containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`
    }, [])

    const resetTilt = useCallback(() => {
        if (containerRef.current) {
            containerRef.current.style.transform = "rotateY(0deg) rotateX(0deg)"
        }
        boundsRef.current = null
    }, [])

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile) return
        if (!containerRef.current || !boundsRef.current) return
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(() => {
            applyTilt(e.clientX, e.clientY)
        })
    }, [isMobile, applyTilt])

    const throttledMouseMove = useMemo(
        () => throttle(handleMouseMove, 16),
        [handleMouseMove]
    )

    const handleMouseEnter = useCallback((_e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile) return
        setIsMouseEntered(true)
        updateBounds()
    }, [isMobile, updateBounds])

    const handleMouseLeave = useCallback((_e: React.MouseEvent<HTMLDivElement>) => {
        setIsMouseEntered(false)
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
        resetTilt()
    }, [resetTilt])

    // En móvil: alternativa 3D con touch (arrastrar para inclinar la tarjeta)
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (!isMobile) return
        updateBounds()
        setIsMouseEntered(true)
        const touch = e.touches[0]
        if (touch && boundsRef.current) applyTilt(touch.clientX, touch.clientY)
    }, [isMobile, updateBounds, applyTilt])

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isMobile || e.touches.length === 0) return
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
        const touch = e.touches[0]
        rafRef.current = requestAnimationFrame(() => {
            applyTilt(touch.clientX, touch.clientY)
        })
    }, [isMobile, applyTilt])

    const handleTouchEnd = useCallback(() => {
        if (!isMobile) return
        setIsMouseEntered(false)
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
        resetTilt()
    }, [isMobile, resetTilt])

    useEffect(() => {
        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
        }
    }, [])

    return (
        <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
            <div
                className={cn("py-20 flex items-center justify-center w-full", containerClassName)}
                style={{
                    perspective: "1000px",
                }}
            >
                <div
                    className={cn(
                        "flex items-center justify-center relative transition-all duration-200 ease-linear w-full max-w-md",
                        className,
                    )}
                    role="button"
                    tabIndex={0}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={throttledMouseMove}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                    ref={containerRef}
                    style={{
                        transformStyle: "preserve-3d",
                        willChange: "transform", // Optimización GPU
                    }}
                >
                    {children}
                </div>
            </div>
        </MouseEnterContext.Provider>
    )
}

export interface CardBodyProps {
    children: React.ReactNode
    className?: string
    reduceEffects?: boolean // Nueva prop para reducir efectos en dispositivos lentos
    variant?: "primary" | "secondary"
}

export const CardBody = ({ children, className, reduceEffects = false, variant = "secondary" }: CardBodyProps) => {
    const isPrimary = variant === "primary"

    // Colores para variante primary (morado)
    const primaryBorder = '2px solid rgba(147, 51, 234, 0.6)' // purple-600 con opacidad
    const primaryGlow = reduceEffects
        ? '0 0 30px rgba(147, 51, 234, 0.8)'
        : '0 0 60px rgba(147, 51, 234, 0.9), 0 0 120px rgba(124, 58, 237, 0.6), inset 0 0 60px rgba(139, 92, 246, 0.3)'
    const primaryBackground = '' // azul noche a morado

    // Colores para variante secondary (naranja)
    const secondaryBorder = '2px solid rgba(255, 152, 0, 0.3)'
    const secondaryGlow = reduceEffects
        ? '0 0 30px rgba(255, 152, 0, 0.6)'
        : '0 0 60px rgba(255, 152, 0, 0.8), 0 0 120px rgba(255, 152, 0, 0.4), inset 0 0 60px rgba(255, 255, 255, 0.2)'

    return (
        <>
            <style>{`
                @keyframes hologramPulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }

                @keyframes hologramFloat {
                    0%, 100% {
                        transform: translateY(0) scale(1);
                    }
                    50% {
                        transform: translateY(-10px) scale(1.01);
                    }
                }

                @keyframes hologramOrbit {
                    from {
                        transform: translate(-50%, -50%) rotate(0deg) translateX(150px) rotate(0deg);
                    }
                    to {
                        transform: translate(-50%, -50%) rotate(360deg) translateX(150px) rotate(-360deg);
                    }
                }

                @keyframes shimmer {
                    0% {
                        background-position: -200% center;
                    }
                    100% {
                        background-position: 200% center;
                    }
                }
            `}</style>
            <div
                className={cn(
                    "[transform-style:preserve-3d] relative rounded-2xl w-full h-full",
                    className,
                )}
                style={{
                    border: isPrimary ? primaryBorder : secondaryBorder,
                    boxShadow: isPrimary ? primaryGlow : secondaryGlow,
                    background: isPrimary ? primaryBackground : undefined,
                    animation: 'hologramFloat 4s ease-in-out infinite',
                    willChange: 'transform', // Optimización GPU
                }}
            >
                {/* Resplandor de fondo morado para variante primary */}
                {isPrimary && !reduceEffects && (
                    <>
                        <div
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full rounded-full pointer-events-none z-0"
                            style={{
                                background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(124, 58, 237, 0.2) 40%, transparent 70%)',
                                animation: 'hologramPulse 3s ease-in-out infinite',
                                filter: 'blur(30px)',
                                willChange: 'opacity',
                            }}
                        />
                        <div
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full rounded-full pointer-events-none z-0"
                            style={{
                                background: 'radial-gradient(circle, rgba(167, 139, 250, 0.6) 0%, transparent 70%)',
                                animation: 'hologramPulse 2s ease-in-out infinite',
                                filter: 'blur(40px)',
                                willChange: 'opacity',
                            }}
                        />
                    </>
                )}

                {/* Estrellas para variante primary */}
                {isPrimary && (
                    <Suspense fallback={null}>
                        <Stars starCount={90} />
                    </Suspense>
                )}

                {/* Contenido */}
                <div
                    className="relative z-10 [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d] w-full space-y-2"
                    style={{
                        transformStyle: 'preserve-3d',
                    }}
                >
                    {children}
                </div>

            </div>
        </>
    )
}

export type CardItemProps = {
    as?: React.ElementType
    children: React.ReactNode
    className?: string
    translateX?: number | string
    translateY?: number | string
    translateZ?: number | string
    rotateX?: number | string
    rotateY?: number | string
    rotateZ?: number | string
} & Record<string, any>

export const CardItem = ({
    as: Tag = "div",
    children,
    className,
    translateX = 0,
    translateY = 0,
    translateZ = 0,
    rotateX = 0,
    rotateY = 0,
    rotateZ = 0,
    ...rest
}: CardItemProps) => {
    const ref = useRef<any>(null)
    const [isMouseEntered] = useMouseEnter()

    useEffect(() => {
        if (!ref.current) return

        if (isMouseEntered) {
            ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
        } else {
            ref.current.style.transform =
                "translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)"
        }
    }, [isMouseEntered, translateX, translateY, translateZ, rotateX, rotateY, rotateZ])

    return React.createElement(
        Tag,
        {
            ref,
            className: cn("transition duration-200 ease-linear", className),
            style: { willChange: 'transform' }, // Optimización GPU
            ...rest,
        },
        children,
    )
}

export const useMouseEnter = () => {
    const context = useContext(MouseEnterContext)
    if (context === undefined) {
        throw new Error("useMouseEnter must be used within a MouseEnterProvider")
    }
    return context
}


export const SecondaryPlanHologram3D = memo(({ plan }: PlanProps) => {
    const phone = "573002698767";
    const [isFlipped, setIsFlipped] = useState(false)
    const [reduceEffects, setReduceEffects] = useState(false)

    const handleShowMore = useCallback(() => {
        setIsFlipped(true);
    }, []);

    const handleShowLess = useCallback(() => {
        setIsFlipped(false);
    }, []);

    const handleContactUs = useCallback(() => {
        trackEvent("whatsapp_contact", {
            event_category: "contact",
            event_label: "Línea de ventas",
            phone_number: phone,
        });
        window.open(`https://wa.me/${phone}`, "_blank");
    }, [phone]);

    useEffect(() => {
        // Detectar rendimiento basado en hardware o preferencias del usuario
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4

        if (prefersReducedMotion || isLowEndDevice) {
            setReduceEffects(true)
        }
    }, [])

    return (
        <div className="perspective-1000 w-full">
            <div
                className={cn(
                    "relative w-full transition-transform duration-700 transform-style-3d",
                    isFlipped && "rotate-y-180"
                )}
                style={{ willChange: 'transform' }}
            >
                {/* FRENTE DE LA TARJETA */}
                <div className={cn("backface-hidden", isFlipped && "invisible")}>
                    <CardContainer containerClassName="py-0">
                        <CardBody
                            className="relative flex flex-col justify-center h-auto p-6 shadow-xl bg-card"
                            reduceEffects={reduceEffects}
                        >
                            <CardItem translateZ={100} className="mt-4 w-full -translate-y-10 ">
                                <Card className="absolute -top-15 left-1/2 -translate-x-1/2 z-10 w-3xs h-3xs flex items-center justify-center rounded-xl bg-primary ">
                                    <CardContent className="text-primary-foreground flex flex-col items-center justify-center w-full h-full">
                                        <span className="text-7xl font-bold leading-none">{plan.speed}</span>
                                        <span className="text-4xl font-semibold -mt-2">Mbps</span>
                                    </CardContent>
                                </Card>
                            </CardItem>
                            {plan.extras.map((extra, index) => (
                                <CardItem key={`extra-${index}`} translateZ={110} className="mt-4 w-full -translate-y-10">
                                    <Card
                                        className="bg-gradient-to-r from-[#ff9900] to-[#ec5406] absolute -left-1/16 -translate-x-1/2 z-12 p-3 border-none"
                                        style={{
                                            top: `${1 + index * 4.5}rem`,
                                        }}
                                    >
                                        <CardContent className="text-primary-foreground flex flex-col items-center justify-center w-full h-full p-0">
                                            <span className="text-xl md:text-2xl lg:text-3xl font-bold">
                                                {extra}
                                            </span>
                                        </CardContent>
                                    </Card>
                                </CardItem>
                            ))}

                            <CardItem translateZ={50} className="mt-29 mb-10 w-full">
                                <div className="relative flex flex-col items-center mb-6">
                                    <Badge
                                        variant="orange"
                                        className="rounded-full px-8 py-2 text-6xl font-bold flex justify-center items-center"
                                        style={{ borderRadius: "2.5rem" }}
                                    >
                                        {plan.price}
                                    </Badge>
                                    <Badge
                                        variant="secondary"
                                        className="absolute left-1/2 -translate-x-1/2 -bottom-4 px-3 py-0.7 text-base font-semibold shadow"
                                        style={{ borderRadius: "1rem" }}
                                    >
                                        mensuales
                                    </Badge>
                                </div>
                            </CardItem>
                            <CardItem translateZ={40} className="w-full">
                                <Button
                                    onClick={handleShowMore}
                                    className="w-full py-6 flex rounded-xl text-lg"
                                >
                                    <span className="font-semibold">Ver más</span>
                                </Button>
                            </CardItem>
                        </CardBody>
                    </CardContainer>
                </div>

                {/* REVERSO DE LA TARJETA */}
                <div
                    className={cn(
                        "absolute inset-0 backface-hidden rotate-y-180",
                        !isFlipped && "invisible"
                    )}
                >
                    <CardContainer containerClassName="py-0">
                        <CardBody
                            className="relative flex flex-col justify-center h-auto rounded-xl border p-6 shadow-xl bg-card"
                            reduceEffects={reduceEffects}
                        >
                            <CardItem translateZ={60} className="w-full mb-4">
                                <h3 className="text-2xl font-bold text-center mb-2">{plan.title}</h3>
                            </CardItem>

                            <CardItem translateZ={60} className="w-full mb-4">
                                {plan.caracteristicas.map((caracteristica: string, index: number) => (
                                    <div key={`caracteristica-${index}`} className="flex items-start gap-3 bg-transparent w-full">
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Check className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">{caracteristica}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardItem>

                            <CardItem translateZ={40} className="w-full space-y-2">
                                <Button
                                    onClick={handleContactUs}
                                    variant="green"
                                    className="w-full min-h-[44px] py-6 flex rounded-xl"
                                >
                                    <span className="text-lg font-semibold">¡Contáctanos!</span>
                                </Button>
                                <Button
                                    onClick={handleShowLess}
                                    variant="outline"
                                    className="w-full min-h-[44px] py-6 flex rounded-xl"
                                >
                                    <span className="text-lg font-semibold">Ver menos</span>
                                </Button>
                            </CardItem>
                        </CardBody>
                    </CardContainer>
                </div>
            </div>

            <style>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
            `}</style>
        </div>
    )
}, (prevProps, nextProps) => {
    if (prevProps.plan.speed !== nextProps.plan.speed) return false;
    if (prevProps.plan.price !== nextProps.plan.price) return false;
    if (prevProps.plan.title !== nextProps.plan.title) return false;
    if (prevProps.plan.category !== nextProps.plan.category) return false;
    if (prevProps.plan.caracteristicas.length !== nextProps.plan.caracteristicas.length) return false;

    const prevCaracteristicas = prevProps.plan.caracteristicas.join(',');
    const nextCaracteristicas = nextProps.plan.caracteristicas.join(',');
    if (prevCaracteristicas !== nextCaracteristicas) return false;

    return true;
});


export const PrimaryPlanHologram3D = memo(({ plan }: PlanProps) => {
    const phone = "573002698767";
    const [isFlipped, setIsFlipped] = useState(false)
    const [reduceEffects, setReduceEffects] = useState(false)

    const handleShowMore = useCallback(() => {
        setIsFlipped(true);
    }, []);

    const handleShowLess = useCallback(() => {
        setIsFlipped(false);
    }, []);

    const handleContactUs = useCallback(() => {
        trackEvent("whatsapp_contact", {
            event_category: "contact",
            event_label: "Línea de ventas",
            phone_number: phone,
        });

        window.open(`https://wa.me/${phone}`, "_blank");
    }, [phone]);

    useEffect(() => {
        // Detectar rendimiento basado en hardware o preferencias del usuario
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4

        if (prefersReducedMotion || isLowEndDevice) {
            setReduceEffects(true)
        }
    }, [])

    return (
        <div className="perspective-1000 w-full">
            <div
                className={cn(
                    "relative w-full transition-transform duration-700 transform-style-3d",
                    isFlipped && "rotate-y-180"
                )}
                style={{ willChange: 'transform' }}
            >
                {/* FRENTE DE LA TARJETA */}
                <div className={cn("backface-hidden", isFlipped && "invisible")}>
                    <CardContainer containerClassName="py-0">
                        <CardBody
                            className="relative flex flex-col justify-center h-auto p-6 shadow-xl bg-primary"
                            reduceEffects={reduceEffects}
                            variant="primary"
                        >
                            <CardItem translateZ={50} className="mt-4 w-full -translate-y-10">
                                <Card className="absolute -top-15 left-1/2 -translate-x-1/2 z-10 w-3xs h-3xs flex items-center justify-center rounded-xl bg-primary">
                                    <CardContent className="text-primary-foreground flex flex-col items-center justify-center w-full h-full">
                                        <span className="text-7xl font-bold leading-none text-center">{plan.title}</span>
                                    </CardContent>
                                </Card>
                            </CardItem>
                            {plan.extras.map((extra, index) => (
                                <CardItem key={`extra-${index}`} translateZ={60} className="mt-4 w-full -translate-y-10">
                                    <Card
                                        className="bg-gradient-to-r from-[#320061] to-[#9c15c5] absolute -left-1/16 -translate-x-1/2 z-12 p-3 border-none"
                                        style={{
                                            top: `${1 + index * 4.5}rem`,
                                        }}
                                    >
                                        <CardContent className="text-primary-foreground flex flex-col items-center justify-center w-full h-full p-0">
                                            <span className="text-xl md:text-2xl lg:text-3xl font-bold">
                                                {extra}
                                            </span>
                                        </CardContent>
                                    </Card>
                                </CardItem>
                            ))}

                            <CardItem translateZ={50} className="mt-29 mb-10 w-full flex flex-col items-center justify-center text-center text-primary-foreground">
                                <h2 className="text-6xl font-bold">
                                    {plan.speed}
                                </h2>
                                <span className="text-xl font-semibold">Mbps</span>
                                {/* Línea de destello horizontal con morado en el centro */}
                                <div
                                    className="w-full h-1 my-3 rounded-full relative overflow-hidden"
                                    style={{
                                        background: 'linear-gradient(90deg, transparent 0%, rgba(147, 51, 234, 0.3) 20%, rgba(147, 51, 234, 0.8) 45%, rgba(167, 139, 250, 1) 50%, rgba(147, 51, 234, 0.8) 55%, rgba(147, 51, 234, 0.3) 80%, transparent 100%)',
                                        backgroundSize: '200% 100%',
                                        animation: 'shimmer 3s ease-in-out infinite',
                                        boxShadow: '0 0 10px rgba(147, 51, 234, 0.6), 0 0 20px rgba(167, 139, 250, 0.4)',
                                    }}
                                />
                            </CardItem>
                            <CardItem translateZ={50} className="w-full">
                                <Button
                                    onClick={handleShowMore}
                                    variant="purple"
                                    className="w-full py-6 flex rounded-xl text-lg"
                                >
                                    <span className="font-semibold">Ver más</span>
                                </Button>
                            </CardItem>
                        </CardBody>
                    </CardContainer>
                </div>

                {/* REVERSO DE LA TARJETA */}
                <div
                    className={cn(
                        "absolute inset-0 backface-hidden rotate-y-180",
                        !isFlipped && "invisible"
                    )}
                >
                    <CardContainer containerClassName="py-0">
                        <CardBody
                            className="relative flex flex-col justify-center h-auto rounded-xl border p-6 shadow-xl bg-primary"
                            reduceEffects={reduceEffects}
                            variant="primary"
                        >
                            <CardItem translateZ={70} className="w-full mb-4 text-primary-foreground">
                                <h3 className="text-2xl font-bold text-center mb-2">{plan.title}</h3>
                            </CardItem>

                            <CardItem translateZ={60} className="w-full text-primary-foreground">
                                {plan.caracteristicas.map((caracteristica: string, index: number) => (
                                    <div key={`caracteristica-${index}`} className="flex items-start gap-3 w-full">
                                        <div className="w-6 h-6 flex items-center justify-center ">
                                            <Check className="w-4 h-4" />
                                        </div>

                                        <p className="font-semibold">{caracteristica}</p>
                                    </div>

                                ))}
                            </CardItem>
                            <CardItem translateZ={40} className="w-full space-y-2">
                                <Button
                                    onClick={handleContactUs}
                                    variant="green"
                                    className="w-full min-h-[44px] py-6 flex rounded-xl"
                                >
                                    <span className="text-lg font-semibold">¡Contáctanos!</span>
                                </Button>
                                <Button
                                    onClick={handleShowLess}
                                    variant="outline"
                                    className="w-full min-h-[44px] py-6 flex rounded-xl"
                                >
                                    <span className="text-lg font-semibold">Ver menos</span>
                                </Button>
                            </CardItem>
                        </CardBody>
                    </CardContainer>
                </div>
            </div>

            <style>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
            `}</style>
        </div >
    )
}, (prevProps, nextProps) => {
    if (prevProps.plan.speed !== nextProps.plan.speed) return false;
    if (prevProps.plan.price !== nextProps.plan.price) return false;
    if (prevProps.plan.title !== nextProps.plan.title) return false;
    if (prevProps.plan.category !== nextProps.plan.category) return false;
    if (prevProps.plan.caracteristicas.length !== nextProps.plan.caracteristicas.length) return false;

    const prevCaracteristicas = prevProps.plan.caracteristicas.join(',');
    const nextCaracteristicas = nextProps.plan.caracteristicas.join(',');
    if (prevCaracteristicas !== nextCaracteristicas) return false;

    return true;
})