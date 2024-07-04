import React from "react";
import { Navigate } from "react-router-dom";

const Authmiddleware = (props) => {
  if (!localStorage.getItem("authUser")) {
    window.location.href = "http://localhost:5173/login";
    return null; // Or optionally return a loading indicator or message
    // return (
    //   <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    // );
  }
  return (<React.Fragment>
    {props.children}
  </React.Fragment>);
};

export default Authmiddleware;



