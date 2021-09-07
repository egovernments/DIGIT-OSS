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
  Modal,
  SectionalDropdown,
} from "@egovernments/digit-ui-react-components";

import { Close } from "../../Icons";
import { useTranslation } from "react-i18next";
import { isError, useQueryClient } from "react-query";

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

const ComplaintDetailsModal = ({ workflowDetails, complaintDetails, close, popup, selectedAction, onAssign, tenantId, t }) => {
  const employeeRoles = workflowDetails?.data?.nextActions ? workflowDetails?.data?.nextActions : null;
  const roles = employeeRoles.filter((role) => role.action === selectedAction);
  const useEmployeeData = Digit.Hooks.pgr.useEmployeeFilter(tenantId, roles[0]?.roles, complaintDetails);
  const employeeData = useEmployeeData
    ? useEmployeeData.map((departmentData) => {
        return { heading: departmentData.department, options: departmentData.employees };
      })
    : null;

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [comments, setComments] = useState("");
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);
  const cityDetails = Digit.ULBService.getCurrentUlb();
  const [selectedReopenReason, setSelectedReopenReason] = useState(null);

  useEffect(() => {
    (async () => {
      setError(null);
      if (file) {
        if (file.size >= 5242880) {
          setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
        } else {
          try {
            // TODO: change module in file storage
            const response = await Digit.UploadServices.Filestorage("property-upload", file, cityDetails.code);
            if (response?.data?.files?.length > 0) {
              setUploadedFile(response?.data?.files[0]?.fileStoreId);
            } else {
              setError(t("CS_FILE_UPLOAD_ERROR"));
            }
          } catch (err) {
            console.error("Modal -> err ", err);
            setError(t("CS_FILE_UPLOAD_ERROR"));
          }
        }
      }
    })();
  }, [file]);

  const reopenReasonMenu = [t(`CS_REOPEN_OPTION_ONE`), t(`CS_REOPEN_OPTION_TWO`), t(`CS_REOPEN_OPTION_THREE`), t(`CS_REOPEN_OPTION_FOUR`)];
  // const uploadFile = useCallback( () => {

  //   }, [file]);

  function onSelectEmployee(employee) {
    setSelectedEmployee(employee);
  }

  function addComment(e) {
    setComments(e.target.value);
  }

  function selectfile(e) {
    setFile(e.target.files[0]);
  }

  function onSelectReopenReason(reason) {
    setSelectedReopenReason(reason);
  }

  return (
    <Modal
      headerBarMain={
        <Heading
          label={
            selectedAction === "ASSIGN" || selectedAction === "REASSIGN"
              ? t("CS_ACTION_ASSIGN")
              : selectedAction === "REJECT"
              ? t("CS_ACTION_REJECT")
              : selectedAction === "REOPEN"
              ? t("CS_COMMON_REOPEN")
              : t("CS_COMMON_RESOLVE")
          }
        />
      }
      headerBarEnd={<CloseBtn onClick={() => close(popup)} />}
      actionCancelLabel={t("CS_COMMON_CANCEL")}
      actionCancelOnSubmit={() => close(popup)}
      actionSaveLabel={
        selectedAction === "ASSIGN" || selectedAction === "REASSIGN"
          ? t("CS_COMMON_ASSIGN")
          : selectedAction === "REJECT"
          ? t("CS_COMMON_REJECT")
          : selectedAction === "REOPEN"
          ? t("CS_COMMON_REOPEN")
          : t("CS_COMMON_RESOLVE")
      }
      actionSaveOnSubmit={() => {
        onAssign(selectedEmployee, comments, uploadedFile);
      }}
      error={error}
      setError={setError}
    >
      <Card>
        {selectedAction === "REJECT" || selectedAction === "RESOLVE" || selectedAction === "REOPEN" ? null : (
          <React.Fragment>
            <CardLabel>{t("CS_COMMON_EMPLOYEE_NAME")}</CardLabel>
            {employeeData && <SectionalDropdown selected={selectedEmployee} menuData={employeeData} displayKey="name" select={onSelectEmployee} />}
          </React.Fragment>
        )}
        {selectedAction === "REOPEN" ? (
          <React.Fragment>
            <CardLabel>{t("CS_REOPEN_COMPLAINT")}</CardLabel>
            <Dropdown selected={selectedReopenReason} option={reopenReasonMenu} select={onSelectReopenReason} />
          </React.Fragment>
        ) : null}
        <CardLabel>{t("CS_COMMON_EMPLOYEE_COMMENTS")}</CardLabel>
        <TextArea name="comment" onChange={addComment} value={comments} />
        <CardLabel>{t("CS_ACTION_SUPPORTING_DOCUMENTS")}</CardLabel>
        <CardLabelDesc>{t(`CS_UPLOAD_RESTRICTIONS`)}</CardLabelDesc>
        <UploadFile
          accept=".jpg"
          onUpload={selectfile}
          onDelete={() => {
            setUploadedFile(null);
          }}
          message={uploadedFile ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`CS_ACTION_NO_FILEUPLOADED`)}
        />
      </Card>
    </Modal>
  );
};

