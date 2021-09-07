import { TelePhone, CheckPoint } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const PendingAtLME = ({ name, isCompleted, mobile, text }) => {
  let { t } = useTranslation();
  return name && mobile ? (
    <CheckPoint isCompleted={isCompleted} customChild={<TelePhone mobile={mobile} text={`${text} ${name}`} />} />
  ) : (
    <CheckPoint label={t("CS_COMMON_PENDINGATLME")} />
  );
};

export default PendingAtLME;
