import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllEntradas, newEntrada, removeEntrada, updateEntrada } from "../services/entradas";
import { Entrada, EntradasResponse } from "../types";
import toast from "react-hot-toast";
import axios from "axios";

type ParamsTypes = {
  dateInitFormatted: string
  dateEndFormatted: string
}

// function isEntradaArray(object: unknown): object is Entrada[] {
//   return Array.isArray(object) && object.every(item => isEntrada(item));
// }

function isEntrada(object: unknown): object is Entrada {
  return typeof object === 'object' && object !== null && 'entradaId' in object && 'descripcion' in object;
}

const useEntradas = ({ dateInitFormatted, dateEndFormatted }: ParamsTypes) => {
  const ENTRADAS_QUERY_KEY = ['entradas', `${dateInitFormatted}-${dateEndFormatted}`]

  const { data: entradas, isPending, isError } = useQuery({
    queryKey: ENTRADAS_QUERY_KEY,
    queryFn: ()=> getAllEntradas({ 
      dateInit: dateInitFormatted,
      dateEnd: dateEndFormatted,
      isDesc: 'true',
      sortBy: 'FechaInicio'
    }),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })

  const queryClient = useQueryClient()

  const createEntrada = useMutation({
    mutationFn: newEntrada,
    onSuccess: (response)=> {
      const entradasEnCache: EntradasResponse | undefined = queryClient.getQueryData(ENTRADAS_QUERY_KEY);
        
      if(entradasEnCache !== undefined && isEntrada(response.data)){
        const cacheUpdated = { 
          ...entradasEnCache,
          results: entradasEnCache.results
            .concat(response.data)
            .sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime())
          
        }
        
        queryClient.setQueryData(ENTRADAS_QUERY_KEY, cacheUpdated)
        toast.success('Entrada agregada correctamente!')
      }
    },
    // onError: (error: Error | AxiosError)=> {
 
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
      console.log({ response: response.data });
      const entradasResponse: EntradasResponse | undefined = queryClient.getQueryData(ENTRADAS_QUERY_KEY);

      if(entradasResponse !== undefined){
        const entradasUpdated = entradasResponse.results
          .map(e=> e.entradaId === response.data.entradaId ? response.data : e)
          .sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime());
        
        const cacheUpdated: EntradasResponse = { ...entradasResponse, results: entradasUpdated } 


        queryClient.setQueryData(ENTRADAS_QUERY_KEY, cacheUpdated)
        toast.success('Entrada actualizada correctamente!')
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

  const deleteEntrada = useMutation({
    mutationFn: removeEntrada,
    onSuccess: (response, entradaId)=> {

      if(entradas !== undefined){
        const cacheUpdated = { 
          ...entradas,
          results: entradas.results
            .map(e=> e.entradaId.toString() === entradaId ? ({ ...e, eliminada: !e.eliminada }) : e)
            // .sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime())
        }

        queryClient.setQueryData(ENTRADAS_QUERY_KEY, cacheUpdated);
        
        const entrada: Entrada | undefined = cacheUpdated.results
          .find(c=> c.entradaId.toString() == entradaId);

        toast.success(`Entrada ${entrada?.eliminada ? 'deshabilitada' : 'recuperada'} correctamente!`)
      }
    },
    onError: (error)=> {
      console.log(error);
      if (axios.isAxiosError(error) )  {
        toast.error(error.response?.data?.errors[""] ?? 'Algo salio mal, no se pudo eliminar la entrada!')
      } else {
        toast.error('Algo salio mal, no se pudo eliminar la entrada!')
      }
    }
  })

  return {
    entradas,
    isPendingEntradas: isPending,
    isErrorEntradas: isError,
    createEntrada,
    deleteEntrada,
    updateEntrada: updateMutation
  }
}

export default useEntradas