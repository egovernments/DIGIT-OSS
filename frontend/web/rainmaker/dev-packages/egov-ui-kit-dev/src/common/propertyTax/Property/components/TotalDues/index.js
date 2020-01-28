import React from "react";
import { Tooltip } from "egov-ui-framework/ui-molecules";
import Label from "egov-ui-kit/utils/translationNode";
import { TotalDuesButton } from "./components";
import { withRouter } from "react-router-dom";
import { downloadBill } from "egov-common/ui-utils/commons";
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
      url: await downloadBill(consumerCode, tenantId),
    });
  };
  render() {
    const { totalBillAmountDue, consumerCode, tenantId, history } = this.props;
    const envURL = "/egov-common/pay";
    const data = { value: "PT_TOTALDUES_TOOLTIP", key: "PT_TOTALDUES_TOOLTIP" };
    return (
      <div className="">
        <div className="col-xs-6 col-sm-3 flex-child" style={{minHeight: "35px"}}>
          <Label buttonLabel={false} label="PT_TOTAL_DUES" color="rgb(0, 0, 0, 0.87)" height="35px" labelStyle={labelStyle} fontSize="18px" />
        </div>
        <Tooltip
          className="totaldues-tooltip-icon"
          val={data}
          icon={"info_circle"}
          style={{ position: "absolute", left: "135px", padding: "4px", width: "30px", display: "inline-flex" }}
        />
        <div className="col-xs-6 col-sm-3 flex-child" style={{minHeight: "35px"}}>
          <Label
            label="Rs "
            secondaryText={totalBillAmountDue}
            labelStyle={labelStyle}
            fontSize="18px"
            color="rgb(0, 0, 0, 0.87)"
            height="35px"
          ></Label>
        </div>
        {totalBillAmountDue > 0 && (
          <div className="col-xs-6 col-sm-3 flex-child">
            <TotalDuesButton
              labelText="PT_TOTALDUES_VIEW"
              onClickAction={() => {
                this.onClickAction(consumerCode, tenantId);
                window.open(this.state.url);
              }}
            />
          </div>
        )}
        {totalBillAmountDue > 0 && (
          <div className="col-xs-6 col-sm-3 flex-child ">
            <div style={{ float: "right" }}>
              <TotalDuesButton
                labelText="PT_TOTALDUES_PAY"
                onClickAction={() => {
                  history.push(`${envURL}?consumerCode=${consumerCode}&tenantId=${tenantId}`);
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default withRouter(TotalDues);
