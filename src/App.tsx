import { Suspense } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { SuspenseFallback } from "@/components/ui/loading-spinner";
import { Toaster } from "./components/ui/sonner";
import { publicRoutes } from "./routes/public.routes";
import { otherRoutes } from "./routes/other.routes";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { SocketProvider } from "@/contexts/SocketContext";

function AppRoutes() {
  const routes = useRoutes([...publicRoutes, ...otherRoutes]);
  return routes;
}

function App() {
  return (
    <Router>
      <GoogleAnalytics />
      <SocketProvider>
        <Suspense fallback={<SuspenseFallback />}>
          <AppRoutes />
          <Toaster position="top-right" richColors />
        </Suspense>
      </SocketProvider>
    </Router>
  );
}

export default App;
