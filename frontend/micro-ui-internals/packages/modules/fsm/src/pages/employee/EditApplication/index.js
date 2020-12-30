import React, { Fragment } from "react";
import { NewApplication } from "../NewApplication";

const EditApplication = () => {
  const header = (
    <>
      <p>Modify Application</p>
      <p style={{ fontSize: "16px" }}>Applicant No. FSM-20313344</p>
    </>
  );
  return <NewApplication heading={header} />;
};

export default EditApplication;
