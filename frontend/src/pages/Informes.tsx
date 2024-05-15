import { useCallback, useEffect, useMemo, useState } from "react";
import ReactECharts from 'echarts-for-react'; // import reactecharts
import useEntradas from "../hooks/useEntradas";
import { dateBetween, defaultYearMonth } from "../utils/date";
import { Entrada } from "../types";
import List from "../components/List";

type DataChartReduced = {
  [key: string]: { value: number, name: string, color: string, id: string, emoji: string }
}

function getOptions ({ data, colorsPalette, isNegative = false }: { data: DataChartReduced[string][], colorsPalette: string[], isNegative?: boolean }){
  return {
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        // console.log(params);
        return `<b> ${params.seriesName} </b> <br />
                ${params.name}: $${isNegative ? '-' : ''}${params.data.value} (${params.percent}%)<br />`;
      }
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Categoria',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            borderColor: 'none',
            formatter: (params)=> isNegative ? `$ -${params.value}` : `$ ${params.value}`
          }
        },
        labelLine: {
          show: false
        },
        data: data,
        color: colorsPalette
      }
    ],
    graph: {
      color: colorsPalette
    }
  };
}

function groupByCategory(tipo: Entrada[] | undefined) {

  const tipoAgrupado = tipo?.reduce((grouped: DataChartReduced, item)=> {
    console.log({grouped, item});

    if(item.categoriaId.toString() in grouped){
      const group = grouped[item.categoriaId]
      grouped[item.categoriaId] = { 
        ...group, 
        value: Math.abs(group.value) + Math.abs(item.monto)  
      }  
    } else {
      grouped[item.categoriaId.toString()] = { 
        id: item.categoriaId,
        emoji: item.categoriaEmoji,
        value: Math.abs(item.monto),
        name: item.categoriaNombre,
        color: item.categoriaColor
      }
    }

    return grouped
  }, {})

  const data = Object.values(tipoAgrupado ?? [])
  console.log({ data });
  const colorsPallete = data 
    ? data.map(i=> i.color)
    : []

  return { data, colorsPallete }
}

const getPorcentaje = (cantidad: number, total: number)=> {
  return (cantidad / total) * 100
}

const Informes = () => {
  const [ dateSelected, setDateSelected ] = useState(defaultYearMonth())

  const [ dateInitFormatted, dateEndFormatted ] = dateBetween(dateSelected)
  const { entradas, isPendingEntradas } = useEntradas({
    dateEndFormatted,
    dateInitFormatted
  });

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>)=> {
    if(e.currentTarget.value) setDateSelected(e.currentTarget.value)
  }

  const egresos = entradas?.results.filter(e=> e.monto < 0);
  const ingresos = entradas?.results.filter(e=> e.monto > 0);

  const { data: dataIngresos, colorsPallete: colorsIngresos } = groupByCategory(ingresos)
  const { data: dataEgresos, colorsPallete: colorsEgresos } = groupByCategory(egresos)

  const ingresosOptions = getOptions({ data: dataIngresos, colorsPalette: colorsIngresos })
  const egresosOptions = getOptions({ data: dataEgresos, colorsPalette: colorsEgresos, isNegative: true })
  
  console.log({ egresos ,dataEgresos });

  const totalIngreso = dataIngresos.reduce((v, a)=> v + a.value, 0)
  const totalEgreso = dataEgresos.reduce((v, a)=> v + a.value, 0)

  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold"> Informes </h1>

        <div className="flex gap-2 items-center">
          {/* <label htmlFor="entradas_año_mes" className="text-xs"> de </label> */}
          <input type="month" id="entradas_año_mes" value={dateSelected} onChange={handleChangeDate} className="input input-sm input-bordered rounded-md text-xs p-2"  />
        </div>
      </header>

      <div role="tablist" className="tabs tabs-lifted">
        <input
          type="radio"
          name="tipo"
          role="tab"
          className="tab rounded-b-lg"
          aria-label="Ingresos"
          defaultChecked
        />

        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          
          <ReactECharts option={ingresosOptions} />
        
          <List
            items={dataIngresos ?? []}
            selectKey={item=> item.id}
            render={(item)=> {
              const porcentaje = getPorcentaje(item.value, totalIngreso)

              return <div className="flex gap-4 mb-2 w-4/6 mx-auto"> 
                <div style={{ background: item.color.trim() ? item.color : "inherit" }} className={`rounded-md p-2 text-xs`}>{item.emoji}</div>
                <div className="grow gap-y-1 flex flex-col">
                  <p className="text-xs flex justify-between items-center"> 
                    <span> {item.name} </span>
                    <span> {porcentaje.toFixed(2)}% </span>
                  </p>
                  <progress max="100" style={{ color: item.color }} className={`progress`} value={porcentaje}>{porcentaje}%</progress>
                </div>
              </div>
            }}
          />
        </div>


        <input
          type="radio"
          name="tipo"
          role="tab"
          className="tab rounded-b-lg"
          aria-label="Egresos"
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          
          
          <ReactECharts option={egresosOptions} />

          <List
            items={dataEgresos ?? []}
            selectKey={item=> item.id}
            render={(item)=> {
              const porcentaje = getPorcentaje(item.value, totalEgreso)
              const progressStyle = {
                '--progress-color': item.color,
              }

              return <div className="flex gap-4 mb-2 w-4/6 mx-auto"> 
                <div style={{ background: item.color.trim() ? item.color : "inherit" }} className={`rounded-md p-2 text-xs`}>{item.emoji}</div>
                <div className="grow gap-y-1 flex flex-col">
                  <p className="text-xs flex justify-between items-center"> 
                    <span> {item.name} </span>
                    <span> {porcentaje.toFixed(2)}% </span>
                  </p>
                  <progress max="100" style={progressStyle} className={`progress progress-bar `} value={porcentaje}>{porcentaje}%</progress>
                </div>
              </div>
            }}
          />
        </div>

        
      </div>
    </>
  )
}

export default Informes