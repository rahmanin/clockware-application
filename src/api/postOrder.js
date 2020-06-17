import { headers } from "./headers";

export default function postOrder(data) {
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  };
  console.log("body", options);
  return fetch("http://localhost:3006/orders", options)
    .then(response => response.json())
    .catch(error => {
        console.log("failed:", error);
    });
};