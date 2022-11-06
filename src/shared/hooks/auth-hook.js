import { useState, useCallback, useEffect } from "react";
// set logout timer
let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState();
  const [userId, setUserId] = useState(false);
  const [tokenExpirationDateState, setTokenExpirationDateState] = useState();

  // login callback function that will be assigned to auth-context
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    // insure token is not expired
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); // existing expiration date or create new 1 hour
    setTokenExpirationDateState(tokenExpirationDate); // set the current expiration datetime
    // set browser local storage
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(), // a kind of string that stores all important date information
      })
    );
  }, []);

  // logout callback function that will be assigned to auth-context
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDateState(null); // clear token expiration date on logout
    setUserId(false);
    // clear data under localStorage
    localStorage.removeItem("userData");
  }, []);

  // check if browser has been refreshed and remain the data
  useEffect(() => {
    // get the localStorage data and convert back the stringify data into JSON Object since we initially created this data as a string under login useCallback
    const storedData = JSON.parse(localStorage.getItem("userData"));
    // new Date(storedData.expiration) > new Date() if expiration datetime is greater than current datedatetime
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token); // if theres a data in localStorage then call login function
    }
  }, [login]);

  // auto logout if token expires
  useEffect(() => {
    if (token && tokenExpirationDateState) {
      // calculate remaining time of token
      const remainingTime =
        tokenExpirationDateState.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDateState]);

  return { token, login, logout, userId };
};
