import { Banner, Card, CardText, LinkButton, Loader, Row, StatusTable, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {convertToNocObject,convertToBPAObject} from "../../../utils/index";

const GetActionMessage = (props) => {
  const { t } = useTranslation();
  if (props.isSuccess) {
    return !window.location.href.includes("editApplication") ? t("CS_BPA_APPLICATION_SUCCESS") : t("CS_PROPERTY_UPDATE_APPLICATION_SUCCESS");
  } else if (props.isLoading) {
    return !window.location.href.includes("editApplication") ? t("CS_BPA_APPLICATION_PENDING") : t("CS_PROPERTY_UPDATE_APPLICATION_PENDING");
  } else if (!props.isSuccess) {
    return !window.location.href.includes("editApplication") ? t("CS_BPA_APPLICATION_FAILED") : t("CS_PROPERTY_UPDATE_APPLICATION_FAILED");
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
      applicationNumber={props.data?.BPA[0].applicationNo}
      info={props.isSuccess ? props.t("BPA_STAKEHOLDER_NO") : ""}
      successful={props.isSuccess}
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
      console.error(err, "inside ack");
    }
  }, []);

  const handleDownloadPdf = async () => {
    // const { Properties = [] } = mutation.data;
    // const Property = (Properties && Properties[0]) || {};
    // const tenantInfo = tenants.find((tenant) => tenant.code === Property.tenantId);
    // const data = await getPTAcknowledgementData({ ...Property }, tenantInfo, t);
    // Digit.Utils.pdf.generate(data);
  };

  return mutation1.isLoading || mutation1.isIdle ? (
    <Loader />
  ) : (
    <Card>
      <BannerPicker t={t} data={mutation1.data} isSuccess={mutation1.isSuccess} isLoading={mutation1.isIdle || mutation1.isLoading} />
      {mutation1.isSuccess && <CardText>{t("CS_FILE_OBPS_RESPONSE")}</CardText>}
      {!mutation1.isSuccess && <CardText>{t("CS_FILE_PROPERTY_FAILED_RESPONSE")}</CardText>}
      <Link to={{
        pathname: `/digit-ui/citizen`,
      }}>
        <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};

export default OBPSAcknowledgement;
