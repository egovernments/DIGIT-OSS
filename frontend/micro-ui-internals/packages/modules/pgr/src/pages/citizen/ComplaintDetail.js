import React from "react";
import { useParams } from "react-router-dom";

export const ComplaintsDetail = ({}) => {
  let { id } = useParams();
  // TODO: get compnaint details from api call

  return <h2>Complaint Detail: {id}</h2>;
};
