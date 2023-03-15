import { LabelContainer } from "egov-ui-framework/ui-containers";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { routeTo } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formActionUtils";
import { getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
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
class LinkButton extends React.Component {

  onClick = (onClickDefination) => {
    let {state, dispatchAction} = this.props;
    let {callBack} = onClickDefination;
    if (typeof callBack === "function") {
      callBack(state, dispatchAction);
    }
  }

  render() {
    const { onClickDefination, labelKey } = this.props;
    const {onClick} = this;
      return (
        <div style={styles}>
            <a href="javascript:void(0)" onClick={() => onClick(onClickDefination)}>
              <LabelContainer
                style={clickHereStyles}
                labelKey={labelKey} />
            </a>      
        </div>
      );
    
  }
}

const mapStateToProps = (state, ownprops) => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const {onClickDefination} = ownprops;
  return { state, screenConfiguration, preparedFinalObject, onClickDefination  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchAction: dispatch,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LinkButton);
