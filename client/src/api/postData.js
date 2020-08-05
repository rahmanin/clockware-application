import { headers } from "./headers";

export default function postData(data, path) {

  if  (localStorage.token) data.token = localStorage.token;

  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  };

  return fetch(`/${path}`, options)
    .then(response => response.json())
    .then(backendData => {
      if (backendData.msg) localStorage.setItem("msg", backendData.msg)
      console.log(backendData)
    })
    .catch(error =>  console.log("failed:", error))
};