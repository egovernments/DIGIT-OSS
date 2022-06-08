import {
  Card,
  CardHeader,
  CardSubHeader,
  CardText,
  CitizenInfoLabel,
  LinkButton,
  Row,
  StatusTable,
  SubmitBar,
  CheckBox
} from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Loader } from "@egovernments/digit-ui-react-components";
import { pdfDocumentName, pdfDownloadLink } from "../utils";
import { useState } from "react";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";

const TLDocumentSearch = (data1, config)=> {
  if (data1 === void 0) {
    data1 = {};
  }

  var client = useQueryClient();
  var tenantId = window.Digit.ULBService.getCurrentTenantId();
  var tenant = tenantId.split(".")[0];
  var filesArray = ["OwnerPhotoProof","ProofOfIdentity","ProofOfOwnership"]
  var file=[];
  var doucument=[]
  filesArray.map(item=>{
    if( data1?.value?.owners?.documents?.[item]?.fileStoreId){
      file.push(data1?.value?.owners?.documents?.[item]?.fileStoreId)
      doucument.push(data1?.value.owners.documents[item])
    }
  })
  var _useQuery = useQuery(["tlDocuments-" + 1, filesArray], function () {
    return window.Digit.UploadServices.Filefetch(filesArray, tenant);
  }),
      isLoading = _useQuery.isLoading,
      error = _useQuery.error,
      data = _useQuery.data;

  return {
    isLoading: isLoading,
    error: error,
    doucument,
    data: {
      pdfFiles: data === null || data === void 0 ? void 0 : data.data
    },
    revalidate: function revalidate() {
      return client.invalidateQueries(["tlDocuments-" + 1, filesArray]);
    }
  };
};


const PDFSvg = ({ width = 20, height = 20, style }) => (
  <svg style={style} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 20 20" fill="gray">
    <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
  </svg>
);

function TLDocument({ value = {} }) {
  const { t } = useTranslation();
  // const isLoading=false
  // const data = {}


  let documents = [];
  documents.push(value && value.owners.documents["ProofOfIdentity"]);
  documents.push(value && value.owners.documents["ProofOfOwnership"]);
  documents.push(value && value.owners.documents["OwnerPhotoProof"]);
  console.log(documents)
  console.log(value && value.owners);
  let isLoading,data;
  try{
    const {  isLoading: loading, isError, error, data:data1, doucument } = TLDocumentSearch(
      {
        value
      },
      { value }
    );
    isLoading=loading;
    data=data1;
    documents=doucument;
  }catch(e){
    console.log(e)
    isLoading=false;
    data={}
  }


  if (isLoading) {
    return <Loader />;
  }

  return (
    <div style={{ marginTop: "19px" }}>
      <React.Fragment>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {documents?.map((document, index) => {
            let documentLink = pdfDownloadLink(data.pdfFiles, document?.fileStoreId);
            return (
              <a target="_" href={documentLink} style={{ minWidth: "100px",marginRight:"10px" }} key={index}>
                <PDFSvg width={85} height={100} style={{ background: "#f6f6f6", padding: "8px" }} />
                <p style={{ marginTop: "8px",textAlign:"center" }}>{t(`TL_${document?.documentType}_LABEL`)}</p>
              </a>
            );
          })}
        </div>
      </React.Fragment>
    </div>
  );
}




const ActionButton = ({ jumpTo }) => {
  const { t } = useTranslation();
  const history = useHistory();
  function routeTo() {
    sessionStorage.setItem("isDirectRenewal", false);
    history.push(jumpTo);
  }
  return (
    <LinkButton
      label={t("CS_COMMON_CHANGE")}
      className="check-page-link-button"
      style={
        jumpTo.includes("proof-of-identity")
          ? { textAlign: "right", marginTop: "-32px" }
          : {}
      }
      onClick={routeTo}
    />
  );
};

const getPath = (path, params) => {
  params &&
    Object.keys(params).map((key) => {
      path = path.replace(`:${key}`, params[key]);
    });
  return path;
};

