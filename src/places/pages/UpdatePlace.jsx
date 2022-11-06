import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/UIElements/Input";
import useForm from "../../shared/hooks/form-hooks";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hooks";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useContext } from "react";

// const DUMMY_PLACES = [
//   {
//     id: "p1",
//     title: "Empire State Building",
//     description: "One of the most famous building",
//     imageUrl: "https://picsum.photos/500?random=1",
//     address: "20 W 34th St, New York, NY 10001",
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584,
//     },
//     creator: "u1",
//   },
//   {
//     id: "p2",
//     title: "Seven Eleven Building",
//     description: "Lorem Ipsum MOther Fucker",
//     imageUrl: "https://picsum.photos/500?random=2",
//     address: "20 W 34th St, New York, NY 10001",
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584,
//     },
//     creator: "u2",
//   },
// ];

const UpdatePlace = () => {
  const [identifiedPlace, setIdentifiedPlace] = useState();
  const { isLoading, errorMessage, sendRequest, clearError } = useHttpClient(); // for handling request from backend
  const auth = useContext(AuthContext); // initialized global variables and functions
  const placeId = useParams().placeId; // from url /places/:placeId
  const history = useHistory(); // for redirect url
  // const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false // second argument
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        // set the data and assign to identifiedPlace
        setIdentifiedPlace(responseData.place);
        // set the data to form inputs
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        }
      );
      history.push(`/${auth.userId}/places`);
    } catch (err) {}
  };

  // if data does not exist from the given placeID parameter
  if (!identifiedPlace && !errorMessage) {
    return (
      <Card className="center user-card__noData">
        <h2>Could not find place!</h2>
      </Card>
    );
  }

  /* if loaded is still true meaning the data from formState is not yet loaded then show a loading message
   */
  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && identifiedPlace && (
        <div className="container">
          <form className="place-form" onSubmit={handleSubmit}>
            <Input
              id="title"
              element="input"
              type="text"
              label="Title"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid title."
              onInput={inputHandler}
              initialValue={identifiedPlace.title}
              initialValid={true}
            />
            <Input
              id="description"
              element="textarea"
              type="text"
              label="Description"
              validators={[VALIDATOR_MINLENGTH(5)]}
              errorText="Please enter at least 5 characters."
              onInput={inputHandler}
              initialValue={identifiedPlace.description}
              initialValid={true}
            />
            <Button
              type="submit"
              className="button--success button-md"
              disabled={!formState.isValid}
            >
              UPDATE PLACE
            </Button>
          </form>
        </div>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
