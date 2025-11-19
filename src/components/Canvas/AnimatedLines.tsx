import { useEffect, useState } from "react";

interface AnimatedLinesProps {
  lineCount?: number;
  animationDuration?: number;
  pauseDuration?: number;
  loop?: boolean;
  className?: string;
}

export default function AnimatedLines({
  lineCount = 4,
  animationDuration = 2,
  pauseDuration = 30,
  loop = true,
  className = "",
}: AnimatedLinesProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    const delayPerLine = (animationDuration * 1000) / lineCount;

    if (visibleLines < lineCount) {
      const timeout = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
      }, delayPerLine);
      return () => clearTimeout(timeout);
    }

    if (visibleLines === lineCount && loop) {
      const pauseTimeout = setTimeout(() => {
        setVisibleLines(0);
        setIsAnimating(true);
      }, pauseDuration * 100);
      return () => clearTimeout(pauseTimeout);
    }
  }, [
    visibleLines,
    isAnimating,
    lineCount,
    animationDuration,
    pauseDuration,
    loop,
  ]);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {Array.from({ length: lineCount }).map((_, index) => (
        <div
          key={index}
          className="w-8 h-10 transition-opacity duration-300 bg-gradient-to-r from-[#FF9900] to-[#EC5406]"
          style={{
            transform: "skewX(-20deg)",
            opacity: index < visibleLines ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
}
