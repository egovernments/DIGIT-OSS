import {
  Card,
  CardHeader,
  Header,
  CardSubHeader,
  CardText,
  CitizenInfoLabel,
  EditIcon,
  LinkButton,
  Row,
  StatusTable,
  SubmitBar,
} from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch, Link } from "react-router-dom";
import TLDocument from "../../../pageComponents/TLDocumets";
import Timeline from "../../../components/TLTimeline";
const getPath = (path, params) => {
  params &&
    Object.keys(params).map((key) => {
      path = path.replace(`:${key}`, params[key]);
    });
  return path;
};
function routeTo(jumpTo) {
  location.href = jumpTo;
}

const CheckPage = (props) => {
  if (localStorage.getItem("TLAppSubmitEnabled") !== "true") {
    // window.history.forward();
    window.location.replace("/digit-ui/citizen");
    return null;
  }
  return <WrapCheckPage {...props} />;
};
const WrapCheckPage = ({ onSubmit, value }) => {
  let isEdit = window.location.href.includes("renew-trade");
  const { t } = useTranslation();
  const history = useHistory();
  const match = useRouteMatch();
  const { TradeDetails, address, owners, propertyType, subtype, pitType, pitDetail, isEditProperty, cpt } = value;
  function getdate(date) {
    let newdate = Date.parse(date);
    return `${
      new Date(newdate).getDate().toString() + "/" + (new Date(newdate).getMonth() + 1).toString() + "/" + new Date(newdate).getFullYear().toString()
    }`;
  }
  useEffect(() => {
    return () => {
      localStorage.setItem("TLAppSubmitEnabled", "false");
    };
  }, []);
  const typeOfApplication = !isEditProperty ? `new-application` : `renew-trade`;
  let routeLink = `/digit-ui/citizen/tl/tradelicence/${typeOfApplication}`;
  if (window.location.href.includes("edit-application") || window.location.href.includes("renew-trade")) {
    routeLink = `${getPath(match.path, match.params)}`;
    routeLink = routeLink.replace("/check", "");
  }
  return (
    <React.Fragment>
      {window.location.href.includes("/citizen") ? <Timeline currentStep={4} /> : null}

      <Header styles={{ fontSize: "32px" }}>{t("TL_COMMON_SUMMARY")}</Header>
      <Card style={{ paddingRight: "16px" }}>
        <CardHeader styles={{ fontSize: "28px" }}>{t("TL_LOCALIZATION_TRADE_DETAILS")}</CardHeader>
        <StatusTable>
          <LinkButton
            label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
            style={{ width: "100px", display: "inline" }}
            onClick={() => routeTo(`${routeLink}/TradeName`)}
          />
          <Row
            className="border-none"
            textStyle={{ marginRight: "-10px" }}
            label={t("TL_LOCALIZATION_TRADE_NAME")}
            text={t(TradeDetails?.TradeName)}
          />
          <Row className="border-none" label={t("TL_STRUCTURE_TYPE")} text={t(`TL_${TradeDetails?.StructureType.code}`)} />
          <Row
            className="border-none"
            label={t("TL_STRUCTURE_SUB_TYPE")}
            text={t(TradeDetails?.StructureType.code !== "IMMOVABLE" ? TradeDetails?.VehicleType?.i18nKey : TradeDetails?.BuildingType?.i18nKey)}
          />
          <Row className="border-none" label={t("TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_LABEL")} text={t(getdate(TradeDetails?.CommencementDate))} />
          {TradeDetails?.units.map((unit, index) => (
            <div key={index}>
              <CardSubHeader>
                {t("TL_UNIT_HEADER")}-{index + 1}
              </CardSubHeader>
              <Row className="border-none" label={t("TL_NEW_TRADE_DETAILS_TRADE_CAT_LABEL")} text={t(unit?.tradecategory?.i18nKey)} />
              <Row className="border-none" label={t("TL_NEW_TRADE_DETAILS_TRADE_TYPE_LABEL")} text={t(unit?.tradetype?.i18nKey)} />
              <Row className="border-none" label={t("TL_NEW_TRADE_DETAILS_TRADE_SUBTYPE_LABEL")} text={t(unit?.tradesubtype?.i18nKey)} />
              <Row className="border-none" label={t("TL_UNIT_OF_MEASURE_LABEL")} text={`${unit?.unit ? t(unit?.unit) : t("CS_NA")}`} />
              <Row className="border-none" label={t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL")} text={`${unit?.uom ? t(unit?.uom) : t("CS_NA")}`} />
            </div>
          ))}
          {TradeDetails?.accessories &&
            TradeDetails?.accessories.map((acc, index) => (
              <div key={index}>
                <CardSubHeader>
                  {t("TL_ACCESSORY_LABEL")}-{index + 1}
                </CardSubHeader>
                <Row className="border-none" label={t("TL_TRADE_ACC_HEADER")} text={t(acc?.accessory?.i18nKey)} />
                <Row className="border-none" label={t("TL_NEW_TRADE_ACCESSORY_COUNT")} text={t(acc?.accessorycount)} />
                <Row className="border-none" label={t("TL_ACC_UOM_LABEL")} text={`${acc?.unit ? t(acc?.unit) : t("CS_NA")}`} />
                <Row className="border-none" label={t("TL_ACC_UOM_VALUE_LABEL")} text={`${acc?.unit ? t(acc?.uom) : t("CS_NA")}`} />
              </div>
            ))}
        </StatusTable>
      </Card>
      { !(TradeDetails?.StructureType.code === "MOVABLE") && <Card>
        <StatusTable>
          <CardHeader styles={{ fontSize: "28px" }}>{t("TL_NEW_TRADE_DETAILS_HEADER_TRADE_LOC_DETAILS")}</CardHeader>
          {cpt && cpt.details && cpt.details.propertyId ? (
            <React.Fragment>
              <LinkButton
                label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
                style={{ width: "100px", display: "inline" }}
                onClick={() => routeTo(`${routeLink}/know-your-property`)}
              />
              <Row
                className="border-none"
                textStyle={{ marginRight: "-10px" }}
                label={t("TL_PROPERTY_ID")}
                text={`${cpt.details.propertyId?.trim()}`}
              />
              <Row
                className="border-none"
                label={t("TL_CHECK_ADDRESS")}
                text={`${cpt.details?.address?.doorNo?.trim() ? `${cpt.details?.address?.doorNo?.trim()}, ` : ""} ${
                  cpt.details?.address?.street?.trim() ? `${cpt.details?.address?.street?.trim()}, ` : ""
                } ${cpt.details?.address?.buildingName?.trim() ? `${cpt.details?.address?.buildingName?.trim()}, ` : ""}
              ${t(cpt.details?.address?.locality?.name)}, ${t(cpt.details?.address?.city)} ${
                  cpt.details?.address?.pincode?.trim() ? `,${cpt.details?.address?.pincode?.trim()}` : ""
                }`}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <LinkButton
                label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
                style={{ width: "100px", display: "inline" }}
                onClick={() => routeTo(`${routeLink}/map`)}
              />
              <Row
                className="border-none"
                label={t("TL_CHECK_ADDRESS")}
                text={`${address?.doorNo?.trim() ? `${address?.doorNo?.trim()}, ` : ""} ${
                  address?.street?.trim() ? `${address?.street?.trim()}, ` : ""
                }${t(address?.locality?.i18nkey)}, ${t(address?.city.code)} ${address?.pincode?.trim() ? `,${address?.pincode?.trim()}` : ""}`}
              />
            </React.Fragment>
          )}
        </StatusTable>
        <div style={{ textAlign: "left" }}>
          <Link to={`/digit-ui/citizen/commonpt/view-property?propertyId=${cpt?.details?.propertyId}&tenantId=${cpt?.details?.tenantId}`}>
            <LinkButton style={{ textAlign: "left" }} label={t("TL_VIEW_PROPERTY")} />
          </Link>
        </div>
      </Card>}
      <Card>
        <StatusTable>
          <CardHeader styles={{ fontSize: "28px" }}>{t("TL_NEW_OWNER_DETAILS_HEADER")}</CardHeader>
          <LinkButton
            label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
            style={{ width: "100px", display: "inline" }}
            onClick={() => routeTo(`${routeLink}/owner-details`)}
          />
          {owners.owners &&
            owners.owners.map((owner, index) => (
              <div key={index}>
                <CardSubHeader>
                  {t("TL_PAYMENT_PAID_BY_PLACEHOLDER")}-{index + 1}
                </CardSubHeader>
                <Row className="border-none" label={t("TL_COMMON_TABLE_COL_OWN_NAME")} text={t(owner?.name)} />
                <Row className="border-none" label={t("TL_NEW_OWNER_DETAILS_GENDER_LABEL")} text={t(owner?.gender?.i18nKey) || t("CS_NA")} />
                <Row className="border-none" label={t("TL_MOBILE_NUMBER_LABEL")} text={t(owner?.mobilenumber)} />
                <Row className="border-none" label={t("TL_GUARDIAN_S_NAME_LABEL")} text={t(owner?.fatherOrHusbandName) || t("CS_NA")} />
                <Row className="border-none" label={t("TL_RELATIONSHIP_WITH_GUARDIAN_LABEL")} text={t(owner?.relationship?.i18nKey) || t("CS_NA")} />
                <Row
                  className="border-none"
                  label={t("TL_CORRESPONDENCE_ADDRESS")}
                  labelStyle={{ marginRight: "2px" }}
                  text={t(owners?.permanentAddress) || t("CS_NA")}
                />
              </div>
            ))}
        </StatusTable>
      </Card>
      <Card>
        <StatusTable>
          <CardHeader styles={{ fontSize: "28px" }}>{t("TL_COMMON_DOCS")}</CardHeader>
          <LinkButton
            label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
            style={{ width: "100px", display: "inline" }}
            onClick={() => routeTo(`${routeLink}/proof-of-identity`)}
          />
          <div>
            {owners?.documents["OwnerPhotoProof"] || owners?.documents["ProofOfIdentity"] || owners?.documents["ProofOfOwnership"] ? (
              <TLDocument value={value}></TLDocument>
            ) : (
              <StatusTable>
                <Row className="border-none" text={t("TL_NO_DOCUMENTS_MSG")} />
              </StatusTable>
            )}
          </div>
        </StatusTable>
        <SubmitBar label={t("CS_COMMON_SUBMIT")} onSubmit={onSubmit} />
      </Card>
    </React.Fragment>
  );
};

export default CheckPage;
