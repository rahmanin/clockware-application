import { useEffect, useState } from "react";
import { headers } from "../api/headers";

export const useCheckAuth = () => {
  const token = localStorage.token;
  headers.authorization = token;
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    fetch(`/checkAuth`, {headers})
      .then(res => {
        if (res.status === 200) {
          setIsLogged(true)
        }
      })
      .catch(error => console.log("failed:", error));

  }, []);
  return isLogged
};

