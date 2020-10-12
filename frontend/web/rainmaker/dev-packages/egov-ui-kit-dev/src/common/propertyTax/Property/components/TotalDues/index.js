import React from "react";
import { Tooltip } from "egov-ui-framework/ui-molecules";
import Label from "egov-ui-kit/utils/translationNode";
import { TotalDuesButton } from "./components";
import { withRouter } from "react-router-dom";
import "./index.css";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";

const labelStyle = {
  color: "rgba(0, 0, 0, 0.6)",
  fontWeight: 400,
  letterSpacing: "0.58px",
  lineHeight: "17px",
  textAlign: "left",
  paddingRight: "20px",
};

const getExcludedUlbs = (tenantId) => {
  let isEnabled;
  let tenantid = getTenantId().split(".")[0];
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantid,
      moduleDetails: [
       {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "citywiseconfig"
            }
          ]
        }
      ]
    }
  };
  try {
   httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    ).then(payload => {payload.MdmsRes.tenant.citywiseconfig.forEach( item => {
      if(item.config === 'ptCitizenPayButton'){
        isEnabled = item.enabledCities.includes(getTenantId()) && process.env.REACT_APP_NAME === "Citizen" ? false : true;
      }
    })})
  } catch (e) {
    console.log(e);
  }
  return isEnabled;
}

const TotalDues = ({ totalBillAmountDue, consumerCode, tenantId, history }) => {
  const envURL='/egov-common/pay';
  const data = { value: "PT_TOTALDUES_TOOLTIP", key: "PT_TOTALDUES_TOOLTIP" };
  const isDiasbled = getExcludedUlbs(tenantId);
  return (
    <div className="">
      <div className="col-xs-6 col-sm-3 flex-child">
        <Label buttonLabel={false} label="PT_TOTAL_DUES" color="rgb(0, 0, 0, 0.87)" height="35px" labelStyle={labelStyle} fontSize="20px" />
      </div>
      <Tooltip
        val={data}
        icon={"info_circle"}
        style={{ position: "absolute", left: "135px", padding: "4px", width: "30px", display: "inline-flex" }}
      />
      <div className="col-xs-6 col-sm-3 flex-child">
        <Label label= "&#8377;" secondaryText={totalBillAmountDue} labelStyle={labelStyle} fontSize="20px" color="rgb(0, 0, 0, 0.87)" height="35px"></Label>
      </div>
      {totalBillAmountDue > 0 && (
        <div className="col-xs-6 col-sm-3 flex-child">
          {/* <TotalDuesButton labelText="PT_TOTALDUES_VIEW" /> */}
        </div>
      )}
      {totalBillAmountDue > 0 && process.env.REACT_APP_NAME !== "Citizen" && isDiasbled && (
        <div className="col-xs-6 col-sm-3 flex-child " >
          <div style={{ float: "right" }}>
          <TotalDuesButton labelText="PT_TOTALDUES_PAY" onClickAction={() => {
            history.push(
              `${envURL}?consumerCode=${consumerCode}&tenantId=${tenantId}`);
          }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default withRouter(TotalDues);
// /egov-common/pay?consumerCode=PT-107-017837&tenantId=pb.amritsar&businessService=PT
