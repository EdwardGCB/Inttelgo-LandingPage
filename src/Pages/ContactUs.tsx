import AnimatedLines from "@/components/Canvas/AnimatedLines";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import Menu from "@/Layouts/Menu";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const phoneNumber = "3002698767";
const emailAddress = "info@inttelgo.com";

const salesLine = {
  title: "Ventas",
  number: "300 269 8767",
  note: "Canal comercial WhatsApp",
};

const supportLine = {
  title: "Soporte",
  number: "3022139106",
  note: "Soporte técnico 24/7",
};

interface SocialNetwork {
  descripcion: string;
  imagen: string;
  link: string;
  classname: string;
  iconProps: string;
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

const contactSchema = z.object({
  name: z.string().min(2, "Ingresa tu nombre"),
  email: z.string().trim().email("Ingresa un correo electrónico válido"),
  phone: z.string().trim().min(7, "Ingresa un número de teléfono válido"),
  subject: z.string().min(3, "Ingresa un asunto"),
  message: z.string().min(10, "Cuéntanos tu mensaje"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

function TypewriterText({
  text,
  speed = 120,
}: {
  text: string;
  speed?: number;
}) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed(text.charAt(0).toUpperCase());
    let index = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        setDisplayed(text);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className="inline-flex items-center gap-2">
      <span>{displayed}</span>
      <span className="ml-1 inline-block h-10 lg:h-30 w-[2px] animate-pulse bg-black align-middle" />
    </span>
  );
}

function RollingDigit({ digit, delay }: { digit: string; delay: number }) {
  const [current, setCurrent] = useState<number>(() =>
    Math.floor(Math.random() * 10)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % 10);
    }, 75);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setCurrent(Number(digit));
    }, delay);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [digit, delay]);

  return (
    <div className="flex h-12 w-10 items-center justify-center rounded-lg bg-black text-2xl font-bold text-[#FFF7D6] shadow-lg transition-transform duration-500 sm:h-14 sm:w-12 sm:text-3xl md:h-16 md:w-14 md:text-4xl">
      {current}
    </div>
  );
}

