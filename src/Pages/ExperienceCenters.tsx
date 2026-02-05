import { lazy, Suspense } from "react";
import AnimatedLines from "@/components/Canvas/AnimatedLines";

const Box3DViewer = lazy(() => import("@/components/Canvas/Box3DViewer"));
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Menu from "@/Layouts/Menu";
import clsx from "clsx";
import { Clock, MapPin } from "lucide-react";
import SEO from "@/components/SEO";

type Priority = "primary" | "secondary" | "third";

const horarios = [
  {
    title: "Lunes a Viernes",
    franja_horaria: { inicio: "8:15 am", fin: "5:00 pm" },
  },
  {
    title: "Sábados",
    franja_horaria: { inicio: "8:15 am", fin: "1:30 pm" },
  },
];

const buildMapsLink = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;

interface experienceCentersProps {
  office: string;
  photo: string;
  address: string;
  link: string;
  priority: Priority;
}

const experienceCenters: Array<experienceCentersProps> = [
  {
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
  },
];

const priorityGridClasses: Record<Priority, string> = {
  primary: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  secondary: "sm:col-span-1 lg:col-span-2 lg:row-span-1 xl:row-span-2",
  third: "sm:col-span-1 lg:col-span-1",
};

export default function ExperienceCenters() {
  return (
    <div className="min-h-screen bg-muted/20 space-y-12 mb-12">
      <SEO
        title="Centros de Experiencia - Inttelgo | Atención presencial en Soacha"
        description="Visita nuestros Centros de Experiencia Inttelgo. Horarios, ubicaciones y atención personalizada para planes de internet, soporte técnico y gestión de servicios."
        keywords="centros de experiencia inttelgo, oficinas inttelgo, atención presencial soacha, horarios inttelgo"
      />
      <Menu
        className="text-foreground hover:text-foreground/80"
        textColor="text-foreground hover:text-foreground/80"
        detailsColor=""
        lineColor="bg-foreground/20"
      />
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-40">
        <Suspense fallback={<LoadingSpinner size="md" />}>
          <AnimatedLines className="mb-6" />
        </Suspense>
        <Card className="border shadow-sm bg-card">
          <CardHeader className="space-y-2">
            <Badge variant="orange" className="w-fit text-xs uppercase tracking-wider">
              Centros de Experiencia
            </Badge>
            <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Conoce nuestros centros de experiencia
            </CardTitle>
            <p className="text-base md:text-lg font-semibold text-primary">
              Vive la tecnología, siente la diferencia.
            </p>
            <CardDescription className="text-base md:text-lg text-muted-foreground leading-relaxed pt-1">
              En nuestros Centros de Experiencia podrás conocer de cerca todos
              nuestros servicios de conectividad. Te brindamos atención
              personalizada para ayudarte a elegir el plan ideal, resolver
              inquietudes técnicas, administrativas y gestionar tus servicios de
              forma rápida y eficiente.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-40">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Clock className="size-40 text-primary" aria-hidden />
              <h3 className="text-7xl font-semibold text-foreground">Horarios de atención</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {horarios.map((horario, index) => (
                <Card
                  key={`horario-${index}`}
                  className="min-w-0 border shadow-sm bg-muted/30 overflow-visible"
                >
                  <CardHeader className="pb-1 pt-4 px-4 sm:pb-2 sm:pt-6 sm:px-6">
                    <Badge variant="secondary" className="w-fit text-xs uppercase">
                      {horario.title}
                    </Badge>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center gap-2 flex-wrap px-4 pb-4 sm:gap-3 sm:px-6 sm:pb-6">
                    <span className="text-lg font-semibold text-foreground tabular-nums sm:text-xl md:text-2xl">
                      {horario.franja_horaria.inicio}
                    </span>
                    <Badge variant="orange" className="shrink-0 px-2 font-bold text-sm sm:text-base md:text-lg">
                      a
                    </Badge>
                    <span className="text-lg font-semibold text-foreground tabular-nums sm:text-xl md:text-2xl">
                      {horario.franja_horaria.fin}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
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

      {/*<div className="w-full bg-muted/30 px-4 sm:px-6 md:px-10 lg:px-40">
        <div className="mb-8">
          <Badge variant="outline" className="mb-2 text-xs uppercase tracking-wider">
            Ubicaciones
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Nuestros centros
          </h2>
          <p className="text-muted-foreground mt-1">
            Visita cualquiera de nuestras sedes para atención personalizada.
          </p>
        </div>
        {experienceCenters.length > 0 ? (
          <div className="grid auto-rows-[220px] grid-cols-1 gap-5 sm:auto-rows-[240px] sm:grid-cols-2 lg:auto-rows-[260px] lg:grid-cols-4">
            {experienceCenters.map((center) => (
              <Card
                key={center.office}
                className={clsx(
                  "group relative h-full overflow-hidden rounded-2xl border shadow-md transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-primary/20",
                  priorityGridClasses[center.priority]
                )}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(/offices/${center.photo}.jpg)` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <CardContent className="relative flex h-full w-full items-end p-5">
                  <h3 className="text-xl font-bold text-white drop-shadow-sm">{center.office}</h3>
                </CardContent>
                <div className="bg-gradient-to-b to-black/90 via-black/40 from-transparent absolute inset-0 -translate-y-full backdrop-blur-sm text-foreground transition-transform duration-300 ease-out group-hover:translate-y-0">
                  <div className="flex h-full flex-col justify-between p-5">
                    <div className="space-y-3">
                      <Badge variant="orange" className="text-2xl">
                        {center.office}
                      </Badge>
                      <p className="text-xl text-primary-foreground flex items-start gap-2">
                        <MapPin className="size-4 shrink-0 mt-0.5" aria-hidden />
                        {center.address}
                      </p>
                    </div>
                    {center.link ? (
                      <Button variant="secondary" size="sm" asChild className="w-full">
                        <a href={center.link} target="_blank" rel="noopener noreferrer">
                          Cómo llegar
                        </a>
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" disabled className="w-full">
                        Cómo llegar
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border border-dashed border-border bg-card/50">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <MapPin className="size-12 text-muted-foreground/50 mb-4" aria-hidden />
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Próximamente más centros
              </h3>
              <p className="text-muted-foreground max-w-md">
                Estamos ampliando nuestra red de Centros de Experiencia. Consulta los horarios
                de atención arriba o contáctanos para más información.
              </p>
            </CardContent>
          </Card>
        )}
      </div>*/}
    </div>
  );
}
