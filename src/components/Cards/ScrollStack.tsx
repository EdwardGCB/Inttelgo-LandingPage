import React, { createContext, useContext, useLayoutEffect, useRef, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';

export interface ScrollStackContextValue {
    activeIndex: number;
}

const ScrollStackContext = createContext<ScrollStackContextValue>({ activeIndex: 0 });

export const useScrollStackContext = () => useContext(ScrollStackContext);

export interface ScrollStackItemProps {
    itemClassName?: string;
    align?: 'left' | 'right';
    index: number;
    children: ReactNode;
}

/** Bloque de timeline: marcador circular + contenido (año, título, descripción, imagen). Sin cards. */
export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
    itemClassName = '',
    align = 'left',
    children
}) => {
    const isRight = align === 'right';

    return (
        <div
            className={`scroll-stack-card relative w-full min-h-68 my-8 box-border origin-top will-change-transform overflow-hidden ${isRight ? 'md:ml-auto -mr-12 md:pl-0 md:pr-16 md:w-[calc(50%-1rem)]' : 'pl-14 md:pl-16 md:mr-auto md:w-[calc(50%-1rem)]'} ${itemClassName}`.trim()}
            style={{
                backfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d'
            }}
        >
            <div className={`flex flex-col gap-4 md:gap-6 py-4`}>
                {children}
            </div>
        </div>
    );
};

