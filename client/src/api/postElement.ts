import { headers } from "./headers";

interface Options {
  method: string,
  headers: {},
  body: string
}

export const postElement = (data: {}, path: string): Promise<any> => {

  if  (localStorage.token) headers.authorization = localStorage.token;

  const options: Options = {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  };

  return fetch(`/api/${path}`, options)
    .then(response => response.json())
    .catch(error =>  console.log("failed:", error))
};