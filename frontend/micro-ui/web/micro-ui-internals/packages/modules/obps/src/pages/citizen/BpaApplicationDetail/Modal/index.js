import React, { useEffect, useState } from "react";
import { Loader, Modal, FormComposer, ButtonSelector, ActionBar,ApplyFilterBar  } from "@egovernments/digit-ui-react-components";
import { configAcceptApplication } from "../config/Approve";
import { configTermsAndConditions } from "../config/TermsAndConditions";

const Heading = (props) => {
  return <h1 style={{marginLeft:"22px"}} className="heading-m BPAheading-m">{props.label}</h1>;
};

const Close = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#0B0C0C" />
  </svg>
);

const CloseBtn = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick} style={{backgroundColor: "#FFFFFF"}}>
      <Close />
    </div>
  );
};

const ActionModal = ({ t, closeModal, submitAction, actionData, action, applicationData }) => {
  const [config, setConfig] = useState({});
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [defaultValues, setDefaultValues] = useState({});
  const [error, setError] = useState(null);
  const [termsData, setTermsData] = useState(false);
  const mobileView = Digit.Utils.browser.isMobile() ? true : false;

  const selectFile = (e) => {
    setFile(e.target.files[0]);
  }

  useEffect(() => {
    switch (action) {
      case "APPROVE": {
        setConfig(
          configAcceptApplication({ t, action, selectFile, uploadedFile, error, isCommentRequired: false, setUploadedFile,file, error })
        )
        break;
      }
      case "SEND_TO_ARCHITECT":
        setConfig(
          configAcceptApplication({ t, action, selectFile, uploadedFile, error, setUploadedFile,file, error })
        );
        break;
      case "TERMS_AND_CONDITIONS":
        setTermsData(true);
        setConfig(configTermsAndConditions({ t, applicationData }));
        break;  
      default:
        setConfig(
          configAcceptApplication({ t, action, selectFile, uploadedFile, error, isCommentRequired: false , setUploadedFile,file, error})
        )
    }
  }, [action, uploadedFile, error]);

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
                    setUploadedFile(null);
                    const response = await Digit.UploadServices.Filestorage("BPA", file, Digit.ULBService.getStateId());
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

  const submit = (data) => {
    let workflow = { action };
    if (uploadedFile) {
      workflow.varificationDocuments = [{
        documentType: "Document - 1",
        fileName: file?.name || "",
        fileStoreId: uploadedFile
      }]
    }

    if(!data?.comments) delete data.comments;

    submitAction({ ...data, ...workflow, })
  }

  return (
    <Modal
      headerBarMain={<Heading label={t(config?.label?.heading)} />}
      headerBarEnd={<CloseBtn onClick={closeModal} />}
      actionCancelLabel={t(config?.label?.cancel)}
      actionCancelOnSubmit={closeModal}
      actionSaveLabel={t(config?.label?.submit)}
      actionSaveOnSubmit={() => {}}
      formId="modal-action"
      isDisabled={false}
      //style={{height: "auto", padding: "10px"}}
      isOBPSFlow={true}
      popupStyles={mobileView?{width:"720px"}:{}}
      style={!mobileView?{minHeight: "45px", height: "auto", width:"107px",paddingLeft:"0px",paddingRight:"0px"}:{minHeight: "45px", height: "auto",width:"160px"}}
      hideSubmit={config?.label?.hideSubmit ? true : false}
      popupModuleMianStyles={action == "TERMS_AND_CONDITIONS" ? {height : "92%", boxSizing: "border-box"}: mobileView?{paddingLeft:"0px"}: {}}
      headerBarMainStyle={action == "TERMS_AND_CONDITIONS" ? {margin: "0px", height: "35px"}: {}}
    >
      {config?.form ?
        <FormComposer
          cardStyle={{ minWidth: "unset", paddingRight: "unset", marginRight:"18px",paddingBottom:"64px" }}
          config={config?.form}
          noBoxShadow
          inline
          childrenAtTheBottom
          onSubmit={submit}
          defaultValues={defaultValues}
          formId="modal-action"
        /> : null
      }
      {termsData ?
        <div style={{height: "100%"}}>
          <div style={{ height: "95%" }}>
            <div style={{fontSize: "18px", paddingBottom: "16px", color :"#000000", fontWeight : "700"}}>{t("TERMS_AND_CONDITIONS")}</div>
            {config?.data && config?.data?.map((value, index) => <div style={{ height: "90%", overflow: "auto"}}>{`${value}`}</div>)}
          </div>
          <div style={{display: "flex", justifyContent: "center", minHeight: "5%"}}>
            <ButtonSelector label={t("BPA_GO_BACK_LABEL")} onSubmit={closeModal} style={{minWidth: "240px"}}/>
          </div>
        </div> : null
      }
     
    </Modal>
  )
}

export default ActionModal;
