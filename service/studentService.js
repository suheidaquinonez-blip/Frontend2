import {supabase} from '../utils/supabaseClient.js';

export const getStudents = async () => {
    const {data, error} = await supabase
        .from('students')
        .select('*');

    if (error) {
        throw new Error (error.message);

    }
    return data;
};