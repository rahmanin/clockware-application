var today = new Date(); 
var year = today.getFullYear();
var month = today.getMonth()+1; 
var day = today.getDate();
var hour = today.getHours() + 1;
if (month.toString().length === 1) {
  month = '0' + month;
}
if (day.toString().length === 1) {
  day = '0' + day;
}   
if (hour.toString().length === 1) {
  hour = '0' + hour;
}
var tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)
var tomorrowYear = tomorrow.getFullYear();
var tomorrowMonth = tomorrow.getMonth()+1; 
var tomorrowDay = tomorrow.getDate();
if (tomorrowMonth.toString().length === 1) {
  tomorrowMonth = '0' + tomorrowMonth;
}
if (day.toString().length === 1) {
  tomorrowDay = '0' + tomorrowDay;
}   
const tomorrowDate = tomorrowYear + '-' + tomorrowMonth + '-' + tomorrowDay;
const cDate = year + '-' + month + '-' + day;
const cTime = hour;
export default {cDate, cTime, tomorrowDate};
