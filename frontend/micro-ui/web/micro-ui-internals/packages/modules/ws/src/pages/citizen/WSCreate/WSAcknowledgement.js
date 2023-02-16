import { Banner, Card, CardText, LinkButton, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
//import { convertToEditTrade, convertToResubmitTrade, convertToTrade, convertToUpdateTrade, stringToBoolean } from "../../../utils";
//import getPDFData from "../../../utils/getTLAcknowledgementData";
//import getPDFData from "../TestAcknowledgment";
import {convertToWSUpdate, convertToSWUpdate, convertToEditWSUpdate, convertToEditSWUpdate} from "../../../utils/index";
import getPDFData from "../../../utils/getWSAcknowledgementData";
const GetActionMessage = (props) => {
  const { t } = useTranslation();
  if (props.isSuccess) {
    return t("CS_WATER_UPDATE_APPLICATION_SUCCESS");
  } else if (props.isLoading) {
    return t("CS_WATER_UPDATE_APPLICATION_PENDING");
  } else if (!props.isSuccess) {
    return t("CS_WATER_UPDATE_APPLICATION_FAILED");
  }
};

const rowContainerStyle = {
  padding: "4px 0px",
  justifyContent: "space-between",
};

const getApplicationNumber = (water,sewerage) => {
  if(water && sewerage && water?.WaterConnection?.[0]?.applicationNo && sewerage?.SewerageConnections?.[0]?.applicationNo)
  return `${water?.WaterConnection?.[0]?.applicationNo} , ${sewerage?.SewerageConnections?.[0]?.applicationNo}`;
  else if(water && water?.WaterConnection?.[0]?.applicationNo)
  return `${water?.WaterConnection?.[0]?.applicationNo}`
  else if(sewerage && sewerage?.SewerageConnections?.[0]?.applicationNo)
  return `${sewerage?.SewerageConnections?.[0]?.applicationNo}`;
}

const BannerPicker = (props) => {
  return (
    <Banner
      message={GetActionMessage(props)}
      info={props.isSuccess && props?.Waterdata ? props.t("WS_ACKNO_APP_NO_LABEL") : ""}
      applicationNumber={props?.Waterdata ? props?.Waterdata?.WaterConnection?.[0]?.applicationNo : ""}
      infoOne={props.isSuccess && props?.Seweragedata ? props.t("WS_ACKNO_SEW_APP_NO_LABEL") : ""}
      applicationNumberOne={props?.Seweragedata ? props?.Seweragedata?.SewerageConnections?.[0]?.applicationNo : ""}
      successful={props.isSuccess}
    />
  );
};

const WSAcknowledgement = ({ data, onSuccess, clearParams }) => {
  const { t } = useTranslation();
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("CITIZEN_TL_MUTATION_HAPPENED", false);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const WSmutation = Digit.Hooks.ws.useWSUpdateAPI(
    "WATER"
  );
  const SWmutation = Digit.Hooks.ws.useWSUpdateAPI(
   "SEWERAGE"
  );
  let isEdit = window.location.href.includes("/edit-application/") || window.location.href.includes("/modify-connection/");
 
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { tenants } = storeData || {};
  const stateId = Digit.ULBService.getStateId();

  useEffect(() => {
    if(sessionStorage.getItem("isCreateEnabled") !== "true")
    window.history.forward();
    else
    sessionStorage.removeItem("isCreateEnabled");

  })

  useEffect(() => {
    try {
        let tenantId;
     if(data?.serviceName?.code === "WATER" || data?.serviceName?.code === "BOTH"){
        tenantId = data?.cpt?.details?.tenantId || tenantId;
        let formdata = isEdit ? convertToEditWSUpdate(data) : convertToWSUpdate(data);
        WSmutation.mutate(formdata, {
          onSuccess,
        })
    }
     
    } catch (err) {
    }
  }, [data]);

  useEffect(() => {

    if(data?.serviceName?.code === "SEWERAGE" || (data?.serviceName?.code === "BOTH" && WSmutation.isSuccess))
      {
        let tenantId = data?.cpt?.details?.tenantId || tenantId;
        let formdata = isEdit ? convertToEditSWUpdate(data) : convertToSWUpdate(data);
        SWmutation.mutate(formdata, {
          onSuccess,
        })
      }
    
  },[data,WSmutation.isSuccess])

  const handleDownloadPdfWater = () => {
    const WSmutationdata =  WSmutation?.data?.WaterConnection?.[0];
    const tenantInfo = tenants.find((tenant) => tenant.code === data?.cpt?.details?.tenantId);
    const data1 = getPDFData({...WSmutationdata},{...data?.cpt?.details},tenantInfo?.code, t);
      data1.then((ress) => Digit.Utils.pdf.generatev1(ress));
  };

  const handleDownloadPdfSewerage = () => {
    const SWmutationdata = SWmutation?.data?.SewerageConnections?.[0];
    const tenantInfo = tenants.find((tenant) => tenant.code === data?.cpt?.details?.tenantId);
    const data2 = getPDFData({...SWmutationdata},{...data?.cpt?.details},tenantInfo?.code, t);
      data2.then((ress) => Digit.Utils.pdf.generatev1(ress));
  };


  const handleDownloadPdf = () => {

    const WSmutationdata =  WSmutation?.data?.WaterConnection?.[0];
    const SWmutationdata = SWmutation?.data?.SewerageConnections?.[0];
    const tenantInfo = tenants.find((tenant) => tenant.code === data?.cpt?.details?.tenantId);
    if(data?.serviceName?.code === "WATER")
    {
      const data1 = getPDFData({...WSmutationdata},{...data?.cpt?.details},tenantInfo?.code, t);
      data1.then((ress) => Digit.Utils.pdf.generatev1(ress));

    }
    else if(data?.serviceName?.code === "SEWERAGE")
    {
      const data2 = getPDFData({...SWmutationdata},{...data?.cpt?.details},tenantInfo?.code, t);
      data2.then((ress) => Digit.Utils.pdf.generatev1(ress));
    }
    else
    {
      const data1 = getPDFData({...WSmutationdata},{...data?.cpt?.details},tenantInfo?.code, t);
      const data2 = getPDFData({...SWmutationdata},{...data?.cpt?.details},tenantInfo?.code, t);
      data1.then((ress) => Digit.Utils.pdf.generatev1(ress));
      data2.then((ress) => Digit.Utils.pdf.generatev1(ress));
    }
  };

  return (data?.serviceName?.code === "WATER"? WSmutation.isLoading || WSmutation.isIdle : (data?.serviceName?.code === "SEWERAGE") ? SWmutation.isLoading || SWmutation.isIdle : (WSmutation.isLoading || WSmutation.isIdle || SWmutation.isLoading || SWmutation.isIdle)) ? (
    <Loader />
  ) : (
    <Card>
      <BannerPicker t={t} clearParams={clearParams} Waterdata={WSmutation.data } Seweragedata={SWmutation.data} isSuccess={data?.serviceName?.code === "WATER"? WSmutation.isSuccess : SWmutation.isSuccess} isLoading={data?.serviceName?.code === "WATER"? WSmutation.isLoading || WSmutation.isIdle : (data?.serviceName?.code === "SEWERAGE") ? SWmutation.isLoading || SWmutation.isIdle : (WSmutation.isLoading || WSmutation.isIdle || SWmutation.isLoading || SWmutation.isIdle)} />
      {(data?.serviceName?.code === "WATER"? WSmutation.isSuccess : SWmutation.isSuccess) && <CardText>{t("WS_FILE_RESPONSE")}</CardText>}
      {/* {(data?.serviceName?.code === "WATER"? WSmutation.isSuccess : SWmutation.isSuccess) && (
        <LinkButton
          label={
            <div className="response-download-button">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f47738">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                </svg>
              </span>
              <span className="download-button">{t("TL_DOWNLOAD_ACK_FORM")}</span>
            </div>
          }
          //style={{ width: "100px" }}
          onClick={handleDownloadPdf}
        />)} */}
      {/* {mutation2?.data?.Licenses[0]?.status === "PENDINGPAYMENT" && <Link to={{
        pathname: `/digit-ui/citizen/payment/collect/${mutation2.data.Licenses[0].businessService}/${mutation2.data.Licenses[0].applicationNumber}`,
        state: { tenantId: mutation2.data.Licenses[0].tenantId },
      }}>
        <SubmitBar label={t("COMMON_MAKE_PAYMENT")} />
      </Link>} */}
      {(data?.serviceName?.code === "WATER" || data?.serviceName?.code === "BOTH") && WSmutation.isSuccess && <LinkButton
      label={
        <div className="response-download-button">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f47738">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
          </span>
          <span className="download-button">{t("WS_PRINT_WATER_APPLICATION_LABEL")}</span>
        </div>
      }
      //style={{ width: "100px" }}
      onClick={handleDownloadPdfWater}
    />}
      {(data?.serviceName?.code === "SEWERAGE" || data?.serviceName?.code === "BOTH") && SWmutation.isSuccess && <LinkButton
      label={
        <div className="response-download-button">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f47738">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
          </span>
          <span className="download-button">{t("WS_PRINT_SEWERAGE_APPLICATION_LABEL")}</span>
        </div>
      }
      //style={{ width: "100px" }}
      onClick={handleDownloadPdfSewerage}
    />}
      <Link to={{
        pathname: `/digit-ui/citizen`,
      }}>
        <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};

export default WSAcknowledgement;

