import { headers } from "./headers";

export default function postData(data, path) {
  if (localStorage.clientToken) headers.authorization = localStorage.clientToken;

  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  };

  return fetch(`/api/${path}`, options)
    .then(response => response.json())
    .catch(error =>  console.log("failed:", error))
};