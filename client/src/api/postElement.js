import { headers } from "./headers";
import locale from "antd/lib/date-picker/locale/en_US";

export default function postElement(data, path) {

  if  (localStorage.token) headers.authorization = localStorage.token;

  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  };

  return fetch(`/${path}`, options)
    .then(response => response.json())
    .then(backendData => {
      localStorage.setItem('lastAdded', JSON.stringify(backendData));
    })
    .catch(error =>  console.log("failed:", error))
};