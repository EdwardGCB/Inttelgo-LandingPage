import BannerPlanes from "@/components/Banners/BannerPlanes";
import TVChannelEffect from "@/components/Canvas/TVChannelEffect ";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import InternetPlans from "@/Layouts/InternetPlans";
import { Check } from "lucide-react";
import { Suspense } from "react";

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
    extras: ["+TV"],
  },
  {
    title: null,
    speed: "200",
    price: "$80.000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
    extras: ["+TV"],
  },
  {
    title: null,
    speed: "300",
    price: "$95.000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
    extras: ["+TV"],
  },
  {
    title: null,
    speed: "500",
    price: "$115.000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
    extras: ["+TV"],
  },
  {
    title: null,
    speed: "750",
    price: "$145.000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
    extras: ["+TV"],
  },
  {
    title: null,
    speed: "920",
    price: "$175.000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
    extras: ["+TV"],
  },
];

export default function Television() {
  return (
    <div className="w-full flex flex-col">
      {/* Navbar + Fondo con grafo */}
      <Suspense fallback={<LoadingSpinner fullScreen size="xl" />}>
        <BannerPlanes
          image="television/television-1.webp"
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
      <div className="w-full">
        {/* Versión móvil: imagen arriba, beneficios abajo con fondo negro */}
        <div className="block md:hidden">
          {/* Imagen de fondo para móvil */}
          <div
            className="w-full h-200 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('/banners/plan/television/television-celular.webp')",
            }}
          >
            <div className="relative w-full justify-center">
              <div className="transform translate-y-27 transition-transform duration-300">
                <TVChannelEffect />
              </div>
            </div>
          </div>

          {/* Beneficios con fondo negro en móvil */}
          <div className="w-full bg-black py-12 px-4 sm:px-6 text-white">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">
                INTERNET RÁPIDO Y ESTABLE PARA TU HOGAR
              </h2>
              <p className="text-base">
                Optimiza tu experiencia digital con planes de fibra óptica
                diseñados para ofrecer el mejor desempeño y latencias bajas.
              </p>
              <h2 className="text-2xl font-bold pt-4">
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

        {/* Versión desktop: diseño original */}
        <div
          className="hidden md:block w-full bg-white py-12 px-4 sm:px-6 md:px-10 lg:px-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/banners/plan/television/television-2.webp')",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 text-primary-foreground">
            <div className="flex items-center justify-center md:justify-start lg:justify-center">
              <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg">
                <div className="transform md:translate-x-[-34%] md:translate-y-[-75%] lg:translate-x-[-14%] lg:-translate-y-[80%] xl:-translate-x-2.5 xl:-translate-y-37 transition-transform duration-300">
                  <TVChannelEffect />
                </div>
              </div>
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
    </div>
  );
}
