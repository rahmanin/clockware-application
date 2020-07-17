import { headers } from "./headers";

export default function updateElement(data, action, path, id) {

  if  (localStorage.token) data.token = localStorage.token;

    const options = {
        method: action,
        headers,
        body: JSON.stringify(data),
    };
    return fetch(`/${path}/${id}`, options)
        .then(response => response.json())
        .catch(error => {
            console.log("failed:", error);
        });
};