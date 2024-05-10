import { Link } from "react-router-dom";

function App() {
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
          <div className="flex flex-col justify-center gap-2 max-w-sm mx-auto">
            <Link className="btn btn-outline btn-neutral uppercase" to='/auth/login'>
              Iniciar sesión
            </Link>
            <Link className="btn btn-neutral uppercase" to='/auth/register'>
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
