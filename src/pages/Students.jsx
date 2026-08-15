import Nav from "../components/Nav";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getStudents } from "../Services/studentsService";

function Students() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <header>
        <Nav />
      </header>
      
      <main className="flex-grow">
        <Header 
          title="Students" 
          description="Gestión y lista de estudiantes" 
          txtButton="Nuevo Estudiante" 
        />
        {/* Aquí puedes agregar la tabla o contenido de los estudiantes */}
      </main>

      <Footer />
    </div>
  );
}

export default Students;