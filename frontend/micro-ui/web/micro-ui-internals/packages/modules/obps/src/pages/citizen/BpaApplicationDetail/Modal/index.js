import React, { useEffect, useState } from "react";
import { Loader, Modal, FormComposer, Toast } from "@egovernments/digit-ui-react-components";
import { configAcceptApplication } from "../config/Approve"; 

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

const ActionModal = ({ t, closeModal, submitAction, actionData, action }) => {
  const [config, setConfig] = useState({});
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [defaultValues, setDefaultValues] = useState({});
  const [error, setError] = useState(null);

  const selectFile = (e) => {
    setFile(e.target.files[0]);
  }

  useEffect(() => {
    switch (action) {
      case "APPROVE": {
        setConfig(
          configAcceptApplication({ t, action, selectFile, uploadedFile, error, isCommentRequired: false, setUploadedFile,file })
        )
        break;
      }
      case "SEND_TO_ARCHITECT":
        setConfig(
          configAcceptApplication({ t, action, selectFile, uploadedFile, error, setUploadedFile,file })
        );
        break;
      default:
        setConfig(
          configAcceptApplication({ t, action, selectFile, uploadedFile, error, isCommentRequired: false , setUploadedFile,file})
        )
    }
  }, [action, uploadedFile]);

  useEffect(() => {
    (async () => {
        setError(null);
        if (file) {
            if (file.size >= 5242880) {
                setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
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
    >
      <FormComposer
        cardStyle={{ minWidth: "unset", paddingRight: "unset" }}
        config={config?.form}
        noBoxShadow
        inline
        childrenAtTheBottom
        onSubmit={submit}
        defaultValues={defaultValues}
        formId="modal-action"
      />
    </Modal>
  )
}

export default ActionModal;