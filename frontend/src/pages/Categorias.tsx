import { useForm } from "react-hook-form";
import { TiposEntradas } from "../types.d";
import Input from "../components/Input";
import InputEmojiPicker from "../components/InputEmojiPicker";
import Modal, { ModalBody, ModalContent, ModalOverlay, ModalHeader, ButtonCloseModal } from "../components/Modal"
import useDisclosure from "../hooks/useDisclousure"
import { useCategorias } from "../hooks/useCategorias";

import { zodResolver } from "@hookform/resolvers/zod";
import { CategoriaCreateSchemaType, categoriaCreateSchema } from "../schemas/categoriaSchema";
import List from "../components/List";
import Categoria from "../components/Categoria";
import { useState } from "react";
import axios from "axios";
import { ErrorIcon } from "../components/Icons";
 
const Categorias = () => {
  const { categorias, isError, isPending, createCategoria, deleteCategoria, updateMutation } = useCategorias()
  const { register, handleSubmit, control, formState: { errors }, watch, setValue, reset } = useForm({
    resolver: zodResolver(categoriaCreateSchema) // ver esto faltan prop como id y otras creo
  })
  const [ modeEdit, setModeEdit ] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure({ 
    cbOnClose: ()=> {
      reset()
      setModeEdit(false)
    }
  });
  const { isOpen: showEmojiPicker, toggle: toggleVisibilityEmojiPicker } = useDisclosure();


  console.log(errors);

  const onSubmit = (data: CategoriaCreateSchemaType) => {
    if(!data.id){
      const { id, ...nuevaCategoriaData } = data; 
      createCategoria.mutate(nuevaCategoriaData, {
        onSuccess: ()=> {
          onClose();
        }
      });
    } else {
      // update mutation
      const { id: categoriaId, ...nuevaCategoriaData } = data; 

      updateMutation.mutate({ categoriaId, data: { ...nuevaCategoriaData, categoriaId } }, {
        onSuccess: ()=> {
          onClose();
        }
      });
    }
  }

  const handleDelete = (id: string)=>  {
    return ()=> {
      deleteCategoria.mutate(id);
    }
  }

  const handleModeEdit = (id: string | number)=> {
    return ()=> {
      const categoria = categorias?.find(equipo=> equipo.categoriaId === id)
      
      if(categoria){
        const { categoriaId, color, emoji, nombre, tipoEntrada } = categoria
        const entidadActualizar = Object.entries({ 
          color, emoji, nombre, tipoEntrada, id: categoriaId.toString()
        })
      
        for (const [ key, value ] of entidadActualizar) {
          setValue(key, value)
        }

        onOpen()
        setModeEdit(true)
      }

    }
  }

  console.log(createCategoria.error, updateMutation.error);
  // console.log({ categorias, isPending, isError });

  // console.log(isError && createCategoria.error);
  const errores = (createCategoria.error || updateMutation.error)
  const alertError = errores ? errores?.message || 'Lo sentimos algo salio mal!' : ''
  
  const egresos = isPending
    ? []
    : categorias?.filter((c) => c.tipoEntrada === TiposEntradas.Egreso);
  const ingresos = isPending
    ? []
    : categorias?.filter((c) => c.tipoEntrada === TiposEntradas.Ingreso);

  return (
    <div>
       <header className="flex gap-4 mb-4">
        <h2 className="text-2xl font-bold"> Categorias </h2>
        <button className="btn btn-sm btn-neutral" onClick={onOpen}>+</button>
      </header>

      <Modal onClose={onClose} isOpen={isOpen} size="sm">
        <ModalOverlay />
        <ModalContent className="bg-neutral text-white">
          <ModalHeader className="flex justify-between items-center">
            <h1 className="text-xl font-bold"> {modeEdit ? 'Editar categoria' : 'Nueva categoria'} </h1>
            <ButtonCloseModal />
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}> 
             {alertError && (
               <div role="alert" className="alert alert-error text-white my-4">
                <ErrorIcon />
                <span>{alertError}</span>
              </div>
             )}

              <input type="hidden"  {...register('id')} />

              <div className="grid grid-cols-9 gap-2">
                <div className="col-span-1">
                  <div className="form-control w-full relative">
                    <label htmlFor="color" className="label text-sm">Icono</label>
                    <input type="color" id="color" className="color-input w-full grow" {...register('color')} />
                    <span className="absolute top-12 left-3 text-xl cursor-pointer" onClick={toggleVisibilityEmojiPicker}> 
                    {watch('emoji') || '💡'}
                  </span>
                    <InputEmojiPicker 
                      control={control}
                      isOpen={showEmojiPicker}
                      toggleVisibilityEmojiPicker={toggleVisibilityEmojiPicker}
                    />
                  </div>
              

                </div>

                <div className="col-span-8">
                  <Input 
                    label="Nombre"
                    name="nombre"
                    register={register}
                    errors={errors}
                    placeholder="Ingrese el nombre de la categoria"
                    required
                  />
                </div>

                <div className="col-span-full">
                  <div className="form-control gap-1 justify-between w-full">
                    <label htmlFor="tipoEntrada" className="label justify-start gap-2">
                      Tipo de entrada
                      <span className="text-red-400">*</span>
                    </label>
                    <select className="select select-bordered select-md w-full text-black" id="tipoEntrada" {...register('tipoEntrada')} defaultValue='' >
                      <option value="" hidden>[TIPO DE ENTRADA]</option>
                      <option value="0">Egreso</option>
                      <option value="1">Ingreso</option>
                    </select>
                  </div>
                </div>
                
              </div>

              <button type="submit" disabled={createCategoria.isPending} className={`btn w-full uppercase mt-4 ${createCategoria.isPending ? 'btn-disabled' : ''}`}>
                Guardar
              </button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <div role="tablist" className="tabs tabs-lifted">
        <input
          type="radio"
          name="cuentas"
          role="tab"
          className="tab rounded-b-lg"
          aria-label="Egresos"
          defaultChecked
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          {isPending ? (
            <div className="flex flex-col gap-2">
              <div className="flex h-9 gap-x-2 px-2">
                <div className="skeleton w-10 rounded-md"></div>
                <div className="skeleton grow rounded-md"></div>
              </div>
              <div className="flex h-9 gap-x-2 px-2">
                <div className="skeleton w-10 rounded-md"></div>
                <div className="skeleton grow rounded-md"></div>
              </div>
            </div>
          ) : (
            <List
              items={egresos}
              selectKey={categoria=> categoria.categoriaId}
              classNameItem={categoria=> `${categoria.eliminada ? 'opacity-25' : ''} flex gap-4 items-center hover:bg-base-200 mb-2 rounded-md p-2`}
              render={categoria=> <Categoria {...categoria} handleDelete={handleDelete} handleEdit={handleModeEdit} />}
              emptyStateMsg="No hay categorias aun, agregue alguna!"
            />
          )}
        </div>

        <input
          type="radio"
          name="cuentas"
          role="tab"
          className="tab checked:rounded-b-lg"
          aria-label="Ingresos"
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          {isPending ? (
            <>
              <div className="skeleton h-6 w-full"></div>
              <div className="skeleton h-6 w-full"></div>
            </>
          ) : (
            <List
              items={ingresos}
              selectKey={categoria=> categoria.categoriaId}
              classNameItem={categoria=> `${categoria.eliminada ? 'opacity-25' : ''} flex gap-4 items-center hover:bg-base-200 mb-2 rounded-md p-2`}
              render={categoria=> <Categoria {...categoria} handleDelete={handleDelete} handleEdit={handleModeEdit} />}
            />
       
          )}
        </div>
      </div>
    </div>
  );
};

export default Categorias;
