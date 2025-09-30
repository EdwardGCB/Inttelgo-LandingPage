import Menu from "@/Layouts/Menu";
import Graph from "@/components/Canvas/Graph";

const BannerPlanes = () => {
  return (
    <div className="relative bg-gradient-to-r from-orange-400 via-orange-600 to-orange-800 overflow-hidden mb-12">
      <Graph />
      <Menu className={"text-white"} />
      <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="hidden sm:block flex-shrink-0 w-full sm:w-2/3 lg:w-1/3 order-1 lg:order-1">
          <img
            src="/banners/plan-internet/1.webp"
            alt="Banner Planes"
            className="w-full h-auto object-contain max-w-xs sm:max-w-sm md:max-w-md mx-auto lg:mx-0"
          />
        </div>
        <div className="flex-1 flex items-center justify-center order-2 lg:order-2">
          <section className="relative text-center">
            <h2 className="text-6xl sm:text-7xl xl:text-7xl 2xl:text-7xl text-orange-50 font-bold leading-tight tracking-wide drop-shadow-lg">
              <div>
                Los planes{" "}
                <span className="text-orange-100 font-extrabold">
                  mas veloces
                </span>
              </div>
              <div>
                de{" "}
                <span className="text-orange-100 font-extrabold">internet</span>{" "}
                para tu{" "}
                <span className="text-orange-100 font-extrabold">hogar</span>
              </div>
            </h2>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BannerPlanes;
