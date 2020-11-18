import React from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardLabel,
  CardSubHeader,
  ConnectingCheckPoints,
  CheckPoint,
  DisplayPhotos,
  MediaRow,
  LastRow,
  Row,
  StatusTable,
} from "@egovernments/digit-ui-react-components";

const MapView = () => {
  return (
    <iframe
      width="600"
      height="450"
      frameBorder="0"
      style={{ border: 0 }}
      src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDdKOqX6EPEX9djPm-vL_8zv0HBF8z0Qjg&q=Space+Needle,Seattle+WA"
      allowFullScreen
    ></iframe>
  );
};

export const ComplaintDetails = (props) => {
  let { id } = useParams();
  return (
    <React.Fragment>
      <Card>
        <CardSubHeader>Complaint Summary</CardSubHeader>
        <CardLabel>Complaint Details</CardLabel>
        <StatusTable>
          <Row label="complaint number" text={id} />
          <MediaRow label="Geolocation">
            <MapView />
          </MediaRow>
          <LastRow label="landmark" text="SBI Bank" />
        </StatusTable>
        <DisplayPhotos srcs={["https://via.placeholder.com/150", "https://via.placeholder.com/150", "https://via.placeholder.com/150"]} />
      </Card>
      <Card>
        <ConnectingCheckPoints>
          <CheckPoint isCompleted={true} label="Pending For assignment" />
          <CheckPoint isCompleted={false} label="Complaint Filed" info="12/08/20 Naval Kishore" />
        </ConnectingCheckPoints>
      </Card>
    </React.Fragment>
  );
};
