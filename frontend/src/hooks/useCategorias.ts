import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllCategorias, newCategoria, removeCategoria, updateCategoria } from "../services/categorias";
import { Categoria } from "../types";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";

const CATEGORIA_QUERY_KEY = "categorias"

export const useCategorias = () => {
  const { data: categorias, isPending, isError, error } = useQuery({
    queryKey: [CATEGORIA_QUERY_KEY],
    queryFn: getAllCategorias,
    refetchOnWindowFocus: false
  });

  const queryClient = useQueryClient()
 
  const createCategoria = useMutation({
    mutationFn: newCategoria,
    onSuccess: (response)=> {

      const categoriasEnCache: Categoria[] | undefined = categorias || queryClient.getQueryData([CATEGORIA_QUERY_KEY]);

      if(categoriasEnCache !== undefined){
        const cacheUpdated = categoriasEnCache.concat(response.data as Categoria)
        
        queryClient.setQueryData([CATEGORIA_QUERY_KEY], cacheUpdated)
        toast.success('Categoria agregada correctamente!')
      }
    },
    onError: (error: Error | AxiosError)=> {
      console.log(error);

      if (axios.isAxiosError(error))  {
        // if(error.response?.status === 409){
          setTimeout(()=> {
            createCategoria.reset();
          }, 3500)
        // } 
      } 

    }
  })

  const updateMutation = useMutation({
    mutationFn: updateCategoria,
    onSuccess: (response)=> {
      const categoriasEnCache: Categoria[] | undefined = categorias || queryClient.getQueryData([CATEGORIA_QUERY_KEY]);

      if(categoriasEnCache !== undefined){
        const cacheUpdated = categoriasEnCache.map(categoria=> (
          categoria.categoriaId === response.data.categoriaId ? response.data : categoria
        ));

        queryClient.setQueryData([CATEGORIA_QUERY_KEY], cacheUpdated)
        toast.success('Categoria actualizada correctamente!')
      }

    },
    onError: (error)=> {
      console.log({ updateCategoriaError: error });

      // if(error.response.status === 404){
      //   toast.error(error.response?.data?.message ?? 'No se encontro el medio!')
      // } else {
      //   toast.error('Algo salio mal, no se pudo editar el medio!')
      // }
    }
  })

  const deleteCategoria = useMutation({
    mutationFn: removeCategoria,
    onSuccess: (response, variables)=> {
      console.log('delete categoria: ',{ response, variables });
      const categoriasEnCache: Categoria[] | undefined = categorias || queryClient.getQueryData([CATEGORIA_QUERY_KEY]);

      if(categoriasEnCache !== undefined){
        const cacheUpdated = categoriasEnCache.map(c=> {
          return c.categoriaId === parseInt(variables, 10) ? ({ ...c, eliminada: !c.eliminada }) : c
        })
        queryClient.setQueryData([CATEGORIA_QUERY_KEY], cacheUpdated)
        toast.success('Categoria eliminada correctamente!')
      }
    },
    onError: (error)=> {
      // const ERROR_MSG_STATUS = [404, 400]
      console.log(error);
      // if(ERROR_MSG_STATUS.includes(error.response.status)){
      //   toast.error(error.response?.data?.message ?? 'No se encontro el medio!')
      // } else {
      //   toast.error('Algo salio mal, no se pudo eliminar el medio!')
      // }
    }
  })

  // const cachedMedios = ()=> queryClient.getQueryData([QUERY_KEY])

  return {
    categorias,
    isPending,
    isError,
    error,
    createCategoria,
    deleteCategoria,
    updateMutation
  }
}
