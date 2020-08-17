import { headers } from "./headers";

export default function logIn(nameAndPass) {
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(nameAndPass),
  };

  return fetch(`/api/login`, options)
    .then(response => response.json())
    .catch(error => console.log("failed:", error));
};