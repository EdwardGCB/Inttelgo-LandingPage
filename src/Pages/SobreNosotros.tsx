import { Suspense, useEffect, useRef, useState, lazy } from "react";
import BannerAbboutUs from "@/components/Banners/BannerAbboutUs";
import { FundationsMarquee } from "@/components/blocks/FundationsMarquee";
import AnimatedLines from "@/components/Canvas/AnimatedLines";

const Box3DViewer = lazy(() => import("@/components/Canvas/Box3DViewer"));
import ScrollStack, { ScrollStackItem } from "@/components/Cards/ScrollStack";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import SEO from "@/components/SEO";
import { accordionPurposeItems, type AccordionPurposeItem } from "@/data/abboutusAccordion";
import { timelineEvents } from "@/data/timelineEvents";

const aboutUsContent = [
  "Somos una empresa de telecomunicaciones con origen en Soacha, especializada en ofrecer soluciones de conectividad de alta calidad para los estratos 0, 1 y 2. Nuestra red es 100% fibra óptica hasta el hogar (FTTH), lo que garantiza una conexión estable, de alta velocidad y con el mejor rendimiento del mercado.",
  "Nos posicionamos como líderes en latencia optimizada y soporte técnico ágil, brindando un servicio robusto y confiable tanto en Soacha como en Ciudad Bolívar. Nuestra infraestructura está diseñada para ofrecer baja latencia, alta disponibilidad y una experiencia de navegación superior, incluso en entornos de alta demanda.",
  "Nuestro modelo de operación se basa en la inclusión y el compromiso social, por lo cual priorizamos la vinculación laboral de talento local. Además, promovemos una cultura empresarial cercana y orientada al cliente, ofreciendo programas de fidelización y beneficios exclusivos para nuestros usuarios.",
];

const benefits = [
  "Atención 100% personalizada",
  "Latencias bajas",
  "Plan GAMER",
  "100% FIBRA ÓPTICA",
  "Tecnología de punta",
];


function VideoLazyLoad() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect();
            setShouldLoad(true);
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: "200px",
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Card className="relative w-full mx-auto lg:mx-0 max-w-md lg:max-w-none lg:sticky lg:top-24 overflow-hidden border-0 shadow-lg p-0">
      <div className="relative rounded-xl overflow-hidden w-full max-w-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          controls
          muted
          playsInline
          preload="metadata"
        >
          {shouldLoad && <source src="/media/historia.mp4" type="video/mp4" />}
          Tu navegador no soporta el video.
        </video>
      </div>
    </Card>
  );
}

