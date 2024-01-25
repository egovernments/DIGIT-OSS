import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormComposer, Toast, Header } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import VendorConfig from "../../configs/VendorConfig";
import { useQueryClient } from "react-query";

const AddVendor = ({ parentUrl, heading }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const [showToast, setShowToast] = useState(null);
  const history = useHistory();
  const queryClient = useQueryClient();

  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("FSM_MUTATION_HAPPENED", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("FSM_ERROR_DATA", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("FSM_MUTATION_SUCCESS_DATA", false);

  const { isLoading: isLoading, isError: vendorCreateError, data: updateResponse, error: updateError, mutate } = Digit.Hooks.fsm.useVendorCreate(
    tenantId
  );

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);

  const { t } = useTranslation();

  const Config = VendorConfig(t);

  const [canSubmit, setSubmitValve] = useState(false);

  const defaultValues = {
    tripData: {
      noOfTrips: 1,
      amountPerTrip: null,
      amount: null,
    },
  };

  const onFormValueChange = (setValue, formData) => {
    if (formData?.vendorName && formData?.phone && formData?.address?.locality && formData?.selectGender) {
      setSubmitValve(true);
    } else {
      setSubmitValve(false);
    }
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const onSubmit = (data) => {
    const name = data?.vendorName;
    const pincode = data?.pincode;
    const street = data?.street?.trim();
    const doorNo = data?.doorNo?.trim();
    const plotNo = data?.plotNo?.trim();
    const landmark = data?.landmark?.trim();
    const city = data?.address?.city?.name;
    const state = data?.address?.city?.state;
    const district = data?.address?.city?.name;
    const region = data?.address?.city?.name;
    const buildingName = data?.buildingName?.trim();
    const localityCode = data?.address?.locality?.code;
    const localityName = data?.address?.locality?.name;
    const localityArea = data?.address?.locality?.area;
    const gender = data?.selectGender?.code;
    const emailId = data?.emailId;
    const phone = data?.phone;
    const dob = new Date(`${data.dob}`).getTime() || new Date(`1/1/1970`).getTime();
    const additionalDetails = data?.additionalDetails;
    const formData = {
      vendor: {
        tenantId: tenantId,
        name,
        agencyType: "ULB",
        paymentPreference: "post-service",
        address: {
          tenantId: tenantId,
          landmark,
          doorNo,
          plotNo,
          street,
          city,
          district,
          region,
          state,
          country: "in",
          pincode,
          buildingName,
          locality: {
            code: localityCode || "",
            name: localityName || "",
            label: "Locality",
            area: localityArea || "",
          },
          geoLocation: {
            latitude: data?.address?.latitude || 0,
            longitude: data?.address?.longitude || 0,
          },
        },
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
        additionalDetails: {
          description: additionalDetails,
        },
        vehicle: [],
        drivers: [],
        source: "WhatsApp",
      },
    };

    mutate(formData, {
      onError: (error, variables) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: (data, variables) => {
        setShowToast({ key: "success", action: "ADD_VENDOR" });
        setTimeout(closeToast, 5000);
        queryClient.invalidateQueries("DSO_SEARCH");
        setTimeout(() => {
          closeToast();
          history.push(`/digit-ui/employee/fsm/registry?selectedTabs=VENDOR`);
        }, 5000);
      },
    });
  };
  const isMobile = window.Digit.Utils.browser.isMobile();

  return (
    <React.Fragment>
      <div>
        <Header>{t("ES_FSM_REGISTRY_TITLE_NEW_VENDOR")}</Header>
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

export default AddVendor;
