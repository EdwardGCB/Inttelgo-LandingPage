import { lazy, Suspense, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import SEO from "@/components/SEO";
import { MousePointerClick, Play } from "lucide-react";

// Lazy loading de componentes pesados
const AnimatedLines = lazy(() => import("@/components/Canvas/AnimatedLines"));
const CarouselChannels = lazy(() => import("@/components/carousels/Chanels"));
// BannerHome no es lazy porque es el elemento LCP y debe cargarse inmediatamente
import BannerHome from "@/components/carousels/PrincipalInfo";

// Componente para lazy loading del iframe de YouTube
function LazyYouTubeEmbed({ videoId }: { videoId: string }) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Si el usuario ya hizo clic, cargar inmediatamente
    if (isClicked) {
      setShouldLoad(true);
      return;
    }

    // Usar IntersectionObserver para cargar cuando sea visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Cargar cuando esté cerca de ser visible (200px antes)
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "200px", // Cargar 200px antes de que sea visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isClicked]);

  // Placeholder con thumbnail de YouTube
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  if (!shouldLoad) {
    return (
      <div
        ref={containerRef}
        className="w-[90%] h-[90%] rounded-lg shadow-lg overflow-hidden relative cursor-pointer group/placeholder"
        onClick={() => setIsClicked(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsClicked(true);
          }
        }}
        aria-label="Cargar video de YouTube"
      >
        {/* Thumbnail de YouTube */}
        <img
          src={thumbnailUrl}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
          width={1280}
          height={720}
          style={{ aspectRatio: "16 / 9" }}
          loading="lazy"
          decoding="async"
        />
        {/* Overlay con botón de play */}
        <div className="absolute inset-0 bg-black/40 group-hover/placeholder:bg-black/50 transition-colors flex items-center justify-center">
          <div className="bg-white/90 rounded-full p-4 group-hover/placeholder:scale-110 transition-transform">
            <Play className="w-12 h-12 text-orange-500 fill-orange-500" />
          </div>
        </div>
        {/* Texto indicador */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm font-medium bg-black/60 px-4 py-2 rounded-full">
          Haz clic para cargar el video
        </div>
      </div>
    );
  }

  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
      className="w-[90%] h-[90%] rounded-lg shadow-lg group-hover/iframe:shadow-orange-500/50 transition-all duration-500 group-hover/iframe:scale-105"
    />
  );
}

interface CardInfo {
  title: string;
  description: string;
  path: string;
  imagePath: string;
}

const cardsInfo: CardInfo[] = [
  {
    title: "Internet",
    description:
      "Conexión 100% fibra óptica con alta velocidad y estabilidad para navegar, trabajar, jugar y disfrutar streaming sin interrupciones.",
    path: "/planes/internet",
    imagePath: "/cards/wifi.svg",
  },
  {
    title: "Internet + TV",
    description:
      "Fibra óptica de alto rendimiento combinada con televisión digital para que disfrutes internet rápido y tus canales favoritos en un solo plan.",
    path: "/planes/television",
    imagePath: "/cards/tv.svg",
  },
  {
    title: "Internet + TV + Tel",
    description:
      "La solución completa para tu hogar o negocio: internet por fibra óptica, televisión digital y telefonía con comunicación clara y confiable.",
    path: "/planes/telefonia",
    imagePath: "/cards/phone.svg",
  },
];

