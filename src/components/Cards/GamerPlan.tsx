import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Stars from "@/components/Canvas/Stars";
import iconoControl from "../../../public/icono-control.svg";

interface Plan {
  title: string | null;
  speed: string;
  price: string;
  category: string;
  caracteristicas: string[];
  extras: string[];
}

interface GamerPlanProps {
  plan: Plan;
}

function GamerPlan({ plan }: GamerPlanProps) {
  return (
    <div className="relative w-full flex flex-col items-center group cursor-pointer z-10 transition-transform duration-300 hover:scale-105">
      {/* Mbps Card flotante */}
      {plan.extras.map((extra, index) => (
        <Card
          key={`extra-${index}`}
          className="absolute left-1/25 -translate-x-1/2 z-21 p-3 border-none"
          style={{
            top: `${1 + index * 4.5}rem`,
            background: "linear-gradient(90deg, #a21caf 0%, #7c3aed 100%)",
          }}
        >
          <CardContent className="text-primary-foreground flex flex-col items-center justify-center w-full h-full p-0">
            <span className="text-xl md:text-2xl lg:text-3xl font-bold">
              {extra}
            </span>
          </CardContent>
        </Card>
      ))}
      <Card className="bg-primary border-3 border-purple-700 absolute -top-10 left-1/2 -translate-x-1/2 z-20 w-3xs h-3xs flex items-center justify-center rounded-xl">
        <Stars starCount={40} />

        <CardContent className="relative z-10 text-primary-foreground flex flex-col items-center justify-center w-full h-full text-center">
          <span className="text-6xl font-bold leading-none">{plan.title}</span>
        </CardContent>
      </Card>

      {/* Card flotante a la derecha con ícono */}
      <Card className="absolute -top-5 left-[calc(50%+90px)] z-30 w-14 h-14 flex items-center justify-center rounded-xl bg-purple-700 border-2 border-white shadow-lg">
        <CardContent className="flex items-center justify-center w-full h-full p-0">
          <div
            className="transition-all duration-500 ease-in-out scale-110"
            style={{
              animation: "floatRotate 3s ease-in-out infinite",
            }}
          >
            <img
              src={iconoControl}
              alt="icono control"
              className="w-12 h-12 filter invert brightness-0"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary pt-24 border-3 border-purple-700 relative w-full shadow-lg hover:shadow-xl hover:shadow-purple-500/50 z-10 overflow-hidden">
        <Stars starCount={90} />
        {/* Fondo de estrellas dentro del card */}
        <CardHeader className="text-center pb-4 relative z-10 rounded-t-xl" />
        <CardContent className="relative z-10 space-y-6">
          {/* Título grande */}
          <div className="flex flex-col items-center mb-2">
            <span className="text-7xl font-extrabold text-white leading-none">
              {plan.speed}
            </span>
            <span className="text-3xl font-extrabold text-white leading-none">
              MEGAS
            </span>
            <span className="text-2xl text-white font-light -mt-1">
              simétricas
            </span>
            <div
              className="w-full h-2 my-2 rounded-full"
              style={{
                background: "linear-gradient(90deg, #a21caf 0%, #7c3aed 100%)",
              }}
            />
          </div>
          {/* Características */}
          <div className="text-purple-50 space-y-3">
            {plan.caracteristicas.map((caracteristica, index) => (
              <div key={index} className="flex items-center gap-2">
                <Star className="h-5 w-5 text-purple-50" />
                <span>{caracteristica}</span>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="relative z-10 backdrop-blur-sm rounded-b-xl">
          <Button variant="purple" className="w-full py-6 flex rounded-xl ">
            <Search />
            <span className="text-lg font-semibold">Saber más</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default GamerPlan;
