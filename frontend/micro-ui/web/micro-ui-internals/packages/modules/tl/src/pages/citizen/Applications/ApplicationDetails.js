import {
  Card,
  CardHeader,
  Loader,
  MultiLink,
  Row,
  SubmitBar,
  Header,
  CardSubHeader,
  CardSectionHeader,
  LinkLabel,
  LinkButton,
  StatusTable,
} from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useParams } from "react-router-dom";
import getPDFData from "../../../utils/getTLAcknowledgementData";
import TLWFApplicationTimeline from "../../../pageComponents/TLWFApplicationTimeline";
import TLDocument from "../../../pageComponents/TLDocumets";

const getAddress = (address, t) => {
  return `${address?.doorNo ? `${address?.doorNo}, ` : ""} ${address?.street ? `${address?.street}, ` : ""}${
    address?.landmark ? `${address?.landmark}, ` : ""
  }${t(address?.locality.code)}, ${t(address?.city.code)},${t(address?.pincode) ? `${address.pincode}` : " "}`
} 


const TLApplicationDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { tenantId } = useParams();
  const history = useHistory();
  const [bill, setBill] = useState(null);
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("CITIZEN_TL_MUTATION_HAPPENED", false);
  const { tenants } = storeData || {};
  let multiBoxStyle = {
    border: "groove",
    background: "#FAFAFA",
    borderRadius: "4px",
    paddingInline: "10px",
    marginTop: "10px",
    marginBottom: "10px",
  };
  let multiHeaderStyle = { marginBottom: "10px", marginTop: "10px", color: "#505A5F" };
  //todo: hook should return object to render the data
  const { isLoading, isError, error, data: application, error: errorApplication } = Digit.Hooks.tl.useTLApplicationDetails({
    tenantId: tenantId,
    applicationNumber: id,
  });
  const { isLoading: PTLoading, isError: isPTError, data: PTData } = Digit.Hooks.pt.usePropertySearch(
    {
      tenantId,
      filters: { propertyIds: application?.[0]?.tradeLicenseDetail?.additionalDetail?.propertyId },
    },
    { enabled: application?.[0]?.tradeLicenseDetail?.additionalDetail?.propertyId ? true : false }
  );

  useEffect(() => {
    setMutationHappened(false);
  }, []);

  const { data: paymentsHistory } = Digit.Hooks.tl.useTLPaymentHistory(tenantId, id);
  useEffect(() => {
    if (application) {
      Digit.PaymentService.fetchBill(tenantId, {
        consumerCode: application[0]?.applicationNumber,
        businessService: application[0]?.businessService,
      }).then((res) => {
        setBill(res?.Bill[0]);
      });
    }
  }, [application]);
  const [showOptions, setShowOptions] = useState(false);
  useEffect(() => {}, [application, errorApplication]);

  const businessService= application?.[0]?.businessService;
  const { isLoading : iswfLoading, data : wfdata } = Digit.Hooks.useWorkflowDetails({
    tenantId: application?.[0]?.tenantId,
    id: id,
    moduleCode: businessService,
  });

