export default function postData(data, path) {

  const options = {
    method: "POST",
    body: data
  };

  return fetch(`/api/${path}`, options)
    .then(response => response.json())
    .catch(error =>  console.log("failed:", error))
};