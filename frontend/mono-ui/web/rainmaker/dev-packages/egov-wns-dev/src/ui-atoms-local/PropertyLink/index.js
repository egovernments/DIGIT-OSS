import { LabelContainer } from "egov-ui-framework/ui-containers";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { routeTo } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formActionUtils";
import get from "lodash/get";
import React from "react";
import { connect } from "react-redux";
const styles = {
  color: "rgba(0, 0, 0, 0.87)",
  marginLeft: "3%",
  marginTop: "7%",
  lineHeight: "35px",
  fontSize: "16px"
};

const clickHereStyles = {
  cursor: "pointer",
  textDecoration: "none",
  color: "#FE7A51"
}
class AddLinkForProperty extends React.Component {
  render() {
    const { url, isMode, selectedPropertyId } = this.props;
    let link = `/pt-common-screens/propertySearch?redirectUrl=${url}`;
    const tenantId = getQueryArg(window.location.href, "tenantId");
    let modifyLink = `/property-tax/assessment-form?assessmentId=0&purpose=update&propertyId=${selectedPropertyId}&tenantId=${tenantId}&redirectTo=${url.substring(1)}`
    if (link) {
      let applicationNo = getQueryArg(window.location.href, "applicationNumber");
      const connectionNo = getQueryArg(window.location.href, "connectionNumber");
      const actionType = getQueryArg(window.location.href, "action");
      link = applicationNo && !link.includes('applicationNumber') ? link + `&applicationNumber=${applicationNo}` : link;
      link = connectionNo&& !link.includes('connectionNumber') ? link + `&connectionNumber=${connectionNo}` : link;
      link = actionType && !link.includes('action')? link + `&action=${actionType}` : link;
    }



    if (isMode === "MODIFY") {
      return (
        <div style={styles} className={"property-buttons"}>
          <a href="javascript:void(0)" onClick={() => routeTo(link)} ><LabelContainer
            style={clickHereStyles}
            labelKey="WS_SEARCH_PROPERTY" />
          </a> <span> </span>

          <a href="javascript:void(0)" onClick={() => routeTo(modifyLink)} >
            <LabelContainer
              style={clickHereStyles}
              labelKey="WS_MODIFY_PROPERTY" />
          </a>
        </div>
      );
    } else {
      return (
        <div style={styles}>
          <LabelContainer
            labelName="To Find/Create Property ID"
            labelKey="WS_APPLY_CREATE_MSG" /><span> </span><a href="javascript:void(0)" onClick={() => routeTo(link)}  ><LabelContainer
              style={clickHereStyles}
              labelKey="WS_APPLY_CLICK_HERE" />
          </a>
        </div>
      );
    }
  }
}
const mapStateToProps = (state, ownprops) => {
  let selectedPropertyId = "";
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  selectedPropertyId = get(preparedFinalObject, "applyScreen.property.propertyId");

  return { selectedPropertyId };
};

export default connect(mapStateToProps)(AddLinkForProperty);
