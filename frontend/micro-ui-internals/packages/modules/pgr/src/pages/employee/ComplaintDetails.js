import React, { useState } from "react";
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
  PopUp,
  HeaderBar,
  ImageViewer,
} from "@egovernments/digit-ui-react-components";

import { Close } from "../../Icons";

const MapView = (props) => {
  return (
    <div onClick={props.onClick}>
      {/* <iframe
        width="600"
        height="450"
        frameBorder="0"
        style={{ border: 0 }}
        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDdKOqX6EPEX9djPm-vL_8zv0HBF8z0Qjg&q=Space+Needle,Seattle+WA"></iframe> */}
      <img src="https://via.placeholder.com/640x280" />
    </div>
  );
};

const Heading = () => {
  return <h1 className="heading-m">Complaint Geolocation</h1>;
};

const CloseBtn = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick}>
      <Close />
    </div>
  );
};

export const ComplaintDetails = (props) => {
  let { id } = useParams();
  const [fullscreen, setFullscreen] = useState(false);
  const [imageZoom, setImageZoom] = useState(null);
  function zoomView() {
    setFullscreen(!fullscreen);
  }

  function close() {
    setFullscreen(!fullscreen);
  }

  function zoomImage(imageSource) {
    console.log("imageSource", imageSource);
    setImageZoom(imageSource);
  }

  function onCloseImageZoom() {
    setImageZoom(null);
  }

  return (
    <React.Fragment>
      <Card>
        <CardSubHeader>Complaint Summary</CardSubHeader>
        <CardLabel>Complaint Details</CardLabel>
        <StatusTable>
          <Row label="complaint number" text={id} />
          <MediaRow label="Geolocation">
            <MapView onClick={zoomView} />
          </MediaRow>
          <LastRow label="landmark" text="SBI Bank" />
        </StatusTable>
        <DisplayPhotos
          srcs={["https://via.placeholder.com/150", "https://via.placeholder.com/150", "https://via.placeholder.com/150"]}
          onClick={zoomImage}
        />
      </Card>
      <Card>
        <ConnectingCheckPoints>
          <CheckPoint isCompleted={true} label="Pending For assignment" />
          <CheckPoint isCompleted={false} label="Complaint Filed" info="12/08/20 Naval Kishore" />
        </ConnectingCheckPoints>
      </Card>
      {fullscreen ? (
        <PopUp>
          <div className="zoom-view">
            <HeaderBar main={<Heading />} end={<CloseBtn onClick={() => close()} />} />
            <div className="zoom-view-main">
              <img src="https://via.placeholder.com/912x568" />
            </div>
          </div>
        </PopUp>
      ) : null}
      {imageZoom ? <ImageViewer imageSrc={imageZoom} onClose={onCloseImageZoom} /> : null}
    </React.Fragment>
  );
};
