import { useEffect, useState } from "react";

export const useData = path => {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`/${path}`)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => {
        console.log("Error:", error);
      });
  }, [path]);
  return {
    data
  };
};

