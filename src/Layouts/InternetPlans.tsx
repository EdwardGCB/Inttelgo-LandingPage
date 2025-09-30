import GamerPlan from "@/components/Cards/GamerPlan";
import SecondaryPlan from "@/components/Cards/SecondaryPlan";

const plansData = [
  {
    title: "Plan Gamer",
    speed: "500",
    price: "",
    category: "Gamer",
    caracteristicas: [
      "¡IP PUBLICA!",
      "Modem 5G con wifi",
      "NAT ABIERTA LAS 24/7",
    ],
  },
  {
    title: null,
    speed: "200",
    price: "$55,000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
  },
  {
    title: null,
    speed: "300",
    price: "$70,000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
  },
  {
    title: null,
    speed: "500",
    price: "$90,000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
  },
  {
    title: null,
    speed: "750",
    price: "$55,000",
    category: "Básico",
    caracteristicas: [
      "Velocidad simétrica",
      "Tareas Básicas",
      "Módem con WiFi",
    ],
  },
];

function InternetPlans() {
  return (
    <div className="container mx-auto md:px-5 lg:px-30 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 justify-items-center space-y-10">
        {plansData.map((plan, index) =>
          plan.category === "Básico" ? (
            <SecondaryPlan key={`plan-internet-${index}`} plan={plan} />
          ) : (
            <GamerPlan key={`plan-internet-${index}`} plan={plan} />
          )
        )}
      </div>
    </div>
  );
}

export default InternetPlans;
