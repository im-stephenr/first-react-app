import React, { Component, useRef, useEffect } from "react";

const Map = (props) => {
  const mapRef = useRef();
  const { center, zoom } = props;
  /**
   * new window.google.maps.Map() is from the embeded javascript src with API in public/index.html
   * the function inside the parameter '{center, zoom}' will only trigger IF the value from the array dependencies '[center, zoom]' will change
   * */
  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
    });
    new window.google.maps.Marker({ position: props.center, map: map });
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
