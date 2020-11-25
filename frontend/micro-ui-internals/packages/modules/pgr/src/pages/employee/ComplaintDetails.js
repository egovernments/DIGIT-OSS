import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardLabel,
  CardLabelDesc,
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
  TextInput,
  TextArea,
  UploadFile,
  ButtonSelector,
  Toast,
  ActionBar,
  Menu,
  SubmitBar,
} from "@egovernments/digit-ui-react-components";

import { Close } from "../../Icons";
import { useTranslation } from "react-i18next";
import useComplaintDetails from "../../hooks/useComplaintDetails";

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

const Heading = (props) => {
  return <h1 className="heading-m">{props.label}</h1>;
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
  const { t } = useTranslation();
  const [fullscreen, setFullscreen] = useState(false);
  const [imageZoom, setImageZoom] = useState(null);
  // const [actionCalled, setActionCalled] = useState(false);
  const [toast, setToast] = useState(false);
  const tenantId = "pb.amritsar";
  const statusTable = useComplaintDetails({ tenantId, id });
  const [displayMenu, setDisplayMenu] = useState(false);
  const [popup, setPopup] = useState(false);
  function popupCall(option) {
    console.log("option", option);
    setDisplayMenu(false);
    setPopup(true);
  }
  useEffect(() => {
    (async () => {
      const assignWorkflow = await Digit.workflowService.getByBusinessId(tenantId, id);
      console.log("aassign", assignWorkflow);
    })();
  }, [statusTable]);
  // useEffect(() => {
  //   console.log("action", props.action);
  //   setActionCalled(props.action);
  // }, [props.action]);

  function zoomView() {
    setFullscreen(!fullscreen);
  }

  function close(state) {
    switch (state) {
      case fullscreen:
        setFullscreen(!fullscreen);
        break;
      case popup:
        setPopup(!popup);
        break;
      default:
        console.log(state);
        break;
    }
  }

  function zoomImage(imageSource) {
    setImageZoom(imageSource);
  }

  function onCloseImageZoom() {
    setImageZoom(null);
  }

  function onAssign() {
    setPopup(false);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  }

  function closeToast() {
    setToast(false);
  }

  return (
    <React.Fragment>
      <Card>
        <CardSubHeader>Complaint Summary</CardSubHeader>
        <CardLabel>Complaint Details</CardLabel>
        <StatusTable>
          {Object.keys(statusTable)
            .filter((k) => k !== "CS_COMPLAINT_DETAILS_GEOLOCATION" && k !== "thumbnails" && k !== "CS_COMPLAINT_DETAILS_ADDITIONAL_DETAILS")
            .map((k) => (
              <Row key={k} label={t(k)} text={statusTable[k]} />
            ))}
          {1 === 1 ? null : (
            <MediaRow label="CS_COMPLAINT_DETAILS_GEOLOCATION">
              <MapView onClick={zoomView} />
            </MediaRow>
          )}
          <LastRow label="landmark" text="SBI Bank" />
        </StatusTable>
        {/* <DisplayPhotos
          srcs={["https://via.placeholder.com/150", "https://via.placeholder.com/150", "https://via.placeholder.com/150"]}
          onClick={zoomImage}
        /> */}
      </Card>
      <Card>
        <ConnectingCheckPoints>
          <CheckPoint isCompleted={true} label="Pending For assignment" />
          <CheckPoint isCompleted={false} label="Complaint Filed" info="12/08/20 Naval Kishore" />
        </ConnectingCheckPoints>
      </Card>
      {fullscreen ? (
        <PopUp>
          <div className="popup-module">
            <HeaderBar main={<Heading label="Complaint Geolocation" />} end={<CloseBtn onClick={() => close(fullscreen)} />} />
            <div className="popup-module-main">
              <img src="https://via.placeholder.com/912x568" />
            </div>
          </div>
        </PopUp>
      ) : null}
      {imageZoom ? <ImageViewer imageSrc={imageZoom} onClose={onCloseImageZoom} /> : null}
      {popup ? (
        <PopUp>
          <div className="popup-module">
            <HeaderBar main={<Heading label="Assign Complaint" />} end={<CloseBtn onClick={() => close(popup)} />} />
            <div className="popup-module-main">
              <Card>
                <CardLabel>Employee Name</CardLabel>
                <TextInput />
                <CardLabel>Comments</CardLabel>
                <TextArea />
                <CardLabel>Supporting Documents</CardLabel>
                <CardLabelDesc>Only .jpg and .pdf files. 5 MB max file size.</CardLabelDesc>
                <UploadFile />
              </Card>
              <div className="popup-module-action-bar">
                <ButtonSelector theme="border" label="Cancel" />
                <ButtonSelector label="Assign" onSubmit={onAssign} />
              </div>
            </div>
          </div>
        </PopUp>
      ) : null}
      {toast && <Toast label="Complaint assigned successfully!" onClose={closeToast} />}
      <ActionBar>
        {displayMenu ? <Menu options={["Assign Complaint", "Reject Complaint"]} onSelect={popupCall} /> : null}
        <SubmitBar label="Take Action" onSubmit={() => setDisplayMenu(!displayMenu)} />
      </ActionBar>
    </React.Fragment>
  );
};
