import { useEffect, useMemo, useState } from 'react'
import { coursesApi } from '../Services/api'

const emptyForm = {
  code: '',
  name: '',
  description: '',
  maxCapacity: '',
}

function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  // Formulario (sirve para crear y para editar)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  async function loadCourses() {
    try {
      setError('')
      const data = await coursesApi.getAll()
      setCourses(data)
    } catch (err) {
      console.error('Error cargando cursos:', err)
      setError('No se pudo conectar con el servidor. Revisa que el backend esté encendido.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  // Filtra por código, nombre o descripción
  const filtered = useMemo(() => {
    const text = search.trim().toLowerCase()
    if (!text) return courses
    return courses.filter((c) =>
      [c.code, c.name, c.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(text))
    )
  }, [courses, search])

  function openNew() {
    setEditingId(null)
    setForm(emptyForm)
    setFormError('')
    setShowForm(true)
  }

  function openEdit(course) {
    setEditingId(course.id)
    setForm({
      code: course.code ?? '',
      name: course.name ?? '',
      description: course.description ?? '',
      maxCapacity: course.maxCapacity ?? '',
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
      code: form.code.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      maxCapacity: Number(form.maxCapacity),
    }

    try {
      if (editingId) {
        await coursesApi.update(editingId, payload)
      } else {
        await coursesApi.create(payload)
      }
      closeForm()
      await loadCourses()
    } catch (err) {
      // Ejemplos: código repetido, capacidad inválida
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(course) {
    const ok = window.confirm(
      `¿Eliminar el curso "${course.name}"? También se borrarán sus matrículas.`
    )
    if (!ok) return

    try {
      await coursesApi.remove(course.id)
      await loadCourses()
    } catch (err) {
      setError(err.message)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200'

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Cursos</h1>
          <p className="mt-2 text-lg text-slate-500">
            Bienvenido al sistema de gestión de cursos
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Nuevo Curso
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p>
      )}

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar curso..."
        className="mt-8 w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-slate-800 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-800">
            <tr>
              <th className="px-6 py-4 font-semibold">Código</th>
              <th className="px-6 py-4 font-semibold">Nombre</th>
              <th className="px-6 py-4 font-semibold">Descripción</th>
              <th className="px-6 py-4 font-semibold">Capacidad</th>
              <th className="px-6 py-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                  Cargando cursos...
                </td>
              </tr>
            )}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                  {courses.length === 0
                    ? 'Aún no hay cursos. Pulsa "Nuevo Curso" para agregar el primero.'
                    : 'Ningún curso coincide con la búsqueda.'}
                </td>
              </tr>
            )}

            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-slate-200">
                <td className="px-6 py-4 font-semibold">{c.code}</td>
                <td className="px-6 py-4">{c.name}</td>
                <td className="px-6 py-4">{c.description || '—'}</td>
                <td className="px-6 py-4">{c.maxCapacity}</td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => openEdit(c)}
                    className="mr-4 font-semibold text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c)}
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
              {editingId ? 'Editar curso' : 'Nuevo curso'}
            </h2>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="code" className="mb-1 block font-medium text-slate-700">
                    Código
                  </label>
                  <input
                    id="code"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    required
                    placeholder="Ej: MAT101"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="maxCapacity" className="mb-1 block font-medium text-slate-700">
                    Capacidad máxima
                  </label>
                  <input
                    id="maxCapacity"
                    name="maxCapacity"
                    type="number"
                    min="1"
                    value={form.maxCapacity}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="name" className="mb-1 block font-medium text-slate-700">
                  Nombre
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="description" className="mb-1 block font-medium text-slate-700">
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                  className={inputClass}
                />
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
                  {saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Courses