import { Link } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { FileIcon } from "./components/Icons";

function App() {
  const { isLogged } = useAuth()
  
 

  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <span className="block text-4xl mb-2">⚖</span>
          <h1 className="text-5xl md:text-7xl font-black">
            Balance App
          </h1>
          <p className="py-6 text-xl">
            Lleve un control de sus egresos e ingresos de forma sencilla
          </p>

          {isLogged() 
            ? <>
              <div className="stats min-h-28 gap-3 flex flex-wrap">
                <Link to='/dashboard' className="stat bg-base-200 flex basis-32">
                  <div className="stat-figure order-0 self-start">
                    <FileIcon />
                  </div>
                  <h3 className="text-xl self-center"> Dashboard  </h3>
                </Link>
             
                <Link to='/dashboard/cuentas' className="stat bg-base-200 flex basis-32">
                  <div className="stat-figure order-0 self-start">
                    <FileIcon />
                  </div>
                  <h3 className="text-xl self-center"> Cuentas  </h3>
                </Link>
     
                <Link to='/dashboard/categorias' className="stat bg-base-200 flex basis-32">
                  <div className="stat-figure order-0 self-start">
                    <FileIcon />
                  </div>
                  <h3 className="text-xl self-center"> Categorias  </h3>
                </Link>
               
                <Link to='/dashboard/informes' className="stat bg-base-200 flex basis-32">
                  <div className="stat-figure order-0 self-start">
                    <FileIcon />
                  </div>
                  <h3 className="text-xl self-center"> Estadisticas  </h3>
                </Link>
              </div>
         
            </>
            :
              <div className="flex flex-col justify-center gap-2 max-w-sm mx-auto">
                <Link className="btn btn-outline btn-neutral uppercase" to='/auth/login'>
                  Iniciar sesión
                </Link>
                <Link className="btn btn-neutral uppercase" to='/auth/register'>
                  Registrarse
                </Link>
              </div>
     
          }


        </div>
      </div>
    </div>
  );
}

export default App;
