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

  const { city_complaint, propertyType, subtype, pitDetail } = value;

  return (
    <Card>
      <CardHeader>{t("CS_CHECK_CHECK_YOUR_ANSWERS")}</CardHeader>
      <CardSubHeader>{t("CS_CHECK_PROPERTY_DETAILS")}</CardSubHeader>
      <StatusTable>
        <Row
          label={t("CS_CHECK_PROPERTY_TYPE")}
          text={propertyType.name}
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/property-type" />}
        />
        <Row
          label={t("CS_CHECK_PROPERTY_SUB_TYPE")}
          text={subtype.name}
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/property-subtype" />}
        />
        <Row
          label={t("CS_CHECK_ADDRESS")}
          text={city_complaint.address}
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/pincode" />}
        />
      </StatusTable>
      <CardSubHeader>{t("CS_CHECK_PIT_SEPTIC_TANK_DETAILS")}</CardSubHeader>
      <StatusTable>
        <Row
          label={t("CS_CHECK_SIZE")}
          text={Object.values(pitDetail).join(" x ")}
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/tank-size" />}
        />
      </StatusTable>
      <CitizenInfoLabel info={t("CS_CHECK_INFO_TITLE")} text={t("CS_CHECK_INFO_TEXT")} />
      <SubmitBar label="Submit" onSubmit={onSubmit} />
    </Card>
  );
};

export default CheckPage;
