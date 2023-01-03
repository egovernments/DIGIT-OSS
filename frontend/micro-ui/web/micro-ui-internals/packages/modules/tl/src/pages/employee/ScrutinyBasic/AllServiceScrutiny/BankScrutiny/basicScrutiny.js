import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";

import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import InfoIcon from "@mui/icons-material/Info";

// import Extension from "../BankGuarantee/Extension";
// import Release from "../BankGuarantee/Release";
// import Replace from "../BankGuarantee/Replace";
// import SubmitNew from "../BankGuarantee/SubmitNew";

import Collapse from "react-bootstrap/Collapse";

const Scrutiny = (props) => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const handlemodaldData = (data) => {
    setmodaldData(data.data);
    setSmShow(false);
  };

  return (
    <Form ref={props.personalInfoRef}>
      <div
        className="collapse-header"
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        style={{
          background: "#f1f1f1",
          padding: "0.25rem 1.25rem",
          borderRadius: "0.25rem",
          fontWeight: "600",
          display: "flex",
          cursor: "pointer",
          color: "#817f7f",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <span style={{ color: "#817f7f" }} className="">
          Bank Guarantee
        </span>
        {open ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>

      <Collapse in={open}>
        <div id="example-collapse-text">
          {/* <SubmitNew /> */}
          {/* <Extension />
          <Replace />
          <Release /> */}
        </div>
      </Collapse>
    </Form>
  );
};

export default Scrutiny;