let workflowDocs = [];
if(wfdata)
{
  wfdata?.timeline?.map((ob) => {
    if(ob?.wfDocuments?.length>0) workflowDocs.push(ob?.wfDocuments?.[0])
  })
}

  if (isLoading || iswfLoading) {
    return <Loader />;
  }

  if (application?.applicationDetails?.length === 0) {
    history.goBack();
  }

  const handleDownloadPdf = async () => {
    const tenantInfo = tenants.find((tenant) => tenant.code === application[0]?.tenantId);
    let res = application[0];
    const data = getPDFData({ ...res }, tenantInfo, t);
    data.then((ress) => Digit.Utils.pdf.generate(ress));
    setShowOptions(false);
  };

  const downloadPaymentReceipt = async () => {
    const receiptFile = { filestoreIds: [paymentsHistory.Payments[0]?.fileStoreId] };
    if (!receiptFile?.fileStoreIds?.[0]) {
      const newResponse = await Digit.PaymentService.generatePdf(tenantId, { Payments: [paymentsHistory.Payments[0]] }, "tradelicense-receipt");
      const fileStore = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: newResponse.filestoreIds[0] });
      window.open(fileStore[newResponse.filestoreIds[0]], "_blank");
      setShowOptions(false);
    } else {
      const fileStore = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: receiptFile.filestoreIds[0] });
      window.open(fileStore[receiptFile.filestoreIds[0]], "_blank");
      setShowOptions(false);
    }
  };

  const downloadTLcertificate = async () => {
    const TLcertificatefile = await Digit.PaymentService.generatePdf(tenantId, { Licenses: application }, "tlcertificate");
    const receiptFile = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: TLcertificatefile.filestoreIds[0] });
    window.open(receiptFile[TLcertificatefile.filestoreIds[0]], "_blank");
    setShowOptions(false);
  };

  let propertyAddress = "";
  if (PTData && PTData?.Properties?.length) {
    propertyAddress=getAddress(PTData?.Properties[0]?.address,t);
  }

  const dowloadOptions =
    paymentsHistory?.Payments?.length > 0
      ? [
          {
            label: t("TL_CERTIFICATE"),
            onClick: downloadTLcertificate,
          },
          {
            label: t("CS_COMMON_PAYMENT_RECEIPT"),
            onClick: downloadPaymentReceipt,
          },
        ]
      : [
          {
            label: t("CS_COMMON_APPLICATION_ACKNOWLEDGEMENT"),
            onClick: handleDownloadPdf,
          },
        ];

  return (
    <React.Fragment>
      <div className="cardHeaderWithOptions">
        <Header>{t("CS_TITLE_APPLICATION_DETAILS")}</Header>
        <MultiLink
          className="multilinkWrapper"
          onHeadClick={() => setShowOptions(!showOptions)}
          displayOptions={showOptions}
          options={dowloadOptions}
        />
      </div>
      <Card style={{ position: "relative" }}>
        {application?.map((application, index) => {
          return (
            <div key={index} className="employee-data-table">
              <Row
                className="employee-data-table"
                label={t("TL_COMMON_TABLE_COL_APP_NO")}
                text={application?.applicationNumber}
                textStyle={{ whiteSpace: "pre", border: "none" }}
              />
              <Row label={t("TL_APPLICATION_CATEGORY")} text={t("ACTION_TEST_TRADE_LICENSE")} textStyle={{ whiteSpace: "pre" }} />
              <Row
                style={{ border: "none" }}
                label={t("TL_COMMON_TABLE_COL_STATUS")}
                text={t(`WF_NEWTL_${application?.status}`)}
                textStyle={{ whiteSpace: "pre-wrap", width: "70%" }}
              />
              <Row
                style={{ border: "none" }}
                label={t("TL_COMMON_TABLE_COL_SLA_NAME")}
                text={`${Math.round(application?.SLA / (1000 * 60 * 60 * 24))} ${t("TL_SLA_DAYS")}`}
                textStyle={{ whiteSpace: "pre" }}
              />
              <Row
                style={{ border: "none" }}
                label={t("TL_COMMON_TABLE_COL_TRD_NAME")}
                text={application?.tradeName}
                textStyle={{ whiteSpace: "pre-wrap", width: "70%" }}
              />
              <CardSectionHeader>{t("TL_OWNERSHIP_DETAILS_HEADER")}</CardSectionHeader>
              {application?.tradeLicenseDetail.owners.map((ele, index) => {
                return application?.tradeLicenseDetail?.subOwnerShipCategory.includes("INSTITUTIONAL") ? (
                  <div key={index} style={multiBoxStyle}>
                    <CardSectionHeader style={multiHeaderStyle}>{`${t("TL_PAYMENT_PAID_BY_PLACEHOLDER")} - ` + (index + 1)}</CardSectionHeader>
                    <Row
                      label={`${t("TL_INSTITUTION_NAME_LABEL")}`}
                      text={t(application?.tradeLicenseDetail?.institution?.instituionName)}
                      textStyle={{ whiteSpace: "pre" }}
                    />
                    <Row
                      label={`${t("TL_INSTITUTION_TYPE_LABEL")}`}
                      text={t(`TL_${application?.tradeLicenseDetail?.subOwnerShipCategory}`)}
                      textStyle={{ whiteSpace: "pre" }}
                    />
                    <Row label={`${t("TL_MOBILE_NUMBER_LABEL")}`} text={t(ele.mobileNumber)} textStyle={{ whiteSpace: "pre" }} />
                    <Row
                      label={`${t("TL_TELEPHONE_NUMBER_LABEL")}`}
                      text={t(application?.tradeLicenseDetail?.institution?.contactNo || t("CS_NA"))}
                      textStyle={{ whiteSpace: "pre" }}
                    />
                    <Row
                      label={`${t("TL_LOCALIZATION_OWNER_NAME")}`}
                      text={t(ele.fatherOrHusbandName || application?.tradeLicenseDetail?.institution?.name)}
                      textStyle={{ whiteSpace: "pre" }}
                    />
                    <Row label={`${t("TL_LOCALIZATION_EMAIL_ID")}`} text={t(ele.emailId || t("CS_NA"))} textStyle={{ whiteSpace: "pre" }} />
                  </div>
                ) : (
                  <div key={index} style={multiBoxStyle}>
                    <CardSectionHeader style={multiHeaderStyle}>{`${t("TL_PAYMENT_PAID_BY_PLACEHOLDER")} - ` + (index + 1)}</CardSectionHeader>
                    <Row label={`${t("TL_COMMON_TABLE_COL_OWN_NAME")}`} text={t(ele.name)} textStyle={{ whiteSpace: "pre" }} />
                    <Row label={`${t("TL_NEW_OWNER_DETAILS_GENDER_LABEL")}`} text={t(ele.gender)} textStyle={{ whiteSpace: "pre" }} />
                    <Row label={`${t("TL_MOBILE_NUMBER_LABEL")}`} text={t(ele.mobileNumber)} textStyle={{ whiteSpace: "pre" }} />
                    <Row label={`${t("TL_GUARDIAN_S_NAME_LABEL")}`} text={t(ele.fatherOrHusbandName)} textStyle={{ whiteSpace: "pre" }} />
                    <Row label={`${t("TL_RELATIONSHIP_WITH_GUARDIAN_LABEL")}`} text={t(ele.relationship)} textStyle={{ whiteSpace: "pre" }} />
                  </div>
                );
              })}
              <CardSubHeader>{t("TL_TRADE_UNITS_HEADER")}</CardSubHeader>
              {application?.tradeLicenseDetail?.tradeUnits?.map((ele, index) => {
                return (
                  <div key={index} style={multiBoxStyle}>
                    <CardSectionHeader style={multiHeaderStyle}>
                      {t("TL_UNIT_HEADER")} {index + 1}
                    </CardSectionHeader>
                    <Row
                      label={t("TL_NEW_TRADE_DETAILS_TRADE_CAT_LABEL")}
                      text={t(`TRADELICENSE_TRADETYPE_${ele?.tradeType.split(".")[0]}`)}
                      textStyle={{ whiteSpace: "pre" }}
                    />
                    <Row
                      style={{ border: "none" }}
                      label={t("TL_NEW_TRADE_DETAILS_TRADE_TYPE_LABEL")}
                      text={t(`TRADELICENSE_TRADETYPE_${ele?.tradeType.split(".")[1]}`)}
                      textStyle={{ whiteSpace: "pre" }}
                    />
                    <Row
                      style={{ border: "none" }}
                      label={t("TL_NEW_TRADE_DETAILS_TRADE_SUBTYPE_LABEL")}
                      text={t(`TL_${ele?.tradeType}`)}
                      textStyle={{ whiteSpace: "pre-wrap", width: "70%" }}
                    />
                  </div>
                );
              })}
              {Array.isArray(application?.tradeLicenseDetail?.accessories) && application?.tradeLicenseDetail?.accessories.length > 0 && (
                <CardSubHeader style={{ paddingTop: "7px" }}>{t("TL_NEW_TRADE_DETAILS_HEADER_ACC")}</CardSubHeader>
              )}
              {Array.isArray(application?.tradeLicenseDetail?.accessories) &&
                application?.tradeLicenseDetail?.accessories.length > 0 &&
                application?.tradeLicenseDetail?.accessories?.map((ele, index) => {
                  return (
                    <div key={index} style={multiBoxStyle}>
                      <CardSectionHeader style={multiHeaderStyle}>
                        {t("TL_ACCESSORY_LABEL")} {index + 1}
                      </CardSectionHeader>
                      <Row
                        style={{ border: "none" }}
                        label={t("TL_REVIEWACCESSORY_TYPE_LABEL")}
                        text={t(`TL_${ele?.accessoryCategory.split("-").join("_")}`)}
                        textStyle={{ whiteSpace: "pre" }}
                      />
                      <Row label={t("TL_NEW_TRADE_ACCESSORY_COUNT_LABEL")} text={ele?.count} textStyle={{ whiteSpace: "pre" }} />
                      <Row label={t("TL_NEW_TRADE_ACCESSORY_UOM_LABEL")} text={ele?.uom} textStyle={{ whiteSpace: "pre" }} />
                      <Row label={t("TL_NEW_TRADE_ACCESSORY_UOMVALUE_LABEL")} text={ele?.uomValue} textStyle={{ whiteSpace: "pre" }} />
                    </div>
                  );
                })}
              {PTData?.Properties && PTData?.Properties.length > 0 && (
                <div>
                  <CardSubHeader>{t("PT_DETAILS")}</CardSubHeader>
                  <Row label={t("TL_PROPERTY_ID")} text={PTData?.Properties?.[0]?.propertyId} textStyle={{ whiteSpace: "pre" }} />
                  <Row label={t("PT_OWNER_NAME")} text={PTData?.Properties?.[0]?.owners[0]?.name} textStyle={{ whiteSpace: "pre" }} />
                  <Row label={t("PROPERTY_ADDRESS")} text={propertyAddress} />
                  <LinkButton
                    style={{ textAlign: "left" }}
                    label={t("TL_VIEW_PROPERTY_DETAIL")}
                    onClick={() => {
                      history.push(
                        `/digit-ui/citizen/commonpt/view-property?propertyId=${PTData?.Properties?.[0]?.propertyId}&tenantId=${PTData?.Properties?.[0]?.tenantId}`
                      );
                    }}
                  ></LinkButton>
                </div>
              )}
              <Row label="" />
             { !(PTData?.Properties && PTData?.Properties.length > 0 )&&<Row
                style={{ border: "none" }}
                label={t("TL_NEW_TRADE_ADDRESS_LABEL")}
                text={`${
                  application?.tradeLicenseDetail?.address?.doorNo?.trim() ? `${application?.tradeLicenseDetail?.address?.doorNo?.trim()}, ` : ""
                } ${
                  application?.tradeLicenseDetail?.address?.street?.trim() ? `${application?.tradeLicenseDetail?.address?.street?.trim()}, ` : ""
                }${t(application?.tradeLicenseDetail?.address?.locality?.name)}, ${t(application?.tradeLicenseDetail?.address?.city)} ${
                  application?.tradeLicenseDetail?.address?.pincode?.trim() ? `,${application?.tradeLicenseDetail?.address?.pincode?.trim()}` : ""
                }`}
                textStyle={{ whiteSpace: "pre-wrap", width: "70%" }}
              />}
              <CardSubHeader>{t("TL_COMMON_DOCS")}</CardSubHeader>
              <div>
                {application?.tradeLicenseDetail?.applicationDocuments?.length > 0 ? (
                  <TLDocument value={{...application}}></TLDocument>
                ) : (
                  <StatusTable>
                    <Row text={t("TL_NO_DOCUMENTS_MSG")} />
                  </StatusTable>
                )}
              </div>
              {workflowDocs?.length > 0 && <div>
              <CardSubHeader>{t("TL_TIMELINE_DOCS")}</CardSubHeader>
              <div>
                {workflowDocs?.length > 0 ? (
                  <TLDocument value={{"workflowDocs":workflowDocs}}></TLDocument>
                ) : (
                  <StatusTable>
                    <Row text={t("TL_NO_DOCUMENTS_MSG")} />
                  </StatusTable>
                )}
              </div>
              </div>}
              <TLWFApplicationTimeline application={application} id={id} />
              {application?.status === "CITIZENACTIONREQUIRED" ? (
                <Link
                  to={{
                    pathname: `/digit-ui/citizen/tl/tradelicence/edit-application/${application?.applicationNumber}/${application?.tenantId}`,
                    state: {},
                  }}
                >
                  <SubmitBar label={t("COMMON_EDIT")} />
                </Link>
              ) : null}
              {/* //TODO: change the actions to be fulfilled from workflow nextactions */}
              {application?.status === "PENDINGPAYMENT" ? (
                <Link
                  to={{
                    pathname: `/digit-ui/citizen/payment/collect/${application?.businessService}/${application?.applicationNumber}`,
                    state: { bill, tenantId: tenantId },
                  }}
                >
                  <SubmitBar label={t("COMMON_MAKE_PAYMENT")} />
                </Link>
              ) : null}
            </div>
          );
        })}
      </Card>
    </React.Fragment>
  );
};

export default TLApplicationDetails;
