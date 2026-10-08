import { useEffect, useMemo, useState } from 'react'
import { studentsApi, coursesApi, enrollmentsApi } from '../Services/api'

const STATUS = {
  ACTIVE: { label: 'Activa', style: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Cancelada', style: 'bg-red-100 text-red-700' },
  COMPLETED: { label: 'Completada', style: 'bg-blue-100 text-blue-700' },
}

const today = new Date().toISOString().split('T')[0]

function Enrollments() {
  const [enrollments, setEnrollments] = useState([])
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  // Formulario de nueva matrícula
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ studentId: '', courseId: '', enrollmentDate: today })
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  async function loadData() {
    try {
      setError('')
      // Pide las tres listas a la vez
      const [enrollmentsData, studentsData, coursesData] = await Promise.all([
        enrollmentsApi.getAll(),
        studentsApi.getAll(),
        coursesApi.getAll(),
      ])
      setEnrollments(enrollmentsData)
      setStudents(studentsData)
      setCourses(coursesData)
    } catch (err) {
      console.error('Error cargando matrículas:', err)
      setError('No se pudo conectar con el servidor. Revisa que el backend esté encendido.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // La matrícula solo trae ids: buscamos el nombre del estudiante y del curso
  const studentName = (id) => {
    const s = students.find((item) => item.id === id)
    return s ? `${s.firstName} ${s.lastName}` : `Estudiante #${id}`
  }
  const courseName = (id) => {
    const c = courses.find((item) => item.id === id)
    return c ? `${c.code} - ${c.name}` : `Curso #${id}`
  }

  const filtered = useMemo(() => {
    const text = search.trim().toLowerCase()
    if (!text) return enrollments
    return enrollments.filter((e) => {
      const s = students.find((item) => item.id === e.studentId)
      const c = courses.find((item) => item.id === e.courseId)
      const label = STATUS[e.status]?.label ?? e.status
      return [
        s ? `${s.firstName} ${s.lastName}` : '',
        c ? `${c.code} ${c.name}` : '',
        label,
      ].some((value) => value.toLowerCase().includes(text))
    })
  }, [enrollments, students, courses, search])

  function openNew() {
    setForm({ studentId: '', courseId: '', enrollmentDate: today })
    setFormError('')
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
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
      studentId: Number(form.studentId),
      courseId: Number(form.courseId),
      enrollmentDate: form.enrollmentDate || null,
    }

    try {
      await enrollmentsApi.enroll(payload)
      closeForm()
      await loadData()
    } catch (err) {
      // Ejemplos: ya está matriculado, curso lleno
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleCancel(enrollment) {
    const ok = window.confirm(
      `¿Cancelar la matrícula de ${studentName(enrollment.studentId)} en ${courseName(enrollment.courseId)}?`
    )
    if (!ok) return

    try {
      await enrollmentsApi.cancel(enrollment.id)
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200'

  const missingData = !loading && (students.length === 0 || courses.length === 0)

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Matrículas</h1>
          <p className="mt-2 text-lg text-slate-500">
            Gestión de matrículas del sistema
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Nueva Matrícula
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p>
      )}

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por estudiante, curso o estado..."
        className="mt-8 w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-slate-800 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-800">
            <tr>
              <th className="px-6 py-4 font-semibold">Estudiante</th>
              <th className="px-6 py-4 font-semibold">Curso</th>
              <th className="px-6 py-4 font-semibold">Fecha</th>
              <th className="px-6 py-4 font-semibold">Estado</th>
              <th className="px-6 py-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                  Cargando matrículas...
                </td>
              </tr>
            )}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                  {enrollments.length === 0
                    ? 'Aún no hay matrículas. Pulsa "Nueva Matrícula" para agregar la primera.'
                    : 'Ninguna matrícula coincide con la búsqueda.'}
                </td>
              </tr>
            )}

            {filtered.map((en) => {
              const status = STATUS[en.status] ?? { label: en.status, style: 'bg-slate-100 text-slate-700' }
              return (
                <tr key={en.id} className="border-t border-slate-200">
                  <td className="px-6 py-4">{studentName(en.studentId)}</td>
                  <td className="px-6 py-4">{courseName(en.courseId)}</td>
                  <td className="px-6 py-4">{en.enrollmentDate}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${status.style}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {en.status === 'ACTIVE' ? (
                      <button
                        type="button"
                        onClick={() => handleCancel(en)}
                        className="font-semibold text-red-600 hover:underline"
                      >
                        Cancelar
                      </button>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900">Nueva matrícula</h2>

            {missingData ? (
              <div className="mt-4">
                <p className="rounded-lg bg-yellow-50 px-4 py-3 text-yellow-800">
                  Para matricular necesitas al menos un estudiante y un curso creados.
                </p>
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="rounded-lg border border-slate-300 px-5 py-2 font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label htmlFor="studentId" className="mb-1 block font-medium text-slate-700">
                    Estudiante
                  </label>
                  <select
                    id="studentId"
                    name="studentId"
                    value={form.studentId}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  >
                    <option value="">Selecciona un estudiante</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.firstName} {s.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="courseId" className="mb-1 block font-medium text-slate-700">
                    Curso
                  </label>
                  <select
                    id="courseId"
                    name="courseId"
                    value={form.courseId}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  >
                    <option value="">Selecciona un curso</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="enrollmentDate" className="mb-1 block font-medium text-slate-700">
                    Fecha de matrícula
                  </label>
                  <input
                    id="enrollmentDate"
                    name="enrollmentDate"
                    type="date"
                    max={today}
                    value={form.enrollmentDate}
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
                    {saving ? 'Guardando...' : 'Matricular'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Enrollments