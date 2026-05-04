import TerminosBecaPage from "@/Pages/Legal&Regulatorio/TerminosBecaPage";
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

// Lazy loading de layout
const Layout = lazy(() => import("@/Layouts/PublicLayout"));

// Lazy loading de páginas públicas
const HomePage = lazy(() => import("@/Pages/Home"));
const PlanInternetPage = lazy(() => import("@/Pages/Plan/Internet"));
const PlanTelevisionPage = lazy(() => import("@/Pages/Plan/Television"));
const PlanTelefoniaPage = lazy(() => import("@/Pages/Plan/Telefonia"));
const SobreNosotrosPage = lazy(() => import("@/Pages/SobreNosotros"));
const ExperienceCentersPage = lazy(() => import("@/Pages/ExperienceCenters"));
const ContactUsPage = lazy(() => import("@/Pages/ContactUs"));
const MundialPage = lazy(() => import("@/Pages/Mundial"));
const BecaPage = lazy(() => import("@/Pages/Beca"));
const PqrsPage = lazy(() => import("@/Pages/Legal&Regulatorio/Pqrs"));
const ManualPage = lazy(() => import("@/Pages/Legal&Regulatorio/Manual"));
const DignidadInfantilPage = lazy(
  () => import("@/Pages/Legal&Regulatorio/DignidadInfantil")
);
const PrivacidadPage = lazy(
  () => import("@/Pages/Legal&Regulatorio/Privacidad")
);
const TerminosPage = lazy(() => import("@/Pages/Legal&Regulatorio/Terminos"));
const SeguridadPage = lazy(() => import("@/Pages/Legal&Regulatorio/Seguridad"));
const RegulacionTicPage = lazy(
  () => import("@/Pages/Legal&Regulatorio/RegulacionTIC")
);
const SpeedTest = lazy(() => import("@/Pages/SpeedTest"));
const PsePage = lazy(() => import("@/Pages/pse"));

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "planes/internet",
        element: <PlanInternetPage />,
      },
      {
        path: "planes/television",
        element: <PlanTelevisionPage />,
      },
      {
        path: "planes/telefonia",
        element: <PlanTelefoniaPage />,
      },
      {
        path: "planes/internet/speedtest",
        element: <SpeedTest />,
      },
      {
        path: "sobre-nosotros",
        element: <SobreNosotrosPage />,
      },
      {
        path: "centros-de-experiencia",
        element: <ExperienceCentersPage />,
      },
      {
        path: "contacto",
        element: <ContactUsPage />,
      },
      {
        path: "mundial-2026",
        element: <MundialPage />,
      },
      {
        path: "beca",
        element: <BecaPage />,
      },
      {
        path: "pse",
        element: <PsePage />,
      },
      {
        path: "pse/:transaction",
        element: <PsePage />,
      },
      {
        path: "pqrs",
        element: <PqrsPage />,
      },
      {
        path: "manual",
        element: <ManualPage />,
      },
      {
        path: "dignidad-infantil",
        element: <DignidadInfantilPage />,
      },
      {
        path: "privacidad",
        element: <PrivacidadPage />,
      },
      {
        path: "terminos",
        element: <TerminosPage />,
      },
      {
        path: "seguridad",
        element: <SeguridadPage />,
      },
      {
        path: "regulacion-tic",
        element: <RegulacionTicPage />,
      },
      {
        path: "beca/terminos",
        element: <TerminosBecaPage />,
      },
    ],
  },
];
