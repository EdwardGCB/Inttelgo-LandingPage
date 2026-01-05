import { useState, useEffect, useMemo } from "react";

const TVChannelEffect = () => {
  const channels = useMemo(
    () => [
      {
        id: 1,
        image: "/banners/plan/television/canales-television-01.webp",
        channel: "Deportes HD",
        program: "Fútbol en Vivo",
      },
      {
        id: 2,
        image: "/banners/plan/television/canales-television-02.webp",
        channel: "Películas Plus",
        program: "Cine de Acción",
      },
      {
        id: 3,
        image: "/banners/plan/television/canales-television-03.webp",
        channel: "Noticias 24h",
        program: "Últimas Noticias",
      },
      {
        id: 4,
        image: "/banners/plan/television/canales-television-04.webp",
        channel: "Discovery Channel",
        program: "Naturaleza Salvaje",
      },
      {
        id: 5,
        image: "/banners/plan/television/canales-television-05.webp",
        channel: "Kids TV",
        program: "Animación Infantil",
      },
      {
        id: 6,
        image: "/banners/plan/television/canales-television-06.webp",
        channel: "Cultura",
        program: "Documentales",
      },
      {
        id: 7,
        image: "/banners/plan/television/canales-television-07.webp",
        channel: "Cultura",
        program: "Documentales",
      },
      {
        id: 8,
        image: "/banners/plan/television/canales-television-08.webp",
        channel: "Cultura",
        program: "Documentales",
      },
      {
        id: 9,
        image: "/banners/plan/television/canales-television-09.webp",
        channel: "Cultura",
        program: "Documentales",
      },
      {
        id: 10,
        image: "/banners/plan/television/canales-television-10.webp",
        channel: "Cultura",
        program: "Documentales",
      },
    ],
    []
  );

  const [currentChannel, setCurrentChannel] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsChanging(true);
      setTimeout(() => {
        setCurrentChannel((prev) => (prev + 1) % channels.length);
        setIsChanging(false);
      }, 300);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full md:w-full lg:w-72 xl:w-70 2xl:w-95 max-w-md mx-auto">
      {/* Marco de TV */}
      <div className="relative">
        {/* Pantalla */}
        <div className="relative aspect-video bg-black overflow-hidden shadow-inner">
          {/* Efecto de estática durante el cambio */}
          {isChanging && (
            <div className="absolute inset-0 z-20 bg-black opacity-80 animate-pulse">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
            </div>
          )}

          {/* Canal actual */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              isChanging ? "opacity-0" : "opacity-100"
            }`}
          >
            <img
              src={channels[currentChannel].image}
              alt={channels[currentChannel].program}
              className="w-full h-full object-cover"
            />

            {/* Overlay con información del canal */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 text-white px-3 py-1 rounded-md font-bold text-sm">
                  {channels[currentChannel].id}
                </div>
                <div>
                  <div className="text-white font-bold text-sm">
                    {channels[currentChannel].channel}
                  </div>
                  <div className="text-gray-300 text-xs">
                    {channels[currentChannel].program}
                  </div>
                </div>
              </div>
            </div>

            {/* Indicador de señal */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-medium">EN VIVO</span>
            </div>
          </div>
        </div>

        {/* Indicadores de canales */}
        <div className="flex justify-center gap-2 mt-4">
          {channels.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentChannel
                  ? "w-8 bg-orange-500"
                  : "w-1.5 bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Sombra del TV */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/30 rounded-full blur-xl"></div>
    </div>
  );
};

export default TVChannelEffect;
