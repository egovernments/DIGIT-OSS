import { Banner, Card, CardText, LinkButton, Loader, Row, StatusTable, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {convertToStakeholderObject} from "../../../utils/index";

const GetActionMessage = (props) => {
  const { t } = useTranslation();
  if (props.isSuccess) {
    return !window.location.href.includes("edit-application") ? t("CS_STAKEHOLDER_APPLICATION_SUCCESS") : t("CS_PROPERTY_UPDATE_APPLICATION_SUCCESS");
  } else if (props.isLoading) {
    return !window.location.href.includes("edit-application") ? t("CS_STAKEHOLDER_APPLICATION_PENDING") : t("CS_PROPERTY_UPDATE_APPLICATION_PENDING");
  } else if (!props.isSuccess) {
    return !window.location.href.includes("edit-application") ? t("CS_STAKEHOLDER_APPLICATION_FAILED") : t("CS_PROPERTY_UPDATE_APPLICATION_FAILED");
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
      applicationNumber={props.data?.Licenses[0].applicationNumber}
      info={props.isSuccess ? props.t("Stakeholder Registartion Application Number") : ""}
      successful={props.isSuccess}
    />
  );
};

const StakeholderAcknowledgement = ({ data, onSuccess }) => {
  const { t } = useTranslation();
  //const isPropertyMutation = window.location.href.includes("property-mutation");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const mutation = Digit.Hooks.obps.useStakeholderAPI(
    data?.address?.city ? data.address?.city?.code : tenantId,
    true
  ); 
   const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { tenants } = storeData || {};
  let isOpenLinkFlow = window.location.href.includes("openlink");


  useEffect(() => {
    try {
      let tenantId = data?.result?.Licenses[0]?.tenantId ? data?.result?.Licenses[0]?.tenantId : tenantId;
      data.tenantId = tenantId;
      let formdata ={};
      formdata = convertToStakeholderObject(data);
      mutation.mutate(formdata, {
        onSuccess,
      });
      
    } catch (err) {
      console.log(err, "inside ack");
    }
  }, []);

  const handleDownloadPdf = async () => {
    // const { Properties = [] } = mutation.data;
    // const Property = (Properties && Properties[0]) || {};
    // const tenantInfo = tenants.find((tenant) => tenant.code === Property.tenantId);
    // const data = await getPTAcknowledgementData({ ...Property }, tenantInfo, t);
    // Digit.Utils.pdf.generate(data);
  };

  return mutation.isLoading || mutation.isIdle ? (
    <Loader />
  ) : (
    <Card>
      <BannerPicker t={t} data={mutation.data} isSuccess={mutation.isSuccess} isLoading={mutation.isIdle || mutation.isLoading} />
      {mutation.isSuccess && <CardText>{t("CS_FILE_STAKEHOLDER_RESPONSE")}</CardText>}
      {!mutation.isSuccess && <CardText>{t("CS_FILE_PROPERTY_FAILED_RESPONSE")}</CardText>}
      {(mutation.isSuccess && !isOpenLinkFlow) && <Link to={{
        pathname: `/digit-ui/citizen/payment/collect/${mutation.data.Licenses[0].businessService}/${mutation.data.Licenses[0].applicationNumber}`,
        state: { tenantId: mutation.data.Licenses[0].tenantId },
      }}>
        <SubmitBar label={t("COMMON_MAKE_PAYMENT")} />
      </Link>}
      {!isOpenLinkFlow && <Link to={`/digit-ui/citizen`}>
        <LinkButton label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>}
      {(mutation.isSuccess && isOpenLinkFlow) && <Link to={{
        pathname: `/digit-ui/citizen`,
      }}>
        <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>}
    </Card>
  );
};

export default StakeholderAcknowledgement;
