import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginSchemaType } from "../schemas/authSchema";
import { useForm } from "react-hook-form";
import { loginService } from "../services/auth.ts";
import useAuth from "../hooks/useAuth.ts";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm<LoginSchemaType>({ 
    resolver: zodResolver(LoginSchema)
  });

  const onSubmit = (data: LoginSchemaType)=> {
    loginService(data)
      .then((response)=> {
        if(response?.accessToken){
          login(response);

          navigate('/dashboard') 
        }

        // aca se puede guardar una referencia de la pagina que se intento visitar
        // navigate(reference)
      })
      .catch(error=> {
        if (error.response) {
   
          const message = error.response.data.message || 'Contraseña o correo incorrecto!';
          setError("root", { type: "manual", message });
        } 
      
      }).finally(()=> {
        setTimeout(()=> {
          clearErrors(undefined)
        }, 4000)
      })

  }

  return (
    <section className="shadow-lg bg-base-100 w-2/6 p-4 rounded-md">
      <h1 className="text-2xl font-bold text-center">Iniciar sesion 🔏</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {errors.root && <div>
           <p className="text-error"> {errors.root.message} </p>
        </div>}

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Correo electronico</span>
          </div>
          <input
            {...register('email')}
            type="email"
            id="email"
            className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
            placeholder="Ingrese su correo"
          />
          {errors.email && <div className="label">
            <span className="label-text text-error">{errors.email.message}</span>
          </div>}
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Contraseña</span>
          </div>
          <input
            {...register('password')}
            type="password"
            id="password"
            className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
            placeholder="Ingrese su contraseña"
          />
          {errors.password && <div className="label">
            <span className="label-text text-error">{errors.password.message}</span>
          </div>}
        </label>
        <button className="btn btn-neutral w-full my-4" type="submit">
          Iniciar sesion
        </button>

        <p className="text-neutral text-center"> 
          No tienes una cuenta? <Link to='/auth/register' className="hover:underline">Registrate</Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
