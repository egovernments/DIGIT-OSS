import React from "react";
import { Header, ResponseComposer, Loader } from "@egovernments/digit-ui-react-components";
import PropTypes from "prop-types";
import Axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ChallanSearchResults = ({ template, header, actionButtonLabel }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { mobileNumber, challanNo, Servicecategory,tenantId } = Digit.Hooks.useQueryParams();
  const filters = {};
  if (mobileNumber) filters.mobileNumber = mobileNumber;
  if (challanNo) filters.consumerCode = challanNo;
  if (Servicecategory) filters.businesService = Servicecategory;

  const result = Digit.Hooks.mcollect.useMcollectSearchBill({ tenantId, filters });
  let bills = result?.data?.Bills;

  if (result.isLoading) {
    return <Loader />;
  }


  const onSubmit = (data) => {
 history.push(`/digit-ui/citizen/payment/my-bills/${data?.businesService}/${data?.ChannelNo}?workflow=mcollect`);
  };

  const payment = {};

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
      total_due: bill.status === "ACTIVE" ? bill.totalAmount : 0,
      OwnerName: bill.payerName || t("CS_NA"),
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
        <ResponseComposer data={searchResults} template={template} actionButtonLabel={actionButtonLabel} onSubmit={onSubmit} />
      </div>
    </div>
  );
};

ChallanSearchResults.propTypes = {
  template: PropTypes.any,
  header: PropTypes.string,
  actionButtonLabel: PropTypes.string,
};

ChallanSearchResults.defaultProps = {
  template: [],
  header: null,
  actionButtonLabel: null,
};

export default ChallanSearchResults;
