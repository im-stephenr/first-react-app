import React, { Component } from "react";
import "../../../App.css";
const MainHeader = (props) => {
  return <header className="main-header">{props.children}</header>;
};

export default MainHeader;
