function StundentTables({ students = [] }) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden mt-4">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 font-bold">
            <th className="p-4">Nombre</th>
            <th className="p-4">Apellido</th>
            <th className="p-4">Correo</th>
            <th className="p-4">Celular</th>
            <th className="p-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.stundeId || index} className="border-b border-gray-200 hover:bg-gray-50 text-gray-800">
              {/* Usamos 'firts_name' y 'lasts_name' tal como vienen de tu base de datos */}
              <td className="p-4">{student.firts_name || "-"}</td>
              <td className="p-4">{student.lasts_name || "-"}</td>
              <td className="p-4">{student.email || "-"}</td>
              <td className="p-4">{student.phone_number || "-"}</td>
              <td className="p-4 space-x-2">
                <button className="text-gray-700 hover:text-blue-600 font-medium">Editar</button>
                <button className="text-gray-500 hover:text-red-600 font-medium">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StundentTables;