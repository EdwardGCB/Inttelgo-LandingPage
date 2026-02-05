import { TabsContent } from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";

const DEFAULT_REQUIREMENTS = [
  "Ser cliente de o vivir con el titular del servicio.",
  "Tener título de bachiller.",
  "Presentarte en las fechas establecidas de la convocatoria.",
];

interface InscripcionTabContentProps {
  /** Año de la beca (ej: "2026") */
  year: string;
  /** URL del formulario de postulación */
  buttonLink: string;
  /** Requisitos personalizados (opcional, usa los por defecto si no se pasan) */
  requirements?: string[];
}

export function InscripcionTabContent({
  year,
  buttonLink,
  requirements = DEFAULT_REQUIREMENTS,
}: InscripcionTabContentProps) {
  return (
    <TabsContent
      value={year}
      className="text-white/90 animate-in fade-in-50 duration-500"
    >
      <div className="space-y-10 max-w-4xl mx-auto">
        <div className="text-center space-y-6">
          <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-orange-500/50 animate-pulse">
            ¡Nuevo!
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent drop-shadow-2xl">
            ¡INSCRIPCIONES ABIERTAS!
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto rounded-full" />
        </div>

        <div className="space-y-6 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <p className="text-xl md:text-2xl font-medium leading-relaxed text-white/90 text-center">
            Ya están abiertas las inscripciones para las becas de estudio{" "}
            <span className="font-bold text-orange-400">INTTELGO {year}</span>.
            Asegúrate de cumplir con los requisitos para participar.
          </p>

          <div className="space-y-4 pt-4">
            <h3 className="text-2xl font-bold text-white mb-4">Requisitos:</h3>
            <ul className="space-y-3 list-none">
              {requirements.map((req, index) => (
                <li
                  key={index}
                  className="flex items-start gap-4 text-lg text-white/90"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm mt-1">
                    <CheckCheck className="w-4 h-4" />
                  </span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <a
            href={buttonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Button
              variant="orange"
              className="flex items-center gap-4 py-7 px-12 text-xl md:text-2xl font-bold text-white shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600"
            >
              <span>¡Postularme!</span>
            </Button>
          </a>
        </div>
      </div>
    </TabsContent>
  );
}
