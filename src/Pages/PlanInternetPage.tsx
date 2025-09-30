import BannerPlanes from "@/components/Banners/BannerPlanes";
import InternetPlans from "@/Layouts/InternetPlans";

function PlanInternetPage() {
  return (
    <div className="w-full">
      {/* Navbar + Fondo con grafo */}
      <BannerPlanes />
      {/* Sección de planes */}
      <InternetPlans />
    </div>
  );
}

export default PlanInternetPage;
