import { useQuery } from "@tanstack/react-query"
import { getAllEntradas } from "../services/entradas"
import Modal, { ModalBody, ModalContent, ModalOverlay, ModalHeader, ButtonCloseModal } from "../components/Modal"
import useDisclosure from "../hooks/useDisclousure"
import { ArrowDownIcon, ArrowUpIcon, FileIcon } from "../components/Icons";

const dias = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
];
 
const Entradas = () => {
  const { data: entradas, isLoading, isFetching, isPending } = useQuery({
    queryKey: ['entradas'],
    queryFn: getAllEntradas,
  })
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <div className="">
      <Modal onClose={onClose} isOpen={isOpen} size="md">
        <ModalOverlay />
        <ModalContent className="bg-neutral text-white">
          <ModalHeader className="flex justify-between items-center">
            <h1> Nueva entrada </h1>
            <ButtonCloseModal />
          </ModalHeader>
          <ModalBody>
            <form>

            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <header className="flex justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold"> Entradas </h2>
        <div className="flex gap-x-2">
        <select name="" className="select select-sm select-bordered" id="">
            <option value="">[AÑO]</option>
          </select>
          <select name="" className="select select-sm select-bordered" id="">
            <option value="">[MESES]</option>
          </select>
          <select name="" className="select select-sm select-bordered" id="">
            <option value="">[CATEGORIAS]</option>
          </select>
          <select name="" className="select select-sm select-bordered" id="">
            <option value="">[TIPO]</option>
          </select>
        </div>
        <div>
          <button className="btn btn-sm btn-neutral" onClick={onOpen}>
            +
          </button>
        </div>
      </header>

      <div className="stats  shadow mb-4">
  
        <div className="stat bg-neutral">
          <div className="stat-title text-base-100">Total neto</div>
          <div className="stat-value text-base-100">89,400</div>
          <div className="stat-desc text-base-100">21% mas que el mes pasado</div>
        </div>
        
      </div>
      
      <section className="flex flex-col mb-4">
        {isPending
          ? 'Obteniendo entradas...'
          : entradas?.results.map(entrada=> {
            const esUnIngreso = entrada.monto > 0;

            const montoColor = esUnIngreso ? 'text-green-500' : 'text-red-500';
            
            const fechaInicio = new Date(entrada.fechaInicio);
            const diaMes = fechaInicio.getDate();
            const diaSemana = fechaInicio.getDay();

            console.log(entrada);
            const badgeColorCategoria = entrada.categoriaColor ? `badge-[${entrada.categoriaColor}]` : 'badge-neutral badge-outline'

            return (
              <article key={entrada.entradaId} className="flex flex-row items-center justify-between gap-x-4 bg-base-200 p-4 rounded-md">
                <div className="flex flex-col text-center">
                  <p className="text-2xl font-black"> {diaMes} </p>
                  <small> {dias[diaSemana]} </small>
                </div>
                <div className="justify-start flex-grow">
                  <h3 className="text-xl font-bold capitalize">{entrada.descripcion}</h3>
                  <span className={`text-xs uppercase badge ${badgeColorCategoria}`}> {entrada.categoriaNombre} </span>
                  <a className="flex items-center mt-2 gap-2 w-fit" href={`data:${entrada.fileType};base64, ${entrada.file}`} download={entrada.filename}>
                    <FileIcon width={18} height={18} />
                    <span> {entrada.filename} </span>
                  </a>
                </div>
                <p className={`text-center font-bold ${montoColor}`}>
                  {esUnIngreso 
                    ? <ArrowUpIcon className="mx-auto" />
                    : <ArrowDownIcon className="mx-auto" />
                  } 

                  {entrada.monto} 
                </p>
              </article>
            )
          })
        }
      </section>
    </div>
  )
}

export default Entradas