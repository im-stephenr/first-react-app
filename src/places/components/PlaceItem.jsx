import React, { Component, useState, useContext } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hooks";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, errorMessage, sendRequest, clearError } = useHttpClient();

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => setShowConfirmModal(true);
  const cancelDeleteHandler = () => setShowConfirmModal(false);

  const confirmDeleteHandler = async (placeId) => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "DELETE",
        null,
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      props.onDelete(placeId);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={errorMessage} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={
          <Button
            type="button"
            className="button--danger"
            onClick={closeMapHandler}
          >
            CLOSE
          </Button>
        }
      >
        <div className="map-container">
          {/* <Map center={props.coordinates} zoom={16} /> */}
          <iframe
            title="map"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={
              "https://maps.google.com/maps?q=" +
              props.coordinates.lat.toString() +
              "," +
              props.coordinates.lng.toString() +
              "&t=&z=15&ie=UTF8&iwloc=&output=embed"
            }
          ></iframe>
          <script
            type="text/javascript"
            src="https://embedmaps.com/google-maps-authorization/script.js?id=5a33be79e53caf0a07dfec499abf84b7b481f165"
          ></script>
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button type="button" onClick={cancelDeleteHandler} inverse>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => confirmDeleteHandler(props.id)}
              className="button--danger "
            >
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you really want to delete this place?</p>
      </Modal>

      <li className="place-item">
        {isLoading && <LoadingSpinner asOverlay />}
        <Card className="place-item__content">
          <div className="place-item__image"></div>
          <img
            src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
            alt={props.title}
          />
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
            <hr />
            <div className="place-item__action">
              <Button
                className="place-item__button"
                onClick={openMapHandler}
                inverse
              >
                VIEW ON MAP
              </Button>
              {auth.isLoggedIn && props.creatorId === auth.userId && (
                <Button
                  to={`/places/${props.id}`}
                  className="place-item__button button--success"
                >
                  EDIT
                </Button>
              )}
              {auth.isLoggedIn && props.creatorId === auth.userId && (
                <Button
                  onClick={showDeleteWarningHandler}
                  className="place-item__button button--danger"
                >
                  DELETE
                </Button>
              )}
            </div>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
