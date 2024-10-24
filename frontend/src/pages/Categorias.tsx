import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import Input from "../components/Input";
import InputEmojiPicker from "../components/InputEmojiPicker";
import Modal, {
  ButtonCloseModal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "../components/Modal";
import Alert from "../components/Alert";
import Tabs from "../components/Tabs";
import Categoria from "../components/Categoria";
import List from "../components/List";

import { useCategorias } from "../hooks/useCategorias";
import useDisclosure from "../hooks/useDisclousure";

import { TiposEntradas } from "../types.d";
import {
  CategoriaCreateSchemaType,
  categoriaCreateSchema,
} from "../schemas/categoriaSchema";

const LoadingCategorias = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-9 gap-x-2 px-2">
        <div className="skeleton w-10 rounded-md"></div>
        <div className="skeleton grow rounded-md"></div>
      </div>
      <div className="flex h-9 gap-x-2 px-2">
        <div className="skeleton w-10 rounded-md"></div>
        <div className="skeleton grow rounded-md"></div>
      </div>
    </div>
  );
};

const Categorias = () => {
  const {
    categorias,
    isPending,
    createCategoria,
    deleteCategoria,
    updateMutation,
  } = useCategorias();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CategoriaCreateSchemaType>({
    resolver: zodResolver(categoriaCreateSchema),
  });
  const [modeEdit, setModeEdit] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure({
    cbOnClose: () => {
      reset();
      setModeEdit(false);
    },
  });

  const { isOpen: showEmojiPicker, toggle: toggleVisibilityEmojiPicker } =
    useDisclosure();

  const onSubmit = (data: CategoriaCreateSchemaType) => {
    if (!data.id) {
      const { id, ...nuevaCategoriaData } = data;
      createCategoria.mutate(nuevaCategoriaData, {
        onSuccess: () => {
          onClose();
        },
      });
    } else {
      // update mutation
      const { id: categoriaId, ...nuevaCategoriaData } = data;

      updateMutation.mutate(
        { categoriaId, data: { ...nuevaCategoriaData, categoriaId } },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    return () => {
      deleteCategoria.mutate(id);
    };
  };

  const handleModeEdit = (id: string | number) => {
    return () => {
      const categoria = categorias?.find((equipo) => equipo.categoriaId === id);

      if (categoria) {
        const { categoriaId, color, emoji, nombre, tipoEntrada } = categoria;
        const entidadActualizar = Object.entries({
          color,
          emoji,
          nombre,
          tipoEntrada,
          categoriaId,
        });

        for (const [key, value] of entidadActualizar) {
          setValue(key as keyof CategoriaCreateSchemaType, value);
        }

        onOpen();
        setModeEdit(true);
      } else {
        toast.error("No se encontro la categoria");
      }
    };
  };

  const errores = createCategoria.error || updateMutation.error;
  const alertError = errores
    ? errores?.message || "Lo sentimos algo salio mal!"
    : "";

  const egresos = categorias?.filter(
    (c) => c.tipoEntrada === TiposEntradas.Egreso
  );
  const ingresos = categorias?.filter(
    (c) => c.tipoEntrada === TiposEntradas.Ingreso
  );

  return (
    <div>
      <header className="flex gap-4 mb-4">
        <h2 className="text-2xl font-bold"> Categorias </h2>
        <button className="btn btn-sm btn-neutral" onClick={onOpen}>
          +
        </button>
      </header>

      <Modal onClose={onClose} isOpen={isOpen} size="sm">
        <ModalContent className="bg-neutral text-white">
          <ModalHeader className="flex justify-between items-center">
            <h1 className="text-xl font-bold">
              {" "}
              {modeEdit ? "Editar categoria" : "Nueva categoria"}{" "}
            </h1>
            <ButtonCloseModal />
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              {alertError && <Alert message={alertError} type="error" />}

              <input type="hidden" {...register("id")} />

              <div className="grid grid-cols-9 gap-2">
                <div className="col-span-1">
                  <div className="form-control w-full relative">
                    <label htmlFor="color" className="label text-sm">
                      Icono
                    </label>
                    <input
                      type="color"
                      id="color"
                      className="color-input w-full grow"
                      {...register("color")}
                    />
                    <span
                      className="absolute top-12 left-3 text-xl cursor-pointer"
                      onClick={toggleVisibilityEmojiPicker}
                    >
                      {watch("emoji") || "💡"}
                    </span>
                    <InputEmojiPicker
                      name="emoji"
                      control={control}
                      isOpen={showEmojiPicker}
                      toggleVisibilityEmojiPicker={toggleVisibilityEmojiPicker}
                    />
                  </div>
                </div>

                <div className="col-span-8">
                  <Input
                    label="Nombre"
                    {...register("nombre")}
                    error={errors.nombre?.message?.toString()}
                    placeholder="Ingrese el nombre de la categoria"
                    isRequired
                  />
                </div>

                <div className="col-span-full">
                  <div className="form-control gap-1 justify-between w-full">
                    <label
                      htmlFor="tipoEntrada"
                      className="label justify-start gap-2"
                    >
                      Tipo de entrada
                      <span className="text-red-400">*</span>
                    </label>
                    <select
                      className="select select-bordered select-md w-full text-black"
                      id="tipoEntrada"
                      {...register("tipoEntrada")}
                      defaultValue=""
                    >
                      <option value="" hidden>
                        [TIPO DE ENTRADA]
                      </option>
                      <option value="0">Egreso</option>
                      <option value="1">Ingreso</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={createCategoria.isPending}
                className={`btn w-full uppercase mt-4 ${
                  createCategoria.isPending ? "btn-disabled" : ""
                }`}
              >
                Guardar
              </button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Tabs
        name="categorias_por_tipo"
        tabs={[
          {
            defaultChecked: true,
            label: "Ingreso",
            content: isPending ? (
              <LoadingCategorias />
            ) : (
              <List
                items={ingresos}
                selectKey={(categoria) =>
                  typeof categoria === "string"
                    ? categoria
                    : categoria.categoriaId
                }
                classNameItem={`group flex gap-4 items-center hover:bg-base-200 mb-2 rounded-md p-2`}
                render={(categoria) => (
                  <Categoria
                    categoria={categoria}
                    handleDelete={handleDelete}
                    handleEdit={handleModeEdit}
                  />
                )}
                emptyStateMsg="No hay categorias aun, agregue alguna!"
              />
            ),
          },
          {
            label: "Egreso",
            content: isPending ? (
              <LoadingCategorias />
            ) : (
              <List
                items={egresos}
                selectKey={(categoria) =>
                  typeof categoria === "string"
                    ? categoria
                    : categoria.categoriaId
                }
                classNameItem={`group flex gap-4 items-center hover:bg-base-200 mb-2 rounded-md p-2`}
                render={(categoria) => (
                  <Categoria
                    categoria={categoria}
                    handleDelete={handleDelete}
                    handleEdit={handleModeEdit}
                  />
                )}
                emptyStateMsg="No hay categorias aun, agregue alguna!"
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default Categorias;
