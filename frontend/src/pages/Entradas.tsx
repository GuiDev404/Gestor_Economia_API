import Modal, { ModalBody, ModalContent, ModalOverlay, ModalHeader, ButtonCloseModal } from "../components/Modal"
import useDisclosure from "../hooks/useDisclousure"
import { useState } from "react";
import EntradaItem from "../components/Entrada";
import List from "../components/List";
import Input from "../components/Input";
import Select from "../components/Select";
import { useCategorias } from "../hooks/useCategorias";
import useCuentas from "../hooks/useCuentas";
import { Categoria, Entrada, TiposEntradas } from "../types.d";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EntradaFormSchemaType, ErrorKeysEntradaFormSchema, KeysEntradaFormSchema, entradaFormSchema } from "../schemas/entradaSchema";
import useEntradas from "../hooks/useEntradas";
import { AxiosError, isAxiosError } from "axios";
import toast, { ErrorIcon } from "react-hot-toast";
import StatCard from "../components/StatCard";
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, MaximizeIcon, MinimizeIcon } from "../components/Icons";

const formatZeroInDate = (date: number)=> date < 10 ? `0${date}` : date

type ResumenKeys = 'total' | 'cantidad'
type ResumenType = Record<ResumenKeys, number>

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

const defaultYearMonth = ()=> {
  const currentDate = new Date()
  return `${currentDate.getFullYear()}-${formatZeroInDate(currentDate.getMonth() + 1)}`
}

