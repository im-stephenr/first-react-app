import React, { useState, useContext } from "react";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/UIElements/Input";
import useForm from "../../shared/hooks/form-hooks";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hooks";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { AuthContext } from "../../shared/context/auth-context";

const Authenticate = () => {
  const auth = useContext(AuthContext); // useContext is like a global variable

  const { isLoading, errorMessage, sendRequest, clearError } = useHttpClient();

  const [isLoginMode, setIsLoginMode] = useState(true);
  // set the state data
  const [formState, inputHandler, setFormData] = useForm(
    {
      username: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const loginFormHandler = async (event) => {
    event.preventDefault();
    if (isLoginMode) {
      // Login Mode
      try {
        // custom hook for handling fetch request to backend
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          "POST",
          JSON.stringify({
            username: formState.inputs.username.value,
            password: formState.inputs.password.value,
          }), // convert regular javascript data to json
          {
            "Content-Type": "application/json", // saying we are sending json data
          }
        );
        auth.login(responseData.userId, responseData.token); // calling the login function from AuthContext under App.js and passing 2 data
      } catch (err) {
        console.log(err);
      }
    } else {
      // Sign up mode
      try {
        // We use FormData instead of JSON since we are sending image
        const formData = new FormData();
        formData.append("name", formState.inputs.name.value);
        formData.append("username", formState.inputs.username.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        // send http request or lan $.ajax in jquery
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          "POST",
          formData // no need to add header type since formData automatically adds it
        );

        auth.login(responseData.userId, responseData.token); // calling the login function from AuthContext under App.js and passing 2 data
      } catch (err) {
        console.log(err);
      }
    }
  };

  // switching between login and signup form and reset the inputs
  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined, // set to undefined
          image: undefined, // set to undefined
        },
        formState.inputs.username.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: { value: "", isValid: false },
          image: { value: null, isValid: false },
        },
        false
      );
    }

    setIsLoginMode((prevMode) => !prevMode); // prevMode => !prevmode is a technique to toggle values example true or false
  };

  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={clearError} />
      <div className="container">
        {isLoading && <LoadingSpinner asOverlay />}
        <form className="place-form" onSubmit={loginFormHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload center id="image" onInput={inputHandler} />
          )}
          <Input
            id="username"
            label="Username"
            element="input"
            type="text"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a username."
            onInput={inputHandler}
          />
          <Input
            id="password"
            label="Password"
            element="input"
            type="password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Minimum of 5 characters required"
            onInput={inputHandler}
          />
          <Button
            type="submit"
            className="place-item__button button--block  button--success"
            disabled={!formState.isValid}
          >
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
          <Button
            className="place-item__button button--block"
            type="button"
            inverse
            onClick={switchModeHandler}
          >
            SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
          </Button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default Authenticate;
