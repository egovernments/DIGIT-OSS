import { downloadBill } from "egov-common/ui-utils/commons";
import { Tooltip } from "egov-ui-framework/ui-molecules";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { routeToCommonPay } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formUtils";
import Label from "egov-ui-kit/utils/translationNode";
import get from "lodash/get";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { TotalDuesButton } from "./components";
import "./index.css";

const labelStyle = {
  color: "rgba(0, 0, 0, 0.6)",
  fontWeight: 400,
  letterSpacing: "0.58px",
  lineHeight: "17px",
  textAlign: "left",
  paddingRight: "20px",
};

class TotalDues extends React.Component {
  state = {
    url: "",
  };
  onClickAction = async (consumerCode, tenantId) => {
    this.setState({
      url: await downloadBill(consumerCode, tenantId, "property-bill"),
    });
  };
  payAction = (consumerCode, tenantId) => {
    const status = get(this.props, 'propertyDetails[0].status', '');
    if (status != "ACTIVE") {
      this.props.toggleSnackbarAndSetText(
        true,
        { labelName: "Property in Workflow", labelKey: "ERROR_PROPERTY_IN_WORKFLOW" },
        "error"
      );
    } else {
      routeToCommonPay(consumerCode, tenantId);
    }
  }

  render() {
    const { totalBillAmountDue, consumerCode, tenantId, isAdvanceAllowed, history } = this.props;
    const envURL = "/egov-common/pay";
    const { payAction } = this;
    const data = { value: "PT_TOTALDUES_TOOLTIP", key: "PT_TOTALDUES_TOOLTIP" };
    return (
      <div className="" id="pt-header-due-amount">
        <div className="col-xs-6 col-sm-3 flex-child" style={{ minHeight: "60px" }}>
          <Label buttonLabel={false} label="PT_TOTAL_DUES" color="rgba(0, 0, 0, 0.74)" labelStyle={labelStyle} fontSize="14px" />
          <Label
            label="Rs "
            secondaryText={totalBillAmountDue ? totalBillAmountDue : 0}
            labelStyle={labelStyle}
            fontSize="24px"
            fontWeight="500"
            color="rgb(0, 0, 0, 0.87)"
            height="35px"
          ></Label>
        </div>
        <Tooltip
          className="totaldues-tooltip-icon"
          val={data}
          icon={"info_circle"}
          style={{ position: "absolute", left: "160px", top: "30px" }}
        />
        <div className="col-xs-6 col-sm-3 flex-child" style={{ minHeight: "60px" }}>
        </div>
          <div className="col-xs-6 col-sm-3 flex-child-button">
            {/* <TotalDuesButton
              labelText="PT_TOTALDUES_VIEW"
              onClickAction={() => {
                this.onClickAction(consumerCode, tenantId);
                window.open(this.state.url);
              }}
            /> */}
          </div>
        {(totalBillAmountDue > 0 || (totalBillAmountDue === 0 && isAdvanceAllowed)) && (
          <div id="pt-flex-child-button" className="col-xs-12 col-sm-3 flex-child-button">
            <div style={{ float: "right" }}>
              <TotalDuesButton
                primary={true}
                labelText="PT_TOTALDUES_PAY"
                onClickAction={() => {
                  payAction(consumerCode, tenantId);
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { propertiesById } = state.properties || {};
  const propertyId = ownProps.consumerCode;
  const selPropertyDetails = propertiesById[propertyId] || {};
  const propertyDetails = selPropertyDetails.propertyDetails || [];
  return {
    propertyDetails,
    propertyId
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    toggleSnackbarAndSetText: (open, message, error) => dispatch(toggleSnackbarAndSetText(open, message, error)),
  };
};



export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TotalDues));