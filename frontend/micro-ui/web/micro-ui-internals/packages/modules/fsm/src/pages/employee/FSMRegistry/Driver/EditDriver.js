import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormComposer, Loader, Toast, Header } from "@egovernments/digit-ui-react-components";
import { useHistory, useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import DriverConfig from "../../configs/DriverConfig";

const EditDriver = ({ parentUrl, heading }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  let { id: dsoId } = useParams();
  const [showToast, setShowToast] = useState(null);
  const [canSubmit, setSubmitValve] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});
  const [driverDetails, setDriverDetails] = useState({});
  const queryClient = useQueryClient();

  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("FSM_MUTATION_HAPPENED", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("FSM_ERROR_DATA", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("FSM_MUTATION_SUCCESS_DATA", false);

  const { data: driverData, isLoading: daoDataLoading, isSuccess: isDriverSuccess, error: driverError } = Digit.Hooks.fsm.useDriverDetails(
    tenantId,
    { ids: dsoId },
    { staleTime: Infinity }
  );

  const { isLoading: isLoading, isError: vendorCreateError, data: updateResponse, error: updateError, mutate } = Digit.Hooks.fsm.useDriverUpdate(
    tenantId
  );

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);

  useEffect(() => {
    if (driverData && driverData[0]) {
      let driverDetails = driverData[0];
      setDriverDetails(driverDetails?.driverData);
      let values = {
        driverName: driverDetails?.driverData?.name,
        license: driverDetails?.driverData?.licenseNumber,
        selectGender: driverDetails?.driverData?.owner?.gender,
        dob: driverDetails?.driverData?.owner?.dob && Digit.DateUtils.ConvertTimestampToDate(driverDetails?.driverData?.owner?.dob, "yyyy-MM-dd"),
        emailId: driverDetails?.driverData?.owner?.emailId === "abc@egov.com" ? "" : driverDetails?.driverData?.owner?.emailId,
        phone: driverDetails?.driverData?.owner?.mobileNumber,
        additionalDetails: driverDetails?.driverData?.additionalDetails?.description,
      };
      setDefaultValues(values);
    }
  }, [driverData]);

  const { t } = useTranslation();
  const history = useHistory();

  const Config = DriverConfig(t, true);

  const onFormValueChange = (setValue, formData) => {
    if (formData?.selectGender) {
      setSubmitValve(true);
    } else {
      setSubmitValve(false);
    }
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const onSubmit = (data) => {
    const license = data?.license;
    const gender = data?.selectGender?.code;
    const emailId = data?.emailId;
    const dob = new Date(`${data.dob}`).getTime();
    const additionalDetails = data?.additionalDetails;
    const formData = {
      driver: {
        ...driverDetails,
        licenseNumber: license,
        additionalDetails: additionalDetails,
        owner: {
          ...driverDetails.owner,
          relationship: driverDetails.owner?.relationship || "OTHER",
          gender: gender || driverDetails.owner.gender || "OTHER",
          dob: dob,
          emailId: emailId || "abc@egov.com",
        },
      },
    };
    mutate(formData, {
      onError: (error, variables) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: (data, variables) => {
        setShowToast({ key: "success", action: "UPDATE_DRIVER" });
        setTimeout(closeToast, 5000);
        queryClient.invalidateQueries("FSM_DRIVER_SEARCH");
        setTimeout(() => {
          closeToast();
          history.push(`/digit-ui/employee/fsm/registry/driver-details/${dsoId}`);
        }, 5000);
      },
    });
  };
  const isMobile = window.Digit.Utils.browser.isMobile();

  if (daoDataLoading || Object.keys(defaultValues).length == 0) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <div>
        <Header>{t("ES_FSM_REGISTRY_TITLE_EDIT_DRIVER")}</Header>
      </div>
      <div style={!isMobile ? { marginLeft: "-15px" } : {}}>
        <FormComposer
          isDisabled={!canSubmit}
          label={t("ES_COMMON_APPLICATION_SUBMIT")}
          config={Config.filter((i) => !i.hideInEmployee).map((config) => {
            return {
              ...config,
              body: config.body.filter((a) => !a.hideInEmployee),
            };
          })}
          fieldStyle={{ marginRight: 0 }}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          onFormValueChange={onFormValueChange}
          noBreakLine={true}
        />
        {showToast && (
          <Toast
            error={showToast.key === "error" ? true : false}
            label={t(showToast.key === "success" ? `ES_FSM_REGISTRY_${showToast.action}_SUCCESS` : showToast.action)}
            onClose={closeToast}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default EditDriver;
