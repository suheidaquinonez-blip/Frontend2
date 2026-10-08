import { useEffect, useMemo, useState } from 'react'
import { studentsApi } from '../Services/api'

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: '',
}

function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  // Formulario (sirve para crear y para editar)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  async function loadStudents() {
    try {
      setError('')
      const data = await studentsApi.getAll()
      setStudents(data)
    } catch (err) {
      console.error('Error cargando estudiantes:', err)
      setError('No se pudo conectar con el servidor. Revisa que el backend esté encendido.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  // Filtra por nombre, apellido, correo o celular
  const filtered = useMemo(() => {
    const text = search.trim().toLowerCase()
    if (!text) return students
    return students.filter((s) =>
      [s.firstName, s.lastName, s.email, s.phone]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(text))
    )
  }, [students, search])

  function openNew() {
    setEditingId(null)
    setForm(emptyForm)
    setFormError('')
    setShowForm(true)
  }

  function openEdit(student) {
    setEditingId(student.id)
    setForm({
      firstName: student.firstName ?? '',
      lastName: student.lastName ?? '',
      email: student.email ?? '',
      phone: student.phone ?? '',
      birthDate: student.birthDate ?? '',
    })
    setFormError('')
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setFormError('')
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    setSaving(true)

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      birthDate: form.birthDate,
    }

    try {
      if (editingId) {
        await studentsApi.update(editingId, payload)
      } else {
        await studentsApi.create(payload)
      }
      closeForm()
      await loadStudents()
    } catch (err) {
      // Ejemplos: correo repetido, correo inválido, fecha futura
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(student) {
    const ok = window.confirm(
      `¿Eliminar a ${student.firstName} ${student.lastName}? También se borrarán sus matrículas.`
    )
    if (!ok) return

    try {
      await studentsApi.remove(student.id)
      await loadStudents()
    } catch (err) {
      setError(err.message)
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const inputClass =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200'

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Estudiantes</h1>
          <p className="mt-2 text-lg text-slate-500">
            Bienvenido al sistema de gestión de estudiantes
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Nuevo Estudiante
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p>
      )}

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar estudiante..."
        className="mt-8 w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-slate-800 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-800">
            <tr>
              <th className="px-6 py-4 font-semibold">Nombre</th>
              <th className="px-6 py-4 font-semibold">Apellido</th>
              <th className="px-6 py-4 font-semibold">Correo</th>
              <th className="px-6 py-4 font-semibold">Celular</th>
              <th className="px-6 py-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                  Cargando estudiantes...
                </td>
              </tr>
            )}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                  {students.length === 0
                    ? 'Aún no hay estudiantes. Pulsa "Nuevo Estudiante" para agregar el primero.'
                    : 'Ningún estudiante coincide con la búsqueda.'}
                </td>
              </tr>
            )}

            {filtered.map((s) => (
              <tr key={s.id} className="border-t border-slate-200">
                <td className="px-6 py-4">{s.firstName}</td>
                <td className="px-6 py-4">{s.lastName}</td>
                <td className="px-6 py-4">{s.email}</td>
                <td className="px-6 py-4">{s.phone || '—'}</td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => openEdit(s)}
                    className="mr-4 font-semibold text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(s)}
                    className="font-semibold text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900">
              {editingId ? 'Editar estudiante' : 'Nuevo estudiante'}
            </h2>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-1 block font-medium text-slate-700">
                    Nombre
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-1 block font-medium text-slate-700">
                    Apellido
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-1 block font-medium text-slate-700">
                  Correo
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="mb-1 block font-medium text-slate-700">
                    Celular
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength={20}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="birthDate" className="mb-1 block font-medium text-slate-700">
                    Fecha de nacimiento
                  </label>
                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    max={today}
                    value={form.birthDate}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {formError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-red-700">{formError}</p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-slate-300 px-5 py-2 font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear estudiante'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Students