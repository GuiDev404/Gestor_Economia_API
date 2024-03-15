import { useQuery } from "@tanstack/react-query";
import { getAllCategorias } from "../services/categorias";
import { TiposEntradas } from "../types.d";
import { DeleteIcon, EditIcon } from "../components/Icons";

const Categorias = () => {
  const {
    data: categorias,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["categorias"],
    queryFn: getAllCategorias,
  });

  console.log({ categorias, isPending, isError });
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
        <button className="btn btn-sm btn-neutral">+</button>

      </header>

      <div role="tablist" className="tabs tabs-lifted">
        <input
          type="radio"
          name="cuentas"
          role="tab"
          className="tab rounded-b-lg"
          aria-label="Egresos"
          checked
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
            egresos?.map((categoria) => {
              const bgEmoji = categoria.color.trim() ? `bg-[${categoria.color}]` : 'bg-base-200';

              return (
                <div className="flex gap-4 items-center hover:bg-base-200 mb-2 rounded-md p-2">
                  <div className={`${bgEmoji} rounded-lg w-8 h-8 flex justify-center items-center text-sm`}>{categoria.emoji}</div>
                  <div className="grow">
                    <h2 className="font-bold text-xl"> {categoria.nombre} </h2>
                  </div>
                  <div className="flex gap-x-2">
                    <button className="btn btn-xs btn-neutral">
                      <EditIcon width={14} height={14} />
                    </button>
                    <button className="btn btn-xs">
                      <DeleteIcon width={14} height={14} />
                    </button>
                  </div>
                </div>
              );
            })
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
            ingresos?.map((categoria) => {
              const bgEmoji = categoria.color.trim() ? `bg-[${categoria.color}]` : 'bg-base-200';

              return (
                <div className="flex gap-4 items-center hover:bg-base-200 mb-2 rounded-md p-2">
                  <div className={`${bgEmoji} rounded-lg w-8 h-8 flex justify-center items-center text-sm`}>{categoria.emoji}</div>
                  <div className="grow">
                    <h2 className="font-bold text-xl"> {categoria.nombre} </h2>
                  </div>
                  <div className="flex gap-x-2">
                    <button className="btn btn-xs btn-neutral">
                      <EditIcon width={14} height={14} />
                    </button>
                    <button className="btn btn-xs">
                      <DeleteIcon width={14} height={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Categorias;
