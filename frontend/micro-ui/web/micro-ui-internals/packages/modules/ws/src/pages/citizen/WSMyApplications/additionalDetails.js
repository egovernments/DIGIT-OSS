import { Card, CardSubHeader, Header, LinkButton, Loader, Row, StatusTable, CardSectionHeader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation} from "react-router-dom";
//import PropertyDocument from "../../pageComponents/PropertyDocument";

const WSAdditionalDetails = () => {
  const { t } = useTranslation();
  const user = Digit.UserService.getUser();
  const tenantId = user?.info?.permanentCity || Digit.ULBService.getCurrentTenantId();
  const applicationNobyData = window.location.href.substring(window.location.href.indexOf("WS_")) || window.location.href.substring(window.location.href.indexOf("SW_"));
  console.log(applicationNobyData,"DATAapplicationno")
  //const { acknowledgementIds } = useParams();

  // let filter1 = !isNaN(parseInt(filter))
  // ? { tenantId: tenantId, mobileNumber: user?.info?.mobileNumber,  }
  // : { tenantId: tenantId, mobileNumber: user?.info?.mobileNumber };

  let filter1 = {tenantId: "pb.amritsar", applicationNumber: applicationNobyData }
const { isLoading, isError, error, data } = Digit.Hooks.ws.useMyApplicationSearch({ filters: filter1 }, { filters: filter1 });

// const fetchBillParams = { consumerCode : data?.WaterConnection?.[0]?.applicationNo };

// const paymentDetails = Digit.Hooks.useFetchBillsForBuissnessService(
//   { businessService: "WS.ONE_TIME_FEE", ...fetchBillParams, tenantId: tenantId },
//   {
//     enabled: data?.WaterConnection?.[0]?.applicationNo ? true : false,
//     retry: false,
//   }
// );

// const { 
//   isLoading : isPTLoading,
//   isError : isPTError,
//   error : PTerror,
//   data : PTData
// } = Digit.Hooks.pt.usePropertySearch({ filters: { propertyIds : data?.WaterConnection?.[0]?.propertyId } }, { filters: { propertyIds : data?.WaterConnection?.[0]?.propertyId } });
// console.log(paymentDetails,"ppppp");
// console.log(PTData,"ptdata")

if (isLoading) {
  return <Loader />;
}
console.log(data,"data");

// const { WaterConnection: applicationsList } = data || {};
// console.log(applicationsList);


  //const application = data?.Properties[0];
  return (
    <React.Fragment>
      <Header>{t("Additional Details")}</Header>
      <div className='hide-seperator'>
        <Card>
          <CardSubHeader>{t("Connection Details")}</CardSubHeader>
          <StatusTable>
            <Row className="border-none"  label={t("Connection Type")} text={data?.WaterConnection?.[0]?.connectionType || t("NA")} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("Number of taps")} text={data?.WaterConnection?.[0]?.noOfTaps} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("pipe size")} text={data?.WaterConnection?.[0]?.pipeSize || "NA"} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("water source")} text={data?.WaterConnection?.[0]?.waterSource || "NA"} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("water sub source")} text={data?.WaterConnection?.[0]?.waterSource || "NA"} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </Card>
        {data?.WaterConnection?.[0]?.plumberInfo && <Card>
          <CardSubHeader>{t("Plumber Details")}</CardSubHeader>
          <StatusTable>
            <Row className="border-none"  label={t("Plumber Provided By")} text={data?.WaterConnection?.[0]?.plumberInfo || t("NA")} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("Plumber License number")} text={data?.WaterConnection?.[0]?.plumberInfo?.licenseNo} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("plumber name")} text={data?.WaterConnection?.[0]?.plumberInfo?.name || "NA"} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("plumber mobile number")} text={data?.WaterConnection?.[0]?.plumberInfo?.mobileNumber || "NA"} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </Card>}
        <Card>
          <CardSubHeader>{t("Road Cutting Details")}</CardSubHeader>
          <StatusTable>
            <Row className="border-none"  label={t("Road Type")} text={data?.WaterConnection?.[0]?.roadType || t("NA")} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("Area")} text={data?.WaterConnection?.[0]?.roadCuttingArea} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </Card>
        <Card>
          <CardSubHeader>{t("Activation Details")}</CardSubHeader>
          <StatusTable>
            <Row className="border-none"  label={t("Connection Execution Date")} text={data?.WaterConnection?.[0]?.dateEffectiveFrom || t("NA")} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("Meter Id")} text={data?.WaterConnection?.[0]?.meterId} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("Meter Installation date")} text={data?.WaterConnection?.[0]?.meterInstallationDate || "NA"} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("Initial meter reading")} text={data?.WaterConnection?.[0]?.additionalDetails?.initialMeterReading || "NA"} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default WSAdditionalDetails;