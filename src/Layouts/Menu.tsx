import {
  CircleCheckIcon,
  CircleHelpIcon,
  CircleIcon,
  Menu as MenuIcon,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

// Tipos para el menú
interface MenuItem {
  title: string;
  href: string;
  description?: string;
  featured?: boolean;
  icon?: string;
}

interface MenuSection {
  title: string;
  type: "dropdown" | "link";
  href?: string;
  items?: MenuItem[];
}

// Componente para renderizar iconos
const IconRenderer = ({ iconName }: { iconName: string }) => {
  const iconMap = {
    CircleHelpIcon: CircleHelpIcon,
    CircleIcon: CircleIcon,
    CircleCheckIcon: CircleCheckIcon,
  };

  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
};

// Datos del menú organizados por secciones
const menuData: Record<string, MenuSection> = {
  home: {
    title: "Inicio",
    type: "link",
    href: "/",
  },
  components: {
    title: "Planes",
    type: "dropdown",
    items: [
      {
        title: "Internet",
        href: "/planes/internet",
        description:
          "Planes de internet para tu hogar y negocios 100% fibra optica.",
      },
      {
        title: "Television",
        href: "/planes/television",
        description:
          "Planes de television para tu hogar y negocios 100% fibra optica.",
      },
      {
        title: "Telefonia",
        href: "/planes/telefonia",
        description:
          "Planes de telefonia para tu hogar y negocios 100% fibra optica.",
      },
    ],
  },
  docs: {
    title: "Sobre nosotros",
    type: "link",
    href: "/sobre-nosotros",
  },
  list: {
    title: "Centros de experiencia",
    type: "link",
    href: "/centros-de-experiencia",
  },
  simple: {
    title: "Contacto",
    type: "link",
    href: "/contacto",
  },
  withIcon: {
    title: "BECA 2025",
    type: "link",
    href: "/beca",
  },
};

export default function Menu({
  className,
  textColor = "text-white hover:text-white/80",
  detailsColor = "invert brightness-0",
  lineColor = "bg-white/50",
  logo = "logo-negro.svg",
}: {
  className?: string;
  textColor?: string;
  detailsColor?: string;
  lineColor?: string;
  logo?: string;
}) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1280);
    };

    // Verificar al cargar
    checkIsMobile();

    // Escuchar cambios de tamaño
    window.addEventListener("resize", checkIsMobile);

    // Limpiar listener
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return (
    <header
      className={cn(
        "flex justify-between items-center px-4 md:px-8 py-4",
        className
      )}
    >
      {/* Imagen izquierda */}
      <div className="flex-shrink-0">
        <Link to="/">
          <img
            src={`/${logo}`}
            alt="Logo izquierdo"
            className={cn("w-32 filter drop-shadow-lg", detailsColor)}
          />
        </Link>
      </div>

      {!isMobile ? (
        <>
          <div className="lg:flex flex-1 justify-center relative z-50">
            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                {Object.entries(menuData)
                  .filter(([key]) => key !== "pse")
                  .map(([key, section], index) => (
                    <div key={key} className="contents">
                      <NavigationMenuItem>
                        {section.type === "link" ? (
                          <NavigationMenuLink
                            asChild
                            className={
                              navigationMenuTriggerStyle() +
                              " bg-transparent text-sm font-medium hover:bg-gradient-to-b hover:from-transparent hover:to-white/60 " +
                              textColor
                            }
                          >
                            <Link to={section.href || "#"}>
                              {section.title}
                            </Link>
                          </NavigationMenuLink>
                        ) : (
                          <>
                            <NavigationMenuTrigger
                              className={cn(
                                "bg-transparent text-sm font-medium hover:bg-gradient-to-b hover:from-transparent hover:to-white/60",
                                textColor
                              )}
                            >
                              {section.title}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="backdrop-blur-2xl">
                              <ul
                                className={`grid gap-2 ${
                                  key === "components"
                                    ? "w-[200px] md:w-[300px] lg:w-[400px]"
                                    : "w-[200px] gap-4"
                                }`}
                              >
                                {section.items?.map(
                                  (item: MenuItem, itemIndex: number) => (
                                    <li key={item.href || itemIndex}>
                                      <NavigationMenuLink
                                        className={cn(
                                          "hover:bg-gradient-to-b hover:from-transparent hover:to-white/60 text-primary-foreground ",
                                          textColor
                                        )}
                                        asChild
                                      >
                                        <Link
                                          to={item.href || "#"}
                                          className={
                                            item.featured
                                              ? "from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                                              : item.icon
                                              ? "flex-row items-center gap-2 rounded-md p-2 transition-all duration-300"
                                              : "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300"
                                          }
                                        >
                                          {item.icon && (
                                            <IconRenderer
                                              iconName={item.icon}
                                            />
                                          )}
                                          <div className="text-lg font-medium">
                                            {item.title}
                                          </div>
                                          {item.description && (
                                            <div className="text-lg leading-snug">
                                              {item.description}
                                            </div>
                                          )}
                                        </Link>
                                      </NavigationMenuLink>
                                    </li>
                                  )
                                )}
                              </ul>
                            </NavigationMenuContent>
                          </>
                        )}
                      </NavigationMenuItem>
                      {index <
                        Object.entries(menuData).filter(
                          ([key]) => key !== "pse"
                        ).length -
                          1 && (
                        <div className={cn("w-px h-6 mx-2", lineColor)} />
                      )}
                    </div>
                  ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          {/* Imagen derecha */}
          <div className="flex-shrink-0">
            <a
              href="https://combopay.co/invoices/inttel-go-sas"
              target="_blank"
            >
              <img
                src="/pse.svg"
                alt="PSE"
                className={cn(
                  "h-15 hover:scale-105 transition-transform cursor-pointer",
                  detailsColor
                )}
              />
            </a>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={cn(textColor)}>
                <MenuIcon className="h-10 w-10" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className={cn(
                "overflow-y-auto bg-gradient-to-b from-orange-50 to-orange-100 border-l-2 border-orange-200",
                isMobile ? "w-[300px]" : "w-[380px] sm:w-[420px]"
              )}
            >
              <nav className="flex flex-col gap-6 mt-8">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full space-y-2"
                >
                  {Object.entries(menuData).map(([key, section]) =>
                    section.type === "link" ? (
                      <Link
                        key={key}
                        to={section.href || "#"}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center py-4 px-4 font-semibold hover:bg-orange-200 hover:text-orange-800 rounded-lg transition-all duration-300 border border-transparent hover:border-orange-300 hover:shadow-md group",
                          isMobile ? "text-base" : "text-lg"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:bg-orange-600 transition-colors"></div>
                          <span>{section.title}</span>
                        </div>
                      </Link>
                    ) : (
                      <AccordionItem
                        key={key}
                        value={key}
                        className="border border-orange-200 rounded-lg bg-white/50 backdrop-blur-sm"
                      >
                        <AccordionTrigger
                          className={cn(
                            "font-semibold py-4 px-4 hover:no-underline hover:bg-orange-100 rounded-lg transition-all duration-300",
                            isMobile ? "text-base" : "text-lg"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>{section.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="flex flex-col gap-2 pl-2">
                            {section.items?.map(
                              (item: MenuItem, itemIndex: number) => (
                                <Link
                                  key={item.href || itemIndex}
                                  to={item.href || "#"}
                                  onClick={() => setOpen(false)}
                                  className="flex flex-col gap-2 py-3 px-4 hover:bg-orange-100 hover:text-orange-800 rounded-lg transition-all duration-300 border border-transparent hover:border-orange-200 group"
                                >
                                  <div className="flex items-center gap-3">
                                    {item.icon && (
                                      <div className="text-orange-600 group-hover:text-orange-700">
                                        <IconRenderer iconName={item.icon} />
                                      </div>
                                    )}
                                    <span
                                      className={cn(
                                        "font-medium",
                                        isMobile ? "text-lg" : "text-base"
                                      )}
                                    >
                                      {item.title}
                                    </span>
                                  </div>
                                  {item.description && (
                                    <span
                                      className={cn(
                                        "text-orange-600 group-hover:text-orange-700",
                                        "text-sm"
                                      )}
                                    >
                                      {item.description}
                                    </span>
                                  )}
                                </Link>
                              )
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  )}
                </Accordion>

                {/* Enlace PSE en el menú móvil */}
                <div className="flex justify-center w-full">
                  <Button className="w-[90%] backdrop-blur-md  bg-orange-500 hover:bg-orange-900 ">
                    <Link to="/pse" onClick={() => setOpen(false)}>
                      <div className="flex items-center gap-3">
                        <span>Pagar con PSE</span>
                      </div>
                    </Link>
                  </Button>
                </div>

                {/* Footer del menú */}
                <div className="pt-4 border-t border-orange-200 text-center">
                  <div className="text-xs text-orange-500">
                    © 2024 Inttelgo - Todos los derechos reservados
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </header>
  );
}
