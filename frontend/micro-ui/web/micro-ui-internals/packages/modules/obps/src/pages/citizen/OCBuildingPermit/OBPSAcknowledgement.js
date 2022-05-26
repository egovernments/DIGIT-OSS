import { Banner, Card, CardText, LinkButton, Loader, Row, StatusTable, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {convertToNocObject,convertToBPAObject, stringReplaceAll} from "../../../utils/index";

const GetActionMessage = (props) => {
  const bpaData = props?.data?.BPA?.[0];
  let bpaBusinessService = props?.data?.BPA?.[0]?.businessService ? props?.data?.BPA?.[0]?.businessService : "BPA";
  let bpaStatus = bpaData?.status;
  if (bpaBusinessService == "BPA_LOW") bpaBusinessService = "BPA";
  let getAppAction = sessionStorage.getItem("BPA_SUBMIT_APP") ? JSON.parse(sessionStorage.getItem("BPA_SUBMIT_APP")) : null;

  if (props.isSuccess) {
    if (getAppAction == "BPA_SUBMIT_APP") return !window.location.href.includes("editApplication") ? props?.t(`BPA_SUBMIT_HEADER_${bpaBusinessService}_${bpaData?.workflow?.action}_${stringReplaceAll(bpaStatus," ","_").toUpperCase()}`) : props?.t(`BPA_SUBMIT_HEADER_${bpaBusinessService}_${bpaData?.workflow?.action}_${stringReplaceAll(bpaStatus," ","_").toUpperCase()}`);
    return !window.location.href.includes("editApplication") ? props?.t(`BPA_HEADER_${bpaBusinessService}_${bpaData?.workflow?.action}_${stringReplaceAll(bpaStatus," ","_").toUpperCase()}`) : props?.t(`BPA_HEADER_${bpaBusinessService}_${bpaData?.workflow?.action}_${stringReplaceAll(bpaStatus," ","_").toUpperCase()}`);
  } else if (props.isLoading) {
    return !window.location.href.includes("editApplication") ? props?.t("CS_BPA_APPLICATION_PENDING") : props?.t("CS_BPA_APPLICATION_PENDING");
  } else if (!props.isSuccess) {
    return !window.location.href.includes("editApplication") ? props?.t("CS_BPA_APPLICATION_FAILED") : props?.t("CS_BPA_APPLICATION_FAILED");
  }
};

const getCardText = (t, props) => {
  const bpaData = props?.BPA?.[0];
  let bpaBusinessService = props?.BPA?.[0]?.businessService ? props?.BPA?.[0]?.businessService : "BPA";
  let bpaStatus = bpaData?.status;
  if (bpaBusinessService == "BPA_LOW") bpaBusinessService = "BPA";
  let getAppAction = sessionStorage.getItem("BPA_SUBMIT_APP") ? JSON.parse(sessionStorage.getItem("BPA_SUBMIT_APP")) : null;
  if (getAppAction == "BPA_SUBMIT_APP") t(`BPA_SUBMIT_SUB_HEADER_${bpaBusinessService}_${bpaData?.workflow?.action}_${bpaData?.additionalDetails?.typeOfArchitect ? bpaData?.additionalDetails?.typeOfArchitect : "ARCHITECT"}_${stringReplaceAll(bpaStatus," ","_").toUpperCase()}`)
  return t(`BPA_SUB_HEADER_${bpaBusinessService}_${bpaData?.workflow?.action}_${bpaData?.additionalDetails?.typeOfArchitect ? bpaData?.additionalDetails?.typeOfArchitect : "ARCHITECT"}_${stringReplaceAll(bpaStatus," ","_").toUpperCase()}`)
}

const rowContainerStyle = {
  padding: "4px 0px",
  justifyContent: "space-between",
};

const getApplicationNoLabel = (props) => {
  let bpaBusinessService = props?.BPA?.[0]?.businessService ? props?.BPA?.[0]?.businessService : "BPA";
  if (bpaBusinessService == "BPA_LOW") bpaBusinessService = "BPA";
  if (bpaBusinessService == "BPA") {
    return props?.t("BPA_PERMIT_APPLICATION_NUMBER_LABEL")
  } else {
    return props?.t("BPA_OCCUPANCY_CERTIFICATE_APPLICATION_NUMBER_LABEL")
  }
}

const BannerPicker = (props) => {
  return (
    <Banner
      message={GetActionMessage(props)}
      applicationNumber={props.data?.BPA[0].applicationNo}
      info={props.isSuccess ? getApplicationNoLabel(props) : ""}
      successful={props.isSuccess}
      headerStyles={{fontSize: "32px"}}
    />
  );
};

const OBPSAcknowledgement = ({ data, onSuccess }) => {
  const { t } = useTranslation();
  //const isPropertyMutation = window.location.href.includes("property-mutation");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const mutation = Digit.Hooks.obps.useObpsAPI(
    data?.tenantId ? data?.tenantId : tenantId,
    true
  ); 
  const mutation1 = Digit.Hooks.obps.useObpsAPI(
    data?.tenantId ? data?.tenantId : tenantId,
    false
  );
   const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { tenants } = storeData || {};

  useEffect(() => {
    try {
      let tenantId = data?.tenantId ? data?.tenantId : tenantId;
      data.tenantId = data?.tenantId;
      let formdata ={};
      data?.nocDocuments?.NocDetails.map((noc) => {
        formdata = convertToNocObject(noc,data);
        mutation.mutate(formdata, {
            onSuccess,
          });
      })
      formdata = convertToBPAObject(data, true);
      mutation1.mutate(formdata, {
        onSuccess,
      });
      
    } catch (err) {
    }
  }, []);

  return mutation1.isLoading || mutation1.isIdle ? (
    <Loader />
  ) : (
    <Card>
      <BannerPicker t={t} data={mutation1.data} isSuccess={mutation1.isSuccess} isLoading={mutation1.isIdle || mutation1.isLoading} />
      {mutation1.isSuccess && <CardText>{getCardText(t,mutation1.data)}</CardText>}
      {!mutation1.isSuccess && <CardText>{t(Digit.Utils.locale.getTransformedLocale(mutation1.error.message))}</CardText>}
      <Link to={{
        pathname: `/digit-ui/citizen`,
      }}>
        <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};

export default OBPSAcknowledgement;
