import React from "react";
import { connect } from "react-redux";
import { toggleSpinner } from "egov-ui-kit/redux/common/actions";
import { httpRequest } from "egov-ui-kit/utils/api";
import get from "lodash/get";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";

class PaymentRedirect extends React.Component {
  componentWillMount() {
    this.props.toggleSpinner();
  }
  componentDidMount = async () => {
    let { history } = this.props;
    let { search } = this.props.location;
    try {
      let pgUpdateResponse = await httpRequest(
        "pg-service/transaction/v1/_update" + search,
        "_update",
        [],
        {}
      );
      let consumerCode = get(pgUpdateResponse, "Transaction[0].consumerCode");
      let tenantId = get(pgUpdateResponse, "Transaction[0].tenantId");
      let txnAmount = get(pgUpdateResponse, "Transaction[0].txnAmount");
      if (get(pgUpdateResponse, "Transaction[0].txnStatus") === "FAILURE") {
        this.props.toggleSpinner();
        history.push(
          "/property-tax/payment-failure/" +
            consumerCode.split(":")[0] +
            "/" +
            tenantId +
            "/" +
            consumerCode.split(":")[1] +
            "/" +
            localStorageGet("assessmentYear") +
            "/" +
            txnAmount
        );
      } else {
        //let transactionId = get(pgUpdateResponse, "Transaction[0].receipt[0].transactionId");
        this.props.toggleSpinner();
        history.push(
          "/property-tax/payment-success/" +
            consumerCode.split(":")[0] +
            "/" +
            tenantId 
        );
      }
    } catch (e) {
      this.props.toggleSpinner();
      alert(e);
      // history.push("/property-tax/payment-success/"+moduleId.split("-",(moduleId.split("-").length-1)).join("-"))
    }
  };
  render() {
    return <div />;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleSpinner: () => dispatch(toggleSpinner())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(PaymentRedirect);
