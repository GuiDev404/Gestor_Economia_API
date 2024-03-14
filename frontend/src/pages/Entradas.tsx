import { useQuery } from "@tanstack/react-query"
import { getAllEntradas } from "../services/entradas"
import { useState } from "react";
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Entradas = () => {
  const { data: entradas, isLoading, isFetching, isPending } = useQuery({
    queryKey: ['entradas'],
    queryFn: getAllEntradas,
  })

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    console.log('afterOpenModal');
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className="">
       <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        // overlayClassName='bg-gray-950 bg-opacity-40'
        contentLabel="Example Modal"
      >
        <div className='w-3/6'>
          <h2>Hello</h2>
          <button onClick={closeModal}>close</button>
          
          <form className="">
            
          </form>
        </div>
      </Modal>

      <header className="flex gap-4">
        <h2 className="text-2xl font-bold"> Entradas </h2>
        <button className="btn btn-sm btn-neutral" onClick={openModal}>
          +
        </button>
      </header>
      
      <section className="flex flex-col my-4">
        {isPending
          ? 'Obteniendo entradas...'
          : entradas?.results.map(entrada=> {
            const badgeMontoColor = entrada.monto > 0 ? 'badge-success' : 'badge-error';

            return <article key={entrada.entradaId}>
              <span className="badge">{new Date(entrada.fechaInicio).toLocaleString()}</span>
              <h3 className="text-xl font-bold">{entrada.descripcion}</h3>
              <a href={`data:${entrada.fileType};base64, ${entrada.file}`} target="_blank">
                {entrada.filename}
              </a>

              <span className={`badge ${badgeMontoColor}`}> {entrada.monto} </span>
            </article>
          })
        }
      </section>
    </div>
  )
}

export default Entradas