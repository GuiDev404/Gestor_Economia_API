import { useQuery } from "@tanstack/react-query"
import { getAllEntradas } from "../services/entradas"
import Modal, { ModalBody, ModalContent, ModalOverlay, ModalHeader, ButtonCloseModal } from "../components/Modal"
import useDisclosure from "../hooks/useDisclousure"
import { useState } from "react";
import Entrada from "../components/Entrada";
import List from "../components/List";
import Input from "../components/Input";
import Select from "../components/Select";
import { useCategorias } from "../hooks/useCategorias";
import useCuentas from "../hooks/useCuentas";
import { Categoria, TiposEntradas } from "../types.d";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EntradaFormSchemaType, entradaFormSchema } from "../schemas/entradaSchema";
import useEntradas from "../hooks/useEntradas";

const formatZeroInDate = (date: number)=> date < 10 ? `0${date}` : date

function dateBetween (dateSelected: string){
  const [year, month] = dateSelected.split('-').map(Number);
  
  const dateInit = new Date(year, month - 1, 1);
  const dateEnd = new Date(year, month, 0);

  const yearInit = dateInit.getFullYear()
  const monthInit = formatZeroInDate(dateInit.getMonth() + 1)
  const monthDayInit = formatZeroInDate(dateInit.getDate())

  const dateInitFormatted = `${yearInit}-${monthInit}-${monthDayInit}`

  const yearEnd = dateEnd.getFullYear()
  const monthEnd = formatZeroInDate(dateEnd.getMonth() + 1)
  const monthDayEnd = formatZeroInDate(dateEnd.getDate())

  const dateEndFormatted = `${yearEnd}-${monthEnd}-${monthDayEnd}`

  return [ dateInitFormatted, dateEndFormatted ]
}

