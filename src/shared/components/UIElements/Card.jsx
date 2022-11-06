import React, { Component } from "react";
import "../../../App.css";

const Card = (props) => {
  return <div className={`user-card ${props.className}`}>{props.children}</div>;
};

export default Card;
