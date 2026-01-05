import BannerPlanes from "@/components/Banners/BannerPlanes";
import TVChannelEffect from "@/components/Canvas/TVChannelEffect ";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import InternetPlans from "@/Layouts/InternetPlans";
import { Check } from "lucide-react";
import { Suspense } from "react";

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
    extras: ["+TV"],
  },
  {
    title: null,
    speed: "200",
    price: "$80.000",
    category: "Básico",
    caracteristicas: [
      "Navegación fluida y redes sociales",
      "Streaming HD",
      "Videollamadas estables",
      "Descarga de archivos livianos",
      "WIFI de uso domestico",
    ],
    extras: ["+TV"],
  },
  {
    title: null,
    speed: "300",
    price: "$95.000",
    category: "Básico",
    caracteristicas: [
      "Streaming Full HD en varios dispositivos",
      "Videollamadas en HD sin cortes",
      "Clases virtuales y teletrabajo",
      "Juegos online casuales",
      "Descargas más rápidas",
    ],
    extras: ["+TV"],
  },
  {
    title: null,
    speed: "500",
    price: "$115.000",
    category: "Básico",
    caracteristicas: [
      "Streaming 4K en múltiples pantallas",
      "Gaming online con baja latencia",
      "Subida y descarga de archivos pesados",
      "Smart Home y cámaras IP",
      "Ideal para creadores de contenido básicos",
    ],
    extras: ["+TV"],
  },
  {
    title: null,
    speed: "750",
    price: "$145.000",
    category: "Básico",
    caracteristicas: [
      "Gaming competitivo",
      "Streaming 4K/8K simultáneo",
      "Teletrabajo intensivo",
      "Servidores locales o acceso remoto",
      "Descargas ultra rápidas",
    ],
    extras: ["+TV"],
  },
  {
    title: null,
    speed: "920",
    price: "$175.000",
    category: "Básico",
    caracteristicas: [
      "Rendimiento cercano a 1 Gbps real",
      "Streaming 8K sin buffering",
      "Gaming competitivo profesional",
      "Ideal para empresas pequeñas o streamers",
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
          image="television/television-digital-banner.webp"
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
        <div className="block lg:hidden">
          {/* Imagen de fondo para móvil */}
          <div
            className="w-full h-250 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('/banners/plan/television/television-canales-hd-movil.webp')",
            }}
          >
            <div className="relative w-full justify-center">
              <div className="transform translate-y-34 md:translate-y-[50%]  transition-transform duration-300">
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
                Nuestros planes incluyen todo lo que necesitas:
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
          className="hidden lg:block w-full xl:h-150 2xl:h-200 bg-white py-12 px-4 sm:px-6 md:px-10 lg:px-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/banners/plan/television/television-canales-hd-desktop.webp')",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 text-primary-foreground">
            <div className="flex items-center justify-center md:justify-start lg:justify-center">
              <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg">
                <div className="transform lg:-translate-x-[27%] lg:-translate-y-[80%] xl:-translate-x-[5%] xl:-translate-y-[65%] 2xl:-translate-x-[1.5%] 2xl:-translate-y-[17%] transition-transform duration-300">
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
                Nuestros planes incluyen todo lo que necesitas:
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
