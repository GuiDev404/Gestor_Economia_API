import { useContext } from 'react'
import { AuthContext } from '../context/AuthProvider';

const useAuth = () => {
  const context = useContext(AuthContext);
  
  if(!context){
    throw new Error('Debe usarse dentro de un provider')
  }

  return context
}

export default useAuth