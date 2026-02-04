import { memo, useMemo } from "react";
import { PrimaryPlanHologram3D, SecondaryPlanHologram3D } from "@/components/Cards/PlanHologram3D";
import type { Plan } from "@/interfaces/plan";



interface InternetPlansProps {
  plansData: Plan[];
}

// Componente memoizado para evitar re-renders innecesarios
const PlanCard = memo(({ plan }: { plan: Plan; index: number }) => {
  const isBasic = plan.category === "Básico";

  return isBasic ? (
    <SecondaryPlanHologram3D plan={plan} />
  ) : (
    <PrimaryPlanHologram3D plan={plan} />
  );
});

PlanCard.displayName = "PlanCard";

function InternetPlans({ plansData }: InternetPlansProps) {
  // Memoizar la lista de planes para evitar recálculos
  const plansList = useMemo(() => {
    return plansData.map((plan, index) => (
      <PlanCard
        key={`plan-internet-${plan.category}-${index}`}
        plan={plan}
        index={index}
      />
    ));
  }, [plansData]);

  return (
    <div className="container md:px-5 lg:px-30 py-10">
      <div className="mx-10 sm:mx-5 md:mx-0 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 justify-items-center space-y-20">
        {plansList}
      </div>
    </div>
  );
}

// Memoizar el componente completo para evitar re-renders cuando las props no cambian
export default memo(InternetPlans);