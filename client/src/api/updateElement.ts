import { headers } from "./headers";

interface Options {
    method: string,
    headers: {},
    body: string
}

export const updateElement = (
    data: {},
    action: string,
    path: string,
    id?: number|null
): Promise<any> => {

  if  (localStorage.token) headers.authorization = localStorage.token;
  
  const options: Options = {
    method: action,
    headers,
    body: JSON.stringify(data),
  };
  return fetch(id ? `/api/${path}/${id}` : `/api/${path}`, options)
    .then(response => response.json())
    .catch(error => {
        console.log("failed:", error);
    });
};