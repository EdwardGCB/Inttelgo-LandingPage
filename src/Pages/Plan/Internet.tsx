import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import AnimatedLines from "@/components/Canvas/AnimatedLines";
import { Check } from "lucide-react";
import SEO from "@/components/SEO";

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
    title: null,
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
    title: null,
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
    title: null,
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
    title: null,
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
    title: null,
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
            <section className="relative text-center">
              <h2 className="text-6xl sm:text-7xl xl:text-7xl 2xl:text-7xl text-orange-50 font-bold leading-tight tracking-wide drop-shadow-lg">
                <div>
                  Los planes{" "}
                  <span className="text-orange-100 hover:text-orange-600 transition-colors duration-300 font-extrabold">
                    más veloces
                  </span>
                </div>
                <div>
                  de{" "}
                  <span className="text-orange-100 hover:text-orange-600 transition-colors duration-300 font-extrabold">
                    internet
                  </span>{" "}
                  para tu{" "}
                  <span className="text-orange-100 hover:text-orange-600 transition-colors duration-300 font-extrabold">
                    hogar.
                  </span>
                </div>
              </h2>
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
        <div className="w-full bg-white py-12 px-4 sm:px-6 md:px-10">
          <div className="sm:w-[90%] md:w-full lg:w-[80%] mx-auto">
            <Suspense fallback={<LoadingSpinner size="md" />}>
              <AnimatedLines />
            </Suspense>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-center my-10">
              <div className="flex justify-center items-center">
                <img
                  src="/banners/plan/internet/internet-alta-velocidad-hogar.webp"
                  alt="Internet de alta velocidad para hogar con fibra óptica Inttelgo"
                  className="size-full rounded-2xl"
                />
              </div>
              <div className="col-span-1 md:col-span-2 space-y-4 px-4 md:px-0">
                <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground">
                  INTERNET RÁPIDO Y ESTABLE PARA TU HOGAR
                </h2>
                <p className="text-base md:text-lg text-secondary-foreground/80">
                  Optimiza tu experiencia digital con planes de fibra óptica
                  diseñados para ofrecer el mejor desempeño y latencias bajas.
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-secondary-foreground pt-4">
                  Nuestros planes incluyen todo lo que necesitas:
                </h2>
                <ul className="space-y-3">
                  {planFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="text-secondary-foreground text-base">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlanInternetPage;
