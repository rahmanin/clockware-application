import { useEffect, useState } from "react";

export const useData = path => {

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    fetch(`/${path}`)
      .then(response => response.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }, [path]);
  return {
    data,
    isLoading
  };
};

