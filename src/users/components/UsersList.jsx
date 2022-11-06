import React, { Component } from "react";
import "../../App.css";
import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";

const UserList = (props) => {
  if (props.items.length === 0) {
    return (
      <Card className="center">
        <h2>No Users Found.</h2>
      </Card>
    );
  }

  return (
    <ul className="user-list">
      {props.items.map((user) => {
        return (
          <UserItem
            key={user._id}
            id={user._id}
            image={`${user.image}`}
            name={user.name}
            placeCount={user.places.length}
          />
        );
      })}
    </ul>
  );
};

export default UserList;
