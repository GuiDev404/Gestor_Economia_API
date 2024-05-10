
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar';

const navItems = [
  { url: '/dashboard', label: 'Entradas' },
  { url: '/dashboard/cuentas', label: 'Cuentas' },
  { url: '/dashboard/categorias', label: 'Categorias' }
]

const DashboardLayout = () => {

  return (
    <div className='min-h-screen p-4 max-w-screen-md w-[95%] mx-auto'>
      <Navbar items={navItems} />

      <main className='my-4'>
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout