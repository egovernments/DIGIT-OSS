import { Card, CardSubHeader, Header, LinkButton, Loader, Row, StatusTable, CardSectionHeader, MultiLink } from "@egovernments/digit-ui-react-components";
import React,{useState} from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation} from "react-router-dom";
//import PropertyDocument from "../../pageComponents/PropertyDocument";
import WSWFApplicationTimeline from "../../pageComponents/WSWFApplicationTimeline";
import WSDocument from "../../pageComponents/WSDocument";
import getPDFData from "../../utils/getWSAcknowledgementData";

const WSApplicationDetails = () => {
  const { t } = useTranslation();
  const user = Digit.UserService.getUser();
  const tenantId = user?.info?.permanentCity || Digit.ULBService.getCurrentTenantId();
  const [showOptions, setShowOptions] = useState(false);
  const applicationNobyData = window.location.href.substring(window.location.href.indexOf("WS_"));
  //const { acknowledgementIds } = useParams();


  let filter1 = {tenantId: tenantId, applicationNumber: applicationNobyData }
const { isLoading, isError, error, data } = Digit.Hooks.ws.useMyApplicationSearch({ filters: filter1 }, { filters: filter1 });

const fetchBillParams = { consumerCode : data?.WaterConnection?.[0]?.applicationNo };

const paymentDetails = Digit.Hooks.useFetchBillsForBuissnessService(
  { businessService: "WS.ONE_TIME_FEE", ...fetchBillParams, tenantId: tenantId },
  {
    enabled: data?.WaterConnection?.[0]?.applicationNo ? true : false,
    retry: false,
  }
);

const { 
  isLoading : isPTLoading,
  isError : isPTError,
  error : PTerror,
  data : PTData
} = Digit.Hooks.pt.usePropertySearch({ filters: { propertyIds : data?.WaterConnection?.[0]?.propertyId } }, { filters: { propertyIds : data?.WaterConnection?.[0]?.propertyId } });

if (isLoading) {
  return <Loader />;
}

const handleDownloadPdf = async () => {
  const tenantInfo = data?.WaterConnection?.[0]?.tenantId;
  let res = data?.WaterConnection?.[0];
  const PDFdata = getPDFData({ ...res },{...PTData?.Properties?.[0]}, tenantInfo, t);
  PDFdata.then((ress) => Digit.Utils.pdf.generate(ress));
  setShowOptions(false);
};

// const { WaterConnection: applicationsList } = data || {};
let dowloadOptions = [];
dowloadOptions.push({
  label: t("CS_COMMON_APPLICATION_ACKNOWLEDGEMENT"),
  onClick: handleDownloadPdf,
},)

  //const application = data?.Properties[0];
  return (
    <React.Fragment>
      <div className="cardHeaderWithOptions" style={{ marginRight: "auto", maxWidth: "960px" }}>
      <Header>{t("WS_APPLICATION_DETAILS_HEADER")}</Header>
      {dowloadOptions && dowloadOptions.length > 0 && <MultiLink
          className="multilinkWrapper"
          onHeadClick={() => setShowOptions(!showOptions)}
          displayOptions={showOptions}
          options={dowloadOptions}

        />}
      </div>
      <div className='hide-seperator'>
        <Card>
          <StatusTable>
            <Row className="border-none"  label={t("WS_MYCONNECTIONS_APPLICATION_NO")} text={data?.WaterConnection?.[0]?.applicationNo} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_MYCONNECTIONS_SERVICE")} text={data?.WaterConnection?.[0]?.applicationType} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_COMMON_TABLE_COL_AMT_DUE_LABEL")} text={paymentDetails?.data?.Bill?.[0]?.billDetails?.[0]?.amount || "NA"} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </Card>
        {paymentDetails?.data?.Bill?.[0]?.billDetails?.[0]?.billAccountDetails.length > 0 && <Card>
          <CardSubHeader>{t("WS_FEE_DEATAILS_HEADER")}</CardSubHeader>
          <StatusTable>
            {paymentDetails?.data?.Bill?.[0]?.billDetails?.[0]?.billAccountDetails.map(bill => (
              <Row className="border-none" label={t(bill?.taxHeadCode)} text={bill?.amount} textStyle={{textAlign: "right" }} />
            ))
            }
            <Row className="border-none" label={t("WS_TOTAL_AMOUNT_DUE")} text={paymentDetails?.data?.Bill?.[0]?.billDetails?.[0]?.amount} textStyle={{textAlign: "right" }} />
            <Row className="border-none" label={t("WS_COMMON_TABLE_COL_APPLICATION_STATUS")} text={paymentDetails?.data?.Bill?.[0]?.billDetails?.amountPaid == null ? "Unpaid":"paid"} textStyle={{textAlign: "right" }} />
            {/* <Row label={t("One time Fee")} text={"₹ 16500.00"} textStyle={{textAlign: "right" }} />
            <Row label={t("Security Charge")} text={"₹ 500.00"} textStyle={{textAlign: "right" }} />
            <Row label={t("Meter Charge")} text={"₹ 2000.00"} textStyle={{textAlign: "right" }} />
            <Row label={t("Tax")} text={" ₹ 200.00"} textStyle={{textAlign: "right" }} />
            <Row label={t("WS_COMMON_TOTAL_AMT")} text={"₹ 15000.00"} textStyle={{textAlign: "right" }} />
            <Row label={t("Status")} text={"Unpaid"} textStyle={{textAlign: "right" }} /> */}
          </StatusTable>
        </Card>}
        <Card>
          <CardSubHeader>{t("WS_COMMON_PROPERTY_DETAILS")}</CardSubHeader>
          <StatusTable>
            <Row className="border-none" label={t("WS_PROPERTY_ID_LABEL")} text={data?.WaterConnection?.[0]?.propertyId} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_OWN_DETAIL_OWN_NAME_LABEL")} text={PTData?.Properties?.[0]?.owners?.[0]?.name} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_OWN_DETAIL_CROSADD")} text={PTData?.Properties?.[0]?.owners?.[0]?.correspondenceAddress} textStyle={{ whiteSpace: "pre" }} />
            <Link to={`/digit-ui/citizen/pt/property/application/${data?.WaterConnection?.[0]?.propertyId}`}>
            <LinkButton label={t("View Property details")} />
            </Link>
          </StatusTable>
        </Card>
        {data?.WaterConnection?.[0]?.connectionHolders && <Card>
          <CardSubHeader>{t("WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER")}</CardSubHeader>
          <StatusTable>
            <Row className="border-none" label={t("WS_OWN_DETAIL_MOBILE_NO_LABEL")} text={data?.WaterConnection?.[0]?.connectionHolders?.[0]?.mobileNumber} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_OWN_DETAIL_OWN_NAME_LABEL")} text={data?.WaterConnection?.[0]?.connectionHolders?.[0]?.name} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_OWN_DETAIL_GENDER_LABEL")} text={data?.WaterConnection?.[0]?.connectionHolders?.[0]?.gender} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_OWN_DETAIL_FATHER_OR_HUSBAND_NAME")} text={data?.WaterConnection?.[0]?.connectionHolders?.[0]?.fatherOrHusbandName} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_OWN_DETAIL_RELATION_LABEL")} text={data?.WaterConnection?.[0]?.connectionHolders?.[0]?.relationship} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_OWN_DETAIL_CROSADD")} text={data?.WaterConnection?.[0]?.connectionHolders?.[0]?.correspondenceAddress} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_OWN_DETAIL_SPECIAL_APPLICANT_LABEL")} text={"NA"} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </Card>}
        <Card>
          <CardSubHeader>{t("WS_COMMON_CONNECTION_DETAIL")}</CardSubHeader>
          <StatusTable>
            <Row className="border-none" label={t("WS_TASK_DETAILS_CONN_DETAIL_NO_OF_TAPS_PROPOSED")} text={data?.WaterConnection?.[0]?.proposedTaps} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_SERV_DETAIL_NO_OF_TOILETS")} text={data?.WaterConnection?.[0]?.proposedPipeSize} textStyle={{ whiteSpace: "pre" }} />
            <Link to={`/digit-ui/citizen/ws/connection/additional/${data?.WaterConnection?.[0]?.applicationNo}`}>
            <LinkButton label={t("additinal details")} />
            </Link>
          </StatusTable>
        </Card>
        {/* <Card>
        <PropertyDocument property={application}></PropertyDocument>
        </Card> */}
        <Card>
        {data?.WaterConnection?.[0]?.documents && data?.WaterConnection?.[0]?.documents.map((doc, index) => (
          <div key={`doc-${index}`}>
         {<div><CardSectionHeader>{t(doc?.documentType?.split('.').slice(0,2).join('_'))}</CardSectionHeader>
          <StatusTable>
          {
           <WSDocument value={data?.WaterConnection?.[0]?.documents} Code={doc?.documentType} index={index} /> }
          {data?.WaterConnection?.[0]?.documents.length != index+ 1 ? <hr style={{color:"#cccccc",backgroundColor:"#cccccc",height:"2px",marginTop:"20px",marginBottom:"20px"}}/> : null}
          </StatusTable>
          </div>}
          </div>
        ))}
        </Card>
        <Card>
        {/* <PTWFApplicationTimeline application={application} id={acknowledgementIds} /> */}
        <WSWFApplicationTimeline application={data?.WaterConnection?.[0]} id={data?.WaterConnection?.[0]?.applicationNo}  />
        </Card>
      </div>
    </React.Fragment>
  );
};

export default WSApplicationDetails;
