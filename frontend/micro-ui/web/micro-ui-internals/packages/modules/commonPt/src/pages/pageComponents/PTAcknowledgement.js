import { Banner, Card, CardText, LinkButton, Loader, Row, StatusTable, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useHistory } from "react-router-dom";
// import getPTAcknowledgementData from "../../../getPTAcknowledgementData";
import { convertToPropertyLightWeight, convertToUpdatePropertyLightWeight } from "../utils";

const GetActionMessage = (props) => {
  const { t } = useTranslation();
  if (props.isSuccess) {
    return !window.location.href.includes("edit-application") ? (window.location.href.includes("employee") ?  t("CS_NEW_PROPERTY_APPLICATION_CREATED_SUCCESS") : t("CS_NEW_PROPERTY_APPLICATION_SUBMITTED_SUCCESS")) : t("CS_PROPERTY_UPDATE_APPLICATION_SUCCESS");
  } else if (props.isLoading) {
    return !window.location.href.includes("edit-application") ? t("CS_PROPERTY_APPLICATION_PENDING") : t("CS_PROPERTY_UPDATE_APPLICATION_PENDING");
  } else if (!props.isSuccess) {
    return !window.location.href.includes("edit-application") ? t("CS_PROPERTY_APPLICATION_FAILED") : t("CS_PROPERTY_UPDATE_APPLICATION_FAILED");
  }
};

const rowContainerStyle = {
  padding: "4px 0px",
  justifyContent: "space-between",
};

const BannerPicker = (props) => {
  return (
    <Banner
      message={GetActionMessage(props)}
      applicationNumber={props.data?.Properties[0].acknowldgementNumber}
      info={props.isSuccess ? props.t("PT_APPLICATION_NO") : ""}
      successful={props.isSuccess}
    />
  );
};

