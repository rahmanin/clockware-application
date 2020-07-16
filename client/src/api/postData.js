import { headers } from "./headers";

export default function postData(data, path) {
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  };

  return fetch(`/${path}`, options)
    .then(response => response.json())
    .catch(error =>  console.log("failed:", error))
};