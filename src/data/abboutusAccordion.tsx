import CarrouselWinner from "@/components/carousels/TravelWinners";
import { lotteryWinners, travelWinners2024, travelWinners2025, tvWinners } from "@/lib/winners";
import type { ReactNode } from "react";

export type AccordionPurposeItem = {
  value: string;
  title: string;
  defaultOpen?: boolean;
  itemClassName?: string;
  content: ReactNode;
};

export const accordionPurposeItems: AccordionPurposeItem[] = [
  {
    value: "item-1",
    title: "Misión",
    itemClassName: "bg-card border rounded-xl px-4 data-[state=open]:shadow-sm transition-shadow",
    content: (
      <p className="text-base lg:text-lg leading-relaxed">
        Mejorar la conectividad de la sociedad, en especial, de la población más
        vulnerable, de bajos recursos y condición de desplazamiento forzado.
        Nuestra oferta, basada en las tecnologías de la información y
        comunicaciones, contribuirá al logro de la equidad social, al acceso a
        oportunidades y a la reducción de las brechas digitales del país.
      </p>
    ),
  },
  {
    value: "item-2",
    title: "Visión",
    itemClassName: "bg-card border rounded-xl px-4 data-[state=open]:shadow-sm transition-shadow",
    content: (
      <>
        <p className="text-base lg:text-lg leading-relaxed">
          La visión de INTTELGO en el 2025 es:
        </p>
        <ul className="list-disc list-inside space-y-2 text-base lg:text-lg">
          <li>
            Ser la empresa con mayor cantidad de clientes sobre sus competidores
            en la comuna 4 de Cazucá y alrededores.
          </li>
          <li>
            Mantener altos los niveles en la satisfacción de sus clientes y el
            cumplimiento de la propuesta de valor.
          </li>
          <li>
            Estar catalogados con la atención más rápida y oportuna ante sus
            clientes.
          </li>
          <li>
            Ser referente como lugar ideal para trabajar en el sur de Bogotá.
          </li>
        </ul>
      </>
    ),
  },
  {
    value: "item-3",
    title: "Conectividad como propósito social",
    itemClassName: "bg-card border rounded-xl px-4 data-[state=open]:shadow-sm transition-shadow",
    content: (
      <>
        <p className="text-base lg:text-lg leading-relaxed">
          Como parte de nuestro compromiso con el desarrollo social y la
          inclusión digital, hemos implementado un programa de responsabilidad
          corporativa enfocado en brindar acceso gratuito a internet a
          comunidades vulnerables. Actualmente,{" "}
          <span className="font-bold">
            más de 32 fundaciones y organizaciones sin ánimo de lucro
          </span>{" "}
          se benefician de nuestro servicio de conectividad sin costo,
          permitiéndoles fortalecer sus procesos educativos, sociales y
          comunitarios. Esta iniciativa busca reducir la brecha tecnológica en
          poblaciones en situación de vulnerabilidad, facilitando el acceso a
          herramientas digitales, plataformas educativas y servicios esenciales
          en línea. Nuestro servicio donado es{" "}
          <span className="font-bold">
            100% fibra óptica hasta el hogar (FTTH)
          </span>
          , lo que garantiza una conexión de alta velocidad, estable y con baja
          latencia, adaptada a las necesidades operativas de estas entidades.
        </p>
        <p className="text-base lg:text-lg leading-relaxed">
          Conectamos a quienes trabajan por un mejor futuro, porque creemos que
          la transformación social también se construye desde la tecnología.
        </p>
      </>
    ),
  },
  {
    value: "item-4",
    title: "Beneficios exclusivos para nuestros clientes",
    defaultOpen: true,
    itemClassName: "bg-card border rounded-xl px-4 data-[state=open]:shadow-sm transition-shadow",
    content: (
      <>
        <p className="text-base lg:text-lg leading-relaxed">
          En nuestra empresa, valoramos la fidelidad y el compromiso de nuestros
          usuarios. Por eso hemos implementado un programa de incentivos
          exclusivos, diseñado para reconocer a quienes mantienen sus
          obligaciones al día y eligen canales digitales eficientes. Nuestros
          clientes que realizan el pago anticipado de su servicio o que utilizan
          medios electrónicos como PSE (Pago Seguro en Línea), acceden
          automáticamente a un sistema de recompensas que incluye:
        </p>
        <ul className="list-disc list-inside space-y-2 text-base lg:text-lg">
          <li>
            Participación en sorteos de viajes nacionales y experiencias
            especiales, como parte de nuestras campañas de fidelización.
          </li>
          <li>
            Bonificaciones en su servicio por cumplimiento y recurrencia de pago
            anticipado.
          </li>
          <li>
            Evita filas, ahorra tiempo y accede a premios exclusivos solo por
            pagar en línea. Con PSE, tu pago es inmediato y totalmente
            confiable.
          </li>
        </ul>
        <div className="space-y-4">
          <CarrouselWinner
            images={[...travelWinners2024, ...travelWinners2025]}
            title="Sorteo Viaje Santa Marta Anual"
            description="Conoce a nuestros ganadores de años anteriores"
          />
          <CarrouselWinner
            images={tvWinners}
            title="Sorteo TV'S por pago oportuno en PSE"
            description="Conoce a nuestros ganadores"
          />
          <CarrouselWinner
            images={lotteryWinners}
            title="Eventos y sorteos especiales"
            description="Conoce a nuestros ganadores de eventos y sorteos especiales"
          />
        </div>
      </>
    ),
  },
];