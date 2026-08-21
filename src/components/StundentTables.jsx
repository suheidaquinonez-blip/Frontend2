import { useState, useEffect } from "react";
import { getStudents } from "../Services/table_Student";

function StundentTables() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Cargar lista de estudiantes desde el servicio de Supabase
  useEffect(() => {
    async function loadStudents() {
      try {
        const data = await getStudents();
        console.log("Datos recibidos de Supabase:", data); // Revisa la consola F12 si los datos no cargan
        if (Array.isArray(data)) {
          setStudents(data);
        }
      } catch (error) {
        console.error("Error al cargar estudiantes:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  // Filtrado tolerante a variaciones en los nombres de columna
  const filteredStudents = students.filter((student) => {
    const firstName = student?.firts_name || student?.first_name || student?.name || "";
    const lastName = student?.lasts_name || student?.last_name || "";
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Buscador de estudiantes */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar estudiante..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabla de Datos */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-gray-600 text-sm font-semibold">
              <th className="py-3 px-4">Nombre</th>
              <th className="py-3 px-4">Apellido</th>
              <th className="py-3 px-4">Correo</th>
              <th className="py-3 px-4">Celular</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">
                  Cargando estudiantes...
                </td>
              </tr>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => {
                const nombre = student?.firts_name || student?.first_name || student?.name || "Sin nombre";
                const apellido = student?.lasts_name || student?.last_name || "-";
                const email = student?.email || "Sin correo";
                const telefono = student?.phone || student?.celular || "-";

                return (
                  <tr key={student?.stundId || student?.id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">{nombre}</td>
                    <td className="py-3 px-4">{apellido}</td>
                    <td className="py-3 px-4">{email}</td>
                    <td className="py-3 px-4">{telefono}</td>
                    <td className="py-3 px-4 text-center space-x-3">
                      <button className="text-gray-600 hover:text-blue-600 font-medium">
                        Editar
                      </button>
                      <button className="text-gray-600 hover:text-red-600 font-medium">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">
                  No se encontraron estudiantes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StundentTables;