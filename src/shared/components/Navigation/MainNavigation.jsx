import React, { Component, useState } from "react";
import MainHeader from "./MainHeader";
import { Link } from "react-router-dom";
import "../../../App.css";
import NavLinks from "./NavLinks";
import Sidedrawer from "./Sidedrawer";
import Backdrop from "../UIElements/Backdrop";
const MainNavigation = (props) => {
  const [drawIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
    console.log("tae");
  };

  return (
    <React.Fragment>
      {drawIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <Sidedrawer show={drawIsOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </Sidedrawer>
      <MainHeader>
        <button onClick={openDrawerHandler} className="main-navigation__header">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">Your Places</Link>
        </h1>
        <nav className="main-navigation__nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
