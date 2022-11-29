import React from "react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";

const Map = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_GOOGLE_MAP_API_KEY,

  });

  if (!isLoaded) {
    return <div>Loading..</div>;
  }
  const center = { lat: 48.8584, lng: 2.2945 };
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "0%",
        height: "30%",
        width: "100%",
      }}
    >
      <GoogleMap
        center={center}
        zoom={15}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        <Marker position={center} />
      </GoogleMap>{" "}
    </div>
  );
};

export default Map;
