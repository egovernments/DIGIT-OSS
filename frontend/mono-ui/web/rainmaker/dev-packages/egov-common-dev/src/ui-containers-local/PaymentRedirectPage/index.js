import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { isPublicSearch } from "egov-ui-framework/ui-utils/commons";
import { getPaymentSearchAPI } from "egov-ui-kit/utils/commons";
import get from "lodash/get";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class PaymentRedirect extends Component {
  getBusinessServiceMdmsData = async (tenantId) => {
    const { prepareFinalObject } = this.props
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "BillingService",
            masterDetails: [{ name: "BusinessService" }]
          },
          {
            moduleName: "common-masters",
            masterDetails: [{ name: "uiCommonPay" }]
          }
        ]
      }
    };
    try {
      let payload = null;
      payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      prepareFinalObject("businessServiceMdmsData", payload.MdmsRes);
    } catch (e) {
      console.log(e);
    }
  };

  checkPublicSearch = () => {
    return isPublicSearch();
  }

  componentDidMount = async () => {
    let { search } = this.props.location;
    const { reduxObj, prepareFinalObject } = this.props;
    const txnQuery = search.split('&')[0].replace('eg_pg_txnid', 'transactionId');
    console.log(txnQuery, 'txnQuery');
    const isPublicSearch = this.checkPublicSearch();

    try {
      let pgUpdateResponse = await httpRequest(
        "post",
        "pg-service/transaction/v1/_update" + txnQuery,
        "_update",
        [],
        {}
      );
      let consumerCode = get(pgUpdateResponse, "Transaction[0].consumerCode");
      let tenantId = get(pgUpdateResponse, "Transaction[0].tenantId");
      if (get(pgUpdateResponse, "Transaction[0].txnStatus") === "FAILURE") {
        const url = `/egov-common/acknowledgement?status=${"failure"}&consumerCode=${consumerCode}&tenantId=${tenantId}&businessService=${get(pgUpdateResponse, "Transaction[0].module", localStorage.getItem('pay-businessService'))}`;
        const ackFailureUrl = isPublicSearch ? `/withoutAuth${url}` : url;
        this.props.setRoute(ackFailureUrl);
      } else {
        const srcQuery = `?tenantId=${tenantId}&consumerCodes=${consumerCode}`


        let searchResponse = await httpRequest(
          "post",
          getPaymentSearchAPI(get(pgUpdateResponse, "Transaction[0].module", localStorage.getItem('pay-businessService'))|| localStorage.getItem('pay-businessService')) + srcQuery,
          "_search",
          [],
          {}
        );
        const businessService = get(searchResponse, "Payments[0].paymentDetails[0].businessService");
        let transactionId = get(searchResponse, "Payments[0].paymentDetails[0].receiptNumber");
        this.getBusinessServiceMdmsData(tenantId).then(response => {
          const commonPayDetails = get(reduxObj, "businessServiceMdmsData.common-masters.uiCommonPay");
          const index = commonPayDetails && commonPayDetails.findIndex((item) => {
            return item.code == businessService;
          });
          if (index > -1) {
            prepareFinalObject("commonPayInfo", commonPayDetails[index]);
          } else {
            const details = commonPayDetails.filter(item => item.code === "DEFAULT");
            prepareFinalObject("commonPayInfo", details);
          }
          let moduleName = "egov-common";
          if (businessService && businessService.indexOf("BPA") > -1) {
            moduleName = "egov-bpa"
          }
          const url = `/${moduleName}/acknowledgement?status=${"success"}&consumerCode=${consumerCode}&tenantId=${tenantId}&receiptNumber=${transactionId}&businessService=${businessService}&purpose=${"pay"}`;
          const ackSuccessUrl = isPublicSearch ? `/withoutAuth${url}` : url;
          this.props.setRoute(ackSuccessUrl);
        })
      }
    } catch (e) {
      alert(e);
    }
  };
  render() {
    return <div />;
  }
}

const mapStateToProps = (state) => {
  const reduxObj = get(state, "screenConfiguration.preparedFinalObject");
  return { reduxObj };
}

const mapDispatchToProps = dispatch => {
  return {
    setRoute: route => dispatch(setRoute(route)),
    prepareFinalObject: (jsonPath, value) => dispatch(prepareFinalObject(jsonPath, value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PaymentRedirect));
