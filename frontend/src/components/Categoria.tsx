import { type Categoria } from "../types.d";
import { DeleteIcon, DeleteOffIcon, EditIcon } from "./Icons";

interface CategoriaProps {
  categoria: Categoria | [string, Categoria[]]
  handleDelete: (id: string)=> ()=> void;
  handleEdit: (id: string | number) => () => void
}

const Categoria: React.FC<CategoriaProps> = ({
  categoria,
  handleEdit,
  handleDelete
}) => {

  if(Array.isArray(categoria)) return null

  const { categoriaId, color, eliminada, emoji, nombre } = categoria; 
  const bgEmoji = color.trim() ? color : "inherit";
  const disabledClassName = eliminada ? 'opacity-25 select-none' : ''

  return (
    <>
      <div
        style={{ background: bgEmoji }}
        className={`${disabledClassName} bg-base-200 rounded-lg w-8 h-8 flex justify-center items-center text-sm`}
      >
        {emoji}
      </div>
      <div className={`grow ${disabledClassName}`}>
        <h2 className="font-bold text-xl"> {nombre} </h2>
      </div>
      <div className="flex gap-x-2">
        {!eliminada && (
          <button className="btn btn-xs btn-neutral h-7" onClick={handleEdit(categoriaId)}>
            <EditIcon width={14} height={14} />
          </button>
        )}
        <button
          className={`btn btn-xs h-7 ${
            eliminada
              ? `btn-success text-white tooltip tooltip-left group-hover:opacity-100 group-hover:select-auto ${disabledClassName}`
              : ""
          }`}
          onClick={handleDelete(categoriaId.toString() as string)}
          data-tip="Recuperar?"
        >
          {eliminada ? (
            <DeleteOffIcon width={14} height={14} />
          ) : (
            <DeleteIcon width={14} height={14} />
          )}
        </button>
      </div>
    </>
  );
};

export default Categoria;
