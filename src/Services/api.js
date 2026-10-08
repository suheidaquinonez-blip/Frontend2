// src/Services/api.js
// Todas las llamadas al backend Spring Boot en un solo lugar.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (res.status === 204) return null; // DELETE sin contenido

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // El backend responde { code, message } o un mapa { campo: mensaje } si falla una validación
    const message =
      data?.message ||
      (data ? Object.values(data).join(', ') : `Error ${res.status}`);
    throw new Error(message);
  }
  return data;
}

const json = (method, body) => ({ method, body: JSON.stringify(body) });

// ---------- Students ----------
// { firstName, lastName, email, phone, birthDate: 'YYYY-MM-DD' }
export const studentsApi = {
  getAll: () => request('/students'),
  getById: (id) => request(`/students/${id}`),
  create: (data) => request('/students', json('POST', data)),
  update: (id, data) => request(`/students/${id}`, json('PUT', data)),
  patch: (id, data) => request(`/students/${id}`, json('PATCH', data)),
  remove: (id) => request(`/students/${id}`, { method: 'DELETE' }),
};

// ---------- Courses ----------
// { code, name, description, maxCapacity }
export const coursesApi = {
  getAll: () => request('/courses'),
  getById: (id) => request(`/courses/${id}`),
  create: (data) => request('/courses', json('POST', data)),
  update: (id, data) => request(`/courses/${id}`, json('PUT', data)),
  remove: (id) => request(`/courses/${id}`, { method: 'DELETE' }),
};

// ---------- Enrollments ----------
// { studentId, courseId, enrollmentDate: 'YYYY-MM-DD' }
export const enrollmentsApi = {
  getAll: () => request('/enrollments'),
  getById: (id) => request(`/enrollments/${id}`),
  enroll: (data) => request('/enrollments', json('POST', data)),
  cancel: (id) => request(`/enrollments/${id}`, { method: 'DELETE' }),
};