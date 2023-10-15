export function getDate(date?: Date | string) {
    const newDate = date ? new Date(date) : new Date();
    const year: number | string = newDate.getFullYear();
    let month: number | string = newDate.getMonth() + 1;
    let day: number | string = newDate.getDate();
    let hour: number | string = newDate.getHours();
    let minuts: number | string = newDate.getMinutes();
  
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    if (hour < 10) {
      hour = '0' + hour;
    }
    if (minuts < 10) {
      minuts = '0' + minuts;
    }

    const totalDate = `${year}-${month}-${day}`;
    const totalDateWithTime = `${year}-${month}-${day}T${hour}:${minuts}`;
  
    return {totalDate, totalDateWithTime};
}