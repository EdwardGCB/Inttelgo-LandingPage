import Menu from "@/Layouts/Menu";
import Stars from "@/components/Canvas/Stars";

function BannerHome() {
  return (
    <div className="relative bg-gradient-to-br from-black via-gray-900 to-slate-800 overflow-hidden mb-12">
      <Stars
        starCount={100}
        colors={[
          "#FFFFFF",
          "#F8F9FA",
          "#E9ECEF",
          "#DEE2E6",
          "#CED4DA",
          "#ADB5BD",
          "#6C757D",
          "#495057",
        ]}
      />
      <Menu className={"text-white"} />
      <div className="flex flex-col items-center justify-center min-h-[600px] px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12 md:py-16 lg:py-20">
        {/* Marte en la parte inferior - Solo mitad visible */}
        <div className="absolute bottom-[-200px] left-1/2 transform -translate-x-1/2 z-0 w-full">
          {/* Planeta Marte - Solo mitad inferior visible */}
          <div className="relative w-full h-[350px] sm:h-[400px] md:h-[450px] overflow-hidden">
            <img
              src="/banners/home/Mars.svg"
              alt="Planeta Marte"
              className="absolute left-1/2 top-0 transform -translate-x-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] md:w-[600px] md:h-[600px] object-contain filter "
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BannerHome;
