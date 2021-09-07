import React from "react";
import { Header, Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

import MyReceipt from "./my-receipt";

export const MyReceipts = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { info: userInfo } = Digit.UserService.getUser();

  const applicationsList = [
    {
      trasactionId: "123",
      serviceCategory: "Property Tax",
      amountPaid: "₹15000",
      paymentDate: new Date().toLocaleDateString(),
    },
    {
      trasactionId: "123",
      serviceCategory: "Property Tax",
      amountPaid: "₹15000",
      paymentDate: new Date().toLocaleDateString(),
    },
    {
      trasactionId: "123",
      serviceCategory: "Property Tax",
      amountPaid: "₹15000",
      paymentDate: new Date().toLocaleDateString(),
    },
  ];

  return (
    <React.Fragment>
      <Header>{t("CS_TITLE_MY_RECEIPTS")}</Header>
      {applicationsList?.length > 0 &&
        applicationsList.map((application, index) => (
          <div key={index}>
            <MyReceipt {...{ application }} />
          </div>
        ))}
    </React.Fragment>
  );
};
