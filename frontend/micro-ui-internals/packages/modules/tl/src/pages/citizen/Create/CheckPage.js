import {
  Card, CardHeader, CardSubHeader, CardText,
  CitizenInfoLabel, LinkButton, Row, StatusTable, SubmitBar
} from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";
import TLDocument from "../../../pageComponents/TLDocumets";

const ActionButton = ({ jumpTo }) => {
  const { t } = useTranslation();
  const history = useHistory();
  function routeTo() {
    sessionStorage.setItem("isDirectRenewal", false);
    history.push(jumpTo);
  }
  return <LinkButton label={t("CS_COMMON_CHANGE")} className="check-page-link-button" onClick={routeTo} />;
};

const getPath = (path, params) => {
  params && Object.keys(params).map(key => {
    path = path.replace(`:${key}`, params[key]);
  })
  return path;
}

const CheckPage = ({ onSubmit, value }) => {
  let isEdit = window.location.href.includes("renew-trade");
  const { t } = useTranslation();
  const history = useHistory();
  const match = useRouteMatch();
  const { TradeDetails, address, owners, propertyType, subtype, pitType, pitDetail, isEditProperty } = value;
  function getdate(date) {
    let newdate = Date.parse(date);
    return `${new Date(newdate).getDate().toString() + "/" + (new Date(newdate).getMonth() + 1).toString() + "/" + new Date(newdate).getFullYear().toString()
      }`;
  }
  const typeOfApplication = !isEditProperty ? `new-application` : `renew-trade`;
  let routeLink = `/digit-ui/citizen/tl/tradelicence/${typeOfApplication}`;
  if (window.location.href.includes("edit-application") || window.location.href.includes("renew-trade")) {
    routeLink = `${getPath(match.path, match.params)}`;
    routeLink = routeLink.replace('/check', '');
  }
  return (
    <Card>
      <CardHeader>{t("CS_CHECK_CHECK_YOUR_ANSWERS")}</CardHeader>
      <CardText>{t("CS_CHECK_CHECK_YOUR_ANSWERS_TEXT")}</CardText>
      {isEdit && <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("TL_RENEWAL_INFO_TEXT")} />}
      <CardSubHeader>{t("TL_LOCALIZATION_TRADE_DETAILS")}</CardSubHeader>
      <StatusTable>
        <Row
          label={t("TL_LOCALIZATION_TRADE_NAME")}
          text={t(TradeDetails?.TradeName)}
          actionButton={<ActionButton jumpTo={`${routeLink}/TradeName`} />}
        />
        <Row
          label={t("TL_STRUCTURE_TYPE")}
          text={t(`TL_${TradeDetails?.StructureType.code}`)}
          actionButton={<ActionButton jumpTo={`${routeLink}/structure-type`} />}
        />
        <Row
          label={t("TL_STRUCTURE_SUB_TYPE")}
          text={t(TradeDetails?.VehicleType ? TradeDetails?.VehicleType.i18nKey : TradeDetails?.BuildingType.i18nKey)}
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
          text={t(getdate(TradeDetails?.CommencementDate))}
          actionButton={<ActionButton jumpTo={`${routeLink}/commencement-date`} />}
        />
        {TradeDetails.units.map((unit, index) => (
          <div key={index}>
            <CardSubHeader>
              {t("TL_UNIT_HEADER")}-{index + 1}
            </CardSubHeader>
            <Row
              label={t("TL_NEW_TRADE_DETAILS_TRADE_CAT_LABEL")}
              text={t(unit?.tradecategory.i18nKey)}
              actionButton={<ActionButton jumpTo={`${routeLink}/units-details`} />}
            />
            <Row
              label={t("TL_NEW_TRADE_DETAILS_TRADE_TYPE_LABEL")}
              text={t(unit?.tradetype.i18nKey)}
              actionButton={<ActionButton jumpTo={`${routeLink}/units-details`} />}
            />
            <Row
              label={t("TL_NEW_TRADE_DETAILS_TRADE_SUBTYPE_LABEL")}
              text={t(unit?.tradesubtype.i18nKey)}
              actionButton={<ActionButton jumpTo={`${routeLink}/units-details`} />}
            />
            <Row
              label={t("TL_UNIT_OF_MEASURE_LABEL")}
              text={ `${unit?.unit ? t(unit?.unit):"NA"}`}
              actionButton={<ActionButton jumpTo={`${routeLink}/units-details`} />}
            />
            <Row
              label={t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL")}
              text={`${unit?.uom ? t(unit?.uom):"NA"}`}
              actionButton={<ActionButton jumpTo={`${routeLink}/units-details`} />}
            />
          </div>
        ))}
        {TradeDetails.accessories &&
          TradeDetails.accessories.map((acc, index) => (
            <div key={index}>
              <CardSubHeader>
                {t("TL_ACCESSORY_LABEL")}-{index + 1}
              </CardSubHeader>
              <Row
                label={t("TL_TRADE_ACC_HEADER")}
                text={t(acc?.accessory.i18nKey)}
                actionButton={<ActionButton jumpTo={`${routeLink}/accessories-details`} />}
              />
              <Row
                label={t("TL_NEW_TRADE_ACCESSORY_COUNT")}
                text={t(acc?.accessorycount)}
                actionButton={<ActionButton jumpTo={`${routeLink}/accessories-details`} />}
              />
              <Row
                label={t("TL_ACC_UOM_LABEL")}
                text={`${acc?.unit ? t(acc?.unit):"NA"}`}
                actionButton={<ActionButton jumpTo={`${routeLink}/accessories-details`} />}
              />
              <Row
                label={t("TL_ACC_UOM_VALUE_LABEL")}
                text={`${acc?.unit ?t(acc?.uom):"NA"}`}
                actionButton={<ActionButton jumpTo={`${routeLink}/accessories-details`} />}
              />
            </div>
          ))}
        <CardSubHeader>{t("TL_NEW_TRADE_DETAILS_HEADER_TRADE_LOC_DETAILS")}</CardSubHeader>
        <Row
          label={t("TL_CHECK_ADDRESS")}
          text={`${address?.doorNo?.trim() ? `${address?.doorNo?.trim()}, ` : ""} ${address?.street?.trim() ? `${address?.street?.trim()}, ` : ""}${t(
            address?.locality?.i18nkey
          )}, ${t(address?.city.code)} ${address?.pincode?.trim() ? `,${address?.pincode?.trim()}` : ""}`}
          actionButton={<ActionButton jumpTo={`${routeLink}/map`} />}
        />
        <CardSubHeader>{t("TL_NEW_OWNER_DETAILS_HEADER")}</CardSubHeader>
        {owners.owners &&
          owners.owners.map((owner, index) => (
            <div key={index}>
              <CardSubHeader>
                {t("TL_PAYMENT_PAID_BY_PLACEHOLDER")}-{index + 1}
              </CardSubHeader>
              <Row
                label={t("TL_COMMON_TABLE_COL_OWN_NAME")}
                text={t(owner?.name)}
                actionButton={<ActionButton jumpTo={`${routeLink}/owner-details`} />}
              />
              <Row
                label={t("TL_NEW_OWNER_DETAILS_GENDER_LABEL")}
                text={t(owner?.gender?.i18nKey)}
                actionButton={<ActionButton jumpTo={`${routeLink}/owner-details`} />}
              />
              <Row
                label={t("TL_MOBILE_NUMBER_LABEL")}
                text={t(owner?.mobilenumber)}
                actionButton={<ActionButton jumpTo={`${routeLink}/owner-details`} />}
              />
            </div>
          ))}
        <CardSubHeader>{t("TL_COMMON_DOCS")}</CardSubHeader>
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
      <SubmitBar label={t("CS_COMMON_SUBMIT")} onSubmit={onSubmit} />
    </Card>
  );
};

export default CheckPage;
