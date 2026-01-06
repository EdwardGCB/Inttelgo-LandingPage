import BannerAbboutUs from "@/components/Banners/BannerAbboutUs";
import { FundationsMarquee } from "@/components/blocks/FundationsMarquee";
import AnimatedLines from "@/components/Canvas/AnimatedLines";
import Box3DViewer from "@/components/Canvas/Box3DViewer";
import Timeline from "@/components/Timeline/Timeline";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import CarrouselWinner from "@/components/carousels/TravelWinners";
import { Check } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  lotteryWinners,
  travelWinners2024,
  travelWinners2025,
  tvWinners,
} from "@/lib/winners";
import SEO from "@/components/SEO";

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

const timelineEvents = [
  {
    year: "2015",
    title: "Fundación de Inttelgo",
    description:
      "Nace Inttelgo en Soacha con la misión de llevar internet de alta calidad a los estratos más vulnerables, iniciando nuestra red de fibra óptica hasta el hogar.",
  },
  {
    year: "2017",
    title: "Expansión a Ciudad Bolívar",
    description:
      "Ampliamos nuestra cobertura llegando a Ciudad Bolívar, consolidando nuestra presencia en comunidades que más necesitan conectividad de calidad.",
  },
  {
    year: "2019",
    title: "Red 100% Fibra Óptica",
    description:
      "Completamos la migración total a fibra óptica FTTH, garantizando la mejor velocidad y estabilidad del mercado para nuestros usuarios.",
  },
  {
    year: "2021",
    title: "Plan GAMER",
    description:
      "Lanzamos nuestro revolucionario Plan GAMER con latencia ultra-baja, posicionándonos como líderes en conectividad para gaming y streaming.",
  },
  {
    year: "2023",
    title: "Compromiso Social",
    description:
      "Implementamos programas de inclusión laboral y fidelización, fortaleciendo nuestro vínculo con la comunidad y el talento local.",
  },
  {
    year: "2024",
    title: "Líderes en Innovación",
    description:
      "Nos consolidamos como referente en telecomunicaciones, ofreciendo tecnología de punta con atención 100% personalizada y soporte técnico ágil 24/7.",
  },
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
    <div className="relative w-full mx-auto lg:mx-0 max-w-md lg:max-w-none lg:sticky lg:top-24 flex justify-center items-center">
      <div className="relative rounded-3xl overflow-hidden w-full max-w-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          controls
          muted
          playsInline
          preload="metadata"
        >
          {shouldLoad && <source src="/historia.mp4" type="video/mp4" />}
          Tu navegador no soporta el video.
        </video>
      </div>
    </div>
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
      <div className="w-full flex flex-col">
        <Suspense fallback={<LoadingSpinner fullScreen size="xl" />}>
          <BannerAbboutUs className="bg-black">
            <section className="relative text-center">
              <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-orange-50 leading-tight tracking-wide drop-shadow-lg">
                Un <span className="font-bold text-[#ec5406]">internet</span>{" "}
                para <br />
                la <span className="font-bold text-[#ec5406]">comunidad</span>.
              </h2>
            </section>
          </BannerAbboutUs>
        </Suspense>
        <div className="w-full bg-white py-12 px-4 sm:px-6 md:px-10 lg:px-20 space-y-5">
          <Suspense fallback={<LoadingSpinner size="md" />}>
            <AnimatedLines />
          </Suspense>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 md:gap-10 items-start">
            <div className="space-y-4 px-4 md:px-0">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground">
                ACERCA DE NOSOTROS
              </h2>
              {aboutUsContent.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base md:text-lg text-secondary-foreground/80"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="hidden lg:flex justify-center items-center h-full py-8">
              <Separator orientation="vertical" className="h-full" />
            </div>

            <div className="relative space-y-6 px-4 sm:px-0">
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary-foreground">
                BENEFICIOS
              </h2>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <ul className="space-y-4 flex-1">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <span className="text-base sm:text-lg text-secondary-foreground/80">
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
            </div>
          </div>
        </div>

        {/* Sección de Historia - Timeline */}
        <div className="w-full bg-gradient-to-b from-white to-gray-50 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-4">
              Nuestra Historia
            </h2>
            <p className="text-lg md:text-xl text-secondary-foreground/70 max-w-3xl mx-auto px-4">
              Un recorrido por los momentos clave que han marcado nuestro
              compromiso con la comunidad.
            </p>
          </div>
          <Timeline events={timelineEvents} />
        </div>

        <div className="w-full bg-white py-12 px-4 sm:px-6 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[500px_1fr] gap-8 lg:gap-12 items-start">
            <VideoLazyLoad />

            {/* Acordeones - derecha */}
            <div className="w-full">
              <Accordion
                type="multiple"
                className="w-full space-y-4"
                defaultValue={["item-4"]}
              >
                <AccordionItem
                  value="item-1"
                  className="border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-xl lg:text-2xl font-bold text-secondary-foreground hover:no-underline py-6">
                    MISIÓN
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance pb-6">
                    <p className="text-base lg:text-lg text-secondary-foreground/80 leading-relaxed">
                      Mejorar la conectividad de la sociedad, en especial, de la
                      población más vulnerable, de bajos recursos y condición de
                      desplazamiento forzado. Nuestra oferta, basada en las
                      tecnologías de la información y comunicaciones,
                      contribuirá al logro de la equidad social, al acceso a
                      oportunidades y a la reducción de las brechas digitales
                      del país.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-2"
                  className="border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-xl lg:text-2xl font-bold text-secondary-foreground hover:no-underline py-6">
                    VISIÓN
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance pb-6">
                    <p className="text-base lg:text-lg text-secondary-foreground/80 leading-relaxed">
                      La visión de INTTELGO en el 2025 es:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-base lg:text-lg text-secondary-foreground/80">
                      <li>
                        Ser la empresa con mayor cantidad de clientes sobre sus
                        competidores en la comuna 4 de Cazucá y alrededores.
                      </li>
                      <li>
                        Mantener altos los niveles en la satisfacción de sus
                        clientes y el cumplimiento de la propuesta de valor.
                      </li>
                      <li>
                        Estar catalogados con la atención más rápida y oportuna
                        ante sus clientes.
                      </li>
                      <li>
                        Ser referente como lugar ideal para trabajar en el sur
                        de Bogotá.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-3"
                  className="border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-xl lg:text-2xl font-bold text-secondary-foreground hover:no-underline py-6">
                    CONECTIVIDAD COMO PROPÓSITO SOCIAL
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance pb-6">
                    <p className="text-base lg:text-lg text-secondary-foreground/80 leading-relaxed">
                      Como parte de nuestro compromiso con el desarrollo social
                      y la inclusión digital, hemos implementado un programa de
                      responsabilidad corporativa enfocado en brindar acceso
                      gratuito a internet a comunidades vulnerables.
                      Actualmente,{" "}
                      <span className="font-bold">
                        más de 32 fundaciones y organizaciones sin ánimo de
                        lucro
                      </span>{" "}
                      se benefician de nuestro servicio de conectividad sin
                      costo, permitiéndoles fortalecer sus procesos educativos,
                      sociales y comunitarios. Esta iniciativa busca reducir la
                      brecha tecnológica en poblaciones en situación de
                      vulnerabilidad, facilitando el acceso a herramientas
                      digitales, plataformas educativas y servicios esenciales
                      en línea. Nuestro servicio donado es{" "}
                      <span className="font-bold">
                        100% fibra óptica hasta el hogar (FTTH)
                      </span>
                      , lo que garantiza una conexión de alta velocidad, estable
                      y con baja latencia, adaptada a las necesidades operativas
                      de estas entidades.
                    </p>
                    <p className="text-base lg:text-lg text-secondary-foreground/80 leading-relaxed">
                      Conectamos a quienes trabajan por un mejor futuro, porque
                      creemos que la transformación social también se construye
                      desde la tecnología.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-4"
                  className="border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-xl lg:text-2xl font-bold text-secondary-foreground hover:no-underline py-6">
                    BENEFICIOS EXCLUSIVOS PARA NUESTROS CLIENTES.
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance pb-6">
                    <p className="text-base lg:text-lg text-secondary-foreground/80 leading-relaxed">
                      En nuestra empresa, valoramos la fidelidad y el compromiso
                      de nuestros usuarios. Por eso hemos implementado un
                      programa de incentivos exclusivos, diseñado para reconocer
                      a quienes mantienen sus obligaciones al día y eligen
                      canales digitales eficientes. Nuestros clientes que
                      realizan el pago anticipado de su servicio o que utilizan
                      medios electrónicos como PSE (Pago Seguro en Línea),
                      acceden automáticamente a un sistema de recompensas que
                      incluye:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-base lg:text-lg text-secondary-foreground/80">
                      <li>
                        Participación en sorteos de viajes nacionales y
                        experiencias especiales, como parte de nuestras campañas
                        de fidelización.
                      </li>
                      <li>
                        Bonificaciones en su servicio por cumplimiento y
                        recurrencia de pago anticipado.
                      </li>
                      <li>
                        Evita filas, ahorra tiempo y accede a premios exclusivos
                        solo por pagar en línea. Con PSE, tu pago es inmediato y
                        totalmente confiable.
                      </li>
                    </ul>
                    <div className="space-y-4">
                      <CarrouselWinner
                        images={[...travelWinners2024, ...travelWinners2025]}
                        title="Sorteo Viaje Santa Marta Anual"
                        description="Conoce a nuestros ganadores de años anteriores"
                      />
                      <CarrouselWinner
                        images={tvWinners}
                        title="Sorteo TV'S por pago oportuno en PSE"
                        description="Conoce a nuestros ganadores"
                      />
                      <CarrouselWinner
                        images={lotteryWinners}
                        title="Eventos y sorteos especiales"
                        description="Conoce a nuestros ganadores de eventos y sorteos especiales"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
        <div className="w-full bg-white py-12 px-4 sm:px-6 md:px-10 lg:px-20">
          <FundationsMarquee />
        </div>
      </div>
    </>
  );
}
