import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";

const CardNewLicence = (props) => {
  return (
    <form>
      <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
        <Card style={{ width: "26%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}></Card>
        <Card style={{ width: "26%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}></Card>
        <Card style={{ width: "26%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}></Card>
        <Card style={{ width: "26%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}></Card>
        <Card style={{ width: "26%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}></Card>
      </Card>
    </form>
  );
};

export default CardNewLicence;
