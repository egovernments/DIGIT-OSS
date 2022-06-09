import {Header}from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
const DownloadBill = () => {
    const { t } = useTranslation();
return(
<Header>{t("ACTION_TEST_DOWNLOAD_BILL_PDF")}</Header>
);
};
export default DownloadBill; 