import React from "react";
import { connect } from "react-redux";
import IconButton from '@material-ui/core/IconButton';
import get from "lodash/get";
import { Dialog, DialogContent } from "@material-ui/core";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from '@material-ui/icons/Close';
class DialogContainer extends React.Component {
  handleClose = () => {
    const { screenKey, handleField } = this.props;
    handleField(
      screenKey,
      `components.adhocDialog`,
      "props.open",
      false
    );
  };
  

  render() {
    const { open, maxWidth, children } = this.props;
    const CloseButton = withStyles(theme => ({
      root: {
        justifyContent: "flex-end",
        float: "right",
        paddingRight: 0,
        zIndex: 1333,
        right: 20,
        paddingTop: 0,
        position: "absolute",
        "&:hover": {
          backgroundColor: "#FFF"
        }
      }
    }))(IconButton);
    return (
      <Dialog open={open} maxWidth={maxWidth} onClose={this.handleClose}>
        <CloseButton aria-label="Close" >
          <CloseIcon onClick={this.handleClose} />
        </CloseButton>
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