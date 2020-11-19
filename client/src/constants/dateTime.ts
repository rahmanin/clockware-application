var today: Date = new Date();
var year: string|number = today.getFullYear();
var month: string|number = today.getMonth() + 1;
var day: string|number = today.getDate();
var hour: string|number = today.getHours() + 1;
if (month.toString().length === 1) {
  month = "0" + month;
}
if (day.toString().length === 1) {
  day = "0" + day;
}
if (hour.toString().length === 1) {
  hour = "0" + hour;
}
var tomorrow: Date = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
var tomorrowYear: string|number = tomorrow.getFullYear();
var tomorrowMonth: string|number = tomorrow.getMonth() + 1;
var tomorrowDay: string|number = tomorrow.getDate();
if (tomorrowMonth.toString().length === 1) {
  tomorrowMonth = "0" + tomorrowMonth;
}
if (tomorrowDay.toString().length === 1) {
  tomorrowDay = "0" + tomorrowDay;
}
const tomorrowDate: string = tomorrowYear + "-" + tomorrowMonth + "-" + tomorrowDay;
const cDate: string= year + "-" + month + "-" + day;
const cTime: any = hour;
export default { cDate, cTime, tomorrowDate };
