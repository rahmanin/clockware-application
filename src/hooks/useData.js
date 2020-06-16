import { useEffect, useState } from "react";

export const useData = (prop) => {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3006/${prop}`)
      .then(response => response.json())
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }, []);
  return {
    data
  };
};

