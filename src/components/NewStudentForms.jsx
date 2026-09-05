import { useState } from "react";

function NewStudentForms() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del estudiante:", formData);
    // Aquí puedes llamar a tu studentService.js, por ejemplo:
    // await createStudent(formData);
  };

  const handleReset = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    });
  };

  return (
    <div>
      <h2>Estudiantes</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          placeholder="Nombre"
          value={formData.first_name}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Apellido"
          value={formData.last_name}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Celular"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg">
          Crear Estudiante
        </button>
        <button type="reset" onClick={handleReset} className="p-2 rounded-lg">
          Limpiar
        </button>
      </form>
    </div>
  );
}

export default NewStudentForms;