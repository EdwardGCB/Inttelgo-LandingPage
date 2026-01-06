// components/Canvas/CardStarBackground.tsx
import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkleSpeed: number;
}

interface StarsProps {
  starCount?: number;
  colors?: string[];
}

const Stars: React.FC<StarsProps> = ({
  starCount = 50,
  colors = ["#8B5CF6", "#7C3AED", "#6D28D9", "#5B21B6"],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(1);
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number | null = null;
    let width = 0;
    let height = 0;

    // Configurar tamaño del canvas basado en el contenedor padre
    // Usar ResizeObserver para evitar reflows forzados
    const resizeCanvas = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const parent = canvas.parentElement;
        if (parent) {
          // Usar getBoundingClientRect una sola vez y cachear
          const rect = parent.getBoundingClientRect();
          width = rect.width;
          height = rect.height;

          // Solo actualizar si cambió el tamaño
          if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
          }
        }
        rafId = null;
      });
    };

    // Usar ResizeObserver en lugar de window resize para mejor rendimiento
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === canvas.parentElement) {
          resizeCanvas();
        }
      }
    });

    const parent = canvas.parentElement;
    if (parent) {
      resizeObserver.observe(parent);
      resizeCanvas(); // Inicializar
    }

    // Usar las dimensiones cacheadas
    const getDimensions = () => {
      if (width === 0 || height === 0) {
        const parent = canvas.parentElement;
        if (parent) {
          const rect = parent.getBoundingClientRect();
          width = rect.width;
          height = rect.height;
          canvas.width = width;
          canvas.height = height;
        }
      }
      return { width, height };
    };

    const { width: canvasWidth, height: canvasHeight } = getDimensions();

    // Crear estrellas con dimensiones actuales
    const createStars = (count: number, w: number, h: number) => {
      const stars: Star[] = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 1.5 + 1.5,
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
        });
      }
      return stars;
    };

    // Inicializar estrellas con dimensiones actuales
    starsRef.current = createStars(starCount, canvasWidth, canvasHeight);

    // Función de animación
    const animate = () => {
      // Obtener dimensiones actuales sin forzar reflow
      const currentWidth = canvas.width || width;
      const currentHeight = canvas.height || height;

      // Limpiar canvas con fondo transparente
      ctx.clearRect(0, 0, currentWidth, currentHeight);

      starsRef.current.forEach((star) => {
        // Actualizar posición
        star.y += star.speed;

        // Reiniciar posición si sale del card
        if (star.y > currentHeight) {
          star.y = 0;
          star.x = Math.random() * currentWidth;
        }

        // Efecto de parpadeo
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 0.8 || star.opacity < 0.3) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        // Dibujar estrella
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

        // Colores morados para el card
        const purpleShades = colors;
        const colorIndex = Math.floor(Math.random() * purpleShades.length);
        ctx.fillStyle = purpleShades[colorIndex];
        ctx.globalAlpha = star.opacity;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [starCount, colors]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
};

export default Stars;
