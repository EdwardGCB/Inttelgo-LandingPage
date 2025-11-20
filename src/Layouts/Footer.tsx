import AnimatedLines from "@/components/Canvas/AnimatedLines";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

interface SocialNetwork {
  descripcion: string;
  imagen: string;
  link: string;
  classname: string;
  iconProps: string;
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
  {
    descripcion: "LinkedIn",
    imagen: "/social/linkedin.svg",
    link: "https://www.linkedin.com/company/inttel-go/",
    classname: "bg-blue-500",
    iconProps: "p-0 brightness-0 invert",
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
];

const legalItems: MenuItem[] = [
  { titulo: "Trámite de PQR's", ruta: "/pqrs" },
  { titulo: "Manual de Usuario", ruta: "/manual" },
  { titulo: "Dignidad Infantil", ruta: "/dignidad-infantil" },
  { titulo: "Política de Privacidad", ruta: "/privacidad" },
  { titulo: "Términos y Condiciones", ruta: "/terminos" },
  { titulo: "Seguridad", ruta: "/seguridad" },
  { titulo: "Regulación sector TIC", ruta: "/regulacion-tic" },
];

const contactInfo: ContactInfo[] = [
  {
    icono: <Phone className="w-4 h-4" />,
    texto: "+57 300-269-8767",
    link: "tel:573002698767",
  },
  {
    icono: <Mail className="w-4 h-4" />,
    texto: "info@inttelgo.com",
    link: "mailto:info@inttelgo.com",
  },
];

export default function Footer() {
  return (
    <footer className="bg-black">
      <div className="container mx-auto px-6 py-8 space-y-10">
        <AnimatedLines />
        <h2 className="text-2xl font-bold text-primary-foreground">
          CONOCE COMO PUEDES REALIZAR EL PAGO DE TU FACTURA
        </h2>
        <div className="w-full aspect-video rounded-lg overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/QLpGbtd_xtE"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
        <div className="flex justify-center">
          <a href="https://combopay.co/invoices/inttel-go-sas" target="_blank">
            <img
              src="/pse.svg"
              alt="pse"
              className="w-90 object-cover hover:scale-105 transition-transform cursor-pointer"
            />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mx-5 lg:mx-20">
          <div className="flex flex-col space-y-2">
            <h3 className=" text-xl font-bold text-primary-foreground">
              Somos
            </h3>
            <h1 className=" text-base text-primary-foreground">
              Inttelgo GO llega a tu hogar para ofrecerte un excelente servicio
              de entretenimiento y conectividad confiable y de calidad
            </h1>
            <div className="flex justify-start items-start gap-3">
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
                      "size-15 p-0 hover:shadow-orange-500/50 hover:scale-105 hover:bg-gradient-to-b hover:from-[#FF9900] hover:to-[#EC5406] border-none  rounded-full not-last:",
                      red.classname
                    )}
                  >
                    <CardContent className=" p-3 flex justify-center items-center">
                      <img
                        src={red.imagen}
                        alt={red.descripcion}
                        className={cn("size-full", red.iconProps)}
                      />
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className=" text-xl font-bold text-primary-foreground">Menu</h3>
            {menuItems.map((item, index) =>
              item.titulo === "PSE" ? (
                <a
                  key={index}
                  href="https://combopay.co/invoices/inttel-go-sas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-primary-foreground hover:underline"
                >
                  {item.titulo}
                </a>
              ) : (
                <Link
                  key={index}
                  to={item.ruta}
                  className="text-base text-primary-foreground hover:underline"
                >
                  {item.titulo}
                </Link>
              )
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className=" text-xl font-bold text-primary-foreground">
              Linea de ventas
            </h3>
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                className="text-base text-primary-foreground flex items-center gap-2 hover:underline"
              >
                {info.icono}
                {info.texto}
              </a>
            ))}
            <span className="text-base text-primary-foreground">
              Bogota D.C/Soacha - Colombia
            </span>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className=" text-xl font-bold text-primary-foreground">
              LEGAL Y REGULATORIO
            </h3>
            {legalItems.map((item, index) => (
              <Link
                key={index}
                to={item.ruta}
                className="text-base text-primary-foreground hover:underline"
              >
                {item.titulo}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
