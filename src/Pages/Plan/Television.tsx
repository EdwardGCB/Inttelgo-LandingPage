import VideoBanner from "@/components/Banners/VideoBanner";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import InternetPlans from "@/Layouts/InternetPlans";
import { Check } from "lucide-react";
import { Suspense } from "react";

const planFeatures = [
  "Más de 150 canales en alta definición.",
  "Señal digital estable y sin cortes.",
  "Canales nacionales e internacionales.",
  "Soporte técnico 24/7.",
  "Compatible con TV + Internet en un solo plan.",
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
        <VideoBanner />
      </Suspense>

      {/* Sección de planes */}
      <div id="planes" className="mt-20 w-full flex justify-center items-center">
        <Suspense fallback={<LoadingSpinner size="lg" />}>
          <InternetPlans plansData={plansData} />
        </Suspense>
      </div>

      {/* Sección de beneficios */}
      <div className="sm:w-[90%] md:w-full lg:w-[80%] mx-auto mb-10">
        <div className="space-y-6 px-4 md:px-0">
          <div className="space-y-4">
            <div className="inline-block">
              <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold uppercase tracking-wide shadow-lg shadow-orange-500/30 mb-4">
                Televisión de alta calidad
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              <span className="text-gray-900">
                TELEVISIÓN HD Y CANALES PARA TODA LA FAMILIA
              </span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" />
            <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl">
              Disfruta de la mejor programación con señal digital en alta
              definición, canales nacionales e internacionales y{" "}
              <span className="font-semibold text-orange-600">
                paquetes que combinan TV + Internet
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
                Tu plan de TV incluye:
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
  );
}