const Entradas = () => {
  const [ dateSelected, setDateSelected ] = useState(defaultYearMonth())
  const [ modeEdit, setModeEdit ] = useState(false);

  const [ dateInitFormatted, dateEndFormatted ] = dateBetween(dateSelected)
  const { entradas, isPendingEntradas, createEntrada, deleteEntrada, updateEntrada } = useEntradas({
    dateEndFormatted,
    dateInitFormatted
  });

  const [ groupedByDay, setGroupedByDay ] = useState(false)


  const { register, handleSubmit, formState: { errors }, watch, setValue, reset, setError } = useForm<EntradaFormSchemaType & { ""?: string }>({
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
    if(e.currentTarget.value) setDateSelected(e.currentTarget.value)
  }
  
  // let categoriasAgrupadasPorTipo = isPendingCategorias 
  //   ? {}
  //   : Object.groupBy(categorias, ({ tipoEntrada }: { tipoEntrada: TiposEntradas }) => tipoEntrada);
    
  // categoriasAgrupadasPorTipo = Object.entries(categoriasAgrupadasPorTipo);

  const onError = (error: Error | AxiosError) => {
    if(isAxiosError(error)){

      const errorsList: [string, string[] | string][] = Object.entries(error.response?.data.errors)
      
      for (const [key, errors] of errorsList) {
        if(Array.isArray(errors)) {
          setError(key.toLowerCase() as ErrorKeysEntradaFormSchema, { 
            message: errors[0],
            type: 'prop_validation'
          })
        } else {
 
          if(error.response?.status && [400, 500].includes(error.response.status)){
            onClose();
            toast.error(errors)
            return;
          } 

          setError(key.toLowerCase() as ErrorKeysEntradaFormSchema, { message: errors, type: 'general' })
        }
      }
    }

  }
  
  const montoActual = watch('monto');
  const esEgreso = montoActual < 0;


  console.log(entradas?.results);
 
  function onSubmit (data: EntradaFormSchemaType){
  
    if(!data.entradaId){
      const { entradaId, ...nuevaEntrada } = data; 

      createEntrada.mutate(nuevaEntrada, {
        onSuccess: ()=> {
          onClose();
        },
        onError,
      })
    } else {
      const { entradaId, ...entradaActualizada } = data; 
      const id = parseInt(entradaId, 10)
      const entrada = entradas?.results.find(e=> e.entradaId === id);
      
      if(entrada){
        const updated = { 
          ...entradaActualizada,
          entradaId: id
        } 
        
        updateEntrada.mutate({ entradaId, data: updated }, {
          onSuccess: ()=> {
            onClose()
          },
          onError
        });
      }
    }

  }

      
  const handleDelete = (id: string)=> ()=> deleteEntrada.mutate(id)
  
  const handleEditMode = (id: string)=>{
    return ()=> {
        const entrada = entradas?.results.find(entrada=> entrada.entradaId.toString() === id)
 
        if(entrada){
          const { entradaId, descripcion, monto, fechaInicio, categoriaId, cuentaId } = entrada
          const entidadActualizar = Object.entries({ 
            descripcion, monto, fechaInicio, categoriaId, cuentaId, entradaId
          })
          
          for (const [ key, value ] of entidadActualizar) {
            if(key === 'fechaInicio' && typeof value === 'string'){
              setValue('fechaInicio', value.split('T')[0]);
            } else {
              setValue(key as KeysEntradaFormSchema, value.toString())
            }

          }
  
          onOpen()
          setModeEdit(true)
        } else {
          toast.error('No se encontro la entrada')
        }
  
    }
  }
 
  const resumen: ResumenType = { total: 0, cantidad: 0  }
  const calcResumenTipo = (tipoEntrada: TiposEntradas | null): ResumenType => {

    if(entradas?.results === undefined) return { cantidad: 0, total: 0 } 
    return entradas?.results
      .filter(t=> t.tiposEntrada === tipoEntrada && !t.eliminada)
      .reduce<ResumenType>((resumenPrevio, entrada, _currentIndex, entradas)=> {
        resumenPrevio.cantidad = entradas.length;
        resumenPrevio.total += entrada.monto;

        return resumenPrevio 
    },  {...resumen})
  }

  const resumenes = { 
    ingresos: calcResumenTipo(TiposEntradas.Ingreso),
    egresos: calcResumenTipo(TiposEntradas.Egreso),
    balance: function () {
      return {
        cantidad: this.ingresos.cantidad + this.egresos.cantidad,
        total: this.ingresos.total - Math.abs(this.egresos.total),
      }
    }
  }

  const formatEntradas = (entradas: Entrada[] | undefined)=> {
    let entradasAgrupadas: Entrada[] | [string, Entrada[]][] | undefined = entradas?.sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime())
    
    if(groupedByDay) {
      const entradasAgrupadasPorDia = Object.groupBy(entradas, ({ fechaInicio }: Entrada)=> 
        new Date(fechaInicio).getDate()
      ) 
 
      entradasAgrupadas = Object.entries(structuredClone(entradasAgrupadasPorDia))
      entradasAgrupadas.sort((a, b) => Number(b[0]) - Number(a[0]))
    }

    return entradasAgrupadas
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
              {errors[""]?.type === 'general' && (
               <div role="alert" className="alert alert-error text-white my-4">
                <ErrorIcon />
                <span>{errors[""]?.message?.toString()}</span>
              </div>
             )}

              {/* <input type="checkbox" className="toggle toggle-error" checked /> */}

              <input type="hidden"  {...register('entradaId')} />

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
                      accept="image/jpeg, image/png, image/tiff, application/pdf, application/zip, text/plain,
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
                disabled={createEntrada.isPending} 
                className={`btn w-full uppercase mt-4 ${createEntrada.isPending ? 'btn-disabled' : ''}`}
               >
                Guardar
              </button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <header className="flex gap-4 mb-4">
        <h2 className="text-2xl font-bold"> Entradas </h2>
    
        <div className="flex gap-x-2">
          <button className="btn btn-sm btn-neutral" onClick={onOpen}> + </button>
        </div>
      </header>

      <section className="grid grid-cols-12 gap-4 text-base-content mb-4">
    
        <StatCard
          title="Ingresos"
          description={`Este mes hubo ${resumenes.ingresos.cantidad} ingresos`}
          amount={resumenes.ingresos.total}
          className="col-span-full md:col-span-6 border-base-300 border"
          classNameAmount="text-green-500"
          icon={<ArrowUpIcon />}
        />

        <StatCard
          title="Egresos"
          description={`Este mes hubo ${resumenes.egresos.cantidad} egresos`}
          amount={resumenes.egresos.total}
          className="col-span-full md:col-span-6 border-base-300 border"
          classNameAmount="text-red-500"
          icon={<ArrowDownIcon />}
        />

        <StatCard
          title="Balance"
          description={`Este mes hubo ${resumenes.balance().cantidad} entradas en total`}
          amount={resumenes.balance().total}
          className="col-span-full border-base-300 border"
          classNameAmount="text-zinc-700"
          icon={<ArrowRightIcon />}
        />

      </section>
      
      <section className="mb-4 flex justify-between gap-x-2">
        <div className="flex gap-2 items-center">
          <label htmlFor="entradas_año_mes" className="text-xs"> Entradas de </label>
          <input type="month" id="entradas_año_mes" value={dateSelected} onChange={handleChangeDate} className="input input-sm input-bordered rounded-md text-xs p-2"  />
        </div>

        <button onClick={()=> setGroupedByDay(isGrouped=> !isGrouped)} className="btn btn-sm btn-neutral tooltip tooltip-top" data-tip={groupedByDay ? 'Desagrupar' : 'Agrupar'}>
          {groupedByDay 
            ? <MaximizeIcon width={18} height={18} />
            : <MinimizeIcon width={18} height={18} />
          }
        </button>
      </section>

      <section className="flex flex-col mb-4">
        
        {isPendingEntradas
          ? 'Obteniendo entradas...'
          : <List
              className="flex flex-col gap-y-2"
              classNameItem='group'
              emptyStateMsg="No hay entradas para este mes. Agregue alguna!"
              selectKey={entrada=> Array.isArray(entrada) ? entrada[0] : entrada.entradaId}
              items={formatEntradas(entradas?.results)} 
              render={entrada=> <EntradaItem
                entrada={entrada}
                // categoriaColor={entrada.categoriaColor}
                // categoriaNombre={entrada.categoriaNombre}
                // categoriaId={entrada.categoriaId}
                // monto={entrada.monto}
                // fechaInicio={entrada.fechaInicio}
                // entradaId={entrada.entradaId}
                // file={entrada.file}
                // filename={entrada.filename}
                // fileType={entrada.fileType}
                // descripcion={entrada.descripcion}
                // cuentaId={entrada.cuentaId}
                // cuentaNombre={entrada.cuentaNombre}
                // cuentaColor={entrada.cuentaColor}
                // eliminada={entrada.eliminada}
                // tiposEntrada={entrada.tiposEntrada}
                // usuarioID={entrada.usuarioID}
                handleDelete={handleDelete}
                handleEdit={handleEditMode}
              />}
          /> 
        }
      </section>
    </div>
  )
}

export default Entradas