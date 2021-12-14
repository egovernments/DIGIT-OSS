import { TelePhone, CheckPoint } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const PendingAtLME = ({ name, isCompleted, mobile, text, customChild }) => {
  let { t } = useTranslation();
  return <CheckPoint label={t("CS_COMMON_PENDINGATLME")} isCompleted={isCompleted} customChild={
          <div>
            {name && mobile ? <TelePhone mobile={mobile} text={`${text} ${name}`}/> : null } 
            {customChild}
          </div>
        } />
};

export default PendingAtLME;
