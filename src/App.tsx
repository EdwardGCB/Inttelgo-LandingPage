import { Suspense } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { SuspenseFallback } from "@/components/ui/loading-spinner";
import { Toaster } from "./components/ui/sonner";
import { publicRoutes } from "./routes/public.routes";
import { otherRoutes } from "./routes/other.routes";
import GoogleAnalytics from "@/components/GoogleAnalytics";

function AppRoutes() {
  const routes = useRoutes([...publicRoutes, ...otherRoutes]);
  return routes;
}

function App() {
  return (
    <Router>
      <GoogleAnalytics />
      <Suspense fallback={<SuspenseFallback />}>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </Suspense>
    </Router>
  );
}

export default App;
