import React, { useState, Fragment, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FormComposer, Header, Card, CardSectionHeader, PDFSvg, Loader, StatusTable, Row, ActionBar, SubmitBar } from "@egovernments/digit-ui-react-components";
import ApplicationDetailsTemplate from "../../../../../templates/ApplicationDetails";
import { newConfig } from "../../../config/InspectionReportConfig";


const BpaApplicationDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [showToast, setShowToast] = useState(null);
  const [canSubmit, setSubmitValve] = useState(false);
  const defaultValues = {};
  const history = useHistory();
  // delete
  const [_formData, setFormData, _clear] = Digit.Hooks.useSessionStorage("store-data", null);
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_HAPPENED", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_SUCCESS_DATA", {});
  const [error, setError] = useState(null);
  const stateId = Digit.ULBService.getStateId();

  const { isMdmsLoading, data: mdmsData } = Digit.Hooks.obps.useMDMS(stateId, "BPA", ["RiskTypeComputation"]);

  const { data = {}, isLoading } = Digit.Hooks.obps.useBPADetailsPage(tenantId, { applicationNo: id });


  let risType = "";
  sessionStorage.setItem("bpaApplicationDetails", true);


  function checkHead(head) {
    if (head === "ES_NEW_APPLICATION_LOCATION_DETAILS") {
      return "TL_CHECK_ADDRESS";
    } else if (head === "ES_NEW_APPLICATION_OWNERSHIP_DETAILS") {
      return "TL_OWNERSHIP_DETAILS_HEADER";
    } else {
      return head;
    }
  }


  const closeToast = () => {
    setShowToast(null);
    setError(null);
  };

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
  }, []);

  const onFormValueChange = (setValue, formData, formState) => {
    setSubmitValve(!Object.keys(formState.errors).length);
  };
  let configs = newConfig;

  const workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: tenantId,
    id: id,
    moduleCode: "BPA",
  });

  if (workflowDetails && workflowDetails.data && !workflowDetails.isLoading)
    workflowDetails.data.actionState = { ...workflowDetails.data };

  if (mdmsData?.BPA?.RiskTypeComputation && data?.edcrDetails) {
    risType = Digit.Utils.obps.calculateRiskType(mdmsData?.BPA?.RiskTypeComputation, data?.edcrDetails?.planDetail?.plot?.area, data?.edcrDetails?.planDetail?.blocks);
    data?.applicationDetails?.map(detail => {
      if (detail?.isInsert) {
        detail.values?.forEach(value => {
          if (value?.isInsert) value.value = `WF_BPA_${risType}`
        })
      }
    })
  }


  return (
    <Fragment>
      <div style={{ marginLeft: "15px" }}>
        <Header>{t("BPA_TASK_DETAILS_HEADER")}</Header>
      </div>
      {data?.applicationData?.status === "FIELDINSPECTION_INPROGRESS" && <div style={{ marginLeft: "15px" }}>
        <Header>{t("Inspection Report")}</Header>
      </div>}
      {data?.applicationData?.status === "FIELDINSPECTION_INPROGRESS" && <FormComposer
        heading={t("")}
        isDisabled={!canSubmit}
        config={configs.map((config) => {
          return {
            ...config,
            body: config.body.filter((a) => {
              return !a.hideInEmployee;
            }),
            head: checkHead(config.head),
          };
        })}
        fieldStyle={{ marginRight: 0 }}
        submitInForm={false}
        defaultValues={defaultValues}
        onFormValueChange={onFormValueChange}
        breaklineStyle={{ border: "0px" }}
      />}
      <ApplicationDetailsTemplate
        applicationDetails={data}
        isLoading={isLoading}
        isDataLoading={isLoading}
        workflowDetails={workflowDetails}
        businessService={workflowDetails?.data?.applicationBusinessService ? workflowDetails?.data?.applicationBusinessService : data?.applicationData?.businessService}
        moduleCode="BPA"
        timelineStatusPrefix={`WF_${workflowDetails?.data?.applicationBusinessService ? workflowDetails?.data?.applicationBusinessService : data?.applicationData?.businessService}_`}
      />
    </Fragment>
  )
};

export default BpaApplicationDetail;