const PTAcknowledgement = ({ onSuccess, onSelect, formData, redirectUrl, userType }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const stateId = Digit.ULBService.getStateId();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const history = useHistory();

  let data = location?.state?.data;
  if (onSelect) {
    data = formData?.cptNewProperty?.property;
  }

  let createNUpdate = false;
  let { data: mdmsConfig, isLoading } = Digit.Hooks.pt.useMDMS(stateId, "PropertyTax", "PTWorkflow");
  (mdmsConfig?.PropertyTax?.PTWorkfow || []).forEach((data) => {
    if (data.enable) {
      if (data.businessService.includes("WNS")) {
        createNUpdate = true;
      }
    }
  });

  const mutation = Digit.Hooks.pt.usePropertyAPI(
    data?.locationDet?.city ? data.locationDet?.city?.code : tenantId,
    true // create
  );

  const mutationForUpdate = Digit.Hooks.pt.usePropertyAPI(
    data?.locationDet?.city ? data.locationDet?.city?.code : tenantId,
    false // update
  );

  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { tenants } = storeData || {};

  useEffect(() => {
    try {
      let tenant = userType === "employee" ? tenantId : data?.locationDet?.cityCode?.code;
      data.tenantId = tenant;

      let formdata = convertToPropertyLightWeight(data);
      formdata.Property.tenantId = formdata?.Property?.tenantId || tenant;

      mutation.mutate(formdata, {
        onSuccess,
      });

      if (!createNUpdate) {
        if (!(mutation.isLoading && mutation.isIdle)) {
          if (mutation.isSuccess) {
            setTimeout(() => {
              if (redirectUrl) {
                history.push(`${redirectUrl}?propertyId=${mutation?.data?.Properties[0]?.propertyId}&tenantId=${formdata.Property.tenantId}`, {
                  ...location?.state?.prevState,
                });
                const scrollConst = redirectUrl?.includes("employee/tl") ? 1600 : 300;
                setTimeout(() => window.scrollTo(0, scrollConst), 400);
                return;
              }
            }, 3000);
          }
        }
      }
    } catch (err) {}
  }, []);

  useEffect(() => {
    let tenant = userType === "employee" ? tenantId : data?.locationDet?.city?.code;

    if (mutation.isSuccess) {
      setTimeout(() => {
        if (redirectUrl) {
          history.push(`${redirectUrl}?propertyId=${mutation?.data?.Properties[0]?.propertyId}&tenantId=${tenant}`, {
            ...location?.state?.prevState,
          });
          const scrollConst = redirectUrl?.includes("employee/tl") ? 1600 : 300;
          setTimeout(() => window.scrollTo(0, scrollConst), 400);
          return;
        }
      }, 3000);
    }
  }, [mutation]);

  useEffect(() => {
    if (mutation.isSuccess && createNUpdate) {
      try {
        let tenant = userType === "employee" ? tenantId : data?.locationDet?.city?.code;
        data.tenantId = tenant;

        let formdata = convertToUpdatePropertyLightWeight(data);
        formdata.Property.tenantId = formdata?.Property?.tenantId || tenant;

        mutationForUpdate.mutate(formdata, {
          onSuccess,
        });

        if (mutationForUpdate.isSuccess) {
          setTimeout(() => {
            if (redirectUrl) {
              history.push(
                `${redirectUrl}?propertyId=${mutationForUpdate?.data?.Properties[0]?.propertyId}&tenantId=${mutationForUpdate?.data?.Properties[0]?.tenantId}`,
                { ...location?.state?.prevState }
              );
              const scrollConst = redirectUrl?.includes("employee/tl") ? 1600 : 300;
              setTimeout(() => window.scrollTo(0, scrollConst), 400);
              return;
            }
          }, 3000);
        }
      } catch (er) {}
    }
  }, [mutation.isSuccess]);

  const onNext = () => {
    if (onSelect) {
      if (mutation.isSuccess) {
        onSelect("cpt", { details: mutation?.data?.Properties[0] });
      }
    }
  };

  return mutation.isLoading || mutation.isIdle ? (
    <Loader />
  ) : (
    <Card>
      <BannerPicker t={t} data={mutation.data} isSuccess={mutation.isSuccess} isLoading={mutation.isIdle || mutation.isLoading} />
      {mutation.isSuccess && <CardText>{window.location.href.includes("employee") ? t("CS_CREATE_PROPERTY_SUCCESS_EMP_RESPONSE") : t("CS_CREATE_PROPERTY_SUCCESS_CITIZEN_RESPONSE")}</CardText>}
      {!mutation.isSuccess && <CardText>{t("CS_FILE_PROPERTY_FAILED_RESPONSE")}</CardText>}

      <StatusTable>
        {mutation.isSuccess && (
          <Row
            rowContainerStyle={rowContainerStyle}
            last
            label={t("PT_COMMON_TABLE_COL_PT_ID")}
            text={mutation?.data?.Properties[0]?.propertyId}
            textStyle={{ whiteSpace: "pre", width: "200%" }}
          />
        )}
      </StatusTable>
      {/* {mutation.isSuccess && !onSelect && <SubmitBar label={t("PT_DOWNLOAD_ACK_FORM")} onSubmit={null} />} */}
      {mutation.isSuccess &&
        window.location.href.includes("/citizen/") &&
        (onSelect ? (
          <SubmitBar label={t("CS_COMMON_PROCEED")} onSubmit={onNext} />
        ) : (
          <SubmitBar
            label={t("CS_COMMON_PROCEED")}
            onSubmit={() => {
              if (redirectUrl) {
                history.push(
                  `${redirectUrl}?propertyId=${mutationForUpdate?.data?.Properties[0]?.propertyId}&tenantId=${mutationForUpdate?.data?.Properties[0]?.tenantId}`,
                  { ...location?.state?.prevState }
                );
              }
            }}
          />
        ))}
    </Card>
  );
};

export default PTAcknowledgement;
