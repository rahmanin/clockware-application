import { useEffect, useState } from "react";

export const useData = (prop) => {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`/${prop}`)
      .then(response => response.json())
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }, [prop]);
  return {
    data
  };
};