const TLCheckPage = ({ onSubmit, value }) => {

  
  let isEdit = window.location.href.includes("renew-trade");
  const { t } = useTranslation();
  const history = useHistory();
  const match = useRouteMatch();
  const {
    TradeDetails,
    address,
    owners,
    propertyType,
    subtype,
    pitType,
    pitDetail,
    isEditProperty,
    noofemployees,
    operationalarea,
    tradeLicenseDetail
  } = value;

   const [declaration, setDeclaration] = useState(false)

  useEffect(() => {
    console.log(declaration, "declaration")
   },[declaration])

  function getdate(date) {
    let newdate = Date.parse(date);
    return `${
      new Date(newdate).getDate().toString() +
      "/" +
      (new Date(newdate).getMonth() + 1).toString() +
      "/" +
      new Date(newdate).getFullYear().toString()
    }`;
  }
  const typeOfApplication = !isEditProperty ? `new-application` : `renew-trade`;
  let routeLink = `/digit-ui/citizen/tl/tradelicence/${typeOfApplication}`;
  if (
    window.location.href.includes("edit-application") ||
    window.location.href.includes("renew-trade")
  ) {
    routeLink = `${getPath(match.path, match.params)}`;
    routeLink = routeLink.replace("/check", "");
  }
  return (
    <React.Fragment>
      <Card>
        <CardHeader>{t("CS_CHECK_CHECK_YOUR_ANSWERS")}</CardHeader>
        <CardText>{t("CS_CHECK_CHECK_YOUR_ANSWERS_TEXT")}</CardText>
        {isEdit && (
          <CitizenInfoLabel
            info={t("CS_FILE_APPLICATION_INFO_LABEL")}
            text={t("TL_RENEWAL_INFO_TEXT")}
          />
        )}
        <CardSubHeader>{t("TL_LOCALIZATION_TRADE_DETAILS")}</CardSubHeader>
        <StatusTable>
          <Row
            label={t("TL_LOCALIZATION_TRADE_NAME")}
            text={t(TradeDetails?.TradeName)}
            actionButton={<ActionButton jumpTo={`${routeLink}/TradeName`} />}
          />
          <Row
            label={t("TL_OCCUPANCY_TYPE")}
            text={t(TradeDetails?.OccupancyType?.code || tradeLicenseDetail?.additionalDetail?.occupancyType)}
            actionButton={<ActionButton jumpTo={`${routeLink}/OccupancyType`} />}
          />
           <Row
            label={t("TL_GST_NO")}
            text={t(TradeDetails?.gstNo || tradeLicenseDetail?.additionalDetail?.gstNo)}
            actionButton={<ActionButton jumpTo={`${routeLink}/gst-no`} />}
          />
          <Row
            label={t("TL_NO_OF_EMPLOYEES")}
            text={t(noofemployees?.noofemployees || tradeLicenseDetail?.noOfEmployees)}
            actionButton={<ActionButton jumpTo={`${routeLink}/noofemployees`} />}
          />
           <Row
            label={t("TL_OPERATIONAL_AREA")}
            text={t(operationalarea?.operationalarea || tradeLicenseDetail?.operationalArea)}
            actionButton={<ActionButton jumpTo={`${routeLink}/operationalarea`} />}
          />
          <Row
            label={t("TL_STRUCTURE_TYPE")}
            text={t(`TL_${TradeDetails?.StructureType.code}`)}
            actionButton={
              <ActionButton jumpTo={`${routeLink}/structure-type`} />
            }
          />
          <Row
            label={t("TL_STRUCTURE_SUB_TYPE")}
            text={t(
              TradeDetails?.StructureType.code !== "IMMOVABLE"
                ? TradeDetails?.VehicleType?.i18nKey
                : TradeDetails?.BuildingType?.i18nKey
            )}
            actionButton={
              <ActionButton
                jumpTo={
                  TradeDetails?.VehicleType
                    ? `${routeLink}/vehicle-type`
                    : `${routeLink}/Building-type`
                }
              />
            }
          />
          <Row
            label={t("TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_LABEL")}
            text={t(getdate(TradeDetails?.commencementDate))}
            actionButton={
              <ActionButton jumpTo={`${routeLink}/commencement-date`} />
            }
          />
          {TradeDetails && TradeDetails.units && TradeDetails.units.map((unit, index) => (
            <div key={index}>
              <CardSubHeader>
                {t("TL_UNIT_HEADER")}-{index + 1}
              </CardSubHeader>
              <Row
                label={t("TL_NEW_TRADE_DETAILS_TRADE_CAT_LABEL")}
                text={t(unit?.tradecategory.i18nKey)}
                actionButton={
                  <ActionButton jumpTo={`${routeLink}/units-details`} />
                }
              />
              <Row
                label={t("TL_NEW_TRADE_DETAILS_TRADE_TYPE_LABEL")}
                text={t(unit?.tradetype.i18nKey)}
                actionButton={
                  <ActionButton jumpTo={`${routeLink}/units-details`} />
                }
              />
              <Row
                label={t("TL_NEW_TRADE_DETAILS_TRADE_SUBTYPE_LABEL")}
                text={t(unit?.tradesubtype.i18nKey)}
                actionButton={
                  <ActionButton jumpTo={`${routeLink}/units-details`} />
                }
              />
              <Row
                label={t("TL_UNIT_OF_MEASURE_LABEL")}
                text={`${unit?.unit ? t(unit?.unit) : t("CS_NA")}`}
                actionButton={
                  <ActionButton jumpTo={`${routeLink}/units-details`} />
                }
              />
              <Row
                label={t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL")}
                text={`${unit?.uom ? t(unit?.uom) : t("CS_NA")}`}
                actionButton={
                  <ActionButton jumpTo={`${routeLink}/units-details`} />
                }
              />
              <Row
                label={t("TL_UNITRATE")}
                text={`${unit?.rate ? t(unit?.rate) : ""}`}
              />
            </div>
          ))}
          {TradeDetails && TradeDetails.accessories &&
            TradeDetails.accessories.map((acc, index) => (
              <div key={index}>
                <CardSubHeader>
                  {t("TL_ACCESSORY_LABEL")}-{index + 1}
                </CardSubHeader>
                <Row
                  label={t("TL_TRADE_ACC_HEADER")}
                  text={t(acc?.accessory.i18nKey)}
                  actionButton={
                    <ActionButton jumpTo={`${routeLink}/accessories-details`} />
                  }
                />
                <Row
                  label={t("TL_NEW_TRADE_ACCESSORY_COUNT")}
                  text={t(acc?.accessorycount)}
                  actionButton={
                    <ActionButton jumpTo={`${routeLink}/accessories-details`} />
                  }
                />
                <Row
                  label={t("TL_ACC_UOM_LABEL")}
                  text={`${acc?.unit ? t(acc?.unit) : t("CS_NA")}`}
                  actionButton={
                    <ActionButton jumpTo={`${routeLink}/accessories-details`} />
                  }
                />
                <Row
                  label={t("TL_ACC_UOM_VALUE_LABEL")}
                  text={`${acc?.unit ? t(acc?.uom) : t("CS_NA")}`}
                  actionButton={
                    <ActionButton jumpTo={`${routeLink}/accessories-details`} />
                  }
                />
              </div>
            ))}
          <CardSubHeader>
            {t("TL_NEW_TRADE_DETAILS_HEADER_TRADE_LOC_DETAILS")}
          </CardSubHeader>
          <Row
            label={t("TL_CHECK_ADDRESS")}
            text={`${
              address?.doorNo?.trim() ? `${address?.doorNo?.trim()}, ` : ""
            } ${
              address?.street?.trim() ? `${address?.street?.trim()}, ` : ""
            }${t(address?.locality?.i18nkey)}, ${t(address?.city.code)} ${
              address?.pincode?.trim() ? `,${address?.pincode?.trim()}` : ""
            }`}
            actionButton={<ActionButton jumpTo={`${routeLink}/map`} />}
          />
             <CardSubHeader>{t("TL_NEW_OWNER_DETAILS_HEADER")}</CardSubHeader>
          {isEdit && owners && owners.owners &&
            owners.owners.map((owner, index)=> (
              <div key={index}>
                <CardSubHeader>
                  {t("TL_PAYMENT_PAID_BY_PLACEHOLDER")}-{index + 1}
                </CardSubHeader>
                <Row
                  label={t("TL_COMMON_TABLE_COL_OWN_NAME")}
                  text={t(owner?.name)}
                  actionButton={
                    <ActionButton jumpTo={`${routeLink}/owner-details`} />
                  }
                />
                <Row
                  label={t("TL_NEW_OWNER_DETAILS_GENDER_LABEL")}
                  text={t(owner?.gender?.i18nKey)}
                  actionButton={
                    <ActionButton jumpTo={`${routeLink}/owner-details`} />
                  }
                />
                <Row
                  label={t("TL_MOBILE_NUMBER_LABEL")}
                  text={t(owner?.mobileNumber)}
                  actionButton={
                    <ActionButton jumpTo={`${routeLink}/owner-details`} />
                  }
                />
                <Row
                  label={t("TL_FATHER_OR_HUSBAND_LABEL")}
                  text={t(owner?.fatherOrHusbandName)}
                  actionButton={
                    <ActionButton jumpTo={`${routeLink}/owner-details`} />
                  }
                />
                <Row
                  label={t("TL_RELAIONSHIP_LABEL")}
                  text={t(owner?.relationship?.code)}
                  actionButton={
                    <ActionButton jumpTo={`${routeLink}/owner-details`} />
                  }
                />                
                <Row
                  label={t("TL_TRADE_RELAIONSHIP_LABEL")}
                  text={t(owner?.tradeRelationship?.code)}
                  actionButton={
                    <ActionButton jumpTo={`${routeLink}/owner-details`} />
                  }
                />
                 <Row
                  label={t("TL_PANCARD_LABEL")}
                  text={t(owner?.pan)}
                  actionButton={
                    <ActionButton jumpTo={`${routeLink}/owner-details`} />
                  }
                />
              </div>
            ))}
          {!isEdit && owners && owners.owners &&
            owners.owners.map((owner, index) => (
              <div key={index}>
                <CardSubHeader>
                  {t("TL_PAYMENT_PAID_BY_PLACEHOLDER")}-{index + 1}
                </CardSubHeader>
                <Row
                  label={t("TL_COMMON_TABLE_COL_OWN_NAME")}
                  text={t(owner?.name)}
                  actionButton={
                    <ActionButton jumpTo={`${routeLink}/owner-details`} />
                  }
                />
                <Row
                  label={t("TL_NEW_OWNER_DETAILS_GENDER_LABEL")}
                  text={t(owner?.gender?.i18nKey)}
                  actionButton={
                    <ActionButton jumpTo={`${routeLink}/owner-details`} />
                  }
                />
                <Row
                  label={t("TL_MOBILE_NUMBER_LABEL")}
                  text={t(owner?.mobileNumber)}
                  actionButton={
                    <ActionButton jumpTo={`${routeLink}/owner-details`} />
                  }
                />
                <Row
                  label={t("TL_FATHER_OR_HUSBAND_LABEL")}
                  text={t(owner?.fatherOrHusbandName)}
                  actionButton={
                    <ActionButton jumpTo={`${routeLink}/owner-details`} />
                  }
                />
                <Row
                  label={t("TL_RELAIONSHIP_LABEL")}
                  text={t(owner?.relationship?.code)}
                  actionButton={
                    <ActionButton jumpTo={`${routeLink}/owner-details`} />
                  }
                />                
                <Row
                  label={t("TL_TRADE_RELAIONSHIP_LABEL")}
                  text={t(owner?.tradeRelationship?.code)}
                  actionButton={
                    <ActionButton jumpTo={`${routeLink}/owner-details`} />
                  }
                />
                 <Row
                  label={t("TL_PANCARD_LABEL")}
                  text={t(owner?.pan)}
                  actionButton={
                    <ActionButton jumpTo={`${routeLink}/owner-details`} />
                  }
                />
              </div>
            ))}
          <CardSubHeader>{t("TL_COMMON_DOCS")}</CardSubHeader>
          <ActionButton jumpTo={`${routeLink}/proof-of-identity`} />
          <div>
            {owners?.documents["OwnerPhotoProof"] ? (
              <TLDocument value={value}></TLDocument>
            ) : (
              <StatusTable>
                <Row text="TL_NO_DOCUMENTS_MSG" />
              </StatusTable>
            )}
          </div>
        </StatusTable>

        <div style={{ display: "flex" , padding: "36px 0"}}>
          <CheckBox
            checked={declaration}
            onChange={(e) => setDeclaration(e.target.checked)}
            label={t("TL_DECLARARTION_MESSAGE")}
          />
        </div>

        <SubmitBar
          label={t("CS_COMMON_SUBMIT")}
          onSubmit={onSubmit}
          disabled={!declaration}
        />
      </Card>
    </React.Fragment>
  );
};

// TLGSTNumber



const customize = (props) => {
  window.Digit.ComponentRegistryService.setComponent("TLCheckPage", TLCheckPage);
  return <TLCheckPage {...props}/>
};

export default customize;
