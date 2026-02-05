import AnimatedLines from "@/components/Canvas/AnimatedLines";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ganadores2024, ganadores2025, ganadores2026 } from "@/data/BecaWinner";
import { redesSociales } from "@/data/SocialNetwork";
import type { SocialNetwork } from "@/interfaces/SocialNetwork";
import type { GanadorBECA } from "@/interfaces/Winner";
import Menu from "@/Layouts/Menu";
import { cn } from "@/lib/utils";
import { TabsContent } from "@radix-ui/react-tabs";
//import { InscripcionTabContent } from "@/components/Beca/InscripcionTabContent";
import { Suspense } from "react";

function WinnerFlipCard({ ganador }: { ganador: GanadorBECA }) {
  return (
    <div className="group relative mx-auto aspect-[9/16] w-full max-w-[360px] overflow-hidden rounded-[32px] bg-gradient-to-br from-gray-900 to-black shadow-2xl shadow-black/60 border-2 border-white/20 hover:border-orange-500/50 transition-all duration-500 hover:shadow-orange-500/30 hover:scale-[1.02]">
      {/* Imagen con overlay mejorado */}
      <div className="absolute inset-0">
        <img
          src={ganador.imagen}
          alt={ganador.nombre}
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
        />
        {/* Gradiente overlay mejorado */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 via-60% to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        {/* Efecto de brillo en hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:from-orange-500/10 group-hover:via-orange-500/5 group-hover:to-orange-500/10 transition-all duration-500" />
      </div>

      {/* Contenido de texto */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-5 p-8 text-center text-white">
        {/* Línea decorativa superior */}
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="space-y-3">
          <h3 className="text-3xl md:text-4xl font-bold leading-tight bg-gradient-to-r from-white via-white to-orange-200 bg-clip-text text-transparent group-hover:from-orange-300 group-hover:via-white group-hover:to-orange-300 transition-all duration-500 drop-shadow-lg">
            {ganador.nombre}
          </h3>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span className="text-sm md:text-base font-medium text-white/80 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 group-hover:border-orange-500/30 group-hover:bg-orange-500/10 transition-all duration-300">
            {ganador.carrera}
          </span>
        </div>

        <a
          href={ganador.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 transform transition-all duration-300 group-hover:scale-105"
        >
          <Button
            variant="orange"
            className="shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70 hover:scale-110 transition-all duration-300 font-semibold px-6 py-3"
          >
            Conoce su historia
          </Button>
        </a>
      </div>

      {/* Efecto de borde brillante en hover */}
      <div className="absolute inset-0 rounded-[32px] border-2 border-transparent group-hover:border-orange-500/30 transition-all duration-500 pointer-events-none" />

      {/* Partículas decorativas (opcional, sutil) */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500" />
      <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-orange-400 rounded-full opacity-0 group-hover:opacity-70 group-hover:animate-pulse transition-opacity duration-700 delay-100" />
    </div>
  );
}

const becasTabs = [
  {
    value: "2024",
    title: "Beca 2024",
  },
  {
    value: "2025",
    title: "Beca 2025",
  },
  {
    value: "2026",
    title: "Beca 2026",
  },
];
export default function Beca() {
  return (
    <div>
      <Menu
        className={"text-black hover:text-black/80"}
        textColor="text-black hover:text-black/80"
        detailsColor=""
        lineColor="bg-black/50"
      />
      <div className="w-full md:w-[90%] lg:w-[80%] mx-auto bg-white py-12 px-4 sm:px-6 md:px-10 lg:px-20 space-y-12">
        <h2 className="text-5xl sm:text-7xl md:text-7xl font-bold text-center drop-shadow-lg">
          INTTELGO - Conectamos oportunidades donde otros no llegan
        </h2>
        <Suspense fallback={<LoadingSpinner size="md" />}>
          <AnimatedLines />
        </Suspense>
        <p className="text-lg text-secondary-foreground/80">
          En INTTELGO, creemos en el poder de la educación. Por eso, como
          agradecimiento por confiar en nuestros servicios; te invitamos a
          participar en nuestra beca exclusiva para clientes. Podrías ser el
          próximo beneficiario.
          <br />
          No te quedes fuera; esta es tu oportunidad de crecer.
          <br />
          Síguenos en nuestras redes sociales para estar al tanto de las
          próximas becas y más beneficios.
        </p>

        <div className="flex flex-wrap items-center gap-6">
          {redesSociales.map((red: SocialNetwork, index: number) => (
            <a
              key={index}
              href={red.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center hover:opacity-80 transition-opacity"
            >
              <Card
                className={cn(
                  "w-20 h-20 sm:w-15 sm:h-15 md:w-25 md:h-25 lg:w-30 lg:h-30 p-0 hover:shadow-orange-500/50 hover:scale-105 hover:bg-gradient-to-b hover:from-[#FF9900] hover:to-[#EC5406] border-none rounded-full not-last:",
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

        <Tabs
          defaultValue={becasTabs[becasTabs.length - 1].value}
          className="space-y-8"
        >
          <TabsList className="mx-auto flex w-full max-w-3xl flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200/80 p-2 sm:p-2 shadow-xl shadow-black/10 backdrop-blur-md border border-white/50">
            {becasTabs.map((beca) => (
              <TabsTrigger
                key={beca.value}
                value={beca.value}
                className="flex-1 rounded-xl px-3 py-2.5 sm:px-6 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wide sm:tracking-wider text-gray-600 transition-all duration-300 hover:text-gray-900 hover:bg-white/60 hover:scale-[1.02] sm:hover:scale-105 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/50 data-[state=active]:scale-[1.02] sm:data-[state=active]:scale-105"
              >
                {beca.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <Card className=" relative overflow-hidden border-none bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white shadow-2xl shadow-black/40">
            {/* Efectos de fondo mejorados */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,153,0,0.15),transparent_50%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,84,6,0.1),transparent_50%)]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

            {/* Patrón de puntos decorativo */}
            <CardContent className="relative z-10 space-y-10 p-8 md:p-12">
              <TabsContent
                value="2024"
                className="text-white/90 animate-in fade-in-50 duration-500"
              >
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
                  <div className="order-2 md:order-1 space-y-4">
                    {ganadores2024.map((ganador: GanadorBECA) => (
                      <div key={ganador.id}>
                        <WinnerFlipCard ganador={ganador} />
                      </div>
                    ))}
                  </div>
                  <div className="order-1 md:order-2 space-y-4">
                    <h3 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                      Nuestra Primera Graduada
                    </h3>
                    <p className="text-xl md:text-2xl font-medium leading-relaxed text-white/90">
                      Te presentamos a{" "}
                      <span className="font-bold text-orange-400">
                        Laura Restrepo
                      </span>
                      , nuestra primera profesional graduada gracias al programa
                      de becas Inttelgo como técnico en contabilidad en
                      tesorería y finanzas en la universidad de la Salle.
                    </p>
                    <p className="text-lg text-white/70">
                      Si quieres conocer más sobre su historia, visita el enlace
                      de TikTok en la parte inferior.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="2025"
                className="animate-in fade-in-50 duration-500"
              >
                <div className="space-y-10">
                  <CardHeader className="max-w-4xl space-y-4 p-0 text-left">
                    <CardTitle className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                      Ganadores Beca INTTELGO 2025
                    </CardTitle>
                    <p className="text-xl text-white/80 leading-relaxed">
                      Conoce a los ganadores de nuestra Beca INTTELGO 2025. Si
                      quieres conocer su historia completa, visita el enlace de
                      TikTok ubicado en la parte inferior de cada tarjeta.
                    </p>
                  </CardHeader>
                  <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2">
                    {ganadores2025.map((ganador: GanadorBECA) => (
                      <WinnerFlipCard key={ganador.id} ganador={ganador} />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="2026"
                className="animate-in fade-in-50 duration-500"
              >
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
                  <div className="order-2 md:order-1 space-y-4">
                    {ganadores2026.map((ganador: GanadorBECA) => (
                      <WinnerFlipCard key={ganador.id} ganador={ganador} />
                    ))}
                  </div>
                  <div className="order-1 md:order-2 space-y-4">
                    <h3 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                      Nuestra Ganadora BECA 2026
                    </h3>
                    <p className="text-xl md:text-2xl font-medium leading-relaxed text-white/90">
                      Te presentamos a{" "}
                      <span className="font-bold text-orange-400">
                        Yudi Tatiana Malagón
                      </span>
                      , nuestra ganadora de la BECA Inttel Go 2026, que seguira impulsando su carrera profesional con un Técnico laboral en atención integral a la primera infancia
                    </p>
                    <p className="text-lg text-white/70">
                      Si quieres conocer más sobre su historia, visita el enlace
                      de Instagram en la parte inferior.
                    </p>
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