export default function SobreNosotros() {
  return (
    <>
      <SEO
        title="Sobre Nosotros - Inttelgo | Internet 100% Fibra Óptica en Soacha y Bogotá"
        description="Conoce a Inttelgo, empresa de telecomunicaciones especializada en internet 100% fibra óptica para estratos 0, 1 y 2. Red FTTH en Soacha y Ciudad Bolívar. Baja latencia, alta velocidad y soporte técnico ágil."
        keywords="sobre inttelgo, inttelgo empresa, internet soacha, fibra óptica soacha, internet ciudad bolívar, internet estratos bajos, FTTH soacha, telecomunicaciones soacha, inttelgo historia"
        ogTitle="Sobre Nosotros - Inttelgo | Internet 100% Fibra Óptica"
        ogDescription="Empresa de telecomunicaciones especializada en internet 100% fibra óptica para estratos 0, 1 y 2. Red FTTH en Soacha y Ciudad Bolívar."
        ogUrl="https://inttelgo.com/sobre-nosotros"
        canonical="https://inttelgo.com/sobre-nosotros"
      />
      <div className="w-full flex flex-col space-y-12 bg-muted/30">
        <Suspense fallback={<LoadingSpinner fullScreen size="xl" />}>
          <BannerAbboutUs className="bg-black" image="/banners/banner-sobre-nosotros.webp">
            <section className="relative text-center px-4">
              <p className="text-sm sm:text-base font-medium tracking-[0.2em] uppercase text-white/80 mb-4 sm:mb-6">
                Sobre nosotros
              </p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-[1.1] tracking-tight">
                <span className="text-white/95 drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
                  Un{" "}
                  <span className="bg-gradient-to-r from-orange-400 via-[#ec5406] to-orange-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(236,84,6,0.5)]">
                    internet
                  </span>{" "}
                  para
                </span>
                <br />
                <span className="text-white/95 drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
                  la{" "}
                  <span className="bg-gradient-to-r from-orange-400 via-[#ec5406] to-orange-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(236,84,6,0.5)]">
                    comunidad
                  </span>
                  .
                </span>
              </h2>
            </section>
          </BannerAbboutUs>
        </Suspense>
        <div className="w-full px-4 sm:px-6 md:px-10 lg:px-20 space-y-6">
          <Suspense fallback={<LoadingSpinner size="md" />}>
            <AnimatedLines />
          </Suspense>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 md:gap-10 items-start">
            <Card className="border shadow-sm bg-card">
              <CardHeader>
                <Badge variant="orange" className="w-fit text-xs uppercase tracking-wider">
                  Acerca de nosotros
                </Badge>
                <CardTitle className="text-2xl md:text-3xl font-bold text-secondary-foreground pt-2">
                  Nuestra historia y compromiso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aboutUsContent.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-base md:text-lg text-muted-foreground leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </CardContent>
            </Card>

            <div className="hidden lg:flex justify-center items-center h-full py-8">
              <Separator orientation="vertical" className="h-full bg-border" />
            </div>

            <Card className="border shadow-sm bg-card">
              <CardHeader>
                <Badge variant="secondary" className="w-fit text-xs uppercase tracking-wider">
                  Beneficios
                </Badge>
                <CardTitle className="text-2xl md:text-3xl font-bold text-secondary-foreground pt-2">
                  Lo que nos diferencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <ul className="space-y-3 flex-1">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="rounded-full bg-primary/10 p-1 mt-0.5">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        </span>
                        <span className="text-base sm:text-lg text-muted-foreground">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="relative flex justify-center sm:justify-end w-full h-1/2 sm:w-64 sm:h-45 md:w-72 md:h-55 lg:w-80 lg:h-65">
                    <Suspense fallback={<LoadingSpinner size="md" />}>
                      <Box3DViewer
                        modelPath="wifi-cromo.glb"
                        hdrPath="hdri2.hdr"
                        distance={20}
                        scale={1}
                      />
                    </Suspense>
                  </div>
                </div>
                <div className="flex justify-end mt-8">
                  <Suspense fallback={<LoadingSpinner size="md" />}>
                    <AnimatedLines className="w-full justify-end" />
                  </Suspense>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sección de Historia - ScrollStack */}
        <div className="w-full bg-muted/20">
          <Card className="max-w-3xl mx-auto border-0 shadow-none bg-transparent text-center">
            <CardHeader className="space-y-2">
              <Badge variant="outline" className="w-fit mx-auto text-xs uppercase tracking-wider">
                Línea de tiempo
              </Badge>
              <CardTitle className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-foreground">
                Nuestra Historia
              </CardTitle>
              <CardDescription className="text-base md:text-lg max-w-2xl mx-auto px-4">
                Un recorrido por los momentos clave que han marcado nuestro
                compromiso con la comunidad.
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
            <ScrollStack
              useWindowScroll
              className="w-full !h-auto overflow-visible"
            >
              {timelineEvents.map((event, index) => (
                <ScrollStackItem
                  key={index}
                  image={event.image}
                  imageAlt={event.imageAlt ?? event.title}
                  itemClassName="border border-border bg-card p-0"
                >
                  <span className="text-sm font-semibold text-primary">
                    {event.year}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mt-1 mb-3">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </ScrollStackItem>
              ))}
            </ScrollStack>
          </div>
        </div>

        <div className="w-full bg-muted/20 px-4 sm:px-6 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[500px_1fr] gap-8 lg:gap-12 items-start">
            <VideoLazyLoad />

            {/* Acordeones - derecha */}
            <div className="w-full space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-secondary-foreground">
                  Conoce nuestro propósito
                </h2>
              </div>
              <Accordion
                type="multiple"
                className="w-full space-y-3"
                defaultValue={accordionPurposeItems.filter((i: AccordionPurposeItem) => i.defaultOpen).map((i: AccordionPurposeItem) => i.value)}
              >
                {accordionPurposeItems.map((item) => (
                  <AccordionItem
                    key={item.value}
                    value={item.value}
                    className={item.itemClassName}
                  >
                    <AccordionTrigger className="text-lg lg:text-xl font-semibold text-secondary-foreground hover:no-underline py-5 hover:text-primary">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance pb-5 text-muted-foreground">
                      {item.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
        <div className="w-full bg-muted/30 py-12 px-4 sm:px-6 md:px-10 lg:px-20">
          <FundationsMarquee />
        </div>
      </div>
    </>
  );
}
