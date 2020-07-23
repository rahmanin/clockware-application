import { headers } from "./headers";

export default function postData(nameAndPass) {
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(nameAndPass),
  };

  return fetch(`/login`, options)
    .then(response => response.json())
    .then(data => {
      localStorage.clear();
      if (data.token) localStorage.setItem("token", data.token);
      if (data.msg) localStorage.setItem("msg", data.msg);
    })
    .catch(error => console.log("failed:", error));
};