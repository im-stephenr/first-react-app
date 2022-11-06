import React, { Component } from "react";
const Avatar = (props) => {
  return (
    <img
      className="user-item__avatar"
      src={props.src}
      alt={props.alt}
      width={props.width}
      height={props.height}
    />
  );
};

export default Avatar;
