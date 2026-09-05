<<<<<<< HEAD
import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import { supabase } from '../config/supabase'; 
import Footer from '../components/Footer';
=======
import { useEffect, useState } from 'react'
import StatCard from '../components/StatCard'
import { supabase } from '../config/supabase'
>>>>>>> main

function Dashboard() {
  const [counts, setCounts] = useState({
    students: 0,
    courses: 0,
    enrollments: 0,
<<<<<<< HEAD
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      // 1. Contar estudiantes
      const { count: studentCount } = await supabase
        .from('Student')
        .select('*', { count: 'exact', head: true });

      // 2. Contar cursos
      const { count: courseCount } = await supabase
        .from('course')
        .select('*', { count: 'exact', head: true });

      // 3. Contar matrículas
      const { count: enrollmentCount } = await supabase
        .from('enrollment')
        .select('*', { count: 'exact', head: true });

      setCounts({
        students: studentCount || 0,
        courses: courseCount || 0,
        enrollments: enrollmentCount || 0,
      });

      setLoading(false);
    }

    fetchCounts();
  }, []);

  return (
    <div className="p-6 flex flex-col justify-between min-h-[calc(100vh-2rem)]">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Bienvenido al Sistema de Gestión de Cursos
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <StatCard 
            title="Students" 
            total={loading ? "..." : counts.students} 
          />
          <StatCard 
            title="Courses" 
            total={loading ? "..." : counts.courses} 
          />
          <StatCard 
            title="Enrollments" 
            total={loading ? "..." : counts.enrollments} 
          />
        </div>
      </div>

      {/* Footer agregado al final de la página */}
      <Footer />
    </div>
  );
}

export default Dashboard;
=======
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCounts() {
      const { count: studentsCount, error: studentsError } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })

      const { count: coursesCount, error: coursesError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })

      const { count: enrollmentsCount, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })

      if (studentsError) console.error('Error students:', studentsError)
      if (coursesError) console.error('Error courses:', coursesError)
      if (enrollmentsError) console.error('Error enrollments:', enrollmentsError)

      setCounts({
        students: studentsCount ?? 0,
        courses: coursesCount ?? 0,
        enrollments: enrollmentsCount ?? 0,
      })
      setLoading(false)
    }

    fetchCounts()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-500 mt-1">
        Bienvenido al Sistema de Gestión de Cursos
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <StatCard title="Students" total={loading ? '...' : counts.students} />
        <StatCard title="Courses" total={loading ? '...' : counts.courses} />
        <StatCard title="Enrollments" total={loading ? '...' : counts.enrollments} />
      </div>
    </div>
  )
}

export default Dashboard
>>>>>>> main
