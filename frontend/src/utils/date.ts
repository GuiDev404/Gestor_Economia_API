const formatZeroInDate = (date: number)=> date < 10 ? `0${date}` : date

export function dateBetween (dateSelected: string){
  const [year, month] = dateSelected.split('-').map(Number);
  
  const dateInit = new Date(year, month - 1, 1);
  const dateEnd = new Date(year, month, 0);

  const yearInit = dateInit.getFullYear()
  const monthInit = formatZeroInDate(dateInit.getMonth() + 1)
  const monthDayInit = formatZeroInDate(dateInit.getDate())

  const dateInitFormatted = `${yearInit}-${monthInit}-${monthDayInit}`

  const yearEnd = dateEnd.getFullYear()
  const monthEnd = formatZeroInDate(dateEnd.getMonth() + 1)
  const monthDayEnd = formatZeroInDate(dateEnd.getDate())

  const dateEndFormatted = `${yearEnd}-${monthEnd}-${monthDayEnd}`

  return [ dateInitFormatted, dateEndFormatted ]
}

export const defaultYearMonth = ()=> {
  const currentDate = new Date()
  return `${currentDate.getFullYear()}-${formatZeroInDate(currentDate.getMonth() + 1)}`
}