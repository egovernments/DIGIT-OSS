import React from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import { Dialog, DialogContent } from "@material-ui/core";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

class DialogContainer extends React.Component {
  handleClose = () => {
    const { screenKey } = this.props;
    this.props.handleField(
      screenKey,
      `components.adhocDialog`,
      "props.open",
      false
    );
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
  return { handleField: (a, b, c, d) => dispatch(handleField(a, b, c, d)) };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DialogContainer);
