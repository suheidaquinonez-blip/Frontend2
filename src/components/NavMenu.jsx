<<<<<<< HEAD
=======
import { Link } from "react-router-dom";

>>>>>>> main
function NavMenu() {
  return (
    <nav>
      <ul className="flex flex-col space-y-2">
        <li>
<<<<<<< HEAD
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
=======
          <Link to="/" className="text-gray-700 hover:text-blue-500">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/courses" className="text-gray-700 hover:text-blue-500">
            Cursos
          </Link>
        </li>
        <li>
          <Link to="/students" className="text-gray-700 hover:text-blue-500">
            Estudiantes
          </Link>
        </li>
        <li>
          <Link to="/enrollments" className="text-gray-700 hover:text-blue-500">
            Matriculas
          </Link>
        </li>
        <li>
          <Link to="/prueba" className="text-gray-700 hover:text-blue-500">
            Layout Prueba
          </Link>
>>>>>>> main
        </li>
      </ul>
    </nav>
  );
}

export default NavMenu;