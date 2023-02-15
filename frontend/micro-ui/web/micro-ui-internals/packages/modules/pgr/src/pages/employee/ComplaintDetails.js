import React, { useState, useEffect, Fragment } from "react";
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
import StarRated from "../../components/timelineInstances/StarRated";

const MapView = (props) => {
  return (
    <div onClick={props.onClick}>
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

const TLCaption = ({ data, comments }) => {
  const { t } = useTranslation()
  return (
    <div>
      {data?.date && <p>{data?.date}</p>}
      <p>{data?.name}</p>
      <p>{data?.mobileNumber}</p>
      {data?.source && <p>{t("ES_COMMON_FILED_VIA_" + data?.source.toUpperCase())}</p>}
      {comments?.map( e => 
        <div className="TLComments">
          <h3>{t("WF_COMMON_COMMENTS")}</h3>
          <p>{e}</p>
        </div>
      )}
    </div>
  );
};

const ComplaintDetailsModal = ({ workflowDetails, complaintDetails, close, popup, selectedAction, onAssign, tenantId, t }) => {
  
  // RAIN-5692 PGR : GRO is assigning complaint, Selecting employee and assign. Its not getting assigned.
  // Fix for next action  assignee dropdown issue
  const stateArray = workflowDetails?.data?.initialActionState?.nextActions?.filter( ele => ele?.action == selectedAction );  
  const useEmployeeData = Digit.Hooks.pgr.useEmployeeFilter(
    tenantId, 
    stateArray?.[0]?.assigneeRoles?.length > 0 ? stateArray?.[0]?.assigneeRoles?.join(",") : "",
    complaintDetails
    );
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
    setError(null);
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
        if(selectedAction === "REJECT" && !comments)
        setError(t("CS_MANDATORY_COMMENTS"));
        else
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
          id={"pgr-doc"}
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
  const workflowDetails = Digit.Hooks.useWorkflowDetails({ tenantId, id, moduleCode: "PGR", role: "EMPLOYEE" });
  const [imagesToShowBelowComplaintDetails, setImagesToShowBelowComplaintDetails] = useState([])
  
  // RAIN-5692 PGR : GRO is assigning complaint, Selecting employee and assign. Its not getting assigned.
  // Fix for next action  assignee dropdown issue
  if (workflowDetails && workflowDetails?.data){
    workflowDetails.data.initialActionState=workflowDetails?.data?.initialActionState || {...workflowDetails?.data?.actionState } || {} ;
      workflowDetails.data.actionState = { ...workflowDetails.data };
    }

  useEffect(()=>{
    if(workflowDetails){
      const {data:{timeline: complaintTimelineData}={}} = workflowDetails
      if(complaintTimelineData){
        const actionByCitizenOnComplaintCreation = complaintTimelineData?.find( e => e?.performedAction === "APPLY")
        const { thumbnailsToShow } = actionByCitizenOnComplaintCreation
        thumbnailsToShow ? setImagesToShowBelowComplaintDetails(thumbnailsToShow) : null
      }
    }
  },[workflowDetails])
  const [displayMenu, setDisplayMenu] = useState(false);
  const [popup, setPopup] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [assignResponse, setAssignResponse] = useState(null);
  const [loader, setLoader] = useState(false);
  const [rerender, setRerender] = useState(1);
  const client = useQueryClient();
  function popupCall(option) {
    setDisplayMenu(false);
    setPopup(true);
  }

  useEffect(() => {
    (async () => {
      const assignWorkflow = await Digit?.WorkflowService?.getByBusinessId(tenantId, id);
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
        break;
    }
  }

  function zoomImage(imageSource, index) {
    setImageZoom(imageSource);
  }
  function zoomImageWrapper(imageSource, index){
    zoomImage(imagesToShowBelowComplaintDetails?.fullImage[index]);
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
        setDisplayMenu(false);
    }
  }

  async function onAssign(selectedEmployee, comments, uploadedFile) {
    setPopup(false);
    const response = await Digit.Complaint.assign(complaintDetails, selectedAction, selectedEmployee, comments, uploadedFile, tenantId);
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

  const getTimelineCaptions = (checkpoint, index, arr) => {
    const {wfComment: comment, thumbnailsToShow} = checkpoint;
    function zoomImageTimeLineWrapper(imageSource, index,thumbnailsToShow){
      let newIndex=thumbnailsToShow.thumbs?.findIndex(link=>link===imageSource);
      zoomImage((newIndex>-1&&thumbnailsToShow?.fullImage?.[newIndex])||imageSource);
    }
    const captionForOtherCheckpointsInTL = {
      date: checkpoint?.auditDetails?.lastModified,
      name: checkpoint?.assigner?.name,
      mobileNumber: checkpoint?.assigner?.mobileNumber,
      ...checkpoint.status === "COMPLAINT_FILED" && complaintDetails?.audit ? {
        source: complaintDetails.audit.source,
      } : {}
    }
    const isFirstPendingForAssignment = arr.length - (index + 1) === 1 ? true : false
    if (checkpoint.status === "PENDINGFORASSIGNMENT" && complaintDetails?.audit) {
      if(isFirstPendingForAssignment){
        const caption = {
          date: Digit.DateUtils.ConvertTimestampToDate(complaintDetails.audit.details.createdTime),
        };
        return <TLCaption data={caption} comments={checkpoint?.wfComment}/>;
      } else {
        const caption = {
          date: Digit.DateUtils.ConvertTimestampToDate(complaintDetails.audit.details.createdTime),
        };
        return <>
          {checkpoint?.wfComment ? <div>{checkpoint?.wfComment?.map( e => 
            <div className="TLComments">
              <h3>{t("WF_COMMON_COMMENTS")}</h3>
              <p>{e}</p>
            </div>
          )}</div> : null}
          {checkpoint.status !== "COMPLAINT_FILED" && thumbnailsToShow?.thumbs?.length > 0 ? <div className="TLComments">
            <h3>{t("CS_COMMON_ATTACHMENTS")}</h3>
            <DisplayPhotos srcs={thumbnailsToShow.thumbs} onClick={(src, index) => zoomImageTimeLineWrapper(src, index,thumbnailsToShow)} />
          </div> : null}
          {caption?.date ? <TLCaption data={caption}/> : null}
        </>
      }
    }
    // return (checkpoint.caption && checkpoint.caption.length !== 0) || checkpoint?.wfComment?.length > 0 ? <TLCaption data={checkpoint?.caption?.[0]} comments={checkpoint?.wfComment} /> : null;
    return <>
      {comment ? <div>{comment?.map( e => 
        <div className="TLComments">
          <h3>{t("WF_COMMON_COMMENTS")}</h3>
          <p>{e}</p>
        </div>
      )}</div> : null}
      {checkpoint.status !== "COMPLAINT_FILED" && thumbnailsToShow?.thumbs?.length > 0 ? <div className="TLComments">
        <h3>{t("CS_COMMON_ATTACHMENTS")}</h3>
        <DisplayPhotos srcs={thumbnailsToShow.thumbs} onClick={(src, index) => zoomImageTimeLineWrapper(src, index,thumbnailsToShow)} />
      </div> : null}
      {captionForOtherCheckpointsInTL?.date ? <TLCaption data={captionForOtherCheckpointsInTL}/> : null}
      {(checkpoint.status == "CLOSEDAFTERRESOLUTION" && complaintDetails.workflow.action == "RATE" && index <= 1) && complaintDetails.audit.rating ? <StarRated text={t("CS_ADDCOMPLAINT_YOU_RATED")} rating={complaintDetails.audit.rating} />: null}
    </>
  }

  return (
    <React.Fragment>
      <Card>
        <CardSubHeader>{t(`CS_HEADER_COMPLAINT_SUMMARY`)}</CardSubHeader>
        <CardLabel style={{fontWeight:"700"}}>{t(`CS_COMPLAINT_DETAILS_COMPLAINT_DETAILS`)}</CardLabel>
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
        {imagesToShowBelowComplaintDetails?.thumbs ? (
          <DisplayPhotos srcs={imagesToShowBelowComplaintDetails?.thumbs} onClick={(source, index) => zoomImageWrapper(source, index)} />
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
                          customChild={getTimelineCaptions(checkpoint, index, arr)}
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
