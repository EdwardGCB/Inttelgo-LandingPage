import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Search } from "lucide-react";
import { Button } from "../ui/button";
import { useCallback } from "react";

interface Plan {
  title: string | null;
  speed: string;
  price: string;
  category: string;
  caracteristicas: string[];
  extras: string[];
}

interface SecondaryPlanProps {
  plan: Plan;
}

function SecondaryPlan({ plan }: SecondaryPlanProps) {
  const phone = "573002698767";

  const handleWhatsAppClick = useCallback(() => {
    window.open(`https://wa.me/${phone}`, "_blank");
  }, [phone]);

  return (
    <div className="relative w-full flex flex-col items-center transition-transform duration-300 hover:scale-105">
      {plan.extras.map((extra, index) => (
        <Card
          key={`extra-${index}`}
          className="bg-gradient-to-r from-[#ff9900] to-[#ec5406] absolute left-1/25 -translate-x-1/2 z-11 p-3 border-none"
          style={{
            top: `${1 + index * 4.5}rem`,
          }}
        >
          <CardContent className="text-primary-foreground flex flex-col items-center justify-center w-full h-full p-0">
            <span className="text-xl md:text-2xl lg:text-3xl font-bold">
              {extra}
            </span>
          </CardContent>
        </Card>
      ))}
      {/* Mbps Card flotante */}
      <Card className="absolute -top-15 left-1/2 -translate-x-1/2 z-10 w-3xs h-3xs flex items-center justify-center rounded-xl bg-primary">
        <CardContent className="text-primary-foreground flex flex-col items-center justify-center w-full h-full">
          <span className="text-7xl font-bold leading-none">{plan.speed}</span>
          <span className="text-4xl font-semibold -mt-2">Mbps</span>
        </CardContent>
      </Card>
      <Card className="w-full shadow-lg hover:shadow-xl transition-shadow pt-16">
        <CardHeader className="text-center pb-4" />
        <CardContent className="space-y-6">
          <div className="relative flex flex-col items-center mb-6">
            <Badge
              variant="orange"
              className="rounded-full px-8 py-2 text-4xl font-bold min-w-[260px] flex justify-center items-center h-16"
              style={{ borderRadius: "2.5rem" }}
            >
              {plan.price}
            </Badge>
            <Badge
              variant="secondary"
              className="absolute left-1/2 -translate-x-1/2 -bottom-4 px-3 py-0.7 text-base font-semibold shadow"
              style={{ borderRadius: "1rem" }}
            >
              mensuales
            </Badge>
          </div>

          {/* Características */}
          <div className="space-y-3">
            {plan.caracteristicas.map((caracteristica, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>{caracteristica}</span>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={() => handleWhatsAppClick()}
            className="w-full min-h-[44px] py-6 flex rounded-xl"
          >
            <Search />
            <span className="text-lg font-semibold">Saber más</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SecondaryPlan;
