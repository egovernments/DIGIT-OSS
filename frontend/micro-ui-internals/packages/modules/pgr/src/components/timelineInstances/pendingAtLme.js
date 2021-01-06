import { TelePhone } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const PendingAtLME = ({ name, mobile, text }) => {
  let { t } = useTranslation();
  return name && mobile ? (
    <React.Fragment>
      <TelePhone mobile={mobile} text={`${text} ${name}`} />
    </React.Fragment>
  ) : (
    <span>{t("CS_COMMON_PENDINGATLME")}</span>
  );
};

export default PendingAtLME;
