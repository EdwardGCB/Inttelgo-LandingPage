import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Usar requestAnimationFrame para asegurar que el DOM esté listo
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto", // Cambiado a "auto" para scroll instantáneo
      });
    };

    // Ejecutar inmediatamente y también después de un frame para asegurar que funcione
    scrollToTop();
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToTop);
    });
  }, [pathname]);

  return null;
}
