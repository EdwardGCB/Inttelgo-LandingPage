import GamerPlan from "@/components/Cards/GamerPlan";
import SecondaryPlan from "@/components/Cards/SecondaryPlan";

interface InternetPlansProps {
  plansData: any[];
}

function InternetPlans({ plansData }: InternetPlansProps) {
  return (
    <div className="container md:px-5 lg:px-30 py-10">
      <div className="mx-10 sm:mx-5 md:mx-0 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 justify-items-center space-y-10">
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
