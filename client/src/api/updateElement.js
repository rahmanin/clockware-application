import { headers } from "./headers";

export default function updateElement(data, action, path, id) {

  if  (localStorage.token) headers.authorization = localStorage.token;
  if  (localStorage.isAdmin) headers.isAdmin = localStorage.isAdmin;
  
    const options = {
        method: action,
        headers,
        body: JSON.stringify(data),
    };
    return fetch(`/api/${path}/${id}`, options)
        .then(response => response.json())
        .catch(error => {
            console.log("failed:", error);
        });
};