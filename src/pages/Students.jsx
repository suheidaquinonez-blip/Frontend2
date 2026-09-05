import { useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firts_name: '',
    lasts_name: '',
    email: '',
    phone_number: ''
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  async function fetchStudents() {
    setLoading(true)
    const { data, error } = await supabase
      .from('Table_Student')
      .select('*')
      .order('stundeId', { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      setStudents(data)
    }
    setLoading(false)
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function openNewForm() {
    setFormData({ firts_name: '', lasts_name: '', email: '', phone_number: '' })
    setEditingId(null)
    setShowForm(true)
  }

  function openEditForm(student) {
    setFormData({
      firts_name: student.firts_name || '',
      lasts_name: student.lasts_name || '',
      email: student.email || '',
      phone_number: student.phone_number || ''
    })
    setEditingId(student.stundeId)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    let error
    if (editingId) {
      const result = await supabase
        .from('Table_Student')
        .update(formData)
        .eq('stundeId', editingId)
      error = result.error
    } else {
      const result = await supabase
        .from('Table_Student')
        .insert([formData])
      error = result.error
    }

    if (error) {
      alert('Error al guardar estudiante: ' + error.message)
    } else {
      closeForm()
      fetchStudents()
    }
    setSubmitting(false)
  }

  async function handleDelete(id) {
    if (!confirm('¿Seguro que deseas eliminar este estudiante?')) return

    const { error } = await supabase
      .from('Table_Student')
      .delete()
      .eq('stundeId', id)

    if (error) {
      alert('Error al eliminar: ' + error.message)
    } else {
      fetchStudents()
    }
  }

  const filteredStudents = students.filter((s) => {
    const term = search.toLowerCase()
    return (
      s.firts_name?.toLowerCase().includes(term) ||
      s.lasts_name?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term)
    )
  })

  if (loading) return <p className="p-6">Cargando estudiantes...</p>
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Página de Estudiantes</h1>
          <p className="text-gray-500">Bienvenido al sistema de gestión de estudiantes</p>
        </div>
        <button
          onClick={openNewForm}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Nuevo Estudiante
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar estudiante..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded p-2 my-4"
      />

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-4 rounded mb-6 grid grid-cols-2 gap-4"
        >
          <h2 className="col-span-2 font-semibold text-lg">
            {editingId ? 'Editar estudiante' : 'Nuevo estudiante'}
          </h2>
          <input
            type="text"
            name="firts_name"
            placeholder="Nombre"
            value={formData.firts_name}
            onChange={handleChange}
            required
            className="border rounded p-2"
          />
          <input
            type="text"
            name="lasts_name"
            placeholder="Apellido"
            value={formData.lasts_name}
            onChange={handleChange}
            required
            className="border rounded p-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleChange}
            required
            className="border rounded p-2"
          />
          <input
            type="text"
            name="phone_number"
            placeholder="Celular"
            value={formData.phone_number}
            onChange={handleChange}
            className="border rounded p-2"
          />
          <div className="col-span-2 flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {filteredStudents.length === 0 ? (
        <p className="text-gray-500">No hay estudiantes registrados.</p>
      ) : (
        <table className="w-full border-collapse bg-white shadow rounded">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-3">Nombre</th>
              <th className="text-left p-3">Apellido</th>
              <th className="text-left p-3">Correo</th>
              <th className="text-left p-3">Celular</th>
              <th className="text-left p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.stundeId} className="border-b hover:bg-gray-50">
                <td className="p-3">{student.firts_name}</td>
                <td className="p-3">{student.lasts_name}</td>
                <td className="p-3">{student.email}</td>
                <td className="p-3">{student.phone_number}</td>
                <td className="p-3 space-x-3">
                  <button
                    onClick={() => openEditForm(student)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(student.stundeId)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Students