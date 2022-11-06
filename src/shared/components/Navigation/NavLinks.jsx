import React, { Component, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import "../../../App.css";
import { AuthContext } from "../../context/auth-context";
import Button from "../FormElements/Button";
const NavLinks = () => {
  const auth = useContext(AuthContext); // this holds the declared global variables and function inside auth context
  const handleLogout = () => {
    auth.logout();
  };
  return (
    <ul className="main-navigation__navlinks">
      <li>
        <NavLink to="/" exact>
          All Users
        </NavLink>
      </li>
      <li>
        {auth.isLoggedIn && (
          <NavLink to={`/${auth.userId}/places`}>My Places</NavLink>
        )}
      </li>
      <li>
        {auth.isLoggedIn && <NavLink to="/places/new">Add Place</NavLink>}
      </li>
      <li>
        {!auth.isLoggedIn && (
          <NavLink to="/users/authenticate">Authenticate</NavLink>
        )}
      </li>
      <li>
        {auth.isLoggedIn && (
          <Button
            type="button"
            className="button button--danger button--logout"
            onClick={handleLogout}
          >
            Logout
          </Button>
        )}
      </li>
    </ul>
  );
};

export default NavLinks;
