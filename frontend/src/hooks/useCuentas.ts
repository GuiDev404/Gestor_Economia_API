import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllCuentas, newCuenta, removeCuenta, updateCuenta } from "../services/cuentas";
import { Cuenta } from "../types";
import toast from "react-hot-toast";
import axios from "axios";

const CUENTAS_QUERY_KEY = 'cuentas';

const useCuentas = () => {
  const { data: cuentas, isPending, isError } = useQuery({
    queryKey: [CUENTAS_QUERY_KEY],
    queryFn: getAllCuentas,
  });

  const queryClient = useQueryClient()

  const createCuenta = useMutation({
    mutationFn: newCuenta,
    onSuccess: (response)=> {
      const categoriasEnCache: Cuenta[] | undefined = cuentas || queryClient.getQueryData([CUENTAS_QUERY_KEY]);

      if(categoriasEnCache !== undefined){
        const cacheUpdated = categoriasEnCache.concat(response.data as Cuenta)
        
        queryClient.setQueryData([CUENTAS_QUERY_KEY], cacheUpdated)
        toast.success('Cuenta agregada correctamente!')
      }
    },
    // onError: (error: Error | AxiosError)=> {
      // console.log(error);
  
      // if (axios.isAxiosError(error))  {
      //     setTimeout(()=> {
      //       createCuenta.reset();
      //     }, 3500)
      // } 
  
    // }
  })

  const updateMutation = useMutation({
    mutationFn: updateCuenta,
    onSuccess: (response)=> {
      const categoriasEnCache: Cuenta[] | undefined = cuentas || queryClient.getQueryData([CUENTAS_QUERY_KEY]);

      if(categoriasEnCache !== undefined){
        const cacheUpdated = categoriasEnCache.map(categoria=> (
          categoria.cuentaId === response.data.cuentaId ? response.data : categoria
        ));

        queryClient.setQueryData([CUENTAS_QUERY_KEY], cacheUpdated)
        toast.success('Cuenta actualizada correctamente!')
      }

    },
    // onError: (error)=> {
    //   console.log({ updateCategoriaError: error });

    //   if (axios.isAxiosError(error))  {
    //     setTimeout(()=> {
    //       updateMutation.reset();
    //     }, 3500)
    //   } 

    // }
  })

  const deleteCuenta = useMutation({
    mutationFn: removeCuenta,
    onSuccess: (response, variables)=> {
      // console.log('delete categoria: ',{ response, variables });
      const categoriasEnCache: Cuenta[] | undefined = cuentas || queryClient.getQueryData([CUENTAS_QUERY_KEY]);

      if(categoriasEnCache !== undefined){
        const cuentaId = parseInt(variables, 10);
        const cacheUpdated = categoriasEnCache.map(c=> {
          return c.cuentaId === cuentaId ? ({ ...c, eliminada: !c.eliminada }) : c
        })
        
        const categoria: Cuenta | undefined = cacheUpdated.find(c=> c.cuentaId == cuentaId);
        queryClient.setQueryData([CUENTAS_QUERY_KEY], cacheUpdated);

        toast.success(`Cuenta ${categoria?.eliminada ? 'deshabilitada' : 'recuperada'} correctamente!`)
      }
    },
    onError: (error)=> {
      console.log(error);
      if (axios.isAxiosError(error) )  {
        toast.error(error.response?.data?.errors[""] ?? 'Algo salio mal, no se pudo eliminar la categoria!')
      } else {
        toast.error('Algo salio mal, no se pudo eliminar la categoria!')
      }
    }
  })

  return {
    cuentas,
    isPendingCuentas: isPending,
    isErrorCuentas: isError,
    createCuenta,
    deleteCuenta,
    updateMutation
  }
}

export default useCuentas