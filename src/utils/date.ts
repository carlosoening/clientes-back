export const formatDateToTimestamp = (date: Date | any): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}.${milliseconds}`;
}

// DD_MM_YYYY
export const parseDD_MM_YYYYToDate = (str: string) => {
  const day: string = str.substring(0, 2);
  const month: string = str.substring(3, 5);
  const year: string = str.substring(6);

  return new Date(`${year}-${month}-${day}T00:00:00.000`);
}

// YYYY-MM-DD
export const parseYYYYMMDDtoDate = (str: string) => {
  const year: string = str.substring(0, 4);
  const month: string = str.substring(5, 7);
  const day: string = str.substring(8);

  return new Date(`${year}-${month}-${day}T00:00:00.000`);
}

export const formatDateToYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
}

export const formatDateToDDMMYYYY = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${day <= 9 ? `0${day}` : day}/${month <= 9 ? `0${month}` : month}/${year}`;
}

export const formatDateToDDMMYYYYhhmm = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minutes = date.getMinutes();

  return `${day <= 9 ? `0${day}` : day}/${month <= 9 ? `0${month}` : month}/${year} ${hour <= 9 ? `0${hour}` : hour}:${minutes <= 9 ? `0${minutes}` : minutes}`;
}