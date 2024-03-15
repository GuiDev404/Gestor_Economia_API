import { useQuery } from "@tanstack/react-query";
import { getAllCuentas } from "../services/cuentas";

const Cuentas = () => {
  const {
    data: cuentas,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["cuentas"],
    queryFn: getAllCuentas,
  });

  console.log({ cuentas, isPending, isError });

  return (
    <div>
      <header className="flex gap-4 mb-4">
        <h2 className="text-2xl font-bold"> Cuentas </h2>

        <button className="btn btn-sm btn-neutral">+</button>
      </header>
      <div className="flex flex-col">
        {isPending ? (
          <>
            <div className="skeleton h-6 w-full"></div>
            <div className="skeleton h-6 w-full"></div>
          </>
        ) : (
          cuentas?.map((cuenta) => {
            return (
              <div className="flex gap-4 bg-base-200 mb-2 rounded-md p-2">
                <div>{cuenta.emoji}</div>
                <div>
                  <h2 className="font-bold text-xl"> {cuenta.titulo} </h2>
                  <p className=""> {cuenta.descripcion} </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Cuentas;
