import { ArrowDownIcon, ArrowUpIcon, FileIcon } from "../components/Icons";
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

const formatPrice = (price: number, location?: string) =>
  new Intl.NumberFormat(location ?? window.navigator.language, {
    style: "currency",
    currency: "ARS",
  }).format(price);

const Entrada: React.FC<Entrada> = ({
  monto,
  fechaInicio,
  categoriaColor,
  entradaId,
  file,
  filename,
  categoriaNombre,
  fileType,
  descripcion,
  cuentaNombre
}) => {
  const esUnIngreso = monto > 0;

  const montoColor = esUnIngreso ? "text-green-500" : "text-red-500";

  const fechaInicioDate = new Date(fechaInicio);
  const diaMes = fechaInicioDate.getDate();
  const diaSemana = fechaInicioDate.getDay();

  // console.log(entrada);
  const badgeColorCategoria = categoriaColor
    ? `badge-[${categoriaColor}]`
    : "badge-neutral badge-outline";

  return (
    <article
      key={entradaId}
      className="flex flex-row items-center justify-between gap-x-4 bg-base-200 p-4 rounded-md"
    >
      <div className="flex flex-col text-center">
        <p className="text-2xl font-black"> {diaMes} </p>
        <small> {dias[diaSemana]} </small>
      </div>
      <div className="justify-start flex-grow">
        <h3 className="text-xl font-bold capitalize">{descripcion}</h3>
        <span className={`text-xs uppercase badge ${badgeColorCategoria}`}>
          {" "}
          {categoriaNombre}{" "}
        </span>
        {file && (
          <a
            className="flex items-center mt-2 gap-2 w-fit"
            href={`data:${fileType};base64, ${file}`}
            download={filename}
          >
            <FileIcon width={18} height={18} />
            <span> {filename} </span>
          </a>
        )}
      </div>
      <p className={`text-center font-bold ${montoColor} flex flex-col items-center gap-1`}>
        {esUnIngreso ? (
          <ArrowUpIcon className="mx-auto" />
        ) : (
          <ArrowDownIcon className="mx-auto" />
        )}

        {formatPrice(monto)}

        <span className={`text-xs uppercase badge ${badgeColorCategoria}`}>
          {" "}
          {cuentaNombre}{" "}
        </span>
      </p>
    </article>
  );
};

export default Entrada;
