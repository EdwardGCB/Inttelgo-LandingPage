import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import BannerPlanes from "@/components/Banners/BannerPlanes";
import InternetPlans from "@/Layouts/InternetPlans";
import { Check, Phone, Tv, Wifi } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedLines from "@/components/Canvas/AnimatedLines";

const planFeatures = [
  "Internet de fibra óptica, televisión HD y telefonía fija en un solo paquete.",
  "Llamadas ilimitadas a destinos nacionales.",
  "Calidad de voz HD y conexión estable para tus llamadas.",
  "Soporte técnico 24/7 para todos tus servicios.",
  "Más ahorro que contratando cada servicio por separado.",
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
    extras: ["+TV", "+TEL"],
  },
  {
    title: null,
    speed: "200",
    price: "$100.000",
    category: "Básico",
    caracteristicas: [
      "Navegación fluida y redes sociales",
      "Streaming HD",
      "Videollamadas estables",
      "Descarga de archivos livianos",
      "WIFI de uso domestico",
    ],
    extras: ["+TV", "+TEL"],
  },
  {
    title: null,
    speed: "300",
    price: "$115.000",
    category: "Básico",
    caracteristicas: [
      "Streaming Full HD en varios dispositivos",
      "Videollamadas en HD sin cortes",
      "Clases virtuales y teletrabajo",
      "Juegos online casuales",
      "Descargas más rápidas",
    ],
    extras: ["+TV", "+TEL"],
  },
  {
    title: null,
    speed: "500",
    price: "$135.000",
    category: "Básico",
    caracteristicas: [
      "Streaming 4K en múltiples pantallas",
      "Gaming online con baja latencia",
      "Subida y descarga de archivos pesados",
      "Smart Home y cámaras IP",
      "Ideal para creadores de contenido básicos",
    ],
    extras: ["+TV", "+TEL"],
  },
  {
    title: null,
    speed: "750",
    price: "$165.000",
    category: "Básico",
    caracteristicas: [
      "Gaming competitivo",
      "Streaming 4K/8K simultáneo",
      "Teletrabajo intensivo",
      "Servidores locales o acceso remoto",
      "Descargas ultra rápidas",
    ],
    extras: ["+TV", "+TEL"],
  },
  {
    title: null,
    speed: "920",
    price: "$195.000",
    category: "Básico",
    caracteristicas: [
      "Rendimiento cercano a 1 Gbps real",
      "Streaming 8K sin buffering",
      "Gaming competitivo profesional",
      "Ideal para empresas pequeñas o streamers",
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
          image="telefonia/triple-play-banner.webp"
          className="bg-gradient-to-b from-orange-400 via-orange-600 to-[#903B67]"
          imageFullWidthFromMd
        >
          {/* Contenido solo para móvil; en pantallas más grandes se muestra solo el banner de imagen */}
          <section className="flex flex-col items-center justify-center text-center sm:hidden">
            <h2 className="max-w-3xl sm:max-w-4xl text-5xl sm:text-5xl lg:text-6xl xl:text-7xl text-orange-50 font-extrabold leading-tight tracking-wide drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
              <span className="block">
                Todo lo que{" "}
                <span className="bg-gradient-to-r from-orange-100 via-amber-200 to-orange-300 bg-clip-text text-transparent hover:from-orange-300 hover:via-orange-100 hover:to-amber-200 transition-all duration-300">
                  necesitas
                </span>
              </span>
              <span className="block mt-1">
                en un solo{" "}
                <span className="bg-gradient-to-r from-orange-100 via-white to-orange-200 bg-clip-text text-transparent">
                  plan
                </span>{" "}
                para tu{" "}
                <span className="bg-gradient-to-r from-orange-100 via-amber-100 to-orange-200 bg-clip-text text-transparent">
                  hogar.
                </span>
              </span>
            </h2>

            <p className="max-w-2xl text-base sm:text-lg md:text-xl text-orange-100/90 mt-4 sm:mt-6 font-medium leading-relaxed">
              Internet ultra rápido + Televisión de alta definición + Telefonía ilimitada
            </p>

            {/* Feature Cards - Triple Play */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 w-full max-w-4xl">
              <Card className="bg-black/20 border-orange-300/20 backdrop-blur hover:bg-black/30 transition-all duration-300 hover:scale-105">
                <CardContent className="flex flex-col items-center text-center p-6 gap-3">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg">
                    <Wifi className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-orange-50">
                    Internet Fibra Óptica
                  </h3>
                  <p className="text-sm text-orange-100/80">
                    Velocidad simétrica de hasta 1 Gbps para toda tu familia
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-orange-300/20 backdrop-blur hover:bg-black/30 transition-all duration-300 hover:scale-105">
                <CardContent className="flex flex-col items-center text-center p-6 gap-3">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg">
                    <Tv className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-orange-50">
                    Televisión HD
                  </h3>
                  <p className="text-sm text-orange-100/80">
                    Más de 100 canales en alta definición con señal digital
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-orange-300/20 backdrop-blur hover:bg-black/30 transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
                <CardContent className="flex flex-col items-center text-center p-6 gap-3">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg">
                    <Phone className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-orange-50">
                    Telefonía Ilimitada
                  </h3>
                  <p className="text-sm text-orange-100/80">
                    Llamadas sin límite a nivel nacional e internacional
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
      <div className="sm:w-[90%] md:w-full lg:w-[80%] mx-auto mb-10">
        <Suspense fallback={<LoadingSpinner size="md" />}>
          <AnimatedLines />
        </Suspense>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div className="flex justify-center items-center">
            <img
              src="/banners/plan/telefonia/triple-play-internet-tv-telefonia.webp"
              alt="Triple play Inttelgo: Internet, TV y Telefonía para tu hogar"
              className=" rounded-2xl"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="space-y-6 px-4 md:px-0">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold uppercase tracking-wide shadow-lg shadow-orange-500/30 mb-4">
                  Triple play para tu hogar
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                <span className="text-gray-900">
                  INTERNET + TELEVISIÓN + TELEFONÍA EN UN SOLO PLAN
                </span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" />
              <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl">
                Conecta tu hogar con un plan triple play que combina{" "}
                <span className="font-semibold text-orange-600">
                  internet de alta velocidad, televisión HD y telefonía ilimitada
                </span>{" "}
                para que tu familia navegue, vea y hable sin preocupaciones.
              </p>
            </div>

            <div className="pt-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Tu plan triple play incluye:
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
    </div>
  );
}
