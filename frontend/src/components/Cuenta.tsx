import React from "react";
import { Cuenta } from "../types.d";
import { DeleteIcon, DeleteOffIcon, EditIcon } from "./Icons";

const Cuenta: React.FC<Cuenta> = ({
  emoji,
  color,
  titulo,
  descripcion,
  eliminada,
  cuentaId,
}) => {
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
      <div className="flex justify-between grow items-center">
        <div className={`${disabledClassName}`}>
          <h2 className="font-bold text-xl capitalize"> {titulo} </h2>
          <p className="first-letter:capitalize text-neutral-600"> {descripcion} </p>
        </div>

        <div className="flex gap-x-2">
          {!eliminada && (
            <button
              className="btn btn-xs btn-neutral h-7"
              // onClick={handleEdit(cuentaId)}
            >
              <EditIcon width={14} height={14} />
            </button>
          )}
          <button
            className={`btn btn-xs h-7 ${
              eliminada
                ? `btn-success text-white tooltip tooltip-left group-hover:opacity-100 group-hover:select-auto ${disabledClassName}`
                : ""
            }`}
            // onClick={handleDelete(cuentaId.toString() as string)}
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
    </>
  );
};

export default Cuenta;
