
import { Link, Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const DashboardLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate()

  const handleLogout = ()=> {
    logout()
    navigate('/auth/login')
  }

  return (
    <div className='min-h-screen p-4'>
      <nav className=' flex justify-between items-center'>
        <div className='flex gap-2'>
          <Link to='/dashboard'> Entradas </Link>
          <Link to='/dashboard/cuentas'> Cuentas </Link>
          <Link to='/dashboard/categorias'> Categorias </Link>

        </div>

        <button className='btn btn-sm btn-neutral' onClick={handleLogout}>
          Cerrar sesion
        </button>
      </nav>

      <main className='my-4'>
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout