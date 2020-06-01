import { Dialog, DialogContent } from "@material-ui/core";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-kit/redux/app/actions";
import get from "lodash/get";
import React from "react";
import { connect } from "react-redux";

class DialogContainer extends React.Component {
  handleClose = () => {
    const { screenKey, handleField, setRoute, redirectUrl } = this.props;
    handleField(
      screenKey,
      `components.adhocDialog`,
      "props.open",
      false
    );
    if (redirectUrl) {
      setRoute(redirectUrl);
    }
  };

  render() {
    const { open, maxWidth, children } = this.props;
    return (
      <Dialog open={open} maxWidth={maxWidth} onClose={this.handleClose}>
        <DialogContent children={children} />
      </Dialog>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const { screenKey } = ownProps;
  const { screenConfig } = screenConfiguration;
  const open = get(
    screenConfig,
    `${screenKey}.components.adhocDialog.props.open`
  );

  return {
    open,
    screenKey,
    screenConfig
  };
};

const mapDispatchToProps = dispatch => {
  return { handleField: (a, b, c, d) => dispatch(handleField(a, b, c, d)), setRoute: (route) => dispatch(setRoute(route)), };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DialogContainer);
