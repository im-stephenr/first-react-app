import React, { useState, useCallback, useRef, useEffect } from "react";
/**
 * THIS HOOK IS CREATED FOR DYNAMIC ERROR HANDLING WHEN RECEIVING DATA FROM BACKEND
 */

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setError] = useState();
  const activeHttpRequest = useRef([]); // setting activeHttpRequest default empty array as reference

  // wrap it with useCallback so it will not be re-render/recreated/looped always when a component use it
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      // set loading
      setIsLoading(true);

      // Adding this function to abort the request whenever it is cancelled (commonly by switching urls fast while request is not yet finished)
      const httpAbortCtrl = new AbortController(); // a built in function on modern browser
      activeHttpRequest.current.push(httpAbortCtrl); // push the httpAbortCtrl results to activeHttpRequest

      try {
        /**
         * send http request or lan $.ajax in jquery
         * default method is GET
         * if we are not sending data, theres no need to specify Content-type
         * */
        const response = await fetch(url, {
          method, // also same as method: method, since they have the same property name
          body,
          headers,
          signal: httpAbortCtrl.signal, // use to cancel this fetch
        });

        // get the response data from api
        const responseData = await response.json();

        // filter all activeHttpRequest and remove the current httpAbortCtrl
        activeHttpRequest.current = activeHttpRequest.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        // if response fail
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData; // return response data
      } catch (err) {
        console.log(err);
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };
  // clean up function, trigger once
  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, errorMessage, sendRequest, clearError };
};
