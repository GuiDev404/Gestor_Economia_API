import { Link, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth";
import { MenuIcon } from "./Icons";

type NavItem = { url: string, label: string }

interface NavbarProps {
  items: NavItem[]
}

const Navbar = ({ items = [] }: NavbarProps) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate()
  
  console.log(user);

  const handleLogout = ()=> {
    logout()
    navigate('/auth/login')
  }

  const sharedContent = <>

    <div className='flex md:items-center flex-col md:flex-row gap-2'>
      <Link to='/' className="text-lg font-semibold me-2">BalanceApp</Link>
      {items.map((navItem)=> <Link key={navItem.label} to={navItem.url}>{navItem.label}</Link>)}
    </div>

    <div className="flex md:items-center flex-col md:flex-row gap-2 justify-end grow md:mt-0">
      <strong> {user?.email} </strong>
      <button className='btn btn-sm btn-neutral' onClick={handleLogout}>
        Cerrar sesion
      </button>
    </div>
  </>

  return (
    <nav className='navbar  px-0'>
      {/* mobile */}
      <div className="drawer md:hidden z-50">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content ms-auto">
          {/* Page content here */}
          <label htmlFor="my-drawer" className="btn btn-sm w-10 btn-neutral drawer-button ">
            <MenuIcon width={20} height={20} />
          </label>
        </div> 
        <div className="drawer-side">
          <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <div className="menu p-4 w-4/5 sm:w-3/5 md:w-80 min-h-full bg-base-200 text-base-content">
            {sharedContent}
          </div>
        </div>
      </div>

      {/* md > */}
      <div className="hidden md:flex justify-between items-center w-full">
        {sharedContent}
      </div>
    </nav>
  )
}

export default Navbar