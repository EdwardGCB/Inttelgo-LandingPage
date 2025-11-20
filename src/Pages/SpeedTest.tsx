import { useState, useEffect, useCallback } from "react";
import Menu from "@/Layouts/Menu";
import { Gauge, MapPin, Clock, Smartphone, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SpeedTest() {
  const [location, setLocation] = useState<string>("No solicitada");
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [device, setDevice] = useState<string>("");

  // Función para obtener ubicación
  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation("Geolocalización no soportada");
      return;
    }

    setIsLoadingLocation(true);
    setLocation("Solicitando permiso...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Usar una API de geocodificación inversa para obtener la ciudad
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es`
          );
          const data = await response.json();
          if (data.city && data.countryName) {
            setLocation(`${data.city}, ${data.countryName}`);
          } else if (data.locality) {
            setLocation(`${data.locality}, ${data.countryName || "Colombia"}`);
          } else {
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch (error) {
          setLocation("Error al obtener ubicación");
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        setIsLoadingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocation("Permiso denegado");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocation("Ubicación no disponible");
            break;
          case error.TIMEOUT:
            setLocation("Tiempo de espera agotado");
            break;
          default:
            setLocation("Error al obtener ubicación");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // No solicitar automáticamente - requiere interacción del usuario

  // Actualizar hora en tiempo real
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Detectar dispositivo
  useEffect(() => {
    const userAgent = navigator.userAgent;
    let deviceType = "";
    let os = "";

    // Detectar sistema operativo
    if (userAgent.includes("Windows")) {
      os = "Windows";
    } else if (userAgent.includes("Mac")) {
      os = "macOS";
    } else if (userAgent.includes("Linux")) {
      os = "Linux";
    } else if (userAgent.includes("Android")) {
      os = "Android";
    } else if (
      userAgent.includes("iOS") ||
      userAgent.includes("iPhone") ||
      userAgent.includes("iPad")
    ) {
      os = "iOS";
    } else {
      os = "Desconocido";
    }

    // Detectar tipo de dispositivo
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      if (/iPad/.test(userAgent)) {
        deviceType = "Tablet";
      } else {
        deviceType = "Móvil";
      }
    } else {
      deviceType = "Escritorio";
    }

    setDevice(`${deviceType} - ${os}`);
  }, []);
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

        {/* User Info Section */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              {/* Ubicación */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 mb-1">Ubicación</p>
                  {location === "No solicitada" ? (
                    <Button
                      onClick={getLocation}
                      disabled={isLoadingLocation}
                      variant="orange"
                      size="sm"
                      className="w-full h-8 text-xs font-semibold"
                      aria-label="Solicitar ubicación"
                    >
                      {isLoadingLocation ? (
                        <>
                          <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                          Solicitando...
                        </>
                      ) : (
                        <>
                          <MapPin className="h-3 w-3 mr-1" />
                          Permitir ubicación
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate flex-1">
                        {location}
                      </p>
                      {(location === "Permiso denegado" ||
                        location === "Error al obtener ubicación" ||
                        location === "Ubicación no disponible" ||
                        location === "Tiempo de espera agotado") && (
                        <Button
                          onClick={getLocation}
                          disabled={isLoadingLocation}
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs flex-shrink-0"
                          aria-label="Reintentar ubicación"
                        >
                          <RefreshCw
                            className={`h-3 w-3 ${
                              isLoadingLocation ? "animate-spin" : ""
                            }`}
                          />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Hora */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Hora actual</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {currentTime}
                  </p>
                </div>
              </div>

              {/* Dispositivo */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Smartphone className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Dispositivo</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {device}
                  </p>
                </div>
              </div>
            </div>
          </div>
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
