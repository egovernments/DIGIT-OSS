import { Banner, Card, CardText, LinkButton, Loader, Row, StatusTable, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation} from "react-router-dom";
// import getPTAcknowledgementData from "../../../getPTAcknowledgementData";
import { convertToPropertyLightWeight, convertToUpdateProperty } from "../utils";

const GetActionMessage = (props) => {
  const { t } = useTranslation();
  if (props.isSuccess) {
    return !window.location.href.includes("edit-application") ? t("CS_PROPERTY_APPLICATION_SUCCESS") : t("CS_PROPERTY_UPDATE_APPLICATION_SUCCESS");
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
  let data = location?.state?.data;
  if(onSelect) {
    data = formData?.cptNewProperty?.property;
  }

  let createNUpdate = false;
  const stateId = Digit.ULBService.getStateId();
  let { data: mdmsConfig, isLoading } = Digit.Hooks.pt.useMDMS(stateId, "PropertyTax", "PTWorkflow");
  (mdmsConfig?.PropertyTax?.PTWorkfow || []).forEach(data => {
    if(data.enable) {
      if((data.businessService).includes("WNS")){
        createNUpdate = true;
      }
    }
  })

  const isPropertyMutation = window.location.href.includes("property-mutation");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const mutation = Digit.Hooks.pt.usePropertyCreateNUpdateAPI(
    data?.locationDet?.city ? data.locationDet?.city?.code : tenantId,
    !window.location.href.includes("edit-application") && !isPropertyMutation,
    createNUpdate,
  );
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { tenants } = storeData || {};
  
  useEffect(() => {
    try {
      // let tenantId = isPropertyMutation ? data.Property?.address.tenantId : data?.address?.city ? data.address?.city?.code : tenantId;
      let tenant = userType === 'employee' ? tenantId : data?.locationDet?.city?.code;
      data.tenantId = tenant;
      let formdata = !window.location.href.includes("edit-application")
        ? isPropertyMutation
          ? data
          : convertToPropertyLightWeight(data)
        : null;
      formdata.Property.tenantId = formdata?.Property?.tenantId || tenant;
      mutation.mutate(formdata, {
        onSuccess,
      });

      if(mutation.isSuccess) {
        setTimeout(() => {
          if(redirectUrl) {
            history.push(`${redirectUrl}?propertyId=${mutation?.data?.Properties[0]?.propertyId}&tenantId=${formdata.Property.tenantId}`);
            return;
          } 
        }, 3000);
      }
     
    } catch (err) {
      console.error(err, "inside ack");
    }
  }, []);

  const onNext = () => {
    if(onSelect) {
      if(mutation.isSuccess) {
        onSelect('cpt', {details: mutation?.data?.Properties[0]} );
      }
    }
  }

  return mutation.isLoading || mutation.isIdle ? (
    <Loader />
  ) : (
    <Card>
      <BannerPicker t={t} data={mutation.data} isSuccess={mutation.isSuccess} isLoading={mutation.isIdle || mutation.isLoading} />
      {mutation.isSuccess && <CardText>{t("CS_FILE_PROPERTY_RESPONSE")}</CardText>}
      {!mutation.isSuccess && <CardText>{t("CS_FILE_PROPERTY_FAILED_RESPONSE")}</CardText>}
     
      <StatusTable>
        {mutation.isSuccess && (
          <Row
            rowContainerStyle={rowContainerStyle}
            last
            label={t("PT_COMMON_TABLE_COL_PT_ID")}
            text={mutation?.data?.Properties[0]?.propertyId}
            textStyle={{ whiteSpace: "pre", width: "60%" }}
          />
        )}
      </StatusTable>
      {mutation.isSuccess && !onSelect && <SubmitBar label={t("PT_DOWNLOAD_ACK_FORM")} onSubmit={handleDownloadPdf} />}
      {mutation.isSuccess && onSelect && <SubmitBar label={t("CS_COMMON_NEXT")} onSubmit={onNext} />}
      <Link to={`/digit-ui/citizen`}>
        <LinkButton label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};

export default PTAcknowledgement;
