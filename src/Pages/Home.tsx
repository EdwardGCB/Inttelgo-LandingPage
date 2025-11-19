import { lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CollaboratorsMarquee } from "@/components/blocks/CollaboratorsMarquee";

// Lazy loading de componentes pesados
const AnimatedLines = lazy(() => import("@/components/Canvas/AnimatedLines"));
const CarouselChannels = lazy(() => import("@/components/carousels/Chanels"));
const BannerHome = lazy(() => import("@/components/carousels/PrincipalInfo"));

interface CardInfo {
  title: string;
  description: string;
  path: string;
  imagePath: string;
}

const cardsInfo: CardInfo[] = [
  {
    title: "Internet",
    description:
      "El mayor rendimiento y estabilidad la encuentras con nuestros planes 100% fibra optica",
    path: "/planes/internet",
    imagePath: "/cards/wifi.svg",
  },
  {
    title: "Internet + TV",
    description:
      "El mayor rendimiento y estabilidad la encuentras con nuestros planes 100% fibra optica",
    path: "/planes/television",
    imagePath: "/cards/tv.svg",
  },
  {
    title: "Internet + TV + Tel",
    description:
      "El mayor rendimiento y estabilidad la encuentras con nuestros planes 100% fibra optica",
    path: "/planes/telefonia",
    imagePath: "/cards/phone.svg",
  },
];

function HomePage() {
  return (
    <div className="w-full overflow-x-hidden">
      <div className="bg-black flex flex-col items-center justify-center pb-10 mb-10">
        <Suspense fallback={<LoadingSpinner fullScreen size="lg" />}>
          <BannerHome />
        </Suspense>
        <h2 className="text-5xl text-primary-foreground text-center px-4">
          La mejor parrilla de{" "}
          <span className="font-extrabold">canales de Bogotá y Soacha</span>
        </h2>
        <div className="w-full max-w-full overflow-hidden">
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <CarouselChannels />
          </Suspense>
        </div>
      </div>
      <div className=" mx-10 sm:mx-4 md:mx-10 lg:mx-20 xl:mx-40 space-y-10 mb-20">
        <Suspense fallback={<LoadingSpinner size="md" />}>
          <AnimatedLines />
        </Suspense>
        <div className="text-secondary-foreground">
          <h3 className="text-4xl font-bold ">
            ¡Entregamos un servicio de calidad!
          </h3>
          <p className="">
            Disfruta de nuestro servicio de interner 100% de fibra optica,
            telefonia y television; con lo ultimo en tecnologia que te conecta
            con el mundo.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cardsInfo.map((card, index) => (
            <div
              key={card.title}
              className="flex flex-col items-center justify-center group cursor-pointer"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <Card className=" sm:w-full lg:w-[90%] bg-black border-white/20 hover:border-transparent transition-all duration-600 ease-in-out hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 hover:bg-gradient-to-b hover:from-[#FF9900] hover:to-[#EC5406]">
                <CardHeader className="text-center flex flex-col items-center justify-center">
                  <div className="w-24 h-24 mb-4 transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:rotate-6">
                    <img
                      src={card.imagePath}
                      alt={card.title}
                      className="w-full h-full object-contain brightness-0 invert"
                      loading="lazy"
                      decoding="async"
                      width={96}
                      height={96}
                    />
                  </div>
                  <CardTitle className="text-2xl font-bold text-primary-foreground transition-all duration-300">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-primary-foreground text-center transition-all duration-300">
                    {card.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline">
                    <Link to={card.path}>
                      <span className="text-lg font-bold">Saber más</span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-4xl font-bold text-secondary-foreground">
            ¡INTERNET ILIMITADO!
          </h3>
          <p className="text-secondary-foreground">
            Disfruta de internet 100% fibra optica, la tecnologia mas avanzada
            para mantenerte siempre conectado.
            <br />
            Trabaja, navega, juega y mira streaming con minima latencia y la
            mejor calidad. Ademas, accede a la mejor
            <br />
            seccion de canales para disfrutar en casa
          </p>
        </div>
        <div className="flex justify-center items-center">
          <CollaboratorsMarquee />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
