<<<<<<< HEAD
import Sidebar2 from "../components/Sidebar2";
import Footer from "../components/Footer";

function LayoutPrueba({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Barra Lateral fija a la izquierda */}
      <Sidebar2 />

      {/* Contenedor Derecho ocupando todo el alto disponible */}
      <div className="flex-1 flex flex-col justify-between min-h-screen">
        <main className="flex-1 p-8">
          {children}
        </main>

        {/* Footer siempre al fondo */}
        <Footer />
=======
import MenuNavegacion from "../components/MenuNavegacion";

function LayoutPrueba() {
  return (
    <div className="layout-prueba min-h-screen flex">
      <div className="bg-blue-900 w-86">
        <h1 className="text-white text-2xl p-4">Sistema de Gestión Académica</h1>
        <div>
          <MenuNavegacion />
        </div>
      </div>

      <div className="bg-slate-200 flex-1">
        <p>Este es un ejemplo de layout de prueba.</p>
>>>>>>> main
      </div>
    </div>
  );
}

export default LayoutPrueba;