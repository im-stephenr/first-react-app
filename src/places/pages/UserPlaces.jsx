import React, { useContext, useEffect } from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hooks";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useState } from "react";

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

const UserPlaces = () => {
  // const variables
  const { isLoading, errorMessage, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [loadedPlaces, setLoadedPlaces] = useState();

  const uid = useParams().uid; // from url

  // const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === uid);
  // use useEffect so it will render only when sendRequest effects/changes
  useEffect(() => {
    const fetchUserPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${uid}`
        );
        setLoadedPlaces(responseData.userWithPlaces[0].places);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserPlaces(); // invoke/call/use the created function
  }, [sendRequest, uid]); // use sendRequest as array dependency so that this function will only render after sending request

  // handle delete under PlaceList component
  const deletePlaceHandler = (deletedPlaceId) => {
    // reset the LoadedPlaces into a new array in which excludes the deleted place id
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={deletePlaceHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
