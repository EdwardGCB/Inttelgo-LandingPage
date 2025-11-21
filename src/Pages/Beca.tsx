import AnimatedLines from "@/components/Canvas/AnimatedLines";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Menu from "@/Layouts/Menu";
import { cn } from "@/lib/utils";
import { TabsContent } from "@radix-ui/react-tabs";
import { Suspense } from "react";

interface SocialNetwork {
  descripcion: string;
  imagen: string;
  link: string;
  classname: string;
  iconProps: string;
}

interface Ganador {
  id: number;
  nombre: string;
  imagen: string;
  link: string;
  carrera: string;
}
const redesSociales: SocialNetwork[] = [
  {
    descripcion: "TikTok",
    imagen: "/social/tiktok.svg",
    link: "https://www.tiktok.com/@inttelgo?is_from_webapp=1&sender_device=pc",
    classname: "bg-primary",
    iconProps: "p-0 group-hover:brightness-0 group-hover:invert transition-all",
  },
  {
    descripcion: "Instagram",
    imagen: "/social/instagram.svg",
    link: "https://www.instagram.com/inttelgo/",
    classname: "bg-gradient-to-b from-pink-500 to-yellow-500",
    iconProps: "p-0 brightness-0 invert",
  },
];

const ganadores2024: Ganador[] = [
  {
    id: 1,
    nombre: "Laura Restrepo",
    imagen: "/winners/BECA/laura-restrepo.jpg",
    link: "https://www.tiktok.com/@inttelgo?is_from_webapp=1&sender_device=pc",
    carrera: "Técnico Laboral: Auxiliar en Comercio Exterior",
  },
];

const ganadores2025: Ganador[] = [
  {
    id: 1,
    nombre: "Jummalay Neira",
    imagen: "/winners/BECA/jummalay-neira.jpg",
    link: "https://www.tiktok.com/@jummalayneira?is_from_webapp=1&sender_device=pc",
    carrera: "Técnico Laboral: Auxiliar en Comercio Exterior",
  },
  {
    id: 2,
    nombre: "Diego Sierra",
    imagen: "/winners/BECA/diego-sierra.jpg",
    link: "https://www.tiktok.com/@diegosierra?is_from_webapp=1&sender_device=pc",
    carrera: "Técnico Laboral: Auxiliar en Comercio Exterior",
  },
];

