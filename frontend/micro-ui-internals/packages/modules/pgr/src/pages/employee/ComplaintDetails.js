import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  BreakLine,
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
  Dropdown,
} from "@egovernments/digit-ui-react-components";

import { Close } from "../../Icons";
import { useTranslation } from "react-i18next";
import Modal from "../../components/Modal";
import useComplaintDetails from "../../hooks/useComplaintDetails";
import useWorkflowDetails from "../../hooks/useWorkflowDetails";

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

const TLCaption = ({ data }) => {
  return (
    <div>
      <p>{data.name}</p>
      <p>{data.mobileNumber}</p>
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
  console.log("statusTable", statusTable);
  const workflowDetails = useWorkflowDetails({ tenantId, id });
  console.log("workflowDetails", workflowDetails);
  const [displayMenu, setDisplayMenu] = useState(false);
  const [popup, setPopup] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [assignResponse, setAssignResponse] = useState(null);

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

  function onActionSelect(action) {
    setSelectedAction(action);
    switch (action) {
      case "ASSIGN":
        setPopup(true);
        setDisplayMenu(false);
        break;
      case "REASSIGN":
        setPopup(true);
        setDisplayMenu(false);
        break;
      case "REJECT":
        setPopup(true);
        setDisplayMenu(false);
        break;
      default:
        console.log("action not known");
        setDisplayMenu(false);
    }
  }

  async function onAssign(selectedEmployee, comments, uploadedFile) {
    setPopup(false);
    const response = await Digit.Complaint.assign(selectedAction, selectedEmployee, comments, uploadedFile);
    console.log("aasjdas", response);
    setAssignResponse(response);
    setToast(true);
    setTimeout(() => setToast(false), 10000);
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
            .filter(
              (k) =>
                k !== "CS_COMPLAINT_DETAILS_GEOLOCATION" && k !== "thumbnails" && k !== "workflow" && k !== "CS_COMPLAINT_DETAILS_ADDITIONAL_DETAILS"
            )
            .map((k, i, arr) =>
              arr.length - 1 === i ? <LastRow key={k} label={t(k)} text={statusTable[k]} /> : <Row key={k} label={t(k)} text={statusTable[k]} />
            )}
          {1 === 1 ? null : (
            <MediaRow label="CS_COMPLAINT_DETAILS_GEOLOCATION">
              <MapView onClick={zoomView} />
            </MediaRow>
          )}
        </StatusTable>
        {statusTable.thumbnails && statusTable.thumbnails.length !== 0 ? <DisplayPhotos srcs={statusTable.thumbnails} onClick={zoomImage} /> : null}
        <BreakLine />
        {workflowDetails.timeline && workflowDetails.timeline.length === 1 ? (
          <CheckPoint isCompleted={true} label={workflowDetails.timeline[0].status} />
        ) : (
          <ConnectingCheckPoints>
            {workflowDetails.timeline &&
              workflowDetails.timeline.map((checkpoint, index, arr) => {
                return arr.length - 1 === index ? (
                  <CheckPoint key={index} isCompleted={false} label={t(checkpoint.status)} />
                ) : (
                  <CheckPoint
                    key={index}
                    isCompleted={true}
                    label={t(checkpoint.status)}
                    customChild={checkpoint.caption && checkpoint.caption.length !== 0 ? <TLCaption data={checkpoint.caption[0]} /> : null}
                  />
                );
              })}
          </ConnectingCheckPoints>
        )}
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
        <Modal
          employeeRoles={workflowDetails.nextActions ? workflowDetails.nextActions.roles : null}
          headerBarMain={<Heading label={selectedAction === "ASSIGN" || selectedAction === "REASSIGN" ? "Assign Complaint" : "Reject Complaint"} />}
          headerBarEnd={<CloseBtn onClick={() => close(popup)} />}
          selectedAction={selectedAction}
          onAssign={onAssign}
          onCancel={() => close(popup)}
        />
      ) : null}
      {toast && (
        <Toast
          label={assignResponse ? (assignResponse.Errors ? assignResponse.Errors[0].message : JSON.stringify(assignResponse)) : null}
          onClose={closeToast}
        />
      )}
      <ActionBar>
        {displayMenu && workflowDetails.nextActions ? <Menu options={workflowDetails.nextActions.actions} onSelect={onActionSelect} /> : null}
        <SubmitBar label="Take Action" onSubmit={() => setDisplayMenu(!displayMenu)} />
      </ActionBar>
    </React.Fragment>
  );
};
