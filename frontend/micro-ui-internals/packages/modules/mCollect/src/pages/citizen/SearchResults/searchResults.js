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
  //filters.url = "egov-searcher/bill-genie/mcollectbills/_get"

  //const tenantId = Digit.ULBService.getCurrentTenantId();
  // const userInfo = Digit.UserService.getUser();
  // let tenantId = userInfo?.info?.permanentCity;
  // tenantId = tenantId;
  const result = Digit.Hooks.mcollect.useMcollectSearchBill({ tenantId, filters });
  //const result = await Axios.post(`https://qa.digit.org/egov-searcher/bill-genie/mcollectbills/_get?`, {"searchCriteria":{"tenantId":"pb.amritsar","mobileNumber":"7878787878","businesService":"ADVT.Hoardings"},"RequestInfo":{"apiId":"Rainmaker","authToken":"1fff79b7-694d-4b18-8a6f-2dbdac1531aa"}})
  let bills = result?.data?.Bills;
  //const consumerCode = result?.data?.Properties?.map((a) => a.propertyId).join(",");

  /* const paymentDetails = Digit.Hooks.useFetchCitizenBillsForBuissnessService(
    { consumerCode, businessService: "PT", mobileNumber: mobileNumber },
    { enabled: consumerCode ? true : false }
  ); */

  if (result.isLoading) {
    return <Loader />;
  }

  /* if (result.error || !consumerCode) {
    return <div>{t("CS_PT_NO_PROPERTIES_FOUND")}</div>;
  } */

  const onSubmit = (data) => {
    //debugger;
    //history.push(`/digit-ui/citizen/payment/my-bills/PT/${data.property_id}`, { tenantId });
    //history.push(`/digit-ui/citizen/mcollect/bill-details/${data.businesService}/${data?.ChannelNo}`, { tenantId });
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
      total_due: bill.status === "PAID" ? 0 : bill.totalAmount,
      OwnerName: bill.payerName || "NA",
      //bil_due__date: bill.billDetails[0].expiryDate || 0,
      bil_due__date: `${
        new Date(bill.billDetails[0].expiryDate).getDate().toString() +
        "/" +
        (new Date(bill.billDetails[0].expiryDate).getMonth() + 1).toString() +
        "/" +
        new Date(bill.billDetails[0].expiryDate).getFullYear().toString()
      }`,
      ChannelNo: bill?.consumerCode || "NA",
      ServiceCategory: bill.businessService ? bill.businessService.split(".")[bill.businessService.split(".").length - 1] : "NA",
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
