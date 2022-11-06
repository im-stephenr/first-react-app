import React, { Component, useReducer, useEffect } from "react";
import { validate } from "../../util/validators";

// 1st parameter is the state value, action is an object with properties declared in dispatch()
const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE": // if action.type is change then return an updated state
      return {
        ...state, // spread operator all state is copied and as is
        value: action.value,
        isValid: validate(action.value, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default: // as a default, return the current state
      return state;
  }
};

const Input = (props) => {
  const INITIAL_STATE = {
    value: props.initialValue || "",
    isValid: props.initialValid || false,
    isTouched: false, // onBlur input
  };
  // useReducer for handling multiple states
  const [inputState, dispatch] = useReducer(inputReducer, INITIAL_STATE);

  // Object Destructure so that we will only get what is needed to that object for the useEffect trigger instead of using the props and inputState directly
  const { id, onInput } = props;
  const { value, isValid } = inputState;
  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  /** initializing useReducer with default state and action
   * returns array with 2 values
   * 1st value is the current state value , 2nd value is a function dispatch
   * useReduce parameters are 1st is custom logic reducer (inputReducer) 2nd is the initial data/value in object
   */
  const changeHandler = (event) => {
    /** dispatch is the 2nd parameter (action) of inputReducer logic
     * dispatch will send state value that you want to change as an object
     */
    dispatch({
      type: "CHANGE",
      value: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  //   Check what type of input element is the component
  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        value={inputState.value}
        onBlur={touchHandler}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        value={inputState.value}
        onBlur={touchHandler}
      />
    );
  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
