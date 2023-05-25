import React, { Component } from "react";
import { Dialog, Button } from "egov-ui-kit/components";
import { connect } from "react-redux";
import Label from "egov-ui-kit/utils/translationNode";
import { RadioButton } from "egov-ui-kit/components";
import { getComplaintDisplayOrder } from "egov-ui-kit/redux/complaints/actions";
import { TextField } from "..";

const styles = {
  logoutContentStyle: { textAlign: "center", padding: "24px 20px" },

  labelStyle: {
    fontSize: "16px",
    fontWeight: "normal",
    color: "#767676",
    letterSpacing: "0.3px",
    marginBottom: "26px",
  },

  radioButtonItemStyle: {
    marginBottom: "18px",
    paddingLeft: "2px",
    height: "16px",
  },
  selectedLabelStyle: {
    color: "#fe7a51",
  },
  radioButtonLabelStyle: {
    fontSize: "16px",
    fontWeight: "400",
    color: "#767676",
    letterSpacing: "0.3px",
  },
};

class DialogWithTextField extends Component {
  state = {
    valueTyped: "",
  };

  textFieldHandleChange = (event, value) => {
    this.setState({ valueTyped: value });
  };

  render() {
    const { lableText, closeDialog, popOpen, onSend } = this.props;
    const { textFieldHandleChange, onConfirmClick } = this;

    return (
      <Dialog
        open={popOpen}
        title={<Label label="" bold={true} color="rgba(0, 0, 0, 0.8700000047683716)" fontSize="20px" labelStyle={{ padding: "16px 0px 0px 24px" }} />}
        children={[
          <div style={{ paddingTop: "22px", paddingLeft: "8px" }}>
            <Label
              label={lableText}
              bold={true}
              color="rgba(0, 0, 0, 0.8700000047683716)"
              fontSize="20px"
              labelStyle={{ padding: "16px 0px 0px 24px" }}
            />
            <TextField id="asda" value={this.state.valueTyped} onChange={textFieldHandleChange} />
          </div>,
        ]}
        handleClose={closeDialog}
        actions={[
          <Button
            id="logout-no-button"
            className="logout-no-button"
            label={<Label buttonLabel={true} label={"CORE_LOGOUTPOPUP_CANCEL"} color="#FE7A51" />}
            backgroundColor={"#fff"}
            onClick={closeDialog}
            style={{ boxShadow: "none" }}
          />,
          <Button
            id="logout-yes-button"
            className="logout-yes-button"
            label={<Label buttonLabel={true} label={"CORE_POPUP_SEND"} color="#FE7A51" />}
            backgroundColor={"#fff"}
            onClick={() => {
              onSend(this.state.valueTyped);
              closeDialog();
            }}
            style={{ boxShadow: "none" }}
          />,
        ]}
        contentClassName={"logout-popup"}
        contentStyle={{ width: "90%" }}
        isClose={true}
      />
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getComplaintDisplayOrder: (order) => dispatch(getComplaintDisplayOrder(order)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(DialogWithTextField);
