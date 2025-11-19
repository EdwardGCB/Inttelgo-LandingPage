import { lazy } from "react";
import { RouteObject } from "react-router-dom";

// Lazy loading de páginas de error
const NotFoundPage = lazy(() => import("@/Pages/NotFound"));
const NotImplementedPage = lazy(() => import("@/Pages/NotImplemented"));

export const otherRoutes: RouteObject[] = [
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/501",
    element: <NotImplementedPage />,
  },
];
