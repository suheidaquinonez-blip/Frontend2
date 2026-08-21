import { supabase } from "../config/supabase";

export const getStudents = async () => {
  try {
    const { data, error } = await supabase
      .from('Table_Student')
      .select('*');

    if (error) {
      console.error('Error al obtener estudiantes:', error.message);
      return [];
    }

    return data;
  } catch (err) {
    console.error('Error de red o conexión:', err);
    return [];
  }
};