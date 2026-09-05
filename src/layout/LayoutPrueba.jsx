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
      </div>
    </div>
  );
}

export default LayoutPrueba;