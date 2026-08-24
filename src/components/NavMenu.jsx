function NavMenu() {
  return (
    <nav>
      <ul className="flex flex-col space-y-2">
        <li>
          <a href="/" className="text-gray-700 hover:text-blue-500">
            Dashboard
          </a>
        </li>
        <li>
          <a href="/courses" className="text-gray-700 hover:text-blue-500">
            Cursos
          </a>
        </li>
        <li>
          <a href="/students" className="text-gray-700 hover:text-blue-500">
            Estudiantes
          </a>
        </li>
        <li>
          <a href="/enrollments" className="text-gray-700 hover:text-blue-500">
            Matriculas
          </a>
        </li>
        <li>
          <a href="/prueba" className="text-gray-700 hover:text-blue-500">
            Layout Prueba
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default NavMenu;