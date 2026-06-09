import { cn } from "@/lib/utils";
import { Mail, Phone, Wifi } from "lucide-react";
import { Link } from "react-router-dom";

interface SocialNetwork {
  descripcion: string;
  link: string;
}

interface MenuItem {
  titulo: string;
  ruta: string;
}

interface ContactInfo {
  icono: React.ReactNode;
  texto: string;
  link: string;
}

const redesSociales: SocialNetwork[] = [
  {
    descripcion: "TikTok",
    link: "https://www.tiktok.com/@inttelgo?is_from_webapp=1&sender_device=pc",
  },
  {
    descripcion: "Instagram",
    link: "https://www.instagram.com/inttelgo/",
  },
  {
    descripcion: "LinkedIn",
    link: "https://www.linkedin.com/company/inttel-go/",
  },
];

const menuItems: MenuItem[] = [
  { titulo: "Inicio", ruta: "/" },
  { titulo: "Planes Internet", ruta: "/planes/internet" },
  { titulo: "Planes Televisión", ruta: "/planes/television" },
  { titulo: "Planes Telefonía", ruta: "/planes/telefonia" },
  { titulo: "Sobre Nosotros", ruta: "/sobre-nosotros" },
  { titulo: "Centros de Experiencia", ruta: "/centros-de-experiencia" },
  { titulo: "Contacto", ruta: "/contacto" },
  { titulo: "Beca", ruta: "/beca" },
  { titulo: "PSE", ruta: "/pse" },
  { titulo: "Prueba tu velocidad", ruta: "/planes/internet/speedtest" },
];

const legalItems: MenuItem[] = [
  { titulo: "Trámite de PQR's", ruta: "/pqrs" },
  { titulo: "Manual de Usuario", ruta: "/manual" },
  { titulo: "Dignidad Infantil", ruta: "/dignidad-infantil" },
  { titulo: "Política de Privacidad", ruta: "/privacidad" },
  { titulo: "Términos y Condiciones", ruta: "/terminos" },
  { titulo: "Seguridad", ruta: "/seguridad" },
  { titulo: "Regulación sector TIC", ruta: "/regulacion-tic" },
  { titulo: "Terminos de la Beca 2026", ruta: "/beca/terminos" },
];

const contactInfo: ContactInfo[] = [
  {
    icono: <Phone className="w-3.5 h-3.5" />,
    texto: "+57 601-794-0127",
    link: "tel:576017940127",
  },
  {
    icono: <Mail className="w-3.5 h-3.5" />,
    texto: "info@inttelgo.com",
    link: "mailto:info@inttelgo.com",
  },
];

const linkClass =
  "relative w-fit text-[13px] text-zinc-200 no-underline transition-colors duration-200 hover:text-orange-600 " +
  "after:content-[''] after:absolute after:-bottom-px after:left-0 after:h-px after:w-0 after:bg-zinc-900 " +
  "after:transition-[width] after:duration-300 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:after:w-full";

const colTitleClass =
  "text-[10px] font-bold tracking-[.14em] uppercase text-white mb-4";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-200">
      {/* ── Hero CTA ── */}
      <div className="px-6 md:px-12 lg:px-16 pt-16 pb-12 border-b border-zinc-200">
        <div
          className={cn(
            "group relative inline-block no-underline",
            "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-none",
            "text-zinc-200 transition-colors duration-300 hover:text-[#EC5406]",
            "after:content-[''] after:absolute after:bottom-0 after:left-0",
            "after:h-[3px] after:w-0 after:bg-[#EC5406]",
            "after:transition-[width] after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)]",
            "hover:after:w-full"
          )}
        >
          Internet 100% Fibra Óptica
          <Wifi className="inline-block ml-3 size-5 sm:size-10 lg:size-15 xl:size-15 align-middle transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-1.5" />
        </div>
      </div>

      {/* ── 4-column grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6 md:px-12 lg:px-16 py-10 border-b border-zinc-200">
        {/* Somos */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
          <p className={colTitleClass}>Somos</p>
          <p className="text-[13px] text-zinc-200 leading-relaxed">
            Inttelgo GO llega a tu hogar para ofrecerte un excelente servicio de
            entretenimiento y conectividad confiable y de calidad.
          </p>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            {redesSociales.map((red) => (
              <a
                key={red.descripcion}
                href={red.link}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "text-[11px] font-semibold tracking-wide text-orange-600 no-underline",
                  "border border-orange-600 rounded-full px-3 py-1",
                  "transition-all duration-200 hover:bg-zinc-900 hover:text-zinc-50 hover:border-zinc-900"
                )}
              >
                {red.descripcion}
              </a>
            ))}
          </div>
        </div>

        {/* Menú */}
        <div className="flex flex-col gap-1.5">
          <p className={colTitleClass}>Menú</p>
          {menuItems.map((item) =>
            item.titulo === "PSE" ? (
              <a
                key={item.titulo}
                href="https://combopay.co/invoices/inttel-go-sas"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {item.titulo}
              </a>
            ) : (
              <Link key={item.titulo} to={item.ruta} className={linkClass}>
                {item.titulo}
              </Link>
            )
          )}
        </div>

        {/* Línea de ventas */}
        <div className="flex flex-col gap-1.5">
          <p className={colTitleClass}>Línea de ventas</p>
          {contactInfo.map((info) => (
            <a
              key={info.link}
              href={info.link}
              className={cn(
                linkClass,
                "flex items-center gap-1.5 w-auto"
              )}
            >
              {info.icono}
              {info.texto}
            </a>
          ))}
          <p className="text-[13px] text-white mt-1">
            Bogotá D.C. / Soacha — Colombia
          </p>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-1.5">
          <p className={colTitleClass}>Legal y regulatorio</p>
          {legalItems.map((item) => (
            <Link key={item.titulo} to={item.ruta} className={linkClass}>
              {item.titulo}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 md:px-12 lg:px-16 py-5">
        <span className="flex items-center gap-2 text-[12px] text-white">
          Bogotá D.C., Colombia
        </span>
        <span className="text-[12px] text-white">
          © {new Date().getFullYear()} Inttelgo — Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
}