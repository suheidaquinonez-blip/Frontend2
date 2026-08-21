import Header from '../components/Header'
import Footer from '../components/Footer'
import StundentTables from '../components/StundentTables'

function Students() {
  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen">
      <div>
        <Header 
          title="Estudiantes" 
          description="Gestión de estudiantes registrados" 
          txtButton="Nuevo Estudiante" 
        />

        <div className="p-6">
          <StundentTables />
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Students