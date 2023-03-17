import React from "react";
import {
  Card,
  CardCaption,
  CardHeader,
  CardLabel,
  CardSubHeader,
  StatusTable,
  Row,
  ActionLinks,
  LinkButton,
  SubmitBar,
  CardText,
  CitizenInfoLabel,
} from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Timeline from "../../../components/TLTimelineInFSM";

const ActionButton = ({ jumpTo }) => {
  const { t } = useTranslation();
  const history = useHistory();

  function routeTo() {
    history.push(jumpTo);
  }

  return <LinkButton label={t("CS_COMMON_CHANGE")} className="check-page-link-button" onClick={routeTo} />;
};

const CheckPage = ({ onSubmit, value }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const { address, propertyType, subtype, pitType, pitDetail, selectGender, selectPaymentPreference, selectTripNo } = value;

  const pitDetailValues = pitDetail ? Object.values(pitDetail).filter((value) => !!value) : null;

  const pitMeasurement = pitDetailValues?.reduce((previous, current, index, array) => {
    if (index === array.length - 1) {
      return previous + current + "m";
    } else {
      return previous + current + "m x ";
    }
  }, "");

  return (
    <React.Fragment>
      <Timeline currentStep={4} flow="APPLY" />
      <Card>
        <CardHeader>{t("CS_CHECK_CHECK_YOUR_ANSWERS")}</CardHeader>
        <CardText>{t("CS_CHECK_CHECK_YOUR_ANSWERS_TEXT")}</CardText>
        <CardSubHeader>{t("CS_CHECK_PROPERTY_DETAILS")}</CardSubHeader>
        <StatusTable>
          {selectTripNo && selectTripNo?.tripNo && (
            <Row
              label={t("ES_FSM_ACTION_NUMBER_OF_TRIPS")}
              text={t(selectTripNo?.tripNo?.i18nKey)}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/select-trip-number" />}
            />
          )}
          {selectTripNo && selectTripNo?.vehicleCapacity && (
            <Row
              label={t("ES_VEHICLE CAPACITY")}
              text={t(selectTripNo?.vehicleCapacity?.capacity)}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/select-trip-number" />}
            />
          )}
          {selectGender && (
            <Row
              label={t("ES_FSM_ACTION_GENDER_TYPE")}
              text={t(selectGender.i18nKey)}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/select-gender" />}
            />
          )}
          <Row
            label={t("CS_CHECK_PROPERTY_TYPE")}
            text={t(propertyType.i18nKey)}
            actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/property-type" />}
          />
          <Row
            label={t("CS_CHECK_PROPERTY_SUB_TYPE")}
            text={t(subtype.i18nKey)}
            actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/property-subtype" />}
          />
          <Row
            label={t("CS_CHECK_ADDRESS")}
            text={`${address?.doorNo?.trim() ? `${address?.doorNo?.trim()}, ` : ""} ${
              address?.street?.trim() ? `${address?.street?.trim()}, ` : ""
            }${t(address?.locality?.i18nkey)}, ${t(address?.city.code)}`}
            actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/pincode" />}
          />
          {address?.landmark?.trim() && (
            <Row
              label={t("CS_CHECK_LANDMARK")}
              text={address?.landmark?.trim()}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/landmark" />}
            />
          )}
          {address?.slumArea?.code === true && (
            <Row
              label={t("CS_APPLICATION_DETAILS_SLUM_NAME")}
              text={t(address?.slumData?.i18nKey)}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/slum-details" />}
            />
          )}
          {pitType && (
            <Row
              label={t("CS_CHECK_PIT_TYPE")}
              text={t(pitType.i18nKey)}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/pit-type" />}
            />
          )}
          {pitMeasurement && (
            <Row
              label={t("CS_CHECK_SIZE")}
              text={[pitMeasurement]}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/tank-size" />}
            />
          )}
          {(selectPaymentPreference?.advanceAmount || selectPaymentPreference?.advanceAmount === 0) && (
            <Row
              label={t("ADV_AMOUNT")}
              text={"₹ " + t(selectPaymentPreference?.advanceAmount)}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/select-payment-preference" />}
            />
          )}
        </StatusTable>
        {/* <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("CS_CHECK_INFO_TEXT")} /> */}
        <SubmitBar label={t("CS_COMMON_SUBMIT")} onSubmit={onSubmit} />
      </Card>
      {propertyType && (
        <CitizenInfoLabel
          style={{ marginTop: "8px", padding: "16px" }}
          info={t("CS_FILE_APPLICATION_INFO_LABEL")}
          text={t("CS_FILE_APPLICATION_INFO_TEXT", { content: t("CS_DEFAULT_INFO_TEXT"), ...propertyType })}
        />
      )}
    </React.Fragment>
  );
};

export default CheckPage;
