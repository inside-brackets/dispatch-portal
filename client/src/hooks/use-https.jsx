import { useState, useCallback } from "react";
import axios from "axios";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const sendRequest = useCallback(async (requestConfig, applyData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : "GET",
        data: requestConfig.body ? requestConfig.body : null,
      });

      applyData(response.data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message || "Something went wrong!");
    }
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
  };
};

export default useHttp;