interface ScrollStackProps {
    className?: string;
    children: ReactNode;
    itemDistance?: number;
    itemScale?: number;
    itemStackDistance?: number;
    stackPosition?: string;
    scaleEndPosition?: string;
    baseScale?: number;
    scaleDuration?: number;
    rotationAmount?: number;
    blurAmount?: number;
    useWindowScroll?: boolean;
    onStackComplete?: () => void;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
    children,
    className = '',
    itemDistance = 100,
    itemScale = 0.03,
    itemStackDistance = 30,
    stackPosition = '20%',
    scaleEndPosition = '10%',
    baseScale = 0.85,
    scaleDuration = 0.5,
    rotationAmount = 0,
    blurAmount = 0,
    useWindowScroll = false,
    onStackComplete
}) => {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const stackCompletedRef = useRef(false);
    const animationFrameRef = useRef<number | null>(null);
    const lenisRef = useRef<Lenis | null>(null);
    const cardsRef = useRef<HTMLElement[]>([]);
    const lastTransformsRef = useRef(new Map<number, any>());
    const isUpdatingRef = useRef(false);
    /** Posiciones iniciales en documento (sin transformar) para evitar feedback loop y parpadeo */
    const initialCardTopsRef = useRef<number[]>([]);
    const scrollRafRef = useRef<number | null>(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const lastActiveIndexRef = useRef(0);

    const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
        if (scrollTop < start) return 0;
        if (scrollTop > end) return 1;
        return (scrollTop - start) / (end - start);
    }, []);

    const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
        if (typeof value === 'string' && value.includes('%')) {
            return (parseFloat(value) / 100) * containerHeight;
        }
        return parseFloat(value as string);
    }, []);

    const getScrollData = useCallback(() => {
        if (useWindowScroll) {
            return {
                scrollTop: window.scrollY,
                containerHeight: window.innerHeight,
                scrollContainer: document.documentElement
            };
        } else {
            const scroller = scrollerRef.current;
            return {
                scrollTop: scroller ? scroller.scrollTop : 0,
                containerHeight: scroller ? scroller.clientHeight : 0,
                scrollContainer: scroller
            };
        }
    }, [useWindowScroll]);

    const getElementOffset = useCallback(
        (element: HTMLElement) => {
            if (useWindowScroll) {
                const rect = element.getBoundingClientRect();
                return rect.top + window.scrollY;
            } else {
                return element.offsetTop;
            }
        },
        [useWindowScroll]
    );

    const updateCardTransforms = useCallback(() => {
        if (!cardsRef.current.length || isUpdatingRef.current) return;

        if (useWindowScroll && initialCardTopsRef.current.length === 0 && cardsRef.current.length > 0) {
            initialCardTopsRef.current = cardsRef.current.map((card) => getElementOffset(card));
        }

        isUpdatingRef.current = true;

        const { scrollTop, containerHeight } = getScrollData();
        const stackPositionPx = parsePercentage(stackPosition, containerHeight);
        const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

        const endElement = useWindowScroll
            ? (document.querySelector('.scroll-stack-end') as HTMLElement | null)
            : (scrollerRef.current?.querySelector('.scroll-stack-end') as HTMLElement | null);

        const endElementTop = endElement ? getElementOffset(endElement) : 0;

        /** Índice de la card actualmente visible (on top del stack) */
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
            const jCardTop = useWindowScroll && initialCardTopsRef.current[j] != null
                ? initialCardTopsRef.current[j]
                : getElementOffset(cardsRef.current[j]);
            const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
            if (scrollTop >= jTriggerStart) {
                topCardIndex = j;
            }
        }
        if (lastActiveIndexRef.current !== topCardIndex) {
            lastActiveIndexRef.current = topCardIndex;
            setActiveIndex(topCardIndex);
        }

        cardsRef.current.forEach((card, i) => {
            if (!card) return;

            const cardTop = useWindowScroll && initialCardTopsRef.current[i] != null
                ? initialCardTopsRef.current[i]
                : getElementOffset(card);
            const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
            const triggerEnd = cardTop - scaleEndPositionPx;
            const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
            const pinEnd = endElementTop - containerHeight / 2;

            const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
            const targetScale = baseScale + i * itemScale;
            const scale = 1 - scaleProgress * (1 - targetScale);
            const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

            let blur = 0;
            if (blurAmount) {
                let topCardIndex = 0;
                for (let j = 0; j < cardsRef.current.length; j++) {
                    const jCardTop = useWindowScroll && initialCardTopsRef.current[j] != null
                        ? initialCardTopsRef.current[j]
                        : getElementOffset(cardsRef.current[j]);
                    const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
                    if (scrollTop >= jTriggerStart) {
                        topCardIndex = j;
                    }
                }
                if (lastActiveIndexRef.current !== topCardIndex) {
                    lastActiveIndexRef.current = topCardIndex;
                    setActiveIndex(topCardIndex);
                }
                const isStacked = i < topCardIndex;
                if (isStacked) {
                    const depthInStack = topCardIndex - i;
                    blur = Math.max(0, depthInStack * blurAmount);

                    card.dataset.stacked = isStacked ? 'true' : 'false';
                    card.classList.toggle('stacked', isStacked);
                }
            }

            let translateY = 0;
            const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

            if (isPinned) {
                translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
            } else if (scrollTop > pinEnd) {
                translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
            }

            const newTransform = {
                translateY: Math.round(translateY * 100) / 100,
                scale: Math.round(scale * 1000) / 1000,
                rotation: Math.round(rotation * 100) / 100,
                blur: Math.round(blur * 100) / 100
            };

            const lastTransform = lastTransformsRef.current.get(i);
            const hasChanged =
                !lastTransform ||
                Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
                Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
                Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
                Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

            if (hasChanged) {
                const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
                const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

                card.style.transform = transform;
                card.style.filter = filter;

                lastTransformsRef.current.set(i, newTransform);
            }

            if (i === cardsRef.current.length - 1) {
                const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
                if (isInView && !stackCompletedRef.current) {
                    stackCompletedRef.current = true;
                    onStackComplete?.();
                } else if (!isInView && stackCompletedRef.current) {
                    stackCompletedRef.current = false;
                }
            }
        });

        isUpdatingRef.current = false;
    }, [
        itemScale,
        itemStackDistance,
        stackPosition,
        scaleEndPosition,
        baseScale,
        rotationAmount,
        blurAmount,
        useWindowScroll,
        onStackComplete,
        calculateProgress,
        parsePercentage,
        getScrollData,
        getElementOffset
    ]);

    const handleScroll = useCallback(() => {
        if (scrollRafRef.current != null) cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = requestAnimationFrame(() => {
            scrollRafRef.current = null;
            updateCardTransforms();
        });
    }, [updateCardTransforms]);

    const setupLenis = useCallback(() => {
        if (useWindowScroll) {
            const lenis = new Lenis({
                duration: 1.2,
                easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                touchMultiplier: 2,
                infinite: false,
                wheelMultiplier: 1,
                lerp: 0.1,
                syncTouch: true,
                syncTouchLerp: 0.075
            });

            lenis.on('scroll', handleScroll);

            const raf = (time: number) => {
                lenis.raf(time);
                animationFrameRef.current = requestAnimationFrame(raf);
            };
            animationFrameRef.current = requestAnimationFrame(raf);

            lenisRef.current = lenis;
            return lenis;
        } else {
            const scroller = scrollerRef.current;
            if (!scroller) return;

            const lenis = new Lenis({
                wrapper: scroller,
                content: scroller.querySelector('.scroll-stack-inner') as HTMLElement,
                duration: 1.2,
                easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                touchMultiplier: 2,
                infinite: false,
                gestureOrientation: 'vertical',
                wheelMultiplier: 1,
                lerp: 0.1,
                syncTouch: true,
                syncTouchLerp: 0.075
            });

            lenis.on('scroll', handleScroll);

            const raf = (time: number) => {
                lenis.raf(time);
                animationFrameRef.current = requestAnimationFrame(raf);
            };
            animationFrameRef.current = requestAnimationFrame(raf);

            lenisRef.current = lenis;
            return lenis;
        }
    }, [handleScroll, useWindowScroll]);

    useLayoutEffect(() => {
        const container = scrollerRef.current;
        if (!container) return;

        const cards = Array.from(container.querySelectorAll('.scroll-stack-card')) as HTMLElement[];
        cardsRef.current = cards;
        const transformsCache = lastTransformsRef.current;

        cards.forEach((card, i) => {
            if (i < cards.length - 1) {
                card.style.marginBottom = `${itemDistance}px`;
            }
            card.style.zIndex = String(i);
            card.style.willChange = 'transform, filter';
            card.style.transformOrigin = 'top center';
            card.style.backfaceVisibility = 'hidden';
            card.style.transform = 'translateZ(0)';
            card.style.webkitTransform = 'translateZ(0)';
            card.style.perspective = '1000px';
            card.style.webkitPerspective = '1000px';
        });

        initialCardTopsRef.current = [];

        setupLenis();

        updateCardTransforms();

        return () => {
            if (scrollRafRef.current != null) cancelAnimationFrame(scrollRafRef.current);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (lenisRef.current) {
                lenisRef.current.destroy();
            }
            stackCompletedRef.current = false;
            cardsRef.current = [];
            initialCardTopsRef.current = [];
            transformsCache.clear();
            isUpdatingRef.current = false;
        };
    }, [
        itemDistance,
        itemScale,
        itemStackDistance,
        stackPosition,
        scaleEndPosition,
        baseScale,
        scaleDuration,
        rotationAmount,
        blurAmount,
        useWindowScroll,
        onStackComplete,
        setupLenis,
        updateCardTransforms
    ]);

    return (
        <ScrollStackContext.Provider value={{ activeIndex }}>
            <div
                className={`relative w-full h-full overflow-y-auto overflow-x-visible ${className}`.trim()}
                ref={scrollerRef}
                style={{
                }}
            >
                <div className="scroll-stack-inner relative pl-8 md:pl-12 pr-6 md:pr-12 pb-[20rem] min-h-screen">
                    {/* Línea vertical central */}
                    <div
                        className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2"
                        style={{
                            background: 'linear-gradient(to bottom, transparent 0%, #f97316 10%, #f97316 90%, transparent 100%)'
                        }}
                    />
                    {children}
                    {/* Spacer so the last pin can release cleanly */}
                    <div className="scroll-stack-end w-full h-px" />
                </div>
            </div>
        </ScrollStackContext.Provider>
    );
};

export default ScrollStack;
