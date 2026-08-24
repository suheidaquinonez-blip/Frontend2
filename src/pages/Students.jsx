<<<<<<< HEAD
function Students() {
  return <h1 className="text-2xl font-bold text-gray-800 p-6">Students</h1>
=======
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Search from "../components/Search";
import StundentTables from "../components/StundentTables";
import { getStudents } from "../Services/table_Student";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const listStudents = async () => {
      try {
        const data = await getStudents();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    listStudents();
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      student.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      student.last_name?.toLowerCase().includes(search.toLowerCase()) ||
      student.email?.toLowerCase().includes(search.toLowerCase()) ||
      student.phone_number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen">
      <div>
        <Header
          title="Página de Estudiantes"
          description="Bienvenido al sistema de gestión de estudiantes"
          txtButton="Nuevo Estudiante"
        />
        <div className="p-6">
          <Search
            searchTerm={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar estudiante..."
          />
          <StundentTables students={filteredStudents} />
        </div>
      </div>
      <Footer />
    </div>
  );
>>>>>>> development
}

export default Students;