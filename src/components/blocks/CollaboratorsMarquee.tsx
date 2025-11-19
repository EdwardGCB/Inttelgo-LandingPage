import { collaborators } from "@/data/collaborators";
import { cn } from "@/lib/utils";

const duplicatedLogos = [...collaborators, ...collaborators];

export function CollaboratorsMarquee() {
  return (
    <section className="w-full rounded-3xl border border-white/10 bg-gradient-to-b from-[#0F0F0F] via-[#111827] to-[#0F0F0F] px-6 py-10 text-white shadow-[0_20px_45px_-25px_rgba(0,0,0,0.8)]">
      <div className="max-w-3xl space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-white/60">
          Colaboradores
        </p>
        <h4 className="text-3xl font-semibold">
          Empresas aliadas con Inttelgo
        </h4>
        <p className="text-white/70">
          Inttelgo GO llega a tu hogar para ofrecerte un excelente servicio de
          entretenimiento y conectividad confiable y de calidad.
        </p>
      </div>

      <div className="mt-10 space-y-6">
        {[false, true].map((isReverse) => (
          <div
            key={isReverse ? "reverse" : "normal"}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "flex min-w-full gap-6",
                isReverse ? "animate-marquee-reverse" : "animate-marquee"
              )}
            >
              {duplicatedLogos.map((logo, index) => (
                <div
                  key={`${logo.name}-${index}-${isReverse ? "rev" : "fwd"}`}
                  className="group flex min-w-52 items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-white/30 hover:bg-white/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 p-2 shadow-inner">
                    <img
                      src={logo.logo}
                      alt={logo.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">
                      {logo.name}
                    </p>
                    <p className="text-sm text-white/70">{logo.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
