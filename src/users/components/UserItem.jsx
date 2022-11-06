import userEvent from "@testing-library/user-event";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../App.css";
import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card>
        <Link to={`/${props.id}/places`}>
          <div className="user-item__image">
            <Avatar
              src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.name}
              width="100"
              height="100"
            />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? "Place" : "Places"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
