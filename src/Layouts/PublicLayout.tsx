import type { FormEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Gauge, Phone } from "lucide-react";
import Lenis from "lenis";
import { LenisContext } from "@/lib/lenisContext";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageToast } from "@/lib/messageToast";
import { getApiUrl } from "@/lib/utils";
import "@/animaciones.css";
import { trackEvent } from "@/lib/analytics";
import { Dialog, DialogContent } from "@/components/ui/dialog";
interface WhatsAppLine {
  title: string;
  phone: string;
  badge: string;
}

const WELCOME_DIALOG_SESSION_KEY = "inttelgo_welcome_dialog_seen";

const PublicLayout = () => {
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadPhone, setLeadPhone] = useState("");
  const lenisRef = useRef<Lenis | null>(null);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const [welcomeDialogOpen, setWelcomeDialogOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const hasSeenWelcomeDialog = sessionStorage.getItem(WELCOME_DIALOG_SESSION_KEY);
    if (!hasSeenWelcomeDialog) {
      setWelcomeDialogOpen(false);
      sessionStorage.setItem(WELCOME_DIALOG_SESSION_KEY, "true");
    }
  }, []);
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowLeadCapture(window.scrollY >= 150);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      wheelMultiplier: 1,
      lerp: 0.1,
      syncTouch: true,
      syncTouchLerp: 0.075,
      // Cede el control del scroll a elementos con scroll nativo
      prevent: (node: Element) => {
        const tag = node.tagName;
        if (tag === "SELECT" || tag === "TEXTAREA") return true;
        if (tag === "INPUT" && (node as HTMLInputElement).type === "range") return true;
        if (node.hasAttribute("data-lenis-prevent")) return true;
        // Elementos con overflow scroll/auto que no son el body
        const { overflowY } = getComputedStyle(node);
        const isScrollable =
          (overflowY === "auto" || overflowY === "scroll") &&
          node.scrollHeight > node.clientHeight;
        return isScrollable;
      },
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, []);

  const handleLeadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!leadPhone.trim()) {
      return;
    }

    try {
      const response = await axios.post(`${getApiUrl()}/contact/call`, {
        phone: leadPhone.trim(),
      });
      if (response.status === 200) {
        MessageToast.success({
          title: "Llamada solicitada correctamente",
          description: "Te llamaremos en breve",
        });
      } else {
        MessageToast.error({
          title: "Error al realizar la llamada",
          description: "Por favor, intenta nuevamente",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLeadPhone("");
    }
  };

  const whatsappLines: WhatsAppLine[] = [
    {
      title: "Línea de ventas",
      phone: "573002698767",
      badge: "Línea ventas",
    },
    {
      title: "Línea de Soporte",
      phone: "573002698767",
      badge: "Línea soporte",
    },
  ];

  const handleWhatsAppClick = useCallback((phone: string, lineTitle: string) => {
    trackEvent("whatsapp_contact", {
      event_category: "contact",
      event_label: lineTitle,       // "Línea de ventas" o "Línea de Soporte"
      phone_number: phone,
    });
    window.open(`https://wa.me/${phone}`, "_blank");
  }, []);


  return (
    <LenisContext.Provider value={lenisInstance}>
      <div className="relative flex min-h-screen flex-col bg-white">
        <ScrollToTop />

        <Dialog open={welcomeDialogOpen} onOpenChange={setWelcomeDialogOpen}>
          <DialogContent className="overflow-hidden p-0 max-w-[92vw] sm:max-w-3xl [&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:opacity-100 border-0">
            <div className="relative">
              {/* Imagen: vertical en mobile, horizontal en desktop */}
              <picture>
                <source
                  media="(min-width: 640px)"
                  srcSet="/publicidad/banner-pollo-mundial-horizontal.webp"
                />
                <img
                  src="/publicidad/banner-pollo-mundial-vertical.webp"
                  alt="Mensaje de Inttelgo"
                  className="block h-full w-full object-cover"
                />
              </picture>

              {/* Texto superior con efecto dorado */}
              <div className="absolute left-1/2 top-[3%] w-[90%] -translate-x-1/2 text-center sm:left-auto sm:right-[3%] sm:top-[4%] sm:w-[45%] sm:translate-x-0">
                <p className="flex flex-wrap justify-center text-center text-lg font-black uppercase italic leading-tight tracking-wide sm:text-2xl">
                  {Array.from("¡Participa solo por ser nuestro cliente!").map((letter, index) => (
                    <span
                      key={`${letter}-${index}`}
                      className={letter === " " ? "w-[0.35em]" : "inline-block"}
                      style={
                        letter === " "
                          ? undefined
                          : {
                            backgroundImage:
                              "linear-gradient(180deg, #FFF8C9 0%, #FFE066 25%, #F5B800 55%, #B8860B 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            filter:
                              "drop-shadow(0 0 6px rgba(255, 215, 0, 0.75)) drop-shadow(0 0 14px rgba(255, 165, 0, 0.5))",
                          }
                      }
                    >
                      {letter === " " ? "\u00A0" : letter}
                    </span>
                  ))}
                </p>
              </div>

              {/* Bloque "Podrás ganar / 6 Meses Gratis" */}
              <div className="absolute left-1/2 bottom-[18%] w-[90%] -translate-x-1/2 sm:left-auto sm:right-[4%] sm:bottom-[9%] sm:w-[44%] sm:translate-x-0">
                <p className="text-center text-base font-black uppercase tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] sm:text-xl">
                  Podrás ganar
                </p>

                <div
                  className="mx-auto my-2 h-[3px] w-[85%] rounded-full bg-orange-500"
                  style={{
                    boxShadow:
                      '0 0 8px rgba(249, 115, 22, 0.9), 0 0 16px rgba(249, 115, 22, 0.5)',
                  }}
                />

                <div className="relative mx-auto flex w-full items-center justify-center">
                  <div
                    className="relative flex items-center justify-center rounded-full border-2 border-white/90 bg-gradient-to-b from-neutral-900 via-neutral-800 to-black px-4 py-2 sm:px-6 sm:py-3"
                    style={{
                      boxShadow:
                        '0 0 20px rgba(255, 165, 0, 0.45), inset 0 1px 0 rgba(255,255,255,0.25), 0 6px 16px rgba(0,0,0,0.55)',
                    }}
                  >
                    <p className="flex flex-wrap justify-center text-center text-lg font-black uppercase italic leading-tight tracking-wide sm:text-2xl">
                      {Array.from("6 meses gratis").map((letter, index) => (
                        <span
                          key={`${letter}-${index}`}
                          className={letter === " " ? "w-[0.35em]" : "inline-block"}
                          style={
                            letter === " "
                              ? undefined
                              : {
                                backgroundImage:
                                  "linear-gradient(180deg, #FFF8C9 0%, #FFE066 25%, #F5B800 55%, #B8860B 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                                filter:
                                  "drop-shadow(0 0 6px rgba(255, 215, 0, 0.75)) drop-shadow(0 0 14px rgba(255, 165, 0, 0.5))",
                              }
                          }
                        >
                          {letter === " " ? "\u00A0" : letter}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botón Ver más — centrado abajo en mobile, posicionado en desktop */}
              <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 sm:left-[35%]">
                <Button
                  onClick={() => {
                    setWelcomeDialogOpen(false);
                    navigate("/mundial-2026");
                  }}
                  variant={"orange"}
                  className="rounded-full group relative overflow-hidden px-8 py-2 text-xs font-black uppercase transition-all hover:scale-105 sm:px-10 sm:text-sm"
                  style={{
                    boxShadow:
                      '0 0 18px rgba(255, 140, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.35), 0 4px 12px rgba(0,0,0,0.5)',
                  }}
                >
                  <span className="relative z-10">Ver más</span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <div
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${showLeadCapture
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
            }`}
        >
          <div className="w-full">
            <div className="flex flex-col gap-4 bg-black p-4 text-primary-foreground shadow-lg md:flex-row md:items-center md:justify-center">
              <p className="text-sm font-medium md:text-base text-center md:text-left">
                <span className="font-bold text-[#FF9900]">
                  ¿En casa necesitas Internet Fibra?
                </span>{" "}
                ¡Déjanos tus datos y te llamaremos en breve!
              </p>
              <form
                onSubmit={handleLeadSubmit}
                className="flex w-full md:w-1/2 lg:w-1/3 items-center overflow-hidden rounded-2xl bg-white shadow-inner focus-within:ring-2 focus-within:ring-[#EC5406]/60"
              >
                <input
                  type="tel"
                  inputMode="tel"
                  name="lead-phone"
                  placeholder="Ingresa tu número de celular"
                  className="h-10 flex-1 border-none px-5 text-sm text-slate-900 outline-none md:text-base"
                  value={leadPhone}
                  onChange={(event) => setLeadPhone(event.target.value)}
                />
                <Button
                  type="submit"
                  variant="orange"
                  className="h-12 px-5 rounded-l-none"
                  aria-label="Enviar formulario"
                >
                  <ArrowRight className="size-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />

        {/* Botón flotante de WhatsApp con Popover */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="orange"
                className="w-15 h-15 rounded-full p-0"
                aria-label="Mide tu velocidad"
                style={{
                  animation: "orangePulse 2s ease-in-out infinite",
                }}
              >
                <Link to="/planes/internet/speedtest">
                  <Gauge className="size-8" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xl font-bold">Mide tu velocidad</p>
            </TooltipContent>
          </Tooltip>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                className="relative overflow-hidden w-15 h-15 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-2xl hover:shadow-green-500/50 hover:scale-110 transition-all duration-300"
                aria-label="Contactar por WhatsApp"
                style={{
                  animation: "pulseGreen 2s ease-in-out infinite",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-8 relative z-10"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>

                {/* Efecto de brillo que pasa por el botón */}
                <span
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{
                    animation: "shine 3s ease-in-out infinite",
                  }}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="rounded-xl p-4 w-82">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Lineas de atención</h3>
                {whatsappLines.map((line, index) => (
                  <Button
                    key={index}
                    onClick={() => handleWhatsAppClick(line.phone, line.title)}
                    className="w-full text-white hover:from-green-500 hover:to-green-600 bg-gradient-to-r from-[#FF9900] to-[#EC5406] relative"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {line.title}
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-white text-[#EC5406] hover:bg-white"
                    >
                      {line.badge}
                    </Badge>
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </LenisContext.Provider>
  );
};

export default PublicLayout;