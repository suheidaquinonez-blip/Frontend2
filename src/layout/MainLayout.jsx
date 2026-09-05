<<<<<<< HEAD
import Footer from "../components/Footer";
import Sidebar2 from "../components/Sidebar2";
=======
import Footer from "../components/footer";
import Aside from "../components/Aside";
>>>>>>> main

function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen">
<<<<<<< HEAD
      {/* Sidebar a la izquierda */}
      <Sidebar2 />

      {/* Contenedor derecho flex para empujar el Footer abajo */}
      <div className="flex flex-col flex-1 justify-between min-h-screen bg-slate-300 border-[18px] border-blue-950">
        <main className="p-6 flex-1">
          {children}
        </main>

        {/* Footer fijo globalmente */}
=======
      <aside className="bg-blue-900 w-86 p-4">
        <Aside />
      </aside>

      <div className="flex flex-col flex-1 bg-slate-300 border-18 border-blue-950">
        <main className="flex-1">
          {children}
        </main>
>>>>>>> main
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;