function HomePage() {
  return (
    <>
      <SEO
        title="Inttelgo Internet - Internet Hogar 100% Fibra Óptica | Pagos en Línea"
        description="Inttelgo Internet: Internet hogar 100% fibra óptica de alta velocidad. Planes de internet, televisión y telefonía. Paga tu factura de internet en línea con PSE. Inttelgo pagos en línea, pagos por PSE Inttelgo."
        keywords="Inttelgo Internet, internet hogar, fibra óptica, internet 100% fibra óptica, pagos en línea, pagar tu factura de internet en línea, inttelgo pagos en línea, pagos por pse inttelgo, internet fibra, planes de internet, internet de alta velocidad, internet residencial, inttelgo, proveedor de internet, internet colombia"
        ogTitle="Inttelgo Internet - Internet Hogar 100% Fibra Óptica"
        ogDescription="Internet hogar 100% fibra óptica de alta velocidad. Planes de internet, televisión y telefonía. Paga tu factura de internet en línea con PSE."
        ogUrl="https://inttelgo.com/"
        canonical="https://inttelgo.com/"
      />
      <div className="w-full overflow-x-hidden space-y-14 md:space-y-10 mb-10 md:mb-20">
        <div className="bg-black flex flex-col items-center justify-center">
          {/* BannerHome se carga directamente (no lazy) porque es el elemento LCP */}
          <BannerHome />
          <h2 className="text-5xl text-primary-foreground text-center px-4">
            La mejor parrilla de{" "}
            <span className="font-extrabold">canales de Bogotá y Soacha</span>
          </h2>
          <div className="w-full max-w-full overflow-hidden">
            <Suspense fallback={<LoadingSpinner size="lg" />}>
              <CarouselChannels />
            </Suspense>
          </div>
        </div>
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 space-y-14 md:space-y-10 flex flex-col items-center justify-center">
          <Suspense fallback={<div className="w-full h-16" />}>
            <AnimatedLines className="justify-start w-full" />
          </Suspense>

          {/* Header - Servicio de calidad */}
          <div className="text-center w-full max-w-3xl mx-auto space-y-4">
            <span className="inline-block text-orange-500 text-sm font-semibold tracking-widest uppercase">
              Nuestros servicios
            </span>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-foreground tracking-tight">
              ¡Entregamos un servicio de calidad!
            </h3>
            <p className="text-muted-foregrounda text-base sm:text-lg leading-relaxed">
              Disfruta de nuestro servicio de internet 100% de fibra óptica,
              telefonía y televisión; con lo último en tecnología que te conecta
              con el mundo.
            </p>
          </div>
          {/* Cards de servicios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full max-w-6xl">
            {cardsInfo.map((card, index) => (
              <div
                key={card.title}
                className="flex flex-col items-center group cursor-pointer"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <Card className="w-full h-full bg-gradient-to-b from-black via-zinc-950 to-black hover:border-orange-500/40 rounded-2xl overflow-hidden transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-orange-500/60 hover:scale-[1.02] hover:-translate-y-1">
                  <CardHeader className="text-center flex flex-col items-center justify-center pb-2">
                    <div className="w-20 h-20 mb-4 rounded-2xl bg-orange-500/20 flex items-center justify-center transition-all duration-500 ease-out group-hover:bg-orange-500 group-hover:scale-110">
                      <img
                        src={card.imagePath}
                        alt={card.title}
                        className="w-12 h-12 object-contain brightness-0 invert opacity-90 group-hover:opacity-100"
                        loading="lazy"
                        decoding="async"
                        width={48}
                        height={48}
                      />
                    </div>
                    <CardTitle className="text-xl font-bold text-orange-500 transition-colors duration-300 group-hover:text-orange-200">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-primary-foreground text-center leading-relaxed line-clamp-4">
                      {card.description}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-center pt-4">
                    <Button
                      variant="orange"
                      className="min-h-[44px] min-w-[130px] font-semibold"
                    >
                      <Link
                        to={card.path}
                        className="flex items-center justify-center w-full h-full gap-2"
                      >
                        Saber más
                        <span>→</span>
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>

          {/* Card CRC - Derechos del usuario */}
          <div className="w-full flex justify-center">
            <Card
              className="p-0 w-full max-w-xl rounded-2xl overflow-hidden hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/60 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 cursor-pointer group/crc"
              onClick={() =>
                window.open(
                  "https://www.crcom.gov.co/es/pagina/regimen-proteccion-usuario",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              <CardContent className="p-0 relative">
                <img
                  src="/banners/conoce-tus-derechos-y-deberes-como-usuario.jpg"
                  alt="Conoce tus derechos y deberes como usuario de servicios de telecomunicaciones - CRC"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/crc:scale-105"
                  loading="lazy"
                  decoding="async"
                  width={313}
                  height={107}
                  sizes="(max-width: 768px) 95vw, 50vw"
                  style={{
                    aspectRatio: "313 / 107",
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/crc:opacity-100 transition-opacity duration-500" />
              </CardContent>
            </Card>
          </div>

          {/* Card PSE */}
          <Card
            className="group w-full h-full bg-gradient-to-b from-black via-zinc-950 to-black hover:border-orange-500/40 rounded-2xl overflow-hidden transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-orange-500/60 hover:scale-[1.02] hover:-translate-y-1"
            style={{
              animation: `fadeInUp 0.8s ease-out 0.3s both`,
            }}
          >

            <CardHeader className="relative z-10 text-center md:text-left pb-4">
              <CardTitle className="text-xl sm:text-2xl font-bold text-orange-500 group-hover:text-orange-200 transition-colors duration-300">
                ¿Sabías que contamos con PSE para pagar tu factura?
              </CardTitle>
              <CardDescription className="text-primary-foreground text-sm sm:text-base">
                Conoce cómo puedes realizar el pago de tu factura.
              </CardDescription>
            </CardHeader>

            <CardContent className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center p-6 lg:p-8 relative z-10">
              <div
                className="w-full aspect-video overflow-hidden flex justify-center items-center rounded-xl bg-zinc-800/30"
                style={{
                  animation: `scale-in 0.6s ease-out 0.5s both`,
                }}
              >
                <LazyYouTubeEmbed videoId="QLpGbtd_xtE" />
              </div>

              <a
                href="https://combopay.co/invoices/inttel-go-sas"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center relative w-full min-h-[280px] rounded-xl transition-colors duration-500"
              >
                <div
                  className="relative w-full flex justify-center items-center py-8"
                  style={{
                    animation: `fadeInUp 0.8s ease-out 0.7s both`,
                  }}
                >
                  <div className="absolute inset-0 bg-orange-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute top-4 right-4 md:top-1/2 md:right-1/2 md:translate-x-16 md:-translate-y-1/2 z-20 pointer-events-none animate-cursor-click">
                    <div className="relative">
                      <MousePointerClick
                        className="w-16 h-16 md:w-20 md:h-20 text-orange-500 drop-shadow-[0_0_10px_rgba(255,153,0,0.8)]"
                        fill="rgba(255, 153, 0, 0.3)"
                        stroke="currentColor"
                        strokeWidth={2}
                      />
                      <div
                        className="absolute inset-0 rounded-full bg-orange-500/30 animate-ping"
                        style={{
                          animationDelay: "2s",
                          animationDuration: "1s",
                        }}
                      />
                    </div>
                  </div>

                  <img
                    src="/pse.svg"
                    alt="Pagar con PSE - Inttelgo"
                    className="w-[60%] max-w-[280px] min-w-[180px] object-contain relative z-10 animate-float group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_rgba(255,153,0,0.5)] transition-all duration-300"
                    loading="lazy"
                    decoding="async"
                    width={300}
                    height={300}
                  />
                </div>
              </a>
            </CardContent>
          </Card>

          {/*<div>
            <h3 className="text-4xl font-bold text-secondary-foreground">
              ¡INTERNET ILIMITADO!
            </h3>
            <p className="text-secondary-foreground">
              Disfruta de internet 100% fibra optica, la tecnologia mas avanzada
              para mantenerte siempre conectado.
              <br />
              Trabaja, navega, juega y mira streaming con minima latencia y la
              mejor calidad. Ademas, accede a la mejor
              <br />
              seccion de canales para disfrutar en casa
            </p>
          </div>
          <div className="flex justify-center items-center">
            <CollaboratorsMarquee />
          </div>*/}

        </div >
      </div>
    </>
  );
}

export default HomePage;
