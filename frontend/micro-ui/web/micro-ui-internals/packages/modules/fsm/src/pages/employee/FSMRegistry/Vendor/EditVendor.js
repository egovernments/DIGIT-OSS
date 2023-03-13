import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormComposer, Loader, Toast, Header } from "@egovernments/digit-ui-react-components";
import { useHistory, useParams } from "react-router-dom";
import VendorConfig from "../../configs/VendorConfig";
import { useQueryClient } from "react-query";

const EditVendor = ({ parentUrl, heading }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  let { id: dsoId } = useParams();
  const [showToast, setShowToast] = useState(null);
  const [canSubmit, setSubmitValve] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});
  const [dsoDetails, setDsoDetails] = useState({});
  const queryClient = useQueryClient();

  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("FSM_MUTATION_HAPPENED", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("FSM_ERROR_DATA", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("FSM_MUTATION_SUCCESS_DATA", false);

  const { data: dsoData, isLoading: daoDataLoading, isSuccess: isDsoSuccess, error: dsoError } = Digit.Hooks.fsm.useDsoSearch(
    tenantId,
    { ids: dsoId },
    { staleTime: Infinity }
  );

  const { isLoading: isLoading, isError: vendorCreateError, data: updateResponse, error: updateError, mutate } = Digit.Hooks.fsm.useVendorUpdate(
    tenantId
  );

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);

  useEffect(() => {
    if (dsoData && dsoData[0]) {
      let dsoDetails = dsoData[0];
      setDsoDetails(dsoDetails?.dsoDetails);
      let values = {
        vendorName: dsoDetails?.name,
        street: dsoDetails?.dsoDetails?.address?.street,
        doorNo: dsoDetails?.dsoDetails?.address?.doorNo,
        plotNo: dsoDetails?.dsoDetails?.address?.plotNo,
        landmark: dsoDetails?.dsoDetails?.address?.landmark,
        pincode: dsoDetails?.dsoDetails?.address?.pincode,
        buildingName: dsoDetails?.dsoDetails?.address?.buildingName,
        address: {
          pincode: dsoDetails?.dsoDetails?.address?.pincode,
          locality: {
            ...dsoDetails?.dsoDetails?.address?.locality,
            i18nkey: `${dsoDetails?.dsoDetails?.tenantId.toUpperCase().split(".").join("_")}_REVENUE_${
              dsoDetails?.dsoDetails?.address.locality.code
            }`,
          },
        },
        phone: dsoDetails?.mobileNumber,
        ownerName: dsoDetails?.dsoDetails?.owner?.name,
        fatherOrHusbandName: dsoDetails?.dsoDetails?.owner?.fatherOrHusbandName,
        relationship: dsoDetails?.dsoDetails?.owner?.relationship,
        selectGender: dsoDetails?.dsoDetails?.owner?.gender,
        dob: dsoDetails?.dsoDetails?.owner?.dob && Digit.DateUtils.ConvertTimestampToDate(dsoDetails?.dsoDetails?.owner?.dob, "yyyy-MM-dd"),
        emailId: dsoDetails?.dsoDetails?.owner?.emailId === "abc@egov.com" ? "" : dsoDetails?.dsoDetails?.owner?.emailId,
        correspondenceAddress: dsoDetails?.dsoDetails?.owner?.correspondenceAddress,
        additionalDetails: dsoDetails?.dsoDetails?.additionalDetails?.description,
      };
      setDefaultValues(values);
    }
  }, [dsoData]);

  const { t } = useTranslation();
  const history = useHistory();

  const Config = VendorConfig(t, true);

  const onFormValueChange = (setValue, formData) => {
    if (formData?.phone && formData?.address?.locality) {
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
    const additionalDetails = data?.additionalDetails;
    const gender = data?.selectGender?.code;
    const emailId = data?.emailId;
    const dob = new Date(`${data.dob}`).getTime() || new Date(`1/1/1970`).getTime();
    const formData = {
      vendor: {
        ...dsoDetails,
        name,
        address: {
          ...dsoDetails.address,
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
            ...dsoDetails.address.locality,
            code: localityCode || "",
            name: localityName || "",
            label: "Locality",
            area: localityArea || "",
          },
          geoLocation: {
            ...dsoDetails.address.geoLocation,
            latitude: data?.address?.latitude || 0,
            longitude: data?.address?.longitude || 0,
          },
        },
        owner: {
          ...dsoDetails.owner,
          gender: gender || dsoDetails.owner?.gender || "OTHER",
          dob: dob,
          emailId: emailId || "abc@egov.com",
          relationship: dsoDetails.owner?.relationship || "OTHER",
        },
        additionalDetails: {
          ...dsoDetails.additionalDetails,
          description: additionalDetails,
        },
      },
    };
    mutate(formData, {
      onError: (error, variables) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: (data, variables) => {
        setShowToast({ key: "success", action: "UPDATE_VENDOR" });
        setTimeout(closeToast, 5000);
        queryClient.invalidateQueries("DSO_SEARCH");
        setTimeout(() => {
          closeToast();
          history.push(`/digit-ui/employee/fsm/registry/vendor-details/${dsoId}`);
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
        <Header>{t("ES_FSM_REGISTRY_TITLE_EDIT_VENDOR")}</Header>
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

export default EditVendor;
