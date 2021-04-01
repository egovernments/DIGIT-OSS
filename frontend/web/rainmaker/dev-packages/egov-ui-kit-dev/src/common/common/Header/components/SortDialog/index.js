import React, { Component } from "react";
import { Dialog, Button } from "components";
import { connect } from "react-redux";
import Label from "egov-ui-kit/utils/translationNode";
import { RadioButton } from "components";
import { getComplaintDisplayOrder } from "egov-ui-kit/redux/complaints/actions";

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

const options = [
  { value: "Old to New", label: <Label label="CS_SORT_OPTION_ONE" /> },
  { value: "New to old", label: <Label label="CS_SORT_OPTION_TWO" /> },
  { value: "SLA", label: <Label label="CS_SORT_OPTION_THREE" /> },
];

class SortDialog extends Component {
  state = {
    actions: [
      <Button
        id="logout-no-button"
        className="logout-no-button"
        label={<Label buttonLabel={true} label={"CORE_LOGOUTPOPUP_CANCEL"} color="#FE7A51" />}
        backgroundColor={"#fff"}
        style={{ boxShadow: "none" }}
      />,
      <Button
        id="logout-yes-button"
        className="logout-yes-button"
        label={<Label buttonLabel={true} label={"CORE_POPUP_OK"} color="#FE7A51" />}
        backgroundColor={"#fff"}
        onclick={() => {
          getComplaintDisplayOrder(this.state.valueSelected);
        }}
        style={{ boxShadow: "none" }}
      />,
    ],
    valueSelected: "",
  };

  handleChange = (event, value) => {
    this.setState({ valueSelected: value });
  };

  render() {
    const { closeSortDialog, sortPopOpen, getComplaintDisplayOrder } = this.props;
    const { handleChange, onConfirmClick } = this;

    return (
      <Dialog
        open={sortPopOpen}
        title={
          <Label
            label="ES_DIALOG_SORT_BY"
            bold={true}
            color="rgba(0, 0, 0, 0.8700000047683716)"
            fontSize="20px"
            labelStyle={{ padding: "16px 0px 0px 24px" }}
          />
        }
        children={[
          <div style={{ paddingTop: "22px", paddingLeft: "8px" }}>
            <RadioButton
              id="sortcomplaint-radio-button"
              name="sortcomplaint-radio-button"
              valueSelected={this.state.valueSelected}
              options={options}
              handleChange={handleChange}
              radioButtonItemStyle={styles.radioButtonItemStyle}
              labelStyle={styles.radioButtonLabelStyle}
              selectedLabelStyle={styles.selectedLabelStyle}
            />
          </div>,
        ]}
        handleClose={closeSortDialog}
        actions={[
          <Button
            id="logout-no-button"
            className="logout-no-button"
            label={<Label buttonLabel={true} label={"CORE_LOGOUTPOPUP_CANCEL"} color="#FE7A51" />}
            backgroundColor={"#fff"}
            onClick={closeSortDialog}
            style={{ boxShadow: "none" }}
          />,
          <Button
            id="logout-yes-button"
            className="logout-yes-button"
            label={<Label buttonLabel={true} label={"CORE_POPUP_OK"} color="#FE7A51" />}
            backgroundColor={"#fff"}
            onClick={() => {
              getComplaintDisplayOrder(this.state.valueSelected);
              closeSortDialog();
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
)(SortDialog);