export const ComplaintDetails = (props) => {
  let { id } = useParams();
  const { t } = useTranslation();
  const [fullscreen, setFullscreen] = useState(false);
  const [imageZoom, setImageZoom] = useState(null);
  // const [actionCalled, setActionCalled] = useState(false);
  const [toast, setToast] = useState(false);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { isLoading, complaintDetails, revalidate: revalidateComplaintDetails } = Digit.Hooks.pgr.useComplaintDetails({ tenantId, id });
  // console.log("find complaint details here", complaintDetails);
  const workflowDetails = Digit.Hooks.useWorkflowDetails({ tenantId, id, moduleCode: "PGR", role: "EMPLOYEE" });
  const [displayMenu, setDisplayMenu] = useState(false);
  const [popup, setPopup] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [assignResponse, setAssignResponse] = useState(null);
  const [loader, setLoader] = useState(false);
  const [rerender, setRerender] = useState(1);
  const client = useQueryClient();
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

  const refreshData = async () => {
    await client.refetchQueries(["fetchInboxData"]);
    await workflowDetails.revalidate();
    await revalidateComplaintDetails();
  };

  useEffect(() => {
    (async () => {
      if (complaintDetails) {
        setLoader(true);
        await refreshData();
        setLoader(false);
      }
    })();
  }, []);

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

  function zoomImage(imageSource, index) {
    setImageZoom(complaintDetails.images[index - 1]);
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
    const response = await Digit.Complaint.assign(complaintDetails, selectedAction, selectedEmployee, comments, uploadedFile, tenantId);
    console.log("find response complaint assign here", response);
    setAssignResponse(response);
    setToast(true);
    setLoader(true);
    await refreshData();
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
                    Array.isArray(complaintDetails?.details[k])
                      ? complaintDetails?.details[k].map((val) => (typeof val === "object" ? t(val?.code) : t(val)))
                      : t(complaintDetails?.details[k]) || "N/A"
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
          <DisplayPhotos srcs={complaintDetails?.thumbnails} onClick={(source, index) => zoomImage(source, index)} />
        ) : null}
        <BreakLine />
        {workflowDetails?.isLoading && <Loader />}
        {!workflowDetails?.isLoading && (
          <React.Fragment>
            <CardSubHeader>{t(`CS_COMPLAINT_DETAILS_COMPLAINT_TIMELINE`)}</CardSubHeader>

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
        <ComplaintDetailsModal
          workflowDetails={workflowDetails}
          complaintDetails={complaintDetails}
          close={close}
          popup={popup}
          selectedAction={selectedAction}
          onAssign={onAssign}
          tenantId={tenantId}
          t={t}
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
