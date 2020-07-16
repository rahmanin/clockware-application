import { headers } from "./headers";

export default function postData(dataa, path) {
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(dataa),
  };

  return fetch(`/${path}`, options)
    .then(response => console.log("POST response", response.json()))
    .catch(error => {
        console.log("failed:", error);
    });
};