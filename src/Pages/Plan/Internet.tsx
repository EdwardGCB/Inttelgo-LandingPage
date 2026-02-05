import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import AnimatedLines from "@/components/Canvas/AnimatedLines";
import { Check, Wifi, Zap } from "lucide-react";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Lazy loading de componentes pesados
const BannerPlanes = lazy(() => import("@/components/Banners/BannerPlanes"));
const InternetPlans = lazy(() => import("@/Layouts/InternetPlans"));

// Array de características incluidas en los planes
const planFeatures = [
  "Internet ilimitado sin restricciones.",
  "Soporte 24/7.",
  "Módem con WIFI de alta velocidad incluido.",
  "Estabilidad en conexión.",
  "Garantía de soporte.",
  "Velocidad simétrica.",
];

const plansData = [
  {
    title: "Plan Gamer",
    speed: "500",
    price: "",
    category: "Gamer",
    caracteristicas: [
      "¡IP PUBLICA!",
      "Módem 5G con wifi",
      "NAT ABIERTA LAS 24/7",
    ],
    extras: [],
  },
  {
    title: "Plan 200 Mbps",
    speed: "200",
    price: "$55.000",
    category: "Básico",
    caracteristicas: [
      "Navegación fluida y redes sociales",
      "Streaming HD",
      "Videollamadas estables",
      "Descarga de archivos livianos",
      "WIFI de uso domestico",
    ],
    extras: [],
  },
  {
    title: "Plan 300 Mbps",
    speed: "300",
    price: "$70.000",
    category: "Básico",
    caracteristicas: [
      "Streaming Full HD en varios dispositivos",
      "Videollamadas en HD sin cortes",
      "Clases virtuales y teletrabajo",
      "Juegos online casuales",
      "Descargas más rápidas",
    ],
    extras: [],
  },
  {
    title: "Plan 500 Mbps",
    speed: "500",
    price: "$90.000",
    category: "Básico",
    caracteristicas: [
      "Streaming 4K en múltiples pantallas",
      "Gaming online con baja latencia",
      "Subida y descarga de archivos pesados",
      "Smart Home y cámaras IP",
      "Ideal para creadores de contenido básicos",
    ],
    extras: [],
  },
  {
    title: "Plan 750 Mbps",
    speed: "750",
    price: "$120.000",
    category: "Básico",
    caracteristicas: [
      "Gaming competitivo",
      "Streaming 4K/8K simultáneo",
      "Teletrabajo intensivo",
      "Servidores locales o acceso remoto",
      "Descargas ultra rápidas",
    ],
    extras: [],
  },
  {
    title: "Plan 920 Mbps",
    speed: "920",
    price: "$150.000",
    category: "Básico",
    caracteristicas: [
      "Rendimiento cercano a 1 Gbps real",
      "Streaming 8K sin buffering",
      "Gaming competitivo profesional",
      "Ideal para empresas pequeñas o streamers",
    ],
    extras: [],
  },
];