export default function ContactUs() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    mode: "onSubmit",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [showSupportCard, setShowSupportCard] = useState(false);

  const rollingDigits = useMemo(
    () =>
      phoneNumber.split("").map((digit, index) => ({
        digit,
        delay: 600 + index * 200,
        key: `${digit}-${index}`,
      })),
    []
  );

  const onSubmit = async (formValues: ContactFormValues) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/contact`,
        formValues
      );
      if (response.status === 200) {
        setIsSubmitting(true);
        setFormStatus("success");
        form.reset();
      } else {
        setFormStatus("error");
      }
    } catch (error) {
      console.error(error);
      setFormStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Menu
        className={"text-black hover:text-black/80"}
        textColor="text-black hover:text-black/80"
        detailsColor=""
        lineColor="bg-black/50"
      />
      <div className="w-full bg-white py-12 px-4 sm:px-6 md:px-10 lg:px-20 space-y-12">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.8fr_1fr] lg:items-center">
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="text-4xl font-bold uppercase tracking-wider text-black sm:text-6xl md:text-7xl lg:text-8xl">
                <TypewriterText text="CONTÁCTANOS" speed={100} />
              </div>
            </div>
            <div className="space-y-6">
              <Separator className="mx-auto h-[2px] w-32 bg-black sm:w-48 md:w-56 lg:mx-0" />
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:justify-start">
                {rollingDigits.map(({ digit, delay, key }) => (
                  <RollingDigit key={key} digit={digit} delay={delay} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-6 lg:items-end">
            <div className="relative w-[90%] h-70 md:h-80 md:w-60 [perspective:1600px] sm:h-84 sm:w-68">
              <div
                className={cn(
                  "absolute inset-0 transition-transform duration-700 [transform-style:preserve-3d]",
                  showSupportCard ? "[transform:rotateY(180deg)]" : ""
                )}
              >
                <div className="absolute inset-0 -rotate-6 rounded-[2.5rem] bg-gradient-to-br from-[#FF9900] via-[#EC5406] to-[#D13A00] shadow-[0_18px_32px_rgba(0,0,0,0.35)]" />
                <div className="absolute inset-2 rounded-[2.25rem] bg-white/90" />

                {/* Frente */}
                <div className="absolute inset-0 flex flex-col justify-between rounded-[2.5rem] bg-black/90 p-6 text-white [backface-visibility:hidden]">
                  <div className="space-y-3">
                    <div className="flex justify-between text-white/80">
                      <span>Línea</span>
                      <span>Inttelgo</span>
                    </div>
                    <span className="block text-xl font-bold uppercase text-white/70">
                      {salesLine.title}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-center gap-3">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/40 bg-black/40 text-3xl font-extrabold sm:h-28 sm:w-28 sm:text-4xl">
                      {salesLine.number.split(" ").map((chunk, idx) => (
                        <span key={`${chunk}-${idx}`} className="tracking-wide">
                          {idx > 0 ? ` ${chunk}` : chunk}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center space-y-2">
                    <div className="space-y-1 text-center text-white/85">
                      <p>{salesLine.note}</p>
                    </div>
                    <Button
                      asChild
                      variant="orange"
                      size="sm"
                      className="w-full rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-md hover:shadow-lg"
                    >
                      <a
                        href={`https://wa.me/57${salesLine.number.replace(
                          /\s/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Enviar mensaje
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Reverso */}
                <div className="absolute inset-0 flex flex-col justify-between rounded-[2.5rem] bg-gradient-to-br from-[#FF9900] via-[#EC5406] to-[#D13A00] p-6 text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <div className="space-y-3">
                    <div className="flex justify-between text-white/80">
                      <span>Línea</span>
                      <span>Inttelgo</span>
                    </div>
                    <span className="block text-xl font-bold uppercase text-white/80">
                      {supportLine.title}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-center gap-3">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/50 bg-white/10 text-3xl font-extrabold sm:h-28 sm:w-28 sm:text-4xl">
                      {supportLine.number.split(" ").map((chunk, idx) => (
                        <span key={`${chunk}-${idx}`} className="tracking-wide">
                          {idx > 0 ? ` ${chunk}` : chunk}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center space-y-2">
                    <div className="space-y-1 text-center text-white/85">
                      <p>{supportLine.note}</p>
                    </div>
                    <Button
                      asChild
                      variant="secondary"
                      size="sm"
                      className="w-full rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide shadow-md hover:shadow-lg"
                    >
                      <a
                        href={`https://wa.me/57${supportLine.number.replace(
                          /\s/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Enviar mensaje
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="orange"
              className="w-full rounded-full px-8 py-4 text-base font-semibold uppercase tracking-wide text-white shadow-lg hover:shadow-xl sm:w-auto"
              onClick={() => setShowSupportCard((prev) => !prev)}
            >
              Girar
            </Button>
          </div>
        </div>
        <Suspense fallback={<LoadingSpinner size="md" />}>
          <AnimatedLines className="ml-3 lg:ml-25" />
        </Suspense>
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-12">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center rounded-lg bg-black px-6 py-2 text-lg font-bold uppercase tracking-[0.3em] text-[#FFF7D6]">
              Correo
            </span>
            <div className="grid gap-6 md:grid-cols-[minmax(0,_auto)_1fr] md:items-center">
              <div className="text-3xl font-semibold text-black transition-colors duration-200 sm:text-4xl md:text-5xl">
                <span className="transition-colors duration-200 hover:text-[#EC5406]">
                  {emailAddress}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <span className="inline-flex w-fit items-center rounded-lg bg-black px-6 py-2 text-lg font-bold uppercase tracking-[0.3em] text-[#FFF7D6]">
              Nuestras redes
            </span>
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
          </div>
        </section>

        <div className="relative">
          <Card className="absolute -top-10 lg:-top-20 right-10 p-0 w-20 h-20 sm:w-25 sm:h-25 md:w-30 md:h-30 lg:w-40 lg:h-40 rounded-full bg-gradient-to-b from-[#FF9900] to-[#EC5406] border-none">
            <CardContent className="px-0 p-3 lg:p-5 flex justify-center items-center">
              <img
                src="/mano-inttelgo-50px.svg"
                alt="Inttelgo huella"
                className="h-full w-full brightness-0 invert"
              />
            </CardContent>
          </Card>
          <Card className="bg-black px-6 py-10 text-[#FFF7D6] shadow-xl sm:px-8 md:px-12">
            <CardHeader>
              <CardTitle>
                <h3 className="text-3xl font-bold md:text-4xl">
                  Nosotros te llamamos
                </h3>
              </CardTitle>
              <CardDescription>
                <p className="text-sm text-white/70 md:text-base">
                  Déjanos tus datos y nos comunicaremos contigo lo más pronto
                  posible.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative flex flex-col gap-8">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid gap-4 md:grid-cols-2"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">
                            Correo electrónico
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Correo electrónico"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Teléfono</FormLabel>
                          <FormControl>
                            <Input
                              inputMode="tel"
                              placeholder="Teléfono"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Asunto</FormLabel>
                          <FormControl>
                            <Input placeholder="Asunto" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="sr-only">Mensaje</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Mensaje" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="md:col-span-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      {formStatus === "success" && (
                        <span className="text-sm font-medium text-[#FFB347]">
                          ¡Hemos recibido tu mensaje! Te contactaremos pronto.
                        </span>
                      )}
                      {formStatus === "error" && (
                        <span className="text-sm font-medium text-red-400">
                          Ocurrió un error al enviar tu mensaje. Inténtalo de
                          nuevo.
                        </span>
                      )}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        variant={"orange"}
                        className="text-white font-bold"
                      >
                        {isSubmitting ? "Enviando..." : "Enviar"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
