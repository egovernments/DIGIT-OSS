import { WarningPopup } from "components";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import React, { Component } from "react";
import { connect } from "react-redux";
import get from "lodash/get";

class LinkComponent extends Component {


  render() {
    const { warningPopup, prepareFinalObject,showPopup } = this.props;
    return (showPopup ?<WarningPopup
      open={showPopup}
      link={warningPopup.link}
      UpdateNumber={warningPopup.UpdateNumber}
      closeDialog={() => { prepareFinalObject("pt-warning-popup.showPopup", false) }}
      type="LINKNUM"></WarningPopup>:<span></span>)
  }
}

const mapStateToProps = (state, ownprops) => {

  let warningPopup = get(state.screenConfiguration.preparedFinalObject, "pt-warning-popup", {});
  let showPopup = get(state.screenConfiguration.preparedFinalObject, "pt-warning-popup.showPopup", {});

  return { warningPopup,showPopup };
};

const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value))
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LinkComponent);

