import { FormComposer, Loader, Modal } from "@egovernments/digit-ui-react-components";
import set from "lodash/set";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { configEmployeeActiveApplication } from "./Modal/EmployeeActivation";
import { configEmployeeApplication } from "./Modal/EmployeeAppliaction";

const EmployeeAction = ({ t, action, tenantId, closeModal, submitAction, applicationData, billData }) => {
  const history = useHistory();
  const [config, setConfig] = useState({});
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);
  const [Reasons, setReasons] = useState([]);
  const [selectedReason, selecteReason] = useState("");
  const tenant = Digit.ULBService.getStateId() || tenantId?.split(".")?.[0];
  const { isLoading, isError, errors, data, ...rest } = Digit.Hooks.hrms.useHrmsMDMS(tenant, "egov-hrms", "DeactivationReason");

  useEffect(() => {
    if(Reasons?.length > 0)
    switch (action) {
      case "DEACTIVATE_EMPLOYEE_HEAD":
        return setConfig(
          configEmployeeApplication({
            t,
            action,
            selectFile,
            uploadedFile,
            setUploadedFile,
            selectedReason,
            Reasons,
            selectReason,
          })
        );
      case "ACTIVATE_EMPLOYEE_HEAD":
        return setConfig(
          configEmployeeActiveApplication({
            t,
            action,
            selectFile,
            uploadedFile,
            setUploadedFile,
            selectedReason,
            Reasons,
            selectReason,
            employees: applicationData?.Employees[0] || {}
          })
        );
      default:
        break;
    }
  }, [action, uploadedFile, Reasons]);

  const Heading = (props) => {
    return <h1 className="heading-m">{props.label}</h1>;
  };

  function selectReason(e) {
    selecteReason(e);
  }
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

  function selectFile(e) {
    setFile(e.target.files[0]);
  }
  useEffect(() => {
    setReasons(
      data?.["egov-hrms"]?.DeactivationReason.map((ele) => {
        ele["i18key"] = "EGOV_HRMS_DEACTIVATIONREASON_" + ele.code;
        return ele;
      })
    );
  }, [data, isLoading]);

  useEffect(() => {
    (async () => {
      setError(null);
      if (file) {
        if (file.size >= 5242880) {
          setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
        } else {
          try {
            setUploadedFile(null);
            const response = await Digit.UploadServices.Filestorage("HRMS", file, Digit.ULBService.getStateId());
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

  function submit(data) {
    // useHRMSUpdate
    data.effectiveFrom = new Date(data.effectiveFrom).getTime();
    data.reasonForDeactivation = selectedReason.code;
    let Employees = [...applicationData.Employees];
    if (action !== "ACTIVATE_EMPLOYEE_HEAD") {
      if (file) {
        let documents = {
          referenceType: "DEACTIVATION",
          documentId: uploadedFile,
          documentName: file.name,
        };
        applicationData.Employees[0]["documents"].push(documents);
      }

      set(Employees[0], 'deactivationDetails[0].effectiveFrom', data?.effectiveFrom);
      set(Employees[0], 'deactivationDetails[0].orderNo', data?.orderNo);
      set(Employees[0], 'deactivationDetails[0].reasonForDeactivation', data?.reasonForDeactivation);
      set(Employees[0], 'deactivationDetails[0].remarks', data?.remarks);

      Employees[0].isActive = false;
      history.replace( `/${window?.contextPath}/employee/hrms/response`, { Employees, key: "UPDATE", action: "DEACTIVATION" });
    } else {
      if (file) {
        let documents = {
          referenceType: "ACTIVATION",
          documentId: uploadedFile,
          documentName: file.name,
        };
        applicationData.Employees[0]["documents"].push(documents);
      }

      set(Employees[0], 'reactivationDetails[0].effectiveFrom', data?.effectiveFrom);
      set(Employees[0], 'reactivationDetails[0].orderNo', data?.orderNo);
      set(Employees[0], 'reactivationDetails[0].reasonForDeactivation', data?.reasonForDeactivation);
      set(Employees[0], 'reactivationDetails[0].remarks', data?.remarks);
      Employees[0].isActive = true;

      history.replace( `/${window?.contextPath}/employee/hrms/response`, { Employees, key: "UPDATE", action: "ACTIVATION" });
    }
  }

  return action && config?.form ? (
    <Modal
      headerBarMain={<Heading label={t(config?.label?.heading)} />}
      headerBarEnd={<CloseBtn onClick={closeModal} />}
      actionCancelOnSubmit={closeModal}
      actionSaveLabel={t(config?.label?.submit)}
      actionSaveOnSubmit={() => { }}
      formId="modal-action"
      isDisabled={!selectedReason}
    >
      <FormComposer config={config?.form} noBoxShadow inline disabled={true} childrenAtTheBottom onSubmit={submit} formId="modal-action" />
    </Modal>
  ) : (
    <Loader />
  );
};
export default EmployeeAction;
