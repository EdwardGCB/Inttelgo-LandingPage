import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

function Graph(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Detectar el modo oscuro/claro
  useEffect(() => {
    const checkDarkMode = (): boolean => {
      return document.documentElement.classList.contains("dark");
    };

    setIsDarkMode(checkDarkMode());

    // Observar cambios en el tema
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkMode(checkDarkMode());
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number | null = null;
    let width = 0;
    let height = 0;

    // Configuración de los nodos del grafo
    const nodes: Node[] = [];
    const nodeCount = isMobile ? 30 : 100;
    const connectionDistance = isMobile ? 100 : 150;

    // Función para inicializar nodos con dimensiones actuales
    const initializeNodes = (w: number, h: number) => {
      nodes.length = 0; // Limpiar nodos existentes
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
        });
      }
    };

    // Ajustar tamaño del canvas usando ResizeObserver y requestAnimationFrame
    // para evitar reflows forzados - usar el contenedor padre en lugar de window
    const resizeCanvas = (): void => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        // Obtener dimensiones del contenedor padre en lugar de window
        const parent = canvas.parentElement;
        if (parent) {
          const rect = parent.getBoundingClientRect();
          const newWidth = rect.width;
          const newHeight = rect.height;

          // Solo actualizar si cambió el tamaño
          if (canvas.width !== newWidth || canvas.height !== newHeight) {
            width = newWidth;
            height = newHeight;
            canvas.width = width;
            canvas.height = height;
            // Reinicializar nodos cuando cambia el tamaño
            initializeNodes(width, height);
          }
        }
        rafId = null;
      });
    };

    // Usar ResizeObserver para detectar cambios de tamaño del contenedor padre
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    // Observar el contenedor padre en lugar de document.body
    const parent = canvas.parentElement;
    if (parent) {
      resizeObserver.observe(parent);
      // Inicializar dimensiones inmediatamente
      resizeCanvas();
    }

    // Fallback para navegadores antiguos (solo si es necesario)
    const handleWindowResize = () => {
      resizeCanvas();
    };
    window.addEventListener("resize", handleWindowResize, { passive: true });

    // Variables para el efecto de interacción con el mouse
    let mouseX = -100;
    let mouseY = -100;

    // Seguir la posición del mouse
    const handleMouseMove = (e: MouseEvent): void => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Función de animación
    const animate = (): void => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Colores según el modo
      const nodeColor = "rgba(255, 255, 255, 0.8)";
      const connectionColor = "rgba(255, 255, 255, 0.3)";
      const mouseConnectionColor = "rgba(255, 255, 255, 0.6)";

      // Actualizar y dibujar nodos
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Rebotar en los bordes
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Dibujar nodo
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();
      });

      // Dibujar conexiones entre nodos cercanos
      nodes.forEach((node, i) => {
        // Verificar conexión con el mouse
        const dxToMouse = node.x - mouseX;
        const dyToMouse = node.y - mouseY;
        const distanceToMouse = Math.sqrt(
          dxToMouse * dxToMouse + dyToMouse * dyToMouse
        );

        if (distanceToMouse < connectionDistance * 1.5) {
          ctx.beginPath();
          ctx.strokeStyle = `${mouseConnectionColor.substr(
            0,
            mouseConnectionColor.lastIndexOf(",")
          )}, ${0.6 * (1 - distanceToMouse / (connectionDistance * 1.5))})`;
          ctx.lineWidth = 1.5;
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }

        // Verificar conexiones entre nodos
        for (let j = i + 1; j < nodes.length; j++) {
          const otherNode = nodes[j];
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `${connectionColor.substr(
              0,
              connectionColor.lastIndexOf(",")
            )}, ${0.2 * (1 - distance / connectionDistance)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    // Iniciar animación
    animate();

    // Limpieza
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isMobile, isDarkMode]); // Se recalcula cuando cambia el modo o el tamaño

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
}

export default Graph;
