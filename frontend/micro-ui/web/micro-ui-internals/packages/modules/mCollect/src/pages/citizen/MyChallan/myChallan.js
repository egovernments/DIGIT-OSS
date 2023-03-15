import React, { useState, useEffect } from "react";
import { Header, ResponseComposer, Loader } from "@egovernments/digit-ui-react-components";
import PropTypes from "prop-types";
import Axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MyChallanResult = ({ template, header, actionButtonLabel }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const filters = {};
  const userInfo = Digit.UserService.getUser();
  const tenantId = userInfo?.info?.tenantId;

  filters.mobileNumber = userInfo?.info?.mobileNumber;

  const result = Digit.Hooks.mcollect.useMcollectSearchBill({ tenantId, filters });

  const onSubmit = (data) => {
   history.push(`/digit-ui/citizen/payment/my-bills/${data?.businesService}/${data?.ChannelNo}?workflow=mcollect`);
  };

  const payment = {};
  function getBillingPeriod(fromPeriod, toPeriod) {
    if (fromPeriod && toPeriod) {
      let from =
        new Date(fromPeriod).getDate() +
        " " +
        Digit.Utils.date.monthNames[new Date(fromPeriod).getMonth()] +
        " " +
        new Date(fromPeriod).getFullYear();
      let to =
        new Date(toPeriod).getDate() + " " + Digit.Utils.date.monthNames[new Date(toPeriod).getMonth()] + " " + new Date(toPeriod).getFullYear();
      return from + " - " + to;
    } else return "N/A";
  }

  /* paymentDetails?.data?.Bill?.forEach((element) => {
    if (element?.consumerCode) {
      payment[element?.consumerCode] = {
        total_due: element?.totalAmount,
        bil_due__date: new Date(element?.billDate).toDateString(),
      };
    }
  }); */

  const searchResults = result?.data?.Bills?.map((bill) => {
    return {
      businesService: bill.businessService,
      total_due:bill.status === "ACTIVE" ? bill.totalAmount : 0 ,
      OwnerName: bill.payerName || t("CS_NA"),
      BillingPeriod: getBillingPeriod(bill.billDetails[0].fromPeriod, bill.billDetails[0].toPeriod),
      //bil_due__date: bill.billDetails[0].expiryDate || 0,
      bil_due__date: `${
        new Date(bill.billDetails[0].expiryDate).getDate().toString() +
        "/" +
        (new Date(bill.billDetails[0].expiryDate).getMonth() + 1).toString() +
        "/" +
        new Date(bill.billDetails[0].expiryDate).getFullYear().toString()
      }`,
      ChannelNo: bill?.consumerCode || t("CS_NA"),
      ServiceCategory: bill.businessService ? bill.businessService.split(".")[bill.businessService.split(".").length - 1] : t("CS_NA"),
    };
  });

  return (
    <div style={{ marginTop: "16px" }}>
      <div >
        {header && (
          <Header style={{ marginLeft: "8px" }}>
            {t(header)} ({searchResults?.length})
          </Header>
        )}
        <div >
          <ResponseComposer data={searchResults} template={template} actionButtonLabel={actionButtonLabel} onSubmit={onSubmit} />
        </div>
      </div>

      <div style={{ marginLeft: "16px", marginTop: "16px", marginBottom: "46px" }}>
        <p>{t("UC_NOT_ABLE_TO_FIND_BILL_MSG")} </p>
        <p className="link">
          <Link to="/digit-ui/citizen/mcollect/search">{t("UC_CLICK_HERE_TO_SEARCH_LINK")}</Link>
        </p>
      </div>
    </div>
  );
};

MyChallanResult.propTypes = {
  template: PropTypes.any,
  header: PropTypes.string,
  actionButtonLabel: PropTypes.string,
};

MyChallanResult.defaultProps = {
  template: [],
  header: null,
  actionButtonLabel: null,
};

export default MyChallanResult;
