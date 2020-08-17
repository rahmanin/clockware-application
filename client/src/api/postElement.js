import { headers } from "./headers";

export default function postElement(data, path) {

  if  (localStorage.token) headers.authorization = localStorage.token;
  if  (localStorage.isAdmin) headers.isAdmin = localStorage.isAdmin;

  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  };

  return fetch(`/api/${path}`, options)
    .then(response => response.json())
    .catch(error =>  console.log("failed:", error))
};