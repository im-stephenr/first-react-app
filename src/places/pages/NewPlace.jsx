import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/UIElements/Input";
import useForm from "../../shared/hooks/form-hooks";
import { useHttpClient } from "../../shared/hooks/http-hooks";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
const NewPlace = () => {
  const history = useHistory();
  const auth = useContext(AuthContext); // useContext is like a global variable
  // Custom hook for handling fetch request to backend
  const { isLoading, errorMessage, sendRequest, clearError } = useHttpClient();
  /* a custom hook made for handling form inputs/validation this has 2 arguments, the initializeInput and initializeValidity\
   * returns array with 2 values
   */
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false // second argument
  );

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places`,
        "POST",
        formData,
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      // Redirect
      history.push("/");
    } catch (err) {
      console.log("CATCH: " + err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={clearError} />
      {isLoading && <LoadingSpinner as asOverlay />}
      <div className="container">
        <form className="place-form" onSubmit={placeSubmitHandler}>
          <Input
            id="title"
            label="Title"
            element="input"
            type="text"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
          />
          <Input
            id="description"
            label="Description"
            rows="10"
            element="textarea"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
          />
          <Input
            id="address"
            label="Address"
            rows="10"
            element="textarea"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid address"
            onInput={inputHandler}
          />
          <ImageUpload id="image" onInput={inputHandler} />
          <div className="center">
            <Button
              type="submit"
              disabled={!formState.isValid}
              className="button--success button--md"
            >
              Add Place
            </Button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};

export default NewPlace;
