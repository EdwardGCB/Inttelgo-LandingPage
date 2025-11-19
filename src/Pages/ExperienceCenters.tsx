import AnimatedLines from "@/components/Canvas/AnimatedLines";
import Box3DViewer from "@/components/Canvas/Box3DViewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Menu from "@/Layouts/Menu";
import clsx from "clsx";
import { Suspense } from "react";

type Priority = "primary" | "secondary" | "third";

const horarios = [
  {
    title: "Luneas a Viernes",
    franja_horaria: { incio: "8:15 am", fin: "5:00 pm" },
  },
  {
    title: "Sabados",
    franja_horaria: { incio: "8:15 am", fin: "1:30 pm" },
  },
];

/*const buildMapsLink = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;*/

interface experienceCentersProps {
  office: string;
  photo: string;
  address: string;
  link: string;
  priority: Priority;
}

const experienceCenters: Array<experienceCentersProps> = [
  /*{
    office: "Santo Domingo",
    photo: "santo-domingo",
    address: "Cra. 37 Este #44A - 91",
    link: buildMapsLink("Cra 37 Este #44A-91, Soacha, Cundinamarca, Colombia"),
    priority: "primary",
  },
  {
    office: "Isla - Oasis",
    photo: "isla-oasis",
    address: "Calle 42 #41C - 04 Este",
    link: buildMapsLink(
      "Calle 42 #41C-04 Este, Soacha, Cundinamarca, Colombia"
    ),
    priority: "third",
  },
  {
    office: "Ciudadela Sucre",
    photo: "ciudadela-sucre",
    address: "Calle 36 #44 - 34 Este",
    link: buildMapsLink("Calle 36 #44-34 Este, Soacha, Cundinamarca, Colombia"),
    priority: "third",
  },
  {
    office: "Quintanares",
    photo: "quintanares",
    address: "Transv. 9 Este #44 - 18",
    link: buildMapsLink(
      "Transversal 9 Este #44-18, Soacha, Cundinamarca, Colombia"
    ),
    priority: "primary",
  },
  {
    office: "Vista Hermosa",
    photo: "vista-hermosa",
    address: "Diag. 71B Sur #18I - 95",
    link: buildMapsLink(
      "Diagonal 71B Sur #18I-95, Soacha, Cundinamarca, Colombia"
    ),
    priority: "primary",
  },
  {
    office: "Tesoro",
    photo: "tesoro",
    address: "Calle 78C #18C - 10",
    link: buildMapsLink("Calle 78C #18C-10, Soacha, Cundinamarca, Colombia"),
    priority: "third",
  },
  {
    office: "Estrella",
    photo: "estrella",
    address: "Cra. 18A Bis #73 - 09",
    link: buildMapsLink(
      "Carrera 18A Bis #73-09, Soacha, Cundinamarca, Colombia"
    ),
    priority: "third",
  },
  {
    office: "Paraíso",
    photo: "paraiso",
    address: "Calle 71P Sur #27J - 07",
    link: buildMapsLink(
      "Calle 71P Sur #27J-07, Soacha, Cundinamarca, Colombia"
    ),
    priority: "third",
  },*/
];

const priorityGridClasses: Record<Priority, string> = {
  primary: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  secondary: "sm:col-span-1 lg:col-span-2 lg:row-span-1 xl:row-span-2",
  third: "sm:col-span-1 lg:col-span-1",
};

