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
} from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ActionButton = ({ jumpTo }) => {
  const { t } = useTranslation();
  const history = useHistory();

  function routeTo() {
    history.push(jumpTo);
  }

  return <LinkButton label={t("CS_CHANGE")} style={{ color: "#F47738" }} onClick={routeTo} />;
};

const CheckPage = ({ onSubmit }) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <Card>
      <CardHeader>{t("CS_CHECK_YOUR_ANSWERS")}</CardHeader>
      <CardSubHeader>{t("CS_PROPERTY_DETAILS")}</CardSubHeader>
      <StatusTable>
        <Row
          label={t("CS_PROPERTY_TYPE")}
          text="Residential"
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/property-type" />}
        />
        <Row
          label={t("CS_PROPERTY_SUB_TYPE")}
          text="Apartment"
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/property-subtype" />}
        />
        <Row
          label={t("CS_ADDRESS")}
          text="Back side Post Office Patiala Road Alakapuri Berhampur"
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/pincode" />}
        />
      </StatusTable>
      <CardSubHeader>{t("CS_PIT_SEPTIC_TANK_DETAILS")}</CardSubHeader>
      <StatusTable>
        <Row label={t("CS_SIZE")} text="1m x 1m x 1m" actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/tank-size" />} />
      </StatusTable>
      <SubmitBar label="Submit" onSubmit={onSubmit} />
    </Card>
  );
};

export default CheckPage;
