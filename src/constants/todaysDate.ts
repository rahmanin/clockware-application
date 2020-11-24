let today: Date | string = new Date();
const dd: string = String(today.getDate()).padStart(2, '0');
const mm: string = String(today.getMonth() + 1).padStart(2, '0'); 
const yyyy: number = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;

export default today