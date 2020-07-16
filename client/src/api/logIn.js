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
      console.log(data);
      alert(data.msg);
      localStorage.clear();
      if (data.token) localStorage.setItem("token", data.token);
    })
    .catch(error => console.log("failed:", error));
};