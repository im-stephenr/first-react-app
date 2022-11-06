import React, { useEffect, useContext } from "react";
import { useState } from "react";
import "../../App.css";
import UserList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hooks";
import { AuthContext } from "../../shared/context/auth-context";

const Users = () => {
  // const variables
  const { isLoading, errorMessage, sendRequest, clearError } = useHttpClient(); // custom hook http-hook
  const [loadedUsers, setLoadedUsers] = useState();
  const auth = useContext(AuthContext); // useContext is like a global variable

  // trigger once since array dependency is empty
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users`
        );

        setLoadedUsers(responseData.users); // set the loaded users
      } catch (err) {
        console.log(err);
      }
    };

    // run the created function fetchUsers
    fetchUsers();
  }, [sendRequest]); // added sendRequest as array dependency so that this function will only render if sendRequest changes/works

  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UserList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
