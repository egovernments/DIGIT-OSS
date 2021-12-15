import React, { Fragment } from "react";
import { Card, CardHeader, SubmitBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const WSDocsRequired = ({ onSelect, onSkip, config }) => {
  const { t } = useTranslation();
  const goNext = () => {
    onSelect("DocsReq", "");
  }

  return (
    <Fragment>
      <Card>
        <CardHeader>{t("WS_COMMON_APPL_NEW_CONNECTION")}</CardHeader>
        <SubmitBar label={t(`CS_COMMON_NEXT`)} onSubmit={goNext} />
      </Card>
    </Fragment>
  );
};

export default WSDocsRequired;