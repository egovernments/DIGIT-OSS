import React, { Component } from "react";
import get from "lodash/get";
import { httpRequest } from "../../ui-utils/api";
import { withRouter } from "react-router";
import { getSearchResults } from "../../ui-utils/commons";

class PaymentRedirect extends Component {
  componentDidMount = async () => {
    let { search } = this.props.location;
    try {
      let pgUpdateResponse = await httpRequest(
        "post",
        "pg-service/transaction/v1/_update" + search,
        "_update",
        [],
        {}
      );
      let consumerCode = get(pgUpdateResponse, "Transaction[0].consumerCode");
      let tenantId = get(pgUpdateResponse, "Transaction[0].tenantId");
      const queryObject = [
        {
          key: "tenantId",
          value: tenantId
        },
        {
          key: "applicationNumber",
          value: consumerCode
        }
      ];
      const response = await getSearchResults(queryObject);
      const financialYear = get(response.Licenses[0], "financialYear");
      if (get(pgUpdateResponse, "Transaction[0].txnStatus") === "FAILURE") {
        window.location.href = `${
          process.env.NODE_ENV === "production" ? "/citizen" : ""
        }/tradelicence/acknowledgement?purpose=${"pay"}&status=${"failure"}&applicationNumber=${consumerCode}&FY=${financialYear}&tenantId=${tenantId}`;
      } else {
        let transactionId = get(pgUpdateResponse, "Transaction[0].txnId");
        window.location.href = `${
          process.env.NODE_ENV === "production" ? "/citizen" : ""
        }/tradelicence/acknowledgement?purpose=${"pay"}&status=${"success"}&applicationNumber=${consumerCode}&FY=${financialYear}&tenantId=${tenantId}&secondNumber=${transactionId}`;
      }
    } catch (e) {
      alert(e);
    }
  };
  render() {
    return <div />;
  }
}

export default withRouter(PaymentRedirect);
