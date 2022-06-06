import {Header}from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
const CancelBill = () => {
    const { t } = useTranslation();
return(
<Header>{t("ACTION_TEST_CANCEL_BILL")}</Header>
);
};
export default CancelBill; 