import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importa tus componentes de página (debes crearlos después)
import HomePage from "@/pages/HomePage";
import PlanInternetPage from "@/pages/PlanInternetPage";
//import AboutPage /AboutPage";
/*import ServicesPage from "./pages/ServicesPage";
import PlansPage from "./pages/PlansPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";*/
import Layout from "@/Layouts/PublicLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal con layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="planes/internet" element={<PlanInternetPage />} />
          {/*<Route path="services" element={<ServicesPage />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="contact" element={<ContactPage />} />*/}
        </Route>

        {/* Ruta 404 para páginas no encontradas */}
        {/*<Route path="*" element={<NotFoundPage />} />*/}
      </Routes>
    </Router>
  );
}

export default App;
