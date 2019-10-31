import React from "react";
import { Tooltip } from "egov-ui-framework/ui-molecules";
import Label from "egov-ui-kit/utils/translationNode";
import { TotalDuesButton } from "./components";
import { withRouter } from "react-router-dom";
import "./index.css";

const labelStyle = {
  color: "rgba(0, 0, 0, 0.6)",
  fontWeight: 400,
  letterSpacing: "0.58px",
  lineHeight: "17px",
  textAlign: "left",
  paddingRight: "20px",
};

const TotalDues = ({ totalBillAmountDue, consumerCode, tenantId, history }) => {
  console.log(process.env.REACT_APP_NAME,'process.env.REACT_APP_NAME');
  
  const envURL=process.env.REACT_APP_NAME === "Citizen"?'/egov-common/citizen-pay':'/egov-common/pay';
  const data = { value: "PT_TOTALDUES_TOOLTIP", key: "PT_TOTALDUES_TOOLTIP" };
  return (
    <div className="row">
      <div className="col-xs-3 flex-child">
        <Label buttonLabel={false} label="PT_TOTAL_DUES" color="rgb(0, 0, 0, 0.87)" height="35px" labelStyle={labelStyle} fontSize="20px" />
      </div>
      <Tooltip
        val={data}
        icon={"info_circle"}
        style={{ position: "absolute", left: "130px", padding: "4px", width: "30px", display: "inline-flex" }}
      />
      <div className="col-xs-3 flex-child">
        <Label label="Rs " secondaryText={totalBillAmountDue} labelStyle={labelStyle} fontSize="20px" color="rgb(0, 0, 0, 0.87)" height="35px"></Label>
      </div>
      {totalBillAmountDue > 0 && (
        <div className="col-xs-3 flex-child">
          <TotalDuesButton labelText="PT_TOTALDUES_VIEW" />
        </div>
      )}
      {totalBillAmountDue > 0 && (
        <div className="col-xs-3 flex-child">
          <TotalDuesButton labelText="PT_TOTALDUES_PAY" onClickAction={() => {
            history.push(
              `${envURL}?consumerCode=${consumerCode}&tenantId=${tenantId}&businessService=PT`);
          }} />
        </div>
      )}
    </div>
  );
};

export default withRouter(TotalDues);
// /egov-common/pay?consumerCode=PT-107-017837&tenantId=pb.amritsar&businessService=PT