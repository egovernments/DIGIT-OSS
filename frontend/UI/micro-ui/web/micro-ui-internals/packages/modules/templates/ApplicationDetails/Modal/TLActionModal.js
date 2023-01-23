import { Loader, Modal, FormComposer } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";

import { configTLApproverApplication } from "../config";
import * as predefinedConfig from "../config";

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

const ActionModal = ({ t, action, tenantId, state, id, closeModal, submitAction, actionData, applicationData, businessService, moduleCode }) => {
  const { data: approverData, isLoading: PTALoading } = Digit.Hooks.useEmployeeSearch(
    tenantId,
    {
      roles: action?.assigneeRoles?.map?.((e) => ({ code: e })),
      isActive: true,
    },
    { enabled: !action?.isTerminateState }
  );
  const { isLoading: financialYearsLoading, data: financialYearsData } = Digit.Hooks.pt.useMDMS(
    tenantId,
    businessService,
    "FINANCIAL_YEARLS",
    {},
    {
      details: {
        tenantId: Digit.ULBService.getStateId(),
        moduleDetails: [{ moduleName: "egf-master", masterDetails: [{ name: "FinancialYear", filter: "[?(@.module == 'TL')]" }] }],
      },
    }
  );

  const [config, setConfig] = useState({});
  const [defaultValues, setDefaultValues] = useState({});
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
            const response = await Digit.UploadServices.Filestorage("PT", file, Digit.ULBService.getStateId());
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
    let workflow = { action: action?.action, comments: data?.comments, businessService, moduleName: moduleCode };
    applicationData = {
      ...applicationData,
      action: action?.action,
      comment: data?.comments,
      assignee: !selectedApprover?.uuid ? null : [selectedApprover?.uuid],
      // assignee: action?.isTerminateState ? [] : [selectedApprover?.uuid],
      wfDocuments: uploadedFile
        ? [
            {
              documentType: action?.action + " DOC",
              fileName: file?.name,
              fileStoreId: uploadedFile,
            },
          ]
        : null,
    };
    submitAction({
      Licenses: [applicationData],
    });
  }

  useEffect(() => {
    if (action) {
      setConfig(
        configTLApproverApplication({
          t,
          action,
          approvers,
          selectedApprover,
          setSelectedApprover,
          selectFile,
          uploadedFile,
          setUploadedFile,
          businessService,
        })
      );
    }
  }, [action, approvers, financialYears, selectedFinancialYear, uploadedFile]);

  return action && config.form ? (
    <Modal
      headerBarMain={<Heading label={t(config.label.heading)} />}
      headerBarEnd={<CloseBtn onClick={closeModal} />}
      actionCancelLabel={t(config.label.cancel)}
      actionCancelOnSubmit={closeModal}
      actionSaveLabel={t(config.label.submit)}
      actionSaveOnSubmit={() => {}}
      // isDisabled={!action.showFinancialYearsModal ? PTALoading || (!action?.isTerminateState && !selectedApprover?.uuid) : !selectedFinancialYear}
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
          // isDisabled={!action.showFinancialYearsModal ? PTALoading || (!action?.isTerminateState && !selectedApprover?.uuid) : !selectedFinancialYear}
        />
      )}
    </Modal>
  ) : (
    <Loader />
  );
};

export default ActionModal;
