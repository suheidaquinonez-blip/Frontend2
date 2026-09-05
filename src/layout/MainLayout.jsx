import Footer from "../components/footer";
import Aside from "../components/Aside";

function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <aside className="bg-blue-900 w-86 p-4">
        <Aside />
      </aside>

      <div className="flex flex-col flex-1 bg-slate-300 border-18 border-blue-950">
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;