const Entradas = () => {
  const [ dateSelected, setDateSelected ] = useState(()=> {
    const currentDate = new Date()
    return `${currentDate.getFullYear()}-${formatZeroInDate(currentDate.getMonth() + 1)}`
  })
  const [ modeEdit, setModeEdit ] = useState(false);

  const [ dateInitFormatted, dateEndFormatted ] = dateBetween(dateSelected)
  const { entradas, isPendingEntradas } = useEntradas({ dateEndFormatted, dateInitFormatted });

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<EntradaFormSchemaType>({
    resolver: zodResolver(entradaFormSchema) 
  })

  const { isOpen, onClose, onOpen } = useDisclosure({ 
    cbOnClose: ()=> {
      reset()
      setModeEdit(false)
    }
  });


  const { categorias, isPending: isPendingCategorias } = useCategorias()
  const { cuentas, isPendingCuentas } = useCuentas()

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>)=> {
    setDateSelected(e.currentTarget.value)
  }
  
  // let categoriasAgrupadasPorTipo = isPendingCategorias 
  //   ? {}
  //   : Object.groupBy(categorias, ({ tipoEntrada }: { tipoEntrada: TiposEntradas }) => tipoEntrada);
    
  // categoriasAgrupadasPorTipo = Object.entries(categoriasAgrupadasPorTipo);
  
  const montoActual = watch('monto');
  const esEgreso = montoActual < 0;

  function onSubmit (data: EntradaFormSchemaType){
    console.log(data);
  }

  return (
    <div className="">
      <Modal onClose={onClose} isOpen={isOpen} size="sm">
        <ModalOverlay />
        <ModalContent className="bg-neutral text-white">
          <ModalHeader className="flex justify-between items-center">
            <h1 className="text-xl font-bold"> {modeEdit ? 'Editar entrada' : 'Nueva entrada'} </h1>
            <ButtonCloseModal />
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>

              {/* <input type="checkbox" className="toggle toggle-error" checked /> */}

              <input type="hidden"  {...register('id')} />

              <div className="grid grid-cols-12 gap-2">

                <div className="col-span-full md:col-span-4">
                  <Input 
                    {...register('descripcion')}
                    error={errors.descripcion?.message}
                    label="Descripcion"
                    placeholder="Ingrese el nombre de la entrada"
                    isRequired
                  />
                </div>
                
                <div className="col-span-full md:col-span-4">
                  <Input 
                    {...register('monto')}
                    error={errors.monto?.message}
                    type="number"
                    label="Monto"
                    placeholder="Ingrese el monto"
                    isRequired
                  />
                </div>

                <div className="col-span-full md:col-span-4">
                  <Input
                    {...register('fechaInicio')}
                    error={errors.fechaInicio?.message}
                    type="date"
                    label="Fecha"
                    isRequired
                  />
                </div>

                <div className="col-span-full md:col-span-6">
                  <Select
                    {...register('cuentaId')}
                    label="Cuentas"
                    error={errors.cuentaId?.message}
                    placeholder="SELECCIONE UNA CUENTA"
                    isRequired
                    disabled={isPendingCuentas}
                  >
                    {isPendingCuentas && cuentas
                      ? ''
                      : cuentas?.map(cuenta=> (
                          !cuenta.eliminada && <option key={cuenta.cuentaId} value={cuenta.cuentaId}>
                            {cuenta.descripcion}
                          </option>
                        ))
                    }
                  </Select>
                </div>

                <div className="col-span-full md:col-span-6">
                  <Select
                    {...register('categoriaId')}
                    label="Categorias"
                    error={errors.categoriaId?.message}
                    placeholder="SELECCIONE UNA CATEGORIA"
                    isRequired
                    disabled={isPendingCategorias || isNaN(montoActual) || montoActual === 0 || errors.monto?.message !== undefined}
                  >
                    {isPendingCategorias && categorias
                      ? ''
                      : categorias?.filter((categoria: Categoria) => {
                          if(!montoActual) return categoria;
                    
                          if(esEgreso && categoria.tipoEntrada === TiposEntradas.Egreso){
                            return categoria
                          } 
                          if(!esEgreso && categoria.tipoEntrada === TiposEntradas.Ingreso){
                            return categoria
                          } 
                    
                        })
                        .map((categoria: Categoria) => {
                          if(!categoria.eliminada) {
                            return (
                              <option key={categoria.categoriaId} value={categoria.categoriaId}>
                                {categoria.nombre}
                              </option>
                            )
                          }
                        })
                      // : categoriasAgrupadasPorTipo?.map((tipoCategoria)=> {
                      //   const [tipo, categorias] = tipoCategoria;

                      //   return <>
                      //     <optgroup label={tipo === '0' ? 'Egresos' : 'Ingresos'}>
                      //       {
                      //         categorias.map((egreso: Categoria) => {
                      //           if(!egreso.eliminada) {
                      //             return (
                      //               <option key={egreso.categoriaId} value={egreso.categoriaId}>
                      //                 {egreso.nombre}
                      //               </option>
                      //             )
                      //           }
                      //         })
                      //       }
                      //     </optgroup>
                      //   </>
                       
                      //   }
                      // )
                    }
                  </Select>
                </div>

                <div className="col-span-full">
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text text-white">Comprobante</span>
                    </div>
                    <input 
                      type="file"
                      accept="image/jpeg, image/png, image/tiff, application/pdf, application/zip, text/plain
                      text/csv"
                      className="file-input file-input-bordered text-black"
                      {...register('comprobante')}
                    />
                    <div className="label">
                      {errors.comprobante && <span className="label-text-alt text-red-500 opacity-75">
                        {errors.comprobante.message}
                      </span>}
                      <span className="label-text-alt text-white opacity-75">Seleccione un archivo con la extension: .jpeg, .png, .tiff, .pdf, .zip, .txt, .csv</span>
                    </div>
                  </label>
                </div>
                
              </div>
              
              <button 
                type="submit"
                // disabled={createCuenta.isPending} 
                className={`btn w-full uppercase mt-4 ${isPendingEntradas ? 'btn-disabled' : ''}`} // createCuenta.isPending
               >
                Guardar
              </button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <header className="flex justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold"> Entradas </h2>
    
        <div className="flex gap-x-2">
          <button className="btn btn-sm btn-neutral" onClick={onOpen}> + </button>
        </div>
      </header>

      <section className="grid grid-cols-12 gap-4 text-base-content">
    
        <div className="stats mb-4 col-span-6 border-base-300 border">
          <div className="stat bg-base-100 ">
            <div className="stat-title">Total neto</div>
            <div className="stat-value">89,400</div>
            <div className="stat-desc">21% mas que el mes pasado</div>
          </div>
        </div>

        <div className="stats mb-4 col-span-6 border-base-300 border">
          <div className="stat bg-base-100">
            <div className="stat-title">Total neto</div>
            <div className="stat-value">89,400</div>
            <div className="stat-desc">21% mas que el mes pasado</div>
          </div>
        </div>

      </section>
      
      <section className="mb-4 flex gap-x-2">
        <div className="flex gap-2 items-center">
          <label htmlFor="entradas_año_mes" className="text-xs"> Entradas de </label>
          <input type="month" id="entradas_año_mes" value={dateSelected} onChange={handleChangeDate} className="input input-sm input-bordered rounded-md text-xs p-2"  />
        </div>

        {/* <select name="" className="select select-sm select-bordered" id="">
          <option value="">[CATEGORIAS]</option>
        </select>
        <select name="" className="select select-sm select-bordered" id="">
          <option value="">[TIPO]</option>
        </select> */}
      </section>

      <section className="flex flex-col mb-4">
        
        {isPendingEntradas
          ? 'Obteniendo entradas...'
          : <List
              emptyStateMsg="No hay entradas para este mes. Agregue alguna!"
              selectKey={entrada=> entrada.entradaId}
              items={entradas?.results} 
              render={entrada=> <Entrada
                categoriaColor={entrada.categoriaColor}
                categoriaNombre={entrada.categoriaNombre}
                categoriaId={entrada.categoriaId}
                monto={entrada.monto}
                fechaInicio={entrada.fechaInicio}
                entradaId={entrada.entradaId}
                file={entrada.file}
                filename={entrada.filename}
                fileType={entrada.fileType}
                descripcion={entrada.descripcion}
                cuentaId={entrada.cuentaId}
                cuentaNombre={entrada.cuentaNombre}
                cuentaColor={entrada.cuentaColor}
                eliminada={entrada.eliminada}
                tiposEntrada={entrada.tiposEntrada}
                usuarioID={entrada.usuarioID}
              />}
          /> 
        }
      </section>
    </div>
  )
}

export default Entradas