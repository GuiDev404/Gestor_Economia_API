# TODOs

- [+] Problemas de fecha en entradas
- [+] Navbar responsive y en un componente aparte
- [+] Implentar vistas de profile, register (only is admin creo)
  - [+] Agregarle al token el username, para despues podes usarlo directamente, creo que esto evitaria crear un profile page 

- Implentar vista agrupada/desagrupada
  - cada entrada de las agrupadas
    - [stats](https://daisyui.com/components/stat/)  
  - cada entrada desagrupada
    - responsive
    - agregar boton de detalle o de solo ver archivo adjunto si existiese

- [ ] Seguir probando hasta arreglar lo del login
- [ ] Sigue mostrando mal las entradas al editar o crear una
- [ ] No permite actualizar las categorias existentes de admin, error 409


### SNIPPETS NO USADOS/ALTERNATIVOS

```js
  : categoriasAgrupadasPorTipo?.map((tipoCategoria)=> {
    const [tipo, categorias] = tipoCategoria;

    return <>
      <optgroup label={tipo === '0' ? 'Egresos' : 'Ingresos'}>
        {
          categorias.map((egreso: Categoria) => {
            if(!egreso.eliminada) {
              return (
                <option key={egreso.categoriaId} value={egreso.categoriaId}>
                  {egreso.nombre}
                </option>
              )
            }
          })
        }
      </optgroup>
    </>
    
    }
  )
```