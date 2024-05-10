import React from "react";
import { ArrowDownIcon, ArrowUpIcon, DeleteIcon, DeleteOffIcon, EditIcon, FileIcon } from "../components/Icons";
import { type Entrada } from "../types";

const dias = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];


function formatDayData (date: Date){
  const fechaInicioDate = new Date(date);

  const formatoFecha = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric' });
  const fechaLocalizada = formatoFecha.formatToParts(fechaInicioDate)

  const diaMes = fechaLocalizada.find(f=> f.type === 'day')
  const diaSemana = fechaLocalizada.find(f=> f.type === 'weekday')

  return { diaMes: diaMes?.value, diaSemana: diaSemana?.value}
}

const formatPrice = (price: number, location?: string) =>
  new Intl.NumberFormat(location ?? window.navigator.language, {
    style: "currency",
    currency: "ARS",
  }).format(price);

interface EntradaProps {
  entrada: Entrada | [string, Entrada[]]
  handleDelete: (id: string)=> ()=> void;
  handleEdit: (id: string) => () => void;
}

const Entrada: React.FC<EntradaProps> = ({
  entrada,
  handleDelete,
  handleEdit
}) => {
  console.log(entrada);

  // const badgeColorCategoria = categoriaColor
  // ? `[bg-${categoriaColor}]`
  // : "badge-neutral badge-outline";

  if(Array.isArray(entrada)){
    const dayMonthNumber = entrada['0']
    const date = new Date()
    
    date.setDate(parseInt(dayMonthNumber, 10))
    const weekday = dias[date.getDay()];

    const [ totalPositivo, totalNegativo ] = entrada[1].reduce((monto, data)=> {
      if(data.monto > 0){
        monto[0] = monto[0] + data.monto
      } else {
        monto[1] = monto[1] - data.monto
      }
      return monto
    }, [0, 0])

    return <details
    className="flex flex-wrap flex-row items-center justify-between gap-x-4 bg-base-200 p-4 rounded-md  group/entrada"
    >
      <summary className="flex justify-between items-center pb-2 cursor-pointer">
        <p className="flex flex-col text-center min-w-20"> 
          <span className="text-2xl font-black"> {dayMonthNumber} </span>
          <small> {weekday} </small>
        </p>

        <div className="flex flex-col items-end">
          <p className={`text-center text-sm font-bold text-green-500 flex items-center`}>
            <ArrowUpIcon className="" width={18} height={18} />
            {formatPrice(totalPositivo)}
          </p>
          <p className={`text-center text-sm font-bold text-red-500 flex items-center`}>
            <ArrowDownIcon className="" width={18} height={18} />
            - {formatPrice(totalNegativo)}
          </p>
        </div>
      </summary>

      <section className="flex flex-col p-4">
        {entrada[1].map(entrada=> {

          return (
            <article key={entrada.entradaId} className="flex justify-between items-center border-base-300 border-y p-2">
              <div className="my-2 min-w-36">
                <h3 className="text-base font-semibold capitalize">{entrada.descripcion}</h3>
                <p className="text-lg font-bold flex items-center gap-2">
                    $ {entrada.monto} <span className={`text-[.7rem] uppercase text-neutral opacity-60`}>
                      / {entrada.cuentaNombre}
                    </span>
                </p>
                <span className={`text-[.6rem] uppercase`}>
                  {entrada.categoriaNombre}
                </span>
              </div>

              <div className="flex gap-x-1">
              {!entrada.eliminada && (
                <button
                    className="btn btn-xs btn-neutral h-7 z-10"
                    onClick={handleEdit(entrada.entradaId.toString())}
                  >
                    <EditIcon width={14} height={14} />
                  </button>
                )}

                <button
                  className={`btn btn-xs h-7 z-10 ${
                    entrada.eliminada
                      ? `btn-success text-white tooltip tooltip-left group-hover-100 group-hover-auto ${'disabledClassName'}`
                      : ""
                  }`}
                  onClick={handleDelete(entrada.entradaId.toString())}
                  data-tip="Recuperar?"
                >
                  {entrada.eliminada ? (
                    <DeleteOffIcon width={14} height={14} />
                  ) : (
                    <DeleteIcon width={14} height={14} />
                  )}
                </button>
              </div>
            </article>
          )
        })}
      </section>
    </details>
  } 

  const { 
    monto,
    fechaInicio,
    entradaId,
    file,
    filename,
    categoriaNombre,
    fileType,
    descripcion,
    cuentaNombre,
    eliminada,
   } =  entrada;

  const esUnIngreso = monto > 0;
  const montoColor = esUnIngreso ? "text-green-500" : "text-red-500";

  const { diaMes, diaSemana } = formatDayData(new Date(fechaInicio))
  const disabledClassName = eliminada ? 'opacity-25 select-none' : ''

  return <>
    <article
      className={`flex flex-wrap flex-row items-center justify-between gap-x-4 bg-base-200 p-4 rounded-md   `}
    >
      <div className={`flex flex-col text-center min-w-20 ${disabledClassName}`}>
        <p className="text-2xl font-black"> {diaMes} </p>
        <small> {diaSemana} </small>
      </div>

      <div className={`flex flex-col flex-grow`}>
        <div className={`flex justify-between`}>
          <h3 className={`text-lg font-bold capitalize ${disabledClassName}`}>{descripcion}</h3>

          <div className="flex gap-x-2">
            {!eliminada && (
              <button
                className="btn btn-xs btn-neutral h-7"
                onClick={handleEdit(entradaId.toString())}
              >
                <EditIcon width={14} height={14} />
              </button>
            )}

            <button
              className={`btn btn-xs h-7 z-10 ${
                eliminada
                  ? `btn-success text-white tooltip tooltip-left group-hover:opacity-100 group-hover:select-auto ${disabledClassName}`
                  : ""
              }`}
              onClick={handleDelete(entradaId.toString())}
              data-tip="Recuperar?"
            >
              {eliminada ? (
                <DeleteOffIcon width={14} height={14} />
              ) : (
                <DeleteIcon width={14} height={14} />
              )}
            </button>
          </div>
        </div>

        <div className={` ${disabledClassName}`}>
          
          <span className={`text-[.6rem] uppercase `}>
            {categoriaNombre}
          </span>
         
          <p className={`mt-3 font-bold flex gap-2 items-center ${montoColor}`}>
            {esUnIngreso ? (
              <ArrowUpIcon className="" width={18} height={18} />
            ) : (
              <ArrowDownIcon className="" width={18} height={18} />
            )}

            {formatPrice(monto)}

            <span className={`text-[.7rem] pt-1 uppercase text-neutral opacity-60`}>
              / {cuentaNombre}{" "}
            </span>
          </p>

          {file && (
            <a
              className="flex text-sm text-zinc-700 hover:text-zinc-900 items-center mt-4 gap-2 w-fit"
              href={`data:${fileType};base64, ${file}`}
              download={filename}
            >
              <FileIcon width={18} height={18} />
              <span> {filename} </span>
            </a>
          )}
        </div>
      </div>

    </article>
    
    {/* <div className=" group-hover:after:content-[''] group-hover:after:absolute group-hover:after:bg-zinc-600 group-hover:after:bg-opacity-70 group-hover:after:w-full group-hover:after:h-full group-hover:after:left-0 group-hover:after:top-0 group-hover:after:rounded-md hidden group-hover:block ">
     {!eliminada && (
       <button
         className="btn btn-xs btn-neutral h-7 absolute right-14 top-5 z-10"
         onClick={handleEdit(entradaId.toString())}
       >
         <EditIcon width={14} height={14} />
       </button>
     )}

     <button
       className={`btn btn-xs h-7 z-10 absolute right-5 top-5 ${
         eliminada
           ? `btn-success text-white tooltip tooltip-left group-hover-100 group-hover-auto ${'disabledClassName'}`
           : ""
       }`}
       onClick={handleDelete(entradaId.toString())}
       data-tip="Recuperar?"
     >
       {eliminada ? (
         <DeleteOffIcon width={14} height={14} />
       ) : (
         <DeleteIcon width={14} height={14} />
       )}
     </button>
    </div> */}
    </>
};

export default Entrada;
