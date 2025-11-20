import Menu from "@/Layouts/Menu";
import { Gauge } from "lucide-react";

export default function SpeedTest() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Menu
        className={"text-black hover:text-black/80 "}
        textColor="text-black hover:text-black/80"
        detailsColor=""
        lineColor="bg-black/50"
      />

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-8 md:mb-12 text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gauge className="h-8 w-8 md:h-10 md:w-10 text-orange-500" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Prueba de Velocidad
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Mide la velocidad de tu conexión a internet de forma rápida y
            precisa
          </p>
        </div>

        {/* Speed Test Container */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="w-full">
              <iframe
                className="w-full h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] xl:h-[700px]"
                src="https://inttelgo.speedtestcustom.com"
                title="Speed Test"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-8 md:mt-12">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 md:p-8 border border-orange-200">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              ¿Cómo funciona?
            </h2>
            <ul className="space-y-2 text-gray-700 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>
                  Haz clic en "Iniciar prueba" para comenzar la medición
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>La prueba medirá tu velocidad de descarga y subida</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Los resultados se mostrarán al finalizar la prueba</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