function PlanInternetPage() {
  return (
    <>
      <SEO
        title="Planes de Internet 100% Fibra Óptica - Inttelgo | Internet Hogar de Alta Velocidad"
        description="Planes de internet 100% fibra óptica para tu hogar. Velocidades desde 200 Mbps hasta 920 Mbps. Internet ilimitado, velocidad simétrica, soporte 24/7. Plan Gamer disponible con IP pública y NAT abierta."
        keywords="planes de internet, internet fibra óptica, internet hogar, internet 100% fibra óptica, planes internet inttelgo, internet alta velocidad, internet ilimitado, plan gamer, internet simétrico, fibra óptica bogotá, internet soacha"
        ogTitle="Planes de Internet 100% Fibra Óptica - Inttelgo"
        ogDescription="Planes de internet 100% fibra óptica para tu hogar. Velocidades desde 200 Mbps hasta 920 Mbps. Internet ilimitado y velocidad simétrica."
        ogUrl="https://inttelgo.com/planes/internet"
        canonical="https://inttelgo.com/planes/internet"
      />
      <div className="w-full flex flex-col">
        {/* Navbar + Fondo con grafo */}
        <Suspense fallback={<LoadingSpinner fullScreen size="xl" />}>
          <BannerPlanes
            image="internet/internet-fibra-optica-banner.webp"
            className="bg-gradient-to-r from-orange-400 via-orange-600 to-orange-800"
          >
            <section className="flex flex-col items-center justify-center text-center">
              <Badge
                variant="orange"
                className="inline-flex items-center gap-2 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] "
              >
                Fibra óptica 100% para tu hogar
              </Badge>

              <h2 className="max-w-3xl sm:max-w-4xl text-5xl sm:text-5xl lg:text-6xl xl:text-7xl text-orange-50 font-extrabold leading-tight tracking-wide drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
                <span className="block">
                  Los planes{" "}
                  <span className="bg-gradient-to-r from-orange-100 via-amber-200 to-orange-300 bg-clip-text text-transparent hover:from-orange-300 hover:via-orange-100 hover:to-amber-200 transition-all duration-300">
                    más veloces
                  </span>
                </span>
                <span className="block mt-1">
                  de{" "}
                  <span className="bg-gradient-to-r from-orange-100 via-white to-orange-200 bg-clip-text text-transparent">
                    internet
                  </span>{" "}
                  para tu{" "}
                  <span className="bg-gradient-to-r from-orange-100 via-amber-100 to-orange-200 bg-clip-text text-transparent">
                    hogar.
                  </span>
                </span>
              </h2>
              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 w-full max-w-4xl">
                <Card className="bg-black/20 border-orange-300/20 backdrop-blur hover:bg-black/30 transition-all duration-300 hover:scale-105">
                  <CardContent className="flex flex-col items-center text-center p-6 gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-orange-50">
                      Velocidad Simétrica
                    </h3>
                    <p className="text-sm text-orange-100/80">
                      Misma velocidad de subida y bajada para todas tus actividades
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-orange-300/20 backdrop-blur hover:bg-black/30 transition-all duration-300 hover:scale-105">
                  <CardContent className="flex flex-col items-center text-center p-6 gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg">
                      <Wifi className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-orange-50">
                      100% Fibra Óptica
                    </h3>
                    <p className="text-sm text-orange-100/80">
                      Tecnología de punta directo hasta tu hogar
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-orange-300/20 backdrop-blur hover:bg-black/30 transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
                  <CardContent className="flex flex-col items-center text-center p-6 gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-orange-50">
                      Conexión Estable
                    </h3>
                    <p className="text-sm text-orange-100/80">
                      Sin cortes ni interrupciones en tu servicio
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

          </BannerPlanes>
        </Suspense>

        {/* Sección de planes */}
        <div className="w-full flex justify-center items-center">
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <InternetPlans plansData={plansData} />
          </Suspense>
        </div>

        {/* Sección de beneficios */}
        <div className="w-full bg-white px-4 sm:px-6 md:px-10">
          <div className="sm:w-[90%] md:w-full lg:w-[80%] mx-auto">
            <Suspense fallback={<LoadingSpinner size="md" />}>
              <AnimatedLines className="mb-6" />
            </Suspense>
            <div className="space-y-6 px-4 md:px-0">
              <div className="space-y-4">
                <div className="inline-block">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold uppercase tracking-wide shadow-lg shadow-orange-500/30 mb-4">
                    Internet de alta calidad
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                  <span className="text-gray-900">
                    INTERNET RÁPIDO Y ESTABLE PARA TU HOGAR
                  </span>
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" />
                <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl">
                  Optimiza tu experiencia digital con planes de fibra óptica
                  diseñados para ofrecer el mejor desempeño y{" "}
                  <span className="font-semibold text-orange-600">
                    latencias bajas
                  </span>
                  .
                </p>
              </div>

              <div className="pt-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Nuestros planes incluyen todo lo que necesitas:
                  </h3>
                </div>

                <Card className="p-6 md:p-8">
                  <ul className="space-y-4">
                    {planFeatures.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-4 group hover:translate-x-1 transition-transform duration-300"
                      >
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/30 group-hover:shadow-lg group-hover:shadow-orange-500/50 transition-all duration-300 group-hover:scale-110">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-800 text-base md:text-lg font-medium leading-relaxed pt-0.5 group-hover:text-gray-900 transition-colors">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}

export default PlanInternetPage;
