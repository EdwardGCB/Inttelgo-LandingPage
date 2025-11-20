import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import AnimatedLines from "@/components/Canvas/AnimatedLines";
import { Check } from "lucide-react";

// Lazy loading de componentes pesados
const BannerPlanes = lazy(() => import("@/components/Banners/BannerPlanes"));
const InternetPlans = lazy(() => import("@/Layouts/InternetPlans"));

// Array de características incluidas en los planes
const planFeatures = [
  "Internet ilimitado sin restricciones",
  "Soporte 24/7",
  "Modem con WIFI de alta velocidad incluido",
  "Estabilidad en conexión",
  "Garantía de soporte",
  "Velocidad simétrica",
];

const plansData = [
  {
    title: "Plan Gamer",
    speed: "500",
    price: "",
    category: "Gamer",
    caracteristicas: [
      "¡IP PUBLICA!",
      "Modem 5G con wifi",
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
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
    extras: [],
  },
  {
    title: null,
    speed: "300",
    price: "$70.000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
    extras: [],
  },
  {
    title: null,
    speed: "500",
    price: "$90.000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
    extras: [],
  },
  {
    title: null,
    speed: "750",
    price: "$120.000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
    extras: [],
  },
  {
    title: null,
    speed: "920",
    price: "$150.000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
    extras: [],
  },
];

function PlanInternetPage() {
  return (
    <div className="w-full flex flex-col">
      {/* Navbar + Fondo con grafo */}
      <Suspense fallback={<LoadingSpinner fullScreen size="xl" />}>
        <BannerPlanes
          image="internet/1.webp"
          className="bg-gradient-to-r from-orange-400 via-orange-600 to-orange-800"
        >
          <section className="relative text-center">
            <h2 className="text-6xl sm:text-7xl xl:text-7xl 2xl:text-7xl text-orange-50 font-bold leading-tight tracking-wide drop-shadow-lg">
              <div>
                Los planes{" "}
                <span className="text-orange-100 font-extrabold">
                  mas veloces
                </span>
              </div>
              <div>
                de{" "}
                <span className="text-orange-100 font-extrabold">internet</span>{" "}
                para tu{" "}
                <span className="text-orange-100 font-extrabold">hogar</span>
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
      <div className="w-full bg-white py-12 px-4 sm:px-6 md:px-10 lg:px-20">
        <Suspense fallback={<LoadingSpinner size="md" />}>
          <AnimatedLines />
        </Suspense>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-center my-10">
          <div className="flex justify-center items-center">
            <img
              src="/banners/plan/internet/2.webp"
              alt="Internet Rápido"
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
              Nuestros Planes Incluyen Todo lo que Necesitas:
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
  );
}

export default PlanInternetPage;
