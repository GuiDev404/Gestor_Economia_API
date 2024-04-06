import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllEntradas, newEntrada, removeEntrada, updateEntrada } from "../services/entradas";
import { Cuenta, Entrada } from "../types";
import toast from "react-hot-toast";
import axios from "axios";

const ENTRADAS_QUERY_KEY = 'entradas';

type ParamsTypes = {
  dateInitFormatted: string
  dateEndFormatted: string
}

const useEntradas = ({ dateInitFormatted, dateEndFormatted }: ParamsTypes) => {
  const { data: entradas, isPending, isError } = useQuery({
    queryKey: [ENTRADAS_QUERY_KEY, `${dateInitFormatted}-${dateEndFormatted}`],
    queryFn: ()=> getAllEntradas({ 
      dateInit: dateInitFormatted,
      dateEnd: dateEndFormatted,
      isDesc: 'true',
      sortBy: 'FechaInicio'
    }),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const queryClient = useQueryClient()

  const createCuenta = useMutation({
    mutationFn: newEntrada,
    onSuccess: (response)=> {
      const entradasEnCache: Entrada[] | undefined = queryClient.getQueryData([ENTRADAS_QUERY_KEY]);

      if(entradasEnCache !== undefined){
        const cacheUpdated = entradasEnCache.concat(response.data as Entrada)
        
        queryClient.setQueryData([ENTRADAS_QUERY_KEY], cacheUpdated)
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
    mutationFn: updateEntrada,
    onSuccess: (response)=> {
      const categoriasEnCache: Cuenta[] | undefined = queryClient.getQueryData([ENTRADAS_QUERY_KEY]);

      if(categoriasEnCache !== undefined){
        const cacheUpdated = categoriasEnCache.map(categoria=> (
          categoria.cuentaId === response.data.cuentaId ? response.data : categoria
        ));

        queryClient.setQueryData([ENTRADAS_QUERY_KEY], cacheUpdated)
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
    mutationFn: removeEntrada,
    onSuccess: (response, variables)=> {
      // console.log('delete categoria: ',{ response, variables });
      const entradasEnCache: Entrada[] | undefined = queryClient.getQueryData([ENTRADAS_QUERY_KEY]);

      if(entradasEnCache !== undefined){
        const cuentaId = parseInt(variables, 10);
        const cacheUpdated = entradasEnCache.map(c=> {
          return c.cuentaId === cuentaId ? ({ ...c, eliminada: !c.eliminada }) : c
        })
        
        const entrada: Entrada | undefined = cacheUpdated.find(c=> c.cuentaId == cuentaId);
        queryClient.setQueryData([ENTRADAS_QUERY_KEY], cacheUpdated);

        toast.success(`Cuenta ${entrada?.eliminada ? 'deshabilitada' : 'recuperada'} correctamente!`)
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
    entradas,
    isPendingEntradas: isPending,
    isErrorEntradas: isError,
    createCuenta,
    deleteCuenta,
    updateCuenta: updateMutation
  }
}

export default useEntradas