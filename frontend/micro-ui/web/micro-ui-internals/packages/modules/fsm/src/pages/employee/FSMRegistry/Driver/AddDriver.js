import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormComposer, Toast, Header } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import DriverConfig from "../../configs/DriverConfig";
import { useQueryClient } from "react-query";

const AddDriver = ({ parentUrl, heading }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const [showToast, setShowToast] = useState(null);
  const history = useHistory();
  const queryClient = useQueryClient();

  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("FSM_MUTATION_HAPPENED", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("FSM_ERROR_DATA", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("FSM_MUTATION_SUCCESS_DATA", false);

  const { isLoading: isLoading, isError: vendorCreateError, data: updateResponse, error: updateError, mutate } = Digit.Hooks.fsm.useDriverCreate(
    tenantId
  );

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);

  const { t } = useTranslation();

  const Config = DriverConfig(t);

  const [canSubmit, setSubmitValve] = useState(false);

  const defaultValues = {
    tripData: {
      noOfTrips: 1,
      amountPerTrip: null,
      amount: null,
    },
  };

  const onFormValueChange = (setValue, formData) => {
    if (formData?.driverName && formData?.phone && formData?.selectGender) {
      setSubmitValve(true);
    } else {
      setSubmitValve(false);
    }
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const onSubmit = (data) => {
    const name = data?.driverName;
    const license = data?.license;
    const gender = data?.selectGender?.code;
    const emailId = data?.emailId;
    const phone = data?.phone;
    const dob = new Date(`${data.dob}`).getTime() || new Date(`1/1/1970`).getTime();
    const additionalDetails = data?.additionalDetails;
    const formData = {
      driver: {
        tenantId: tenantId,
        name: name,
        licenseNumber: license,
        additionalDetails: additionalDetails,
        status: "ACTIVE",
        owner: {
          tenantId: stateId,
          name: name,
          fatherOrHusbandName: name,
          relationship: "OTHER",
          gender: gender,
          dob: dob,
          emailId: emailId || "abc@egov.com",
          mobileNumber: phone,
        },
        vendorDriverStatus: "INACTIVE",
      },
    };

    mutate(formData, {
      onError: (error, variables) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: (data, variables) => {
        setShowToast({ key: "success", action: "ADD_DRIVER" });
        setTimeout(closeToast, 5000);
        queryClient.invalidateQueries("FSM_DRIVER_SEARCH");
        setTimeout(() => {
          closeToast();
          history.push(`/digit-ui/employee/fsm/registry`);
        }, 5000);
      },
    });
  };

  const isMobile = window.Digit.Utils.browser.isMobile();

  return (
    <React.Fragment>
      <div>
        <Header>{t("ES_FSM_REGISTRY_TITLE_NEW_DRIVER")}</Header>
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
            label={t(showToast.key === "success" ? `ES_FSM_${showToast.action}_SUCCESS` : showToast.action)}
            onClose={closeToast}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default AddDriver;
