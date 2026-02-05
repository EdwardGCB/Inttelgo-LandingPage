import { useState, useEffect, useRef, memo } from 'react';
import Menu from "@/Layouts/Menu";

// Componente de video memoizado para evitar re-renders innecesarios
const VideoSection = memo(({
    video,
    isFocused,
    onClick,
    shouldLoad
}: {
    video: any;
    isFocused: boolean;
    onClick: () => void;
    shouldLoad: boolean;
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Controlar reproducción del video
    useEffect(() => {
        if (!videoRef.current) return;

        if (isFocused && isLoaded) {
            videoRef.current.play().catch(err => console.log('Play error:', err));
        } else {
            videoRef.current.pause();
        }
    }, [isFocused, isLoaded]);

    // Precargar video cuando esté cerca de ser mostrado
    useEffect(() => {
        if (shouldLoad && videoRef.current && !isLoaded) {
            videoRef.current.load();
        }
    }, [shouldLoad, isLoaded]);

    return (
        <div
            className={`relative overflow-hidden transition-all duration-1000 ease-in-out ${isFocused ? 'flex-[3]' : 'flex-2'
                }`}
            onClick={onClick}
            style={{ cursor: 'pointer' }}
        >
            {/* Video de fondo */}
            {shouldLoad && (
                <video
                    ref={videoRef}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${isFocused ? 'grayscale-0' : 'grayscale'
                        }`}
                    src={video.src}
                    loop
                    muted
                    playsInline
                    preload={isFocused ? "auto" : "metadata"} // Solo precargar metadata si no está enfocado
                    onLoadedData={() => setIsLoaded(true)}
                />
            )}

            {/* Placeholder mientras carga */}
            {!isLoaded && shouldLoad && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Placeholder si no debe cargar aún */}
            {!shouldLoad && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
            )}

            {/* Overlay difuminado de negro a transparente */}
            <div
                className={`absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-1000 ${isFocused ? 'opacity-70' : 'opacity-90'
                    }`}
            />

            {/* Contenido del banner - Desktop */}
            <div className="hidden md:block relative h-full">
                <div className="h-full flex flex-col justify-end p-8 lg:p-12">
                    <div
                        className={`transform transition-all duration-1000 ${isFocused
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-4 opacity-60'
                            }`}
                    >
                        <h2
                            className={`font-black text-white mb-4 transition-all duration-1000 ${isFocused
                                ? 'text-4xl lg:text-5xl'
                                : 'text-2xl lg:text-3xl'
                                }`}
                            style={{
                                textShadow: '0 4px 30px rgba(0,0,0,0.8)',
                                lineHeight: '1.1'
                            }}
                        >
                            {video.title}
                        </h2>

                        <p
                            className={`text-white/90 font-medium mb-6 transition-all duration-1000 ${isFocused
                                ? 'text-xl opacity-100 max-h-20'
                                : 'text-base opacity-0 max-h-0'
                                }`}
                            style={{
                                textShadow: '0 2px 20px rgba(0,0,0,0.8)'
                            }}
                        >
                            {video.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Contenido del banner - Mobile */}
            <div className="block md:hidden relative h-full">
                <div className="h-full flex flex-col justify-end p-6">
                    <div
                        className={`transform transition-all duration-1000 ${isFocused
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-4 opacity-60'
                            }`}
                    >
                        <h2
                            className={`font-black text-white mb-2 transition-all duration-1000 ${isFocused
                                ? 'text-2xl'
                                : 'text-xl'
                                }`}
                            style={{
                                textShadow: '0 4px 30px rgba(0,0,0,0.8)',
                                lineHeight: '1.1'
                            }}
                        >
                            {video.title}
                        </h2>

                        <p
                            className={`text-white/90 font-medium transition-all duration-1000 ${isFocused
                                ? 'text-sm opacity-100 max-h-20'
                                : 'text-xs opacity-0 max-h-0'
                                }`}
                            style={{
                                textShadow: '0 2px 20px rgba(0,0,0,0.8)'
                            }}
                        >
                            {video.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
});

VideoSection.displayName = 'VideoSection';

export default function VideoBanner() {
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [loadedVideos, setLoadedVideos] = useState<Set<number>>(new Set([0])); // Cargar el primero inmediatamente

    const videos = [
        {
            id: 1,
            src: "/media/The Beauty Of Avatar - The Way Of Water.mp4",
            title: "TELEVISIÓN HD",
            description: "Más de 150 canales en alta definición"
        },
        {
            id: 2,
            src: "/media/THE BEAUTY OF THE LORD OF THE RINGS THE HOBBIT.webm",
            title: "INTERNET RÁPIDO",
            description: "Hasta 920 Mbps de velocidad"
        },
        {
            id: 3,
            src: "/media/The Amazing World of Gumball.webm",
            title: "PAQUETES COMBINADOS",
            description: "Internet + TV al mejor precio"
        }

    ];

    // Cambiar el foco cada 15 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setFocusedIndex((prev) => (prev + 1) % videos.length);
        }, 15000);

        return () => clearInterval(interval);
    }, [videos.length]);

    // Precargar el siguiente video antes de que se muestre
    useEffect(() => {
        // Cargar el video actual
        setLoadedVideos(prev => new Set([...prev, focusedIndex]));

        // Precargar el siguiente video con un delay
        const nextIndex = (focusedIndex + 1) % videos.length;
        const timer = setTimeout(() => {
            setLoadedVideos(prev => new Set([...prev, nextIndex]));
        }, 2000); // Esperar 2 segundos antes de precargar el siguiente

        return () => clearTimeout(timer);
    }, [focusedIndex, videos.length]);

    // Cargar videos gradualmente al montar el componente
    useEffect(() => {
        const loadTimer = setTimeout(() => {
            // Cargar todos los videos después de 5 segundos
            setLoadedVideos(new Set([0, 1, 2]));
        }, 5000);

        return () => clearTimeout(loadTimer);
    }, []);

    return (
        <>
            {/* Vista móvil (< md) - Banner con videos verticales */}
            <section className="flex md:hidden flex-col w-full h-[800px] relative overflow-hidden bg-black">
                {/* Menu superpuesto */}
                <div className="absolute top-0 left-0 right-0 z-50">
                    <Menu
                        className="text-white hover:text-white/80 bg-transparent"
                        logo="logo-monocromatico.svg"
                    />
                </div>

                {videos.map((video, index) => (
                    <VideoSection
                        key={video.id}
                        video={video}
                        isFocused={focusedIndex === index}
                        onClick={() => setFocusedIndex(index)}
                        shouldLoad={loadedVideos.has(index)}
                    />
                ))}

                {/* Indicadores de progreso */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-40">
                    {videos.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setFocusedIndex(index)}
                            className={`h-1 rounded-full transition-all duration-300 ${focusedIndex === index
                                ? 'w-8 bg-orange-500'
                                : 'w-4 bg-white/50'
                                }`}
                            aria-label={`Ir a sección ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* Vista desktop (>= md) - Banner con videos horizontales */}
            <section className="hidden md:flex w-full h-[600px] relative overflow-hidden bg-black">
                {/* Menu superpuesto */}
                <div className="absolute top-0 left-0 right-0 z-50">
                    <Menu
                        className="text-white hover:text-white/80 bg-transparent"
                        logo="logo-monocromatico.svg"
                    />
                </div>

                {videos.map((video, index) => (
                    <VideoSection
                        key={video.id}
                        video={video}
                        isFocused={focusedIndex === index}
                        onClick={() => setFocusedIndex(index)}
                        shouldLoad={loadedVideos.has(index)}
                    />
                ))}

                {/* Indicadores de progreso */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-40">
                    {videos.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setFocusedIndex(index)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${focusedIndex === index
                                ? 'w-12 bg-orange-500'
                                : 'w-6 bg-white/50'
                                }`}
                            aria-label={`Ir a sección ${index + 1}`}
                        />
                    ))}
                </div>
            </section>
        </>
    );
}