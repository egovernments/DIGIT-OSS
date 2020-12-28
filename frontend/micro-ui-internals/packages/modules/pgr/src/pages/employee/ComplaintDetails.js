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
  Loader,
} from "@egovernments/digit-ui-react-components";

import { Close } from "../../Icons";
import { useTranslation } from "react-i18next";
import Modal from "../../components/Modal";
import { isError } from "react-query";

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
  const { t } = useTranslation();
  return (
    <div>
      {data.date && <p>{data.date}</p>}
      <p>{data.name}</p>
      <p>{data.mobileNumber}</p>
      {data.source && <p>{t("ES_COMMON_FILED_VIA_" + data.source.toUpperCase())}</p>}
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
  const { isLoading, complaintDetails, revalidate: revalidateComplaintDetails } = Digit.Hooks.pgr.useComplaintDetails({ tenantId, id });
  const workflowDetails = Digit.Hooks.useWorkflowDetails({ tenantId, id, moduleCode: "PGR", role: "EMPLOYEE" });
  const [displayMenu, setDisplayMenu] = useState(false);
  const [popup, setPopup] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [assignResponse, setAssignResponse] = useState(null);
  const [loader, setLoader] = useState(false);
  const [rerender, setRerender] = useState(1);
  function popupCall(option) {
    console.log("option", option);
    setDisplayMenu(false);
    setPopup(true);
  }

  useEffect(() => {
    (async () => {
      const assignWorkflow = await Digit?.WorkflowService?.getByBusinessId(tenantId, id);
      console.log("assign", assignWorkflow);
    })();
  }, [complaintDetails]);

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
      case "RESOLVE":
        setPopup(true);
        setDisplayMenu(false);
        break;
      case "REJECT":
        setPopup(true);
        setDisplayMenu(false);
        break;
      case "REOPEN":
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
    const response = await Digit.Complaint.assign(complaintDetails, selectedAction, selectedEmployee, comments, uploadedFile);
    console.log("aasjdas", response);
    setAssignResponse(response);
    setToast(true);
    setLoader(true);
    await workflowDetails.revalidate();
    await revalidateComplaintDetails;
    setLoader(false);
    setRerender(rerender + 1);
    setTimeout(() => setToast(false), 10000);
  }

  function closeToast() {
    setToast(false);
  }

  if (isLoading || workflowDetails.isLoading || loader) {
    return <Loader />;
  }

  if (workflowDetails.isError) return <React.Fragment>{workflowDetails.error}</React.Fragment>;

  const getTimelineCaptions = (checkpoint) => {
    // console.log("tl", checkpoint);
    if (checkpoint.status === "COMPLAINT_FILED" && complaintDetails?.audit) {
      const caption = {
        date: Digit.DateUtils.ConvertTimestampToDate(complaintDetails.audit.details.createdTime),
        name: complaintDetails.audit.citizen.name,
        mobileNumber: complaintDetails.audit.citizen.mobileNumber,
        source: complaintDetails.audit.source,
      };
      return <TLCaption data={caption} />;
    }
    return checkpoint.caption && checkpoint.caption.length !== 0 ? <TLCaption data={checkpoint.caption[0]} /> : null;
  };

  return (
    <React.Fragment>
      <Card>
        <CardSubHeader>{t(`CS_HEADER_COMPLAINT_SUMMARY`)}</CardSubHeader>
        <CardLabel>{t(`CS_COMPLAINT_DETAILS_COMPLAINT_DETAILS`)}</CardLabel>
        {isLoading ? (
          <Loader />
        ) : (
          <StatusTable>
            {complaintDetails &&
              Object.keys(complaintDetails?.details).map((k, i, arr) => (
                <Row
                  key={k}
                  label={t(k)}
                  text={
                    Array.isArray(complaintDetails?.details[k]) ? complaintDetails?.details[k].map((val) => t(val)) : t(complaintDetails?.details[k])
                  }
                  last={arr.length - 1 === i}
                />
              ))}

            {1 === 1 ? null : (
              <MediaRow label="CS_COMPLAINT_DETAILS_GEOLOCATION">
                <MapView onClick={zoomView} />
              </MediaRow>
            )}
          </StatusTable>
        )}
        {complaintDetails?.thumbnails && complaintDetails?.thumbnails?.length !== 0 ? (
          <DisplayPhotos srcs={complaintDetails?.thumbnails} onClick={zoomImage} />
        ) : null}
        <BreakLine />
        {workflowDetails?.isLoading && <Loader />}
        {!workflowDetails?.isLoading && (
          <React.Fragment>
            {workflowDetails?.data?.timeline && workflowDetails?.data?.timeline?.length === 1 ? (
              <CheckPoint isCompleted={true} label={t("CS_COMMON_" + workflowDetails?.data?.timeline[0]?.status)} />
            ) : (
              <ConnectingCheckPoints>
                {workflowDetails?.data?.timeline &&
                  workflowDetails?.data?.timeline.map((checkpoint, index, arr) => {
                    return (
                      <React.Fragment key={index}>
                        <CheckPoint
                          keyValue={index}
                          isCompleted={index === 0}
                          label={t("CS_COMMON_" + checkpoint.status)}
                          customChild={getTimelineCaptions(checkpoint)}
                        />
                      </React.Fragment>
                    );
                  })}
              </ConnectingCheckPoints>
            )}
          </React.Fragment>
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
          complaintDetails={complaintDetails}
          employeeRoles={workflowDetails?.data?.nextActions ? workflowDetails?.data?.nextActions : null}
          headerBarMain={
            <Heading
              label={
                selectedAction === "ASSIGN" || selectedAction === "REASSIGN"
                  ? t("CS_ACTION_ASSIGN")
                  : selectedAction === "REJECT"
                  ? t("CS_ACTION_REJECT")
                  : t("CS_ACTION_RESOLVE")
              }
            />
          }
          headerBarEnd={<CloseBtn onClick={() => close(popup)} />}
          selectedAction={selectedAction}
          onAssign={onAssign}
          onCancel={() => close(popup)}
        />
      ) : null}
      {toast && <Toast label={t(assignResponse ? `CS_ACTION_${selectedAction}_TEXT` : "CS_ACTION_ASSIGN_FAILED")} onClose={closeToast} />}
      {!workflowDetails?.isLoading && workflowDetails?.data?.nextActions?.length > 0 && (
        <ActionBar>
          {displayMenu && workflowDetails?.data?.nextActions ? (
            <Menu options={workflowDetails?.data?.nextActions.map((action) => action.action)} t={t} onSelect={onActionSelect} />
          ) : null}
          <SubmitBar label={t("WF_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
        </ActionBar>
      )}
    </React.Fragment>
  );
};
