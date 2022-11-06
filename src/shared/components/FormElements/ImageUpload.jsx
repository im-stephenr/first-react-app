import React, { Component, useRef, useState, useEffect } from "react";
import Button from "./Button";

const ImageUpload = (props) => {
  const filePickerRef = useRef(); // this is like document.getElementById and will get the entire element
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  // function for preview image on upload, triggers whenever a file changes
  useEffect(() => {
    // if theres no file uploaded return
    if (!file) {
      return;
    }
    const fileReader = new FileReader(); // FileReader built in from browser
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid; // current state of is valid

    // check if there is a file uploaded
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];

      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true; // set new value since setIsValid is not yet triggered
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    // a function from parent component
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <React.Fragment>
      <div className="form-control">
        <input
          type="file"
          ref={filePickerRef}
          id={props.id}
          style={{ display: "none" }}
          accept=".jpg,.png,.jpeg"
          onChange={pickHandler}
        />
      </div>
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          Pick IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </React.Fragment>
  );
};

export default ImageUpload;
