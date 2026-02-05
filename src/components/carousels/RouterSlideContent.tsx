import Translucent from "@/components/Cards/Translucent";

const ROUTER_SLIDE_INFO_DATA = [
  {
    id: 1,
    title: "24/7",
    description: "Soporte técnico",
    image: "/cards/24-7.svg",
  },
  {
    id: 2,
    title: "Megas simétricas",
    description: "Velocidad equilibrada",
    image: "/cards/up-down.svg",
  },
  {
    id: 3,
    title: "Alta velocidad",
    description: "1 Ms de respuesta",
    image: "/cards/speed-test.svg",
  },
];

interface RouterSlideContentProps {
  /** Contenido del media: imagen del modem (móvil) o modelo 3D (desktop) */
  children: React.ReactNode;
}

/**
 * Layout compartido del slide del router/modem.
 * Incluye título, slot para media (imagen o 3D) y cards informativas.
 * Lo único que cambia entre móvil y desktop es el children (imagen vs 3D).
 */
export function RouterSlideContent({ children }: RouterSlideContentProps) {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Área del media: imagen o modelo 3D */}
      <div className="relative w-full flex flex-col items-center">
        {/* Título */}
        <div className="absolute flex flex-col items-center justify-center z-0 pointer-events-none px-4 -top-0">
          <h1 className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl text-white font-bold leading-tight tracking-wide text-center mb-2">
            Disfruta del internet más veloz
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-extrabold leading-tight tracking-wide text-center">
            con nuestro módem WiFi 6
          </h1>
        </div>
        {children}
      </div>

      {/* Cards informativos */}
      <div className="w-full max-w-6xl px-4 mt-4 mb-8">
        <div className="grid grid-cols-3 gap-4 lg:gap-6">
          {ROUTER_SLIDE_INFO_DATA.map((item) => (
            <Translucent key={item.id} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
