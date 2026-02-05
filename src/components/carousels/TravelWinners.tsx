import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRef } from "react";

export default function CarrouselWinner({
  images,
  title,
  description,
}: {
  images: string[];
  title: string;
  description: string;
}) {
  const plugin = useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
      jump: false,
    })
  );

  return (
    <Card className="w-full border rounded-xl overflow-hidden bg-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl md:text-2xl font-semibold text-foreground">
          {title}
        </CardTitle>
        <CardDescription className="text-base">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Carousel
          className="w-full"
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
            dragFree: false,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {images.map((image: string, index: number) => (
              <CarouselItem
                key={index}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:ring-2 hover:ring-primary/20">
                  <img
                    src={image}
                    alt={`Ganador del sorteo ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </CardContent>
    </Card>
  );
}
