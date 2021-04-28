import React, { Component } from "react";
import { Snackbar } from "../../ui-atoms";
import { connect } from "react-redux";
import { toggleSnackbar } from "../../ui-redux/screen-configuration/actions";

class SnackbarContainer extends Component {
  handleClose = (event, reason) => {
    const { toggleSnackbar } = this.props;
    toggleSnackbar(false, "", "");
  };
  render() {
    const { open, variant, message } = this.props;
    return (
      <Snackbar
        onClose={this.handleClose}
        open={open}
        variant={variant}
        message={message}
      />
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleSnackbar: (open, message, variant) => {
      dispatch(toggleSnackbar(open, message, variant));
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(SnackbarContainer);
