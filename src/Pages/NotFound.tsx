import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-orange-100 px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-orange-500">404</h1>
          <h2 className="text-3xl font-bold text-gray-800">
            Página no encontrada
          </h2>
          <p className="text-gray-600">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" className="bg-orange-500 hover:bg-orange-600">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Ir al inicio
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            onClick={() => window.history.back()}
          >
            <Link to="#" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver atrás
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}


