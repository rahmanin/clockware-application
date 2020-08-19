import { headers } from "./headers";

export default function postElement(data, path) {

  if  (localStorage.token) headers.authorization = localStorage.token;
  if  (localStorage.is_admin) headers.is_admin = localStorage.is_admin;

  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  };

  return fetch(`/api/${path}`, options)
    .then(response => response.json())
    .catch(error =>  console.log("failed:", error))
};