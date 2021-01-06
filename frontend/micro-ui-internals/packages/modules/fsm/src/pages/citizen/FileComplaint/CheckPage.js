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

const CheckPage = ({ onSubmit, value }) => {
  const history = useHistory();

  const { city_complaint, propertyType, subtype, pitDetail } = value;

  return (
    <Card>
      <CardHeader>Check Your Answers</CardHeader>
      <CardSubHeader>Property Details</CardSubHeader>
      <StatusTable>
        <Row label="Property Type" text={propertyType} actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/property-type" />} />
        <Row
          label="Property Sub-Type"
          text={subtype.name}
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/property-subtype" />}
        />
        <Row label="Address" text={city_complaint.address} actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/pincode" />} />
      </StatusTable>
      <CardSubHeader>Pit/Septic Tank Details</CardSubHeader>
      <StatusTable>
        <Row
          label="Size"
          text={Object.values(pitDetail).join(" x ")}
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/tank-size" />}
        />
      </StatusTable>
      <SubmitBar label="Submit" onSubmit={onSubmit} />
    </Card>
  );
};

export default CheckPage;
