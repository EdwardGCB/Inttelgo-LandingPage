import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import BannerPlanes from "@/components/Banners/BannerPlanes";
import InternetPlans from "@/Layouts/InternetPlans";
import { Check } from "lucide-react";

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
    extras: ["+TV", "+TEL"],
  },
  {
    title: null,
    speed: "200",
    price: "$100.000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
    extras: ["+TV", "+TEL"],
  },
  {
    title: null,
    speed: "300",
    price: "$115.000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
    extras: ["+TV", "+TEL"],
  },
  {
    title: null,
    speed: "500",
    price: "$135.000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
    extras: ["+TV", "+TEL"],
  },
  {
    title: null,
    speed: "750",
    price: "$165.000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
    extras: ["+TV", "+TEL"],
  },
  {
    title: null,
    speed: "920",
    price: "$195.000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
    extras: ["+TV", "+TEL"],
  },
];

export default function Telefonia() {
  return (
    <div className="w-full flex flex-col">
      {/* Navbar + Fondo con grafo */}
      <Suspense fallback={<LoadingSpinner fullScreen size="xl" />}>
        <BannerPlanes
          image="telefonia/tripleplay.webp"
          className="bg-gradient-to-b from-orange-400 via-orange-600 to-[#903B67]"
        />
      </Suspense>

      {/* Sección de planes */}
      <div className="w-full flex justify-center items-center">
        <Suspense fallback={<LoadingSpinner size="lg" />}>
          <InternetPlans plansData={plansData} />
        </Suspense>
      </div>

      {/* Sección de beneficios */}
      <div className="w-full bg-white py-12 px-4 sm:px-6 md:px-10 lg:px-20 bg-cover bg-center bg-no-repeat">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center text-secondary-foreground">
          <div className="flex justify-center items-center">
            <img
              src="/banners/plan/telefonia/tv+tel+wifi.webp"
              alt="Internet Rápido"
              className="size-full rounded-2xl"
            />
          </div>
          <div className="col-span-1 space-y-4 px-4 md:px-0">
            <h2 className="text-3xl md:text-4xl font-bold">
              INTERNET RÁPIDO Y ESTABLE PARA TU HOGAR
            </h2>
            <p className="text-base md:text-lg">
              Optimiza tu experiencia digital con planes de fibra óptica
              diseñados para ofrecer el mejor desempeño y latencias bajas.
            </p>
            <h2 className="text-2xl md:text-3xl font-bold pt-4">
              Nuestros Planes Incluyen Todo lo que Necesitas:
            </h2>
            <ul className="space-y-3">
              {planFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span className="text-base">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