export default function ExperienceCenters() {
  return (
    <div>
      <Menu
        className={"text-black hover:text-black/80"}
        textColor="text-black hover:text-black/80"
        detailsColor=""
        lineColor="bg-black/50"
      />
      <div className="w-full bg-white py-12 px-4 sm:px-6 md:px-10 lg:px-20 space-y-4">
        <Suspense fallback={<LoadingSpinner size="md" />}>
          <AnimatedLines />
        </Suspense>
        <div className="col-span-1 md:col-span-2 space-y-4 px-4 md:px-0">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground">
            CONOCE NUESTROS CENTROS DE EXPERIENCIA
          </h2>
          <p className="text-base md:text-lg text-[#EC5406] font-bold">
            Vive la tecnologia, siente la diferencia.
          </p>
          <p className="text-base md:text-lg text-secondary-foreground/80">
            En nuestros Centros de Experiencia podras conocer de cerca todos
            nuestros servicios de conectividad. Te brindamos atencion
            personalizada para ayudarte a elegir el plan ideal, resolver
            inquietudes tecnicas, administrativas y gestionar tus servicios de
            forma rapida y eficiente.
          </p>
        </div>
      </div>
      <div className="w-full bg-white px-4 sm:px-6 md:px-10 lg:px-20 space-y-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col items-center space-y-6 sm:flex-row sm:items-center sm:justify-center sm:space-y-0 sm:gap-6">
            {horarios.map((horario, index) => (
              <div
                key={`Card-horarios-${index}`}
                className="flex w-full max-w-xs justify-center sm:max-w-sm"
              >
                <div className="relative w-full">
                  <Badge
                    variant="orange"
                    className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-base sm:text-lg"
                  >
                    {horario.title}
                  </Badge>
                  <Card className="border border-black/10 shadow-sm h-20 p-0">
                    <CardContent className="flex items-center justify-center gap-2 py-8 text-lg font-semibold sm:text-xl">
                      <span>{horario.franja_horaria.incio}</span>
                      <Badge variant="orange" className="border-none font-bold">
                        A
                      </Badge>
                      <span>{horario.franja_horaria.fin}</span>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <div className="flex w-full h-90 max-w-md items-center justify-center">
              <Suspense fallback={<LoadingSpinner size="md" />}>
                <Box3DViewer
                  modelPath="reloj.glb"
                  hdrPath="hdri2.hdr"
                  distance={20}
                  scale={4}
                />
              </Suspense>
            </div>
          </div>
        </div>
        <Suspense fallback={<LoadingSpinner size="md" />}>
          <AnimatedLines />
        </Suspense>
      </div>

      <div className="w-full bg-white py-12 px-4 sm:px-6 md:px-10 lg:px-20 space-y-6">
        <div className="grid auto-rows-[220px] grid-cols-1 gap-5 sm:auto-rows-[240px] sm:grid-cols-2 lg:auto-rows-[260px] lg:grid-cols-4">
          {experienceCenters.map((center) => (
            <Card
              key={center.office}
              className={clsx(
                "group relative h-full overflow-hidden rounded-3xl border-0 shadow-lg transition-transform duration-500 hover:shadow-xl",
                priorityGridClasses[center.priority]
              )}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(/offices/${center.photo}.jpg)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
              <CardContent className="relative flex h-full w-full items-end p-6">
                <div className="space-y-2 text-white">
                  <h3 className="text-2xl font-bold">{center.office}</h3>
                </div>
              </CardContent>
              <div className="absolute inset-0 -translate-y-full bg-black/85 text-white transition-transform duration-500 ease-out group-hover:translate-y-0">
                <div className="flex h-full flex-col justify-between p-6">
                  <div className="space-y-3">
                    <Badge
                      variant="outline"
                      className="w-fit border-white bg-white/10 px-3 py-1 text-xl uppercase tracking-wider text-white"
                    >
                      {center.office}
                    </Badge>
                    <p className="text-lg text-white/80">{center.address}</p>
                  </div>
                  {center.link ? (
                    <Button
                      variant="secondary"
                      size="lg"
                      asChild
                      className="w-fit bg-gradient-to-b from-[#FF9900] to-[#EC5406] text-white hover:bg-gradient-to-b hover:from-[#EC5406] hover:to-[#FF9900]"
                    >
                      <a
                        href={center.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Cómo llegar
                      </a>
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-fit bg-gradient-to-b from-[#FF9900] to-[#EC5406] text-white hover:bg-gradient-to-b hover:from-[#EC5406] hover:to-[#FF9900]"
                      disabled
                    >
                      Cómo llegar
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
