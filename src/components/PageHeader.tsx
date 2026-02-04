// src/components/PageHeader.tsx (versión mejorada)
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  // Opción 1: Dos logos con separador
  logoLeft?: string | ReactNode;
  logoRight?: string | ReactNode;
  logoLeftAlt?: string;
  logoRightAlt?: string;
  // Opción 2: Un icono centrado
  icon?: ReactNode;
  iconClassName?: string;
  // Configuración general
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  separatorClassName?: string;
  logosContainerClassName?: string;
  logoClassName?: string;
}

export function PageHeader({
  title,
  subtitle,
  logoLeft,
  logoRight,
  logoLeftAlt,
  logoRightAlt,
  icon,
  iconClassName = "inline-flex h-20 w-20 items-center justify-center rounded-full bg-black text-white",
  className = "flex flex-col items-center gap-4 text-center",
  titleClassName = "text-4xl font-extrabold uppercase tracking-tight text-black sm:text-5xl",
  subtitleClassName = "max-w-3xl text-base text-muted-foreground",
  separatorClassName = "text-2xl sm:text-3xl font-light text-muted-foreground",
  logosContainerClassName = "flex items-center justify-center gap-4 sm:gap-6",
  logoClassName = "h-12 w-12 sm:h-16 sm:w-16 object-contain",
}: PageHeaderProps) {
  const renderLogo = (logo: string | ReactNode, alt?: string) => {
    if (typeof logo === "string") {
      return <img src={logo} alt={alt || ""} className={logoClassName} />;
    }
    return <div className={logoClassName}>{logo}</div>;
  };

  return (
    <CardHeader className={className}>
      {/* Dos logos con separador */}
      {logoLeft && logoRight && (
        <div className={logosContainerClassName}>
          {renderLogo(logoLeft, logoLeftAlt)}
          <span className={separatorClassName}>|</span>
          {renderLogo(logoRight, logoRightAlt)}
        </div>
      )}

      {/* Un icono centrado */}
      {icon && !logoLeft && !logoRight && (
        <div className={iconClassName}>{icon}</div>
      )}

      <CardTitle className={`${titleClassName} break-words`}>{title}</CardTitle>
      {subtitle && (
        <CardDescription className={`${subtitleClassName} break-words`}>
          {subtitle}
        </CardDescription>
      )}
    </CardHeader>
  );
}
