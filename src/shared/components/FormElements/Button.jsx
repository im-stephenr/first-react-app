import React, { Component } from "react";
import { Link } from "react-router-dom";

const Button = (props) => {
  if (props.href) {
    return (
      <a
        href={props.href}
        className={`button button--${props.size || "default"} 
        ${props.className} ${props.inverse && "button--inverse"}`}
      >
        {props.children}
      </a>
    );
  }

  if (props.to) {
    return (
      <Link
        to={props.to}
        className={`button button--${props.size || "default"} ${
          props.className
        } ${props.inverse && "button--inverse"}`}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      className={`button button--${props.size || "default"} ${
        props.className
      } ${props.inverse && "button--inverse"}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
