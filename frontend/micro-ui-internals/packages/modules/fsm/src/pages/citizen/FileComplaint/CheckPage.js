import React from "react";
import {
  Card,
  CardCaption,
  CardHeader,
  CardLabel,
  CardSubHeader,
  StatusTable,
  Row,
  ActionLinks,
  LinkButton,
  SubmitBar,
} from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";

const ActionButton = ({ jumpTo }) => {
  const history = useHistory();

  function routeTo() {
    history.push(jumpTo);
  }

  return <LinkButton label="CHANGE" style={{ color: "#F47738" }} onClick={routeTo} />;
};

const CheckPage = ({ onSubmit }) => {
  const history = useHistory();

  return (
    <Card>
      <CardHeader>Check Your Answers</CardHeader>
      <CardSubHeader>Property Details</CardSubHeader>
      <StatusTable>
        <Row label="Property Type" text="Residential" actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/property-type" />} />
        <Row
          label="Property Sub-Type"
          text="Apartment"
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/property-subtype" />}
        />
        <Row
          label="Address"
          text="Back side Post Office Patiala Road Alakapuri Berhampur"
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/pincode" />}
        />
      </StatusTable>
      <CardSubHeader>Pit/Septic Tank Details</CardSubHeader>
      <StatusTable>
        <Row label="Size" text="1m x 1m x 1m" actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/tank-size" />} />
      </StatusTable>
      <SubmitBar label="Submit" onSubmit={onSubmit} />
    </Card>
  );
};

export default CheckPage;
