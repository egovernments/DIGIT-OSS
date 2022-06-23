import React from "react";
import { UpdateMobile } from "components";
import { Tooltip } from "egov-ui-framework/ui-molecules";
import Label from "egov-ui-kit/utils/translationNode";
import { TotalDuesButton } from "./components";
import { withRouter } from "react-router-dom";
import { downloadBill } from "egov-common/ui-utils/commons";
import "./index.css";
import get from "lodash/get";
import { routeToCommonPay } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formUtils";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "egov-pt/ui-utils";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

const locale = getLocale() || "en_IN";
const localizationLabelsData = initLocalizationLabels(locale);

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
    invalidNumber: "",
    showWarning: false,
    paybuttonconfig:""
  };
  onClickAction = async (consumerCode, tenantId) => {
    this.setState({
      url: await downloadBill(consumerCode, tenantId, "property-bill"),
    });
  };

  componentDidMount(){
    this.getPayButtonData()
  }
  getPayButtonData = async () => {
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: "uk",
        moduleDetails: [
          {
            moduleName: "tenant",
            masterDetails: [
              {
                name: "paybuttonconfig"
              }
            ]
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
      if (
        payload &&
        payload.MdmsRes &&
        payload.MdmsRes.tenant &&
        payload.MdmsRes.tenant.paybuttonconfig
      ) {
        let isOpenLink = window.location.pathname.includes("openlink") || window.location.pathname.includes("withoutAuth");
        let envs=(process.env.REACT_APP_NAME !== "Citizen" ) ? "employee":"citizen"
        let disablePayButton= payload.MdmsRes.tenant.paybuttonconfig[0][isOpenLink?"open":envs]
        this.setState({
          paybuttonconfig: disablePayButton
        })
      }
    } catch (e) {
      console.log(e);
    }
  };
  

  close = () => {
    this.setState({ showWarning: false });
  };

  checkValidProeprty = () => {
    const { properties, updateNumberConfig } = this.props;
    let { owners = [] } = properties;
    let returnValue = true;
    owners = owners && owners.filter((owner) => owner.status == "ACTIVE");
    owners &&
      owners.map((owner) => {
        if (process.env.REACT_APP_NAME !== "Citizen") {
          if (owner.mobileNumber == updateNumberConfig.invalidNumber || !owner.mobileNumber.match(updateNumberConfig["invalidPattern"])) {
            this.setState({ showWarning: true, invalidNumber: owner.mobileNumber });
            returnValue = false;
          }
        } else {
          if (
            owner.mobileNumber == updateNumberConfig.invalidNumber ||
            (!owner.mobileNumber.match(updateNumberConfig["invalidPattern"]) && owner.mobileNumber == JSON.parse(getUserInfo()).mobileNumber)
          ) {
            this.setState({ showWarning: true, invalidNumber: owner.mobileNumber });
            returnValue = false;
          }
        }
      });
    return returnValue;
  };

  payAction = (consumerCode, tenantId) => {
    /*   const status = get(this.props, 'propertyDetails[0].status', '');
    if (status != "ACTIVE") {
      this.props.toggleSnackbarAndSetText(
        true,
        { labelName: "Property in Workflow", labelKey: "ERROR_PROPERTY_IN_WORKFLOW" },
        "error"
      );
    } else { */
    this.checkValidProeprty() && routeToCommonPay(consumerCode, tenantId);
    /*  } */
  };
  render() {
    const { totalBillAmountDue, consumerCode, tenantId, history, citywiseconfig, properties, updateNumberConfig } = this.props;
    let disabledCities = get(citywiseconfig, "[0].enabledCities");
    const { payAction } = this;

    const envURL = "/egov-common/pay";
    const data = { value: "PT_TOTALDUES_TOOLTIP", key: "PT_TOTALDUES_TOOLTIP" };
    return (
      <div className="">
        <div className="col-xs-6 col-sm-3 flex-child" style={{ minHeight: "35px" }}>
          <Label buttonLabel={false} label="PT_TOTAL_DUES" color="rgba(0, 0, 0, 0.74)" labelStyle={labelStyle} fontSize="14px" />
        </div>
        <div className="col-xs-6 col-sm-3 flex-child" style={{ position: "absolute", left: "134px", width: "30px", display: "inline-flex" }}>
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
          style={{ position: "absolute", left: "117px", width: "30px", display: "inline-flex" }}
        />

        {totalBillAmountDue > 0 && (
          <div className="col-xs-6 col-sm-3 flex-child-button">
            <UpdateMobile
              closeDue={this.close}
              number={this.state.invalidNumber}
              type={"WARNING"}
              showWarning={this.state.showWarning}
              key={getTranslatedLabel("PT_OWNERSHIP_INFO_MOBILE_NO", localizationLabelsData)}
              tenantId={properties.tenantId}
              propertyId={properties.propertyId}
              updateNumberConfig={updateNumberConfig}
            ></UpdateMobile>
          </div>
        )}
        {totalBillAmountDue > 0 && (!this.state.paybuttonconfig) && (process.env.REACT_APP_NAME !== "Citizen" || !disabledCities.includes(tenantId)) && (
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
export default withRouter(TotalDues);
