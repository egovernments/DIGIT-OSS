// import axios from "axios";
// import { size } from "lodash";
import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
// import basicScrutiny from "../BankScrutiny/basicScrutiny";
import basicScrutiny from "../ScrutinyBasic/AllServiceScrutiny/BankScrutiny/basicScrutiny";

// import { commoncolor, primarycolor } from "../../constants";
// import ScrutitnyForms from "../ScrutinyBasic/ScutinyBasic";
// import { useSearchParams } from "react-router-dom";

const FormBank = (props) => {
  return (
    <Card>
      <Row style={{ top: 30, padding: 10 }}>
        <basicScrutiny></basicScrutiny>
      </Row>
    </Card>
  );
};

export default FormBank;