function WinnerFlipCard({ ganador }: { ganador: Ganador }) {
  return (
    <div className="group relative mx-auto aspect-[9/16] w-full max-w-[360px] overflow-hidden rounded-[32px] bg-black shadow-2xl shadow-black/40 border-2 border-white/60">
      <img
        src={ganador.imagen}
        alt={ganador.nombre}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-4 p-8 text-center text-white">
        <div className="space-y-2">
          <h3 className="text-3xl font-semibold">{ganador.nombre}</h3>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/70">
          <span>{ganador.carrera}</span>
        </div>
        <a href={ganador.link} target="_blank" rel="noopener noreferrer">
          <Button variant="orange">Conoce su historia</Button>
        </a>
      </div>
    </div>
  );
}
export default function Beca() {
  return (
    <div>
      <Menu
        className={"text-black hover:text-black/80"}
        textColor="text-black hover:text-black/80"
        detailsColor=""
        lineColor="bg-black/50"
      />
      <div className="w-full bg-white py-12 px-4 sm:px-6 md:px-10 lg:px-20 space-y-12">
        <h2 className="text-5xl sm:text-7xl md:text-7xl font-bold text-center drop-shadow-lg">
          CONOCE A NUESTROS GANADORES
          <br />
          DE LA BECA DE INTTELGO 2025
        </h2>
        <Suspense fallback={<LoadingSpinner size="md" />}>
          <AnimatedLines />
        </Suspense>
        <p className="text-lg text-secondary-foreground/80">
          En INTTELGO, creemos en el poder de la educacion. Por eso, como
          agradecimiento por confiar en nuestros servicios, te invitamos a
          participar en nuestra beca exclusiva para clientes. Podrias ser el
          proximo beneficiario.
          <br />
          No te quedes fuera, esta es tu oportunidad de crecer.
          <br />
          Siguenos en nuestras redes sociales para estar al tanto de las
          proximas becas y mas beneficios.
        </p>

        <div className="flex flex-wrap items-center gap-6">
          {redesSociales.map((red, index) => (
            <a
              key={index}
              href={red.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center hover:opacity-80 transition-opacity"
            >
              <Card
                className={cn(
                  "w-10 h-10 sm:w-15 sm:h-15 md:w-25 md:h-25 lg:w-30 lg:h-30 p-0 hover:shadow-orange-500/50 hover:scale-105 hover:bg-gradient-to-b hover:from-[#FF9900] hover:to-[#EC5406] border-none rounded-full not-last:",
                  red.classname
                )}
              >
                <CardContent className="p-3 flex justify-center items-center">
                  <img
                    src={red.imagen}
                    alt={red.descripcion}
                    className={cn("h-full w-full", red.iconProps)}
                  />
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        <Tabs defaultValue="2026" className="space-y-10">
          <TabsList className="mx-auto flex w-full max-w-2xl items-center justify-center gap-2 rounded-full bg-black/5 p-2 shadow-inner shadow-black/5 backdrop-blur">
            <TabsTrigger
              value="2024"
              className="flex-1 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide text-black/60 transition-all duration-300 hover:text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Beca 2024
            </TabsTrigger>
            <TabsTrigger
              value="2025"
              className="flex-1 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide text-black/60 transition-all duration-300 hover:text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Beca 2025
            </TabsTrigger>
            <TabsTrigger
              value="2026"
              className="flex-1 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide text-black/60 transition-all duration-300 hover:text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Beca 2026
            </TabsTrigger>
          </TabsList>
          <Card className="relative overflow-hidden border-none bg-black text-white shadow-2xl shadow-black/25">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_58%)]" />
            <CardContent className="relative z-10 space-y-10 p-10">
              <TabsContent value="2024" className="text-white/70">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <span className="order-1 text-3xl font-semibold leading-tight text-white md:order-2">
                    Te presentamos a Laura Restrepo, nuestra primera profesional
                    graduada gracias al programa de becas inttelgo como un
                    tecnico en Contabilidad en tesoreria y finanzas en la
                    universidad de la Salle, si quieres mas sobre su historia
                    visita el enlace de tiktok en la parte inferior.
                  </span>
                  {ganadores2024.map((ganador) => (
                    <div key={ganador.id} className="order-2 md:order-1">
                      <WinnerFlipCard ganador={ganador} />
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="2025">
                <div className="space-y-8">
                  <CardHeader className="max-w-3xl space-y-3 p-0 text-left text-white">
                    <CardTitle className="text-3xl font-semibold leading-tight">
                      Conoce a los ganadores de nuestra Beca INTTELGO 2025, si
                      quieres conocer su historia completa visita el enlace de
                      TikTok ubicado en la parte inferior.
                    </CardTitle>
                  </CardHeader>
                  <div className="grid grid-cols-1 gap-3 md:gap-6 md:grid-cols-2">
                    {ganadores2025.map((ganador) => (
                      <WinnerFlipCard key={ganador.id} ganador={ganador} />
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="2026" className="text-white/70">
                <div className="space-y-8">
                  <h2 className=" text-center text-5xl lg:text-9xl font-semibold leading-tight text-white">
                    PREPARATE
                  </h2>
                  <p className="text-lg">
                    Pronto anunciaremos la convocatoria para las becas de
                    estudio INTTELGO 2026, te invitamos a estar pendiente en
                    nuestras redes sociales. Asegurate de cumplir con los
                    requisitos para participar.
                  </p>
                  <ul className="list-disc list-inside">
                    <li>Ser cliente de o vivir con el titular del servicio</li>
                    <li>Tener titulo de bachiller</li>
                    <li>
                      Presentarte en las fechas establecidas de la convocatoria
                    </li>
                  </ul>
                  <h2 className="text-center text-3xl font-semibold leading-tight text-white">
                    Siguenos en nuestro Instagram para enterarte primero <br />
                    de nuestras convocatorias
                  </h2>
                  <div className="flex justify-center">
                    <a
                      href="https://www.instagram.com/inttelgo/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant={"orange"}
                        className="flex items-center gap-4 py-6 px-10 text-2xl font-bold text-white"
                      >
                        <img
                          src="/social/instagram.svg"
                          alt="Instagram"
                          className="h-10 w-10 brightness-0 invert"
                        />
                        Ir a Instagram
                      </Button>
                    </a>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
