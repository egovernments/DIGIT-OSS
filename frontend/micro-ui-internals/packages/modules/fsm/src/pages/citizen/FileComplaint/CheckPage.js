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
  CitizenInfoLabel,
  CardText,
} from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ActionButton = ({ jumpTo }) => {
  const { t } = useTranslation();
  const history = useHistory();

  function routeTo() {
    history.push(jumpTo);
  }

  return <LinkButton label={t("CS_COMMON_CHANGE")} style={{ color: "#F47738" }} onClick={routeTo} />;
};

const CheckPage = ({ onSubmit, value }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const { city_complaint, locality_complaint, landmark, propertyType, subtype, pitDetail } = value;

  const pitMeasurement = Object.values(pitDetail).reduce((previous, current, index, array) => {
    if (index === array.length - 1) {
      return previous + current + "m";
    } else {
      return previous + current + "m X ";
    }
  }, "");

  return (
    <Card>
      <CardHeader>{t("CS_CHECK_CHECK_YOUR_ANSWERS")}</CardHeader>
      <CardText>{t("CS_CHECK_CHECK_YOUR_ANSWERS_TEXT")}</CardText>
      <CardSubHeader>{t("CS_CHECK_PROPERTY_DETAILS")}</CardSubHeader>
      <StatusTable>
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
          text={`${t(locality_complaint.code)} ${t(city_complaint.code)}`}
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/pincode" />}
        />
        {landmark && (
          <Row
            label={t("CS_CHECK_LANDMARK")}
            text={landmark}
            actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/landmark" />}
          />
        )}
      </StatusTable>
      <CardSubHeader>{t("CS_CHECK_PIT_SEPTIC_TANK_DETAILS")}</CardSubHeader>
      <StatusTable>
        <Row
          label={t("CS_CHECK_SIZE")}
          text={pitMeasurement}
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/tank-size" />}
        />
      </StatusTable>
      <CitizenInfoLabel info={t("CS_CHECK_INFO_TITLE")} text={t("CS_CHECK_INFO_TEXT")} />
      <SubmitBar label="Submit" onSubmit={onSubmit} />
    </Card>
  );
};

export default CheckPage;
