interface Options {
  method: string,
  body: any
}

export const postImage = (data: any, path: string): Promise<any> => {

  const options: Options = {
    method: "POST",
    body: data
  };
  return fetch(`/api/${path}`, options)
    .then(response => response.json())
    .catch(error =>  console.log("failed:", error))
};