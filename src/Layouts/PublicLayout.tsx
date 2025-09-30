import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="w-full">
      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer (opcional) */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-600 text-sm">
            © 2024 Zippay. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
