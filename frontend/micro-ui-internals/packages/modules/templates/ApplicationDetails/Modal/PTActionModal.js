import { Loader, Modal, FormComposer } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";

import { configPTRejectApplication, configPTVerifyApplication, configPTApproverApplication, configPTAssessProperty } from "../config";

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

const ActionModal = ({ t, action, tenantId, state, id, closeModal, submitAction, actionData, applicationData, businessService }) => {
  const { data: fieldInspectorData } = Digit.Hooks.useEmployeeSearch(tenantId, { roles: [{ code: "PT_FIELD_INSPECTOR" }], isActive: true });
  const { data: approverData } = Digit.Hooks.useEmployeeSearch(tenantId, { roles: [{ code: "PT_APPROVER" }], isActive: true });
  const { isLoading: financialYearsLoading, data: financialYearsData } = Digit.Hooks.pt.useMDMS(
    tenantId,
    businessService,
    "FINANCIAL_YEARLS",
    {},
    {
      details: {
        tenantId: "pb",
        moduleDetails: [{ moduleName: "egf-master", masterDetails: [{ name: "FinancialYear", filter: "[?(@.module == 'PT')]" }] }],
      },
    }
  );

  const [config, setConfig] = useState({});
  const [defaultValues, setDefaultValues] = useState({});
  const [fieldInspectors, setFieldInspectors] = useState([]);
  const [selectedFieldInspector, setSelectedFieldInspector] = useState({});
  const [approvers, setApprovers] = useState([]);
  const [selectedApprover, setSelectedApprover] = useState({});
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState(null);

  useEffect(() => {
    if (financialYearsData && financialYearsData["egf-master"]) {
      setFinancialYears(financialYearsData["egf-master"]?.["FinancialYear"]);
    }
  }, [financialYearsData]);

  useEffect(() => {
    setFieldInspectors(fieldInspectorData?.Employees?.map((employee) => ({ uuid: employee?.uuid, name: employee?.user?.name })));
  }, [fieldInspectorData]);

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
        if (file.size >= 5242880) {
          setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
        } else {
          try {
            const response = await Digit.UploadServices.Filestorage("PT", file, tenantId?.split(".")[0]);
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

  const businessServiceMap = {
    REJECT: "PT.CREATE",
    SENDBACKTOCITIZEN: "PT.CREATE",
    VERIFY: "PT.CREATE",
    FORWARD: "PT.CREATE",
    APPROVE: "PT.CREATE",
  };

  function submit(data) {
    let workflow = { action: action, comments: data?.comments, businessService: businessServiceMap[action], moduleName: businessService };
    if (action === "VERIFY") workflow["assignes"] = [selectedFieldInspector];
    if (action === "FORWARD") workflow["assignes"] = [selectedApprover];
    if (uploadedFile)
      workflow["documents"] = [
        {
          documentType: "Document - 1",
          fileName: file?.name,
          fileStoreId: uploadedFile,
        },
      ];

    submitAction({
      Property: {
        ...applicationData,
        workflow,
      },
      Assessment: {
        financialYear: selectedFinancialYear?.name,
        propertyId: applicationData?.propertyId,
        tenantId,
        source: applicationData?.source,
        channel: applicationData?.channel,
        assessmentDate: Date.now(),
      },
    });
  }
  useEffect(() => {
    switch (action) {
      case "REJECT":
      case "APPROVE":
      case "SENDBACKTOCITIZEN":
        return setConfig(
          configPTRejectApplication({
            t,
            action,
            selectFile,
            uploadedFile,
            setUploadedFile,
          })
        );
      case "VERIFY":
        return setConfig(
          configPTVerifyApplication({
            t,
            action,
            fieldInspectors,
            selectedFieldInspector,
            setSelectedFieldInspector,
            selectFile,
            uploadedFile,
            setUploadedFile,
          })
        );
      case "FORWARD":
        return setConfig(
          configPTApproverApplication({
            t,
            action,
            approvers,
            selectedApprover,
            setSelectedApprover,
            selectFile,
            uploadedFile,
            setUploadedFile,
          })
        );
      case "ASSESS_PROPERTY":
        return setConfig(
          configPTAssessProperty({
            t,
            action,
            financialYears,
            selectedFinancialYear,
            setSelectedFinancialYear,
          })
        );
      default:
        console.log("default case");
        break;
    }
  }, [action, fieldInspectors, approvers, financialYears, selectedFinancialYear, uploadedFile]);

  return action && config.form ? (
    <Modal
      headerBarMain={<Heading label={t(config.label.heading)} />}
      headerBarEnd={<CloseBtn onClick={closeModal} />}
      actionCancelLabel={t(config.label.cancel)}
      actionCancelOnSubmit={closeModal}
      actionSaveLabel={t(config.label.submit)}
      actionSaveOnSubmit={() => {}}
      formId="modal-action"
    >
      {financialYearsLoading ? (
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
