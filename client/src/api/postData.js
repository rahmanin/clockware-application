import { headers } from "./headers";

export default function postData(data, prop) {
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  };

  return fetch(`/${prop}`, options)
    .then(response => response)
    .catch(error => {
        console.log("failed:", error);
    });
};