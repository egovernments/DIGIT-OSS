import { Loader, Modal, FormComposer } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { configWSApproverApplication, configWSDisConnectApplication } from "../config";
import * as predefinedConfig from "../config";
import cloneDeep from "lodash/cloneDeep";


const Heading = (props) => {
  return <h1 className="heading-m">{props.label}</h1>;
};

const Close = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const CloseBtn = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick}>
      <Close />
    </div>
  );
};

const convertDateToEpochNew = (dateString, dayStartOrEnd = "dayend") => {
  //example input format : "2018-10-02"
  try {
    const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    const DateObj = new Date(Date.UTC(parts[1], parts[3] - 1, parts[2]));

    DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
    if (dayStartOrEnd === "dayend") {
      DateObj.setHours(DateObj.getHours() + 24);
      DateObj.setSeconds(DateObj.getSeconds() - 1);
    }
    return DateObj.getTime();
  } catch (e) {
    return dateString;
  }
};

const ActionModal = ({ t, action, tenantId, state, id, closeModal, submitAction, actionData, applicationData, businessService, moduleCode }) => {
  const { data: approverData, isLoading: PTALoading } = Digit.Hooks.useEmployeeSearch(
    tenantId,
    {
      roles: action?.assigneeRoles?.map?.((e) => ({ code: e })),
      isActive: true,
    },
    { enabled: !action?.isTerminateState }
  );

  const [config, setConfig] = useState({});
  const [defaultValues, setDefaultValues] = useState({});
  const [approvers, setApprovers] = useState([]);
  const [selectedApprover, setSelectedApprover] = useState({});
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setApprovers(approverData?.Employees?.map((employee) => ({ uuid: employee?.uuid, name: employee?.user?.name })));
  }, [approverData]);

  function selectFile(e) {
    setFile(e.target.files[0]);
  }

  useEffect(() => {
    (async () => {
      setError(null);
      if (file) {
        const allowedFileTypesRegex = /(.*?)(jpg|jpeg|png|image|pdf)$/i
        if (file.size >= 5242880) {
          setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
        } else if (file?.type && !allowedFileTypesRegex.test(file?.type)) {
          setError(t(`NOT_SUPPORTED_FILE_TYPE`))
        } else {
          try {
            const response = await Digit.UploadServices.Filestorage("WS", file, Digit.ULBService.getCurrentTenantId());
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

  function submit(data) {
    if(applicationData?.isBillAmend){
      const comments = data?.comments ? data.comments : null
     
      const additionalDetails = { ...applicationData?.billAmendmentDetails?.additionalDetails, comments } 
     const amendment = {
       ...applicationData?.billAmendmentDetails,
        workflow:{
          businessId:applicationData?.billAmendmentDetails?.amendmentId,
          action:action?.action,
          tenantId:tenantId,
          businessService:"BS.AMENDMENT",
          moduleName:"BS"
        },
       additionalDetails,
       comment: data?.comments || "",
       wfDocuments: uploadedFile
         ? [
           {
             documentType: action?.action + " DOC",
             fileName: file?.name,
             fileStoreId: uploadedFile,
           },
         ]
         : null,
       processInstance: {
         action: action?.action,
         assignes: !selectedApprover?.uuid ? [] : [{ uuid: selectedApprover?.uuid }],
         comment: data?.comments || "",
         documents: uploadedFile
           ? [
             {
               documentType: action?.action + " DOC",
               fileName: file?.name,
               fileStoreId: uploadedFile,
             },
           ]
           : []
       }
      }
      //amendment?.additionalDetails?.comments = comments
      submitAction({AmendmentUpdate:amendment})
      return
    }
    let workflow = { action: action?.action, comments: data?.comments, businessService, moduleName: moduleCode };
    applicationData = {
      ...applicationData,
      action: action?.action,
      comment: data?.comments || "",
      assignee: !selectedApprover?.uuid ? [] : [selectedApprover?.uuid],
      assignes: !selectedApprover?.uuid ? [] : [{ uuid: selectedApprover?.uuid }],
      wfDocuments: uploadedFile
        ? [
          {
            documentType: action?.action + " DOC",
            fileName: file?.name,
            fileStoreId: uploadedFile,
          },
        ]
        : null,
      processInstance: {
        ...applicationData?.processInstance,
        action: action?.action,
        assignes: !selectedApprover?.uuid ? [] : [{ uuid: selectedApprover?.uuid }],
        comment: data?.comments || "",
        documents: uploadedFile
          ? [
            {
              documentType: action?.action + " DOC",
              fileName: file?.name,
              fileStoreId: uploadedFile,
            },
          ]
          : []
      }
    };
    
    if (data?.date) {
      const connectionExecutionDate = cloneDeep(data?.date);
      applicationData.connectionExecutionDate = convertDateToEpochNew(connectionExecutionDate)
    }
    if (applicationData?.processInstance?.businessService == "DisconnectWSConnection" || applicationData?.processInstance?.businessService == "DisconnectSWConnection"){
      applicationData?.serviceType == "WATER" ?
      submitAction({ WaterConnection: applicationData, disconnectRequest: true }) :
      submitAction({ SewerageConnection: applicationData, disconnectRequest: true })
    } else {
      const adhocRebateData = sessionStorage.getItem("Digit.ADHOC_ADD_REBATE_DATA");
      const parsedAdhocRebateData = adhocRebateData ? JSON.parse(adhocRebateData) : "";
      if (parsedAdhocRebateData?.value?.adhocPenalty) applicationData.additionalDetails.adhocPenalty = parseInt(parsedAdhocRebateData?.value?.adhocPenalty) || "";
      if (parsedAdhocRebateData?.value?.adhocPenaltyComment) applicationData.additionalDetails.adhocPenaltyComment = parsedAdhocRebateData?.value?.adhocPenaltyComment || "";
      if (parsedAdhocRebateData?.value?.adhocPenaltyReason) applicationData.additionalDetails.adhocPenaltyReason = parsedAdhocRebateData?.value?.adhocPenaltyReason || "";
      if (parsedAdhocRebateData?.value?.adhocRebate) applicationData.additionalDetails.adhocRebate = parseInt(parsedAdhocRebateData?.value?.adhocRebate) || "";
      if (parsedAdhocRebateData?.value?.adhocRebateComment) applicationData.additionalDetails.adhocRebateComment = parsedAdhocRebateData?.value?.adhocRebateComment || "";
      if (parsedAdhocRebateData?.value?.adhocRebateReason) applicationData.additionalDetails.adhocRebateReason = parsedAdhocRebateData?.value?.adhocRebateReason || "";
      applicationData?.serviceType == "WATER" ? submitAction({ WaterConnection: applicationData }) : submitAction({ SewerageConnection: applicationData });
    }
  }

  useEffect(() => {
    if (applicationData?.processInstance?.businessService == "DisconnectWSConnection" || applicationData?.processInstance?.businessService == "DisconnectSWConnection") {
      if (action) {
        setConfig(
          configWSDisConnectApplication({
            t,
            action,
            approvers,
            selectedApprover,
            setSelectedApprover,
            selectFile,
            uploadedFile,
            setUploadedFile,
            businessService,
            error
          })
        );
      }
    } else {
      if (action) {
        setConfig(
          configWSApproverApplication({
            t,
            action,
            approvers,
            selectedApprover,
            setSelectedApprover,
            selectFile,
            uploadedFile,
            setUploadedFile,
            businessService,
            error
          })
        );
      }
    }
  }, [action, approvers, uploadedFile, error]);

  return action && config.form ? (
    <Modal
      headerBarMain={<Heading label={t(config.label.heading)} />}
      headerBarEnd={<CloseBtn onClick={closeModal} />}
      actionCancelLabel={t(config.label.cancel)}
      actionCancelOnSubmit={closeModal}
      actionSaveLabel={t(config.label.submit)}
      actionSaveOnSubmit={() => { }}
      formId="modal-action"
    >
      {PTALoading ? (
        <Loader />
      ) : (
        <FormComposer
          config={config.form}
          noBoxShadow
          inline
          childrenAtTheBottom
          onSubmit={submit}
          defaultValues={defaultValues}
          formId="modal-action"
        />
      )}
    </Modal>
  ) : (
    <Loader />
  );
};

export default ActionModal;