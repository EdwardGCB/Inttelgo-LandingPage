import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Gauge, Phone } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
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
import "../animaciones.css";
interface WhatsAppLine {
  title: string;
  phone: string;
  badge: string;
}

const PublicLayout = () => {
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadPhone, setLeadPhone] = useState("");

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

  const handleWhatsAppClick = useCallback((phone: string) => {
    window.open(`https://wa.me/${phone}`, "_blank");
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <ScrollToTop />
      <div className="sticky top-0 z-50 md:border-b bg-white/95 shadow-sm backdrop-blur-md">
        <div
          className={`block transition-all duration-500 ${showLeadCapture
            ? "max-h-33 md:max-h-20 opacity-100"
            : "max-h-0 opacity-0"
            } overflow-hidden`}
        >
          <div className="w-full pb-4">
            <div className="flex flex-col gap-4  bg-black p-4 text-primary-foreground shadow-lg md:flex-row md:items-center md:justify-center">
              <p className="text-sm font-medium md:text-base text-center md:text-left ">
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
                  onClick={() => handleWhatsAppClick(line.phone)}
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
  );
};

export default PublicLayout;