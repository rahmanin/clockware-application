var now = new Date(); 
var year = now.getFullYear();
var month = now.getMonth()+1; 
var day = now.getDate();
var hour = now.getHours() + 1;
if (month.toString().length === 1) {
  month = '0' + month;
}
if (day.toString().length === 1) {
  day = '0' + day;
}   
if (hour.toString().length === 1) {
  hour = '0' + hour;
}
const cDate = year + '-' + month + '-' + day;
const cTime = hour + ':00';
export default {cDate, cTime};
