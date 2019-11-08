import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import get from "lodash/get";
import set from "lodash/set";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getSearchResults } from "../../ui-utils/commons";

class PaymentRedirect extends Component {
  componentDidMount = async () => {
    let { search } = this.props.location;
    const txnQuery=search.split('&')[0].replace('eg_pg_txnid','transactionId');
    console.log(txnQuery,'txnQuery');
    
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
        this.props.setRoute(
          `/egov-common/acknowledgement?status=${"failure"}&consumerCode=${consumerCode}&tenantId=${tenantId}`
        );
      } else {
        const srcQuery=`?tenantId=${tenantId}&consumerCode=${consumerCode}`
 
 
        let searchResponse = await httpRequest(
          "post",
          "collection-services/payments/_search" + srcQuery,
          "_search",
          [],
          {}
        );

        let transactionId = get(searchResponse, "Payments[0].paymentDetails[0].receiptNumber");
        this.props.setRoute(
          // status=success&receiptNumber=PB-TL-2019-10-29-003220&consumerCode=PT-1909-208877&tenantId=pb.amritsar
          `/egov-common/acknowledgement?status=${"success"}&consumerCode=${consumerCode}&tenantId=${tenantId}&receiptNumber=${transactionId}`
        );
      }
    } catch (e) {
      alert(e);
    }
  };
  render() {
    return <div />;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setRoute: route => dispatch(setRoute(route))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withRouter(PaymentRedirect));
