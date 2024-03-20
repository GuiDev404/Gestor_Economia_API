import { useQuery } from "@tanstack/react-query";
import { getAllCuentas } from "../services/cuentas";
import List from "../components/List";
import Cuenta from "../components/Cuenta";

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
          <div className="flex flex-col gap-2">
            <div className="skeleton h-10 w-full"></div>
            <div className="skeleton h-10 w-full"></div>
          </div>
        ) : (
          <List
            items={cuentas}
            selectKey={cuenta=> cuenta.cuentaId}
            render={cuenta=> <Cuenta {...cuenta} />}
            classNameItem="flex gap-4 bg-base-200 mb-2 rounded-md p-2 group"
            emptyStateMsg="No hay cuentas aun, agregue alguna!"
          />
        )}
      </div>
    </div>
  );
};

export default Cuentas;
