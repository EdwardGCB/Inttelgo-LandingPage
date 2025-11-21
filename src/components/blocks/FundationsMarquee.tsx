import { fundations } from "@/data/fundations";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";

const duplicatedLogos = [...fundations, ...fundations];

export function FundationsMarquee() {
  return (
    <>
      <div className="w-full space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.35em]">Fundaciones</p>
        <h4 className="text-3xl font-semibold">
          Compromiso social de Inttelgo S.A.S con la comunidad
        </h4>
      </div>

      <div className="mt-10 space-y-6 relative">
        {[false, true].map((isReverse) => (
          <div
            key={isReverse ? "reverse" : "normal"}
            className="overflow-hidden relative"
          >
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, white 0%, white 0%, transparent 20%, transparent 80%, white 100%, white 100%)",
              }}
            />
            <div
              className={cn(
                "flex w-max gap-6",
                isReverse
                  ? "animate-marquee-reverse-fundations"
                  : "animate-marquee-fundations"
              )}
            >
              {duplicatedLogos.map((logo, index) => (
                <Card
                  key={`${logo.name}-${index}-${isReverse ? "rev" : "fwd"}`}
                  className="py-3"
                >
                  <CardContent className="flex items-center gap-4 px-3">
                    <div className="flex h-18 w-18 items-center justify-center rounded-xl shadow-inner border">
                      <img
                        src={logo.logo}
                        alt={logo.name}
                        className="h-full w-full object-contain rounded-xl"
                      />
                    </div>
                    <div>
                      <p className="text-base font-semibold ">{logo.name}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
