// components/Canvas/CardStarBackground.tsx
import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkleSpeed: number;
  color: string; // Cachear color para evitar Math.random() en cada frame
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

    // Optimizar contexto del canvas para mejor rendimiento
    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: false,
      willReadFrequently: false, // Optimización: no leeremos frecuentemente
    });
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
        // Asignar color una sola vez al crear la estrella
        const colorIndex = Math.floor(Math.random() * colors.length);
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 1.5 + 1.5,
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          color: colors[colorIndex], // Cachear color
        });
      }
      return stars;
    };

    // Inicializar estrellas con dimensiones actuales
    starsRef.current = createStars(starCount, canvasWidth, canvasHeight);

    // Control de visibilidad para pausar animación cuando no es visible
    let isVisible = true;
    let lastFrameTime = 0;
    const targetFPS = 30; // Reducir a 30fps para ahorrar CPU
    const frameInterval = 1000 / targetFPS;

    // IntersectionObserver para pausar cuando no es visible
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0 }
    );

    if (canvas) {
      visibilityObserver.observe(canvas);
    }

    // Función de animación optimizada
    const animate = (currentTime: number) => {
      // Throttle a 30fps y solo animar si es visible
      if (!isVisible) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = currentTime - lastFrameTime;
      if (elapsed < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = currentTime - (elapsed % frameInterval);

      // Obtener dimensiones actuales sin forzar reflow
      const currentWidth = canvas.width || width;
      const currentHeight = canvas.height || height;

      // Limpiar canvas con fondo transparente
      ctx.clearRect(0, 0, currentWidth, currentHeight);

      // Optimización: agrupar operaciones de canvas
      ctx.save();

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

        // Dibujar estrella (usar color cacheado)
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color; // Usar color cacheado
        ctx.globalAlpha = star.opacity;
        ctx.fill();
      });

      ctx.restore();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
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
