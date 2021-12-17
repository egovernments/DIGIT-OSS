import { UpdateMobile } from "components";
import { downloadBill } from "egov-common/ui-utils/commons";
import { Tooltip } from "egov-ui-framework/ui-molecules";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import { routeToCommonPay } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formUtils";
import Label from "egov-ui-kit/utils/translationNode";
import get from "lodash/get";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { TotalDuesButton } from "./components";
import "./index.css";

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
    url: "", invalidNumber: "",
    showWarning: false,
    isAlternate:false
  };
  onClickAction = async (consumerCode, tenantId) => {
    this.setState({
      url: await downloadBill(consumerCode, tenantId, "property-bill"),
    });
  };
  close = () => {
    this.setState({ showWarning: false });
  }

  checkValidProeprty = () => {
    const { properties, updateNumberConfig } = this.props;
    let { owners = [] } = properties;
    let returnValue = true;
    owners = owners && owners.filter(owner => owner.status == "ACTIVE");
    owners && owners.map(owner => {
      if (process.env.REACT_APP_NAME !== "Citizen") {
        if ((owner.mobileNumber == updateNumberConfig.invalidNumber) || !owner.mobileNumber.match(updateNumberConfig['invalidPattern'])) {
          this.setState({ showWarning: true, invalidNumber: owner.mobileNumber,isAlternate:false });
          returnValue = false;
        }else if(owner.alternatemobilenumber && ((owner.alternatemobilenumber == updateNumberConfig.invalidNumber) || !owner.alternatemobilenumber.match(updateNumberConfig['invalidPattern']))) {
          this.setState({ showWarning: true, invalidNumber: owner.alternatemobilenumber,isAlternate:true });
          returnValue = false;
        }
      } else {
        if (((owner.mobileNumber == updateNumberConfig.invalidNumber) || !owner.mobileNumber.match(updateNumberConfig['invalidPattern']) && owner.mobileNumber == JSON.parse(getUserInfo()).mobileNumber)) {
          this.setState({ showWarning: true, invalidNumber: owner.mobileNumber,isAlternate:false  });
          returnValue = false;
        }else if (owner.alternatemobilenumber !=null && ((owner.alternatemobilenumber == updateNumberConfig.invalidNumber) || !owner.alternatemobilenumber.match(updateNumberConfig['invalidPattern']) && owner.alternatemobilenumber == JSON.parse(getUserInfo()).mobileNumber)) {
          this.setState({ showWarning: true, invalidNumber: owner.alternatemobilenumber ,isAlternate:true });
          returnValue = false;
        }
      }
    })
    return returnValue;
  }
  payAction = (consumerCode, tenantId) => {
    const status = get(this.props, 'propertyDetails[0].status', '');
    if (status != "ACTIVE") {
      this.props.toggleSnackbarAndSetText(
        true,
        { labelName: "Property in Workflow", labelKey: "ERROR_PROPERTY_IN_WORKFLOW" },
        "error"
      );
    } else {
      this.checkValidProeprty() && routeToCommonPay(consumerCode, tenantId);
    }
  }


  render() {
    const { totalBillAmountDue, consumerCode, tenantId, isAdvanceAllowed, history, properties, updateNumberConfig } = this.props;
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
          <UpdateMobile
            closeDue={this.close}
            number={this.state.invalidNumber}
            type={"WARNING"}
            showWarning={this.state.showWarning}
            key={getTranslatedLabel("PT_OWNERSHIP_INFO_MOBILE_NO", localizationLabelsData)}
            tenantId={properties.tenantId}
            propertyId={properties.propertyId}
            updateNumberConfig={updateNumberConfig}
            isAlternate={this.state.isAlternate}
          >
          </UpdateMobile>
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