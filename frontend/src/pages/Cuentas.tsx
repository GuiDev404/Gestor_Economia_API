import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AxiosError, isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import List from "../components/List";
import Cuenta from "../components/Cuenta";
import Modal, { ButtonCloseModal, ModalBody, ModalContent, ModalHeader } from "../components/Modal";
import Input from "../components/Input";
import InputEmojiPicker from "../components/InputEmojiPicker";
import Alert from "../components/Alert";

import useCuentas from "../hooks/useCuentas";
import useDisclosure from "../hooks/useDisclousure";

import { CuentaFormSchemaType, cuentaFormSchema, ErrorKeysFormSchema, KeysFormSchema } from "../schemas/cuentaSchema";

const Cuentas = () => {
  const { cuentas, isPendingCuentas, createCuenta, deleteCuenta, updateMutation } = useCuentas()
  const { register, handleSubmit, control, formState: { errors }, watch, setValue, setError, clearErrors, reset } = useForm<CuentaFormSchemaType & { ""?: string }>({
    resolver: zodResolver(cuentaFormSchema) // ver esto faltan prop como id y otras creo
  })
  const [ modeEdit, setModeEdit ] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure({ 
    cbOnClose: ()=> {
      reset()
      setModeEdit(false)
    }
  });
  const { isOpen: showEmojiPicker, toggle: toggleVisibilityEmojiPicker } = useDisclosure();

  const onError = (error: Error | AxiosError) => {
    if(isAxiosError(error)){

      const errorsList: [string, string[] | string][] = Object.entries(error.response?.data.errors)
      
      for (const [key, errors] of errorsList) {
        if(Array.isArray(errors)) {
          setError(key.toLowerCase() as ErrorKeysFormSchema, { message: errors[0], type: 'prop_validation' })
        } else {
 
          if(error.response?.status && [400, 500].includes(error.response.status)){
            onClose();
            toast.error(errors)
            return;
          } 

          setError(key.toLowerCase() as ErrorKeysFormSchema, { message: errors, type: 'general' })
        }
      }
    }

  }

  const onSubmit: SubmitHandler<CuentaFormSchemaType> = (data): void => {
    if(!data.id){
      const { color, descripcion, emoji, titulo } = data; 
      createCuenta.mutate({ color, descripcion, emoji, titulo }, {
        onSuccess: ()=> {
          onClose();
        },
        onError,
      });
    } else {
      // update mutation
      const { id: cuentaId, ...cuentaActualizada } = data; 
      
      updateMutation.mutate({ cuentaId, data: { ...cuentaActualizada, cuentaId: parseInt(cuentaId, 10) } }, {
        onSuccess: ()=> {
          onClose();
          console.log('CUENTA ACTUALIZADA: ', { cuentaId, ...cuentaActualizada });
        },
        onError
      });

    }
  }

  const handleDelete = (id: string)=>  {
    return ()=> {
      deleteCuenta.mutate(id);
    }
  }

  useEffect(()=> {
    const errorsEntries = Object.entries(errors);
    
    if(
      (createCuenta.error !== null || updateMutation.error !== null) &&
      ['general', 'prop_validation'].includes(errorsEntries?.[0]?.[1]?.type as string)
    ){
      setTimeout(()=> {
        clearErrors();
      }, 4000)
    }
  }, [errors, createCuenta.error, updateMutation.error, clearErrors])


  const handleModeEdit = (id: string | number)=> {
    return ()=> {
      const cuenta = cuentas?.find(cuenta=> cuenta.cuentaId === id)
      
      if(cuenta){
        const { cuentaId, color, emoji, titulo, descripcion } = cuenta
        const entidadActualizar = Object.entries({ 
          color, emoji, titulo, descripcion, id: cuentaId.toString()
        })
      
        for (const [ key, value ] of entidadActualizar) {
          setValue(key as KeysFormSchema, value)
        }

        onOpen()
        setModeEdit(true)
      } else {
        toast.error('No se encontro la cuenta')
      }

    }
  }
   
  return (
    <div>
       <Modal onClose={onClose} isOpen={isOpen} size="sm">

        <ModalContent className="bg-neutral text-white">
          <ModalHeader className="flex justify-between items-center">
            <h1 className="text-xl font-bold"> {modeEdit ? 'Editar cuenta' : 'Nueva cuenta'} </h1>
            <ButtonCloseModal />
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}> 
              {errors[""]?.type === 'general' && 
                <Alert type="error" message={errors[""]?.message?.toString() ?? ''} />
              }

              <input type="hidden"  {...register('id')} />

              <div className="grid grid-cols-9 gap-2">
                <div className="col-span-1">
                  <div className="form-control w-full relative">
                    <label htmlFor="color" className="label text-sm">Icono</label>
                    <input 
                      type="color"
                      id="color"
                      className="color-input w-full grow" {...register('color')}
                    />
                    <span 
                      className="absolute top-12 left-3 text-xl cursor-pointer"
                      onClick={toggleVisibilityEmojiPicker}
                    > 
                      {watch('emoji') || '💡'}
                    </span>
                    <InputEmojiPicker
                      name="emoji"
                      control={control}
                      isOpen={showEmojiPicker}
                      toggleVisibilityEmojiPicker={toggleVisibilityEmojiPicker}
                    />
                  </div>
              
                </div>

                <div className="col-span-8">
                  <Input
                    label="Titulo"
                    {...register('titulo')}
                    error={errors.titulo?.message?.toString()}
                    placeholder="Ingrese el titulo de la cuenta"
                    isRequired
                  />
                </div>

                <div className="col-span-full">
                  <div className="form-control gap-1 justify-between w-full">
                    <label htmlFor="descripcion" className="label justify-start gap-2">
                      Descripcion
                      <span className="text-red-400">*</span>
                    </label>
                    <textarea id="descripcion" {...register('descripcion')} className="textarea textarea-bordered text-black" placeholder="Ingrese una descripcion para la cuenta"></textarea>
                  </div>
                </div>
                
              </div>

              <button 
                type="submit"
                disabled={createCuenta.isPending} 
                className={`btn w-full uppercase mt-4 ${createCuenta.isPending ? 'btn-disabled' : ''}`}
               >
                Guardar
              </button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <header className="flex gap-4 mb-4">
        <h2 className="text-2xl font-bold"> Cuentas </h2>

        <button className="btn btn-sm btn-neutral" onClick={onOpen}>+</button>
      </header>

      <div className="flex flex-col">
        {isPendingCuentas ? (
          <div className="flex flex-col gap-2">
            <div className="skeleton h-16 w-full"></div>
            <div className="skeleton h-16 w-full"></div>
          </div>
        ) : (
          <List
            items={cuentas}
            selectKey={cuenta=> typeof cuenta === 'string' ? cuenta : cuenta.cuentaId}
            render={cuenta=> 
              <Cuenta 
                cuenta={cuenta}
                handleDelete={handleDelete}
                handleEdit={handleModeEdit}
              />
            }
            classNameItem="flex gap-4 bg-base-200 mb-2 rounded-md p-2 group"
            emptyStateMsg="No hay cuentas aun, agregue alguna!"
          />
        )}
      </div>
    </div>
  );
};

export default Cuentas;
