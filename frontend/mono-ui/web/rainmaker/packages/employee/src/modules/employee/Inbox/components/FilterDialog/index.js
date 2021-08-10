import React from "react";
import { Dialog, DropDown } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

const LogoutDialog = ({ popupClose, popupOpen }) => {
  return (
    <Dialog
      open={popupOpen}
      isClose={true}
      title={
        <Label label={"Filter"} bold={true} color="rgba(0, 0, 0, 0.8700000047683716)" fontSize="20px" labelStyle={{ padding: "16px 0px 0px 24px" }} />
      }
      children={[
        <DropDown
          floatingLabelText="Module"
          className="filter-fields-style"
          dropDownData={[
            {
              value: "India",
              label: "IN",
            },
            {
              value: "USA",
              label: "US",
            },
            {
              value: "Australia",
              label: "AUS",
            },
          ]}
          underlineStyle={{ borderBottom: "none" }}
        />,
        <DropDown
          floatingLabelText="Locality"
          className="filter-fields-style"
          dropDownData={[
            {
              value: "India",
              label: "IN",
            },
            {
              value: "USA",
              label: "US",
            },
            {
              value: "Australia",
              label: "AUS",
            },
          ]}
          underlineStyle={{ borderBottom: "none" }}
        />,
        <DropDown
          floatingLabelText="Locality"
          className="filter-fields-style"
          dropDownData={[
            {
              value: "India",
              label: "IN",
            },
            {
              value: "USA",
              label: "US",
            },
            {
              value: "Australia",
              label: "AUS",
            },
          ]}
          underlineStyle={{ borderBottom: "none" }}
        />,
      ]}
      handleClose={popupClose}
      contentClassName={"logout-popup"}
      contentStyle={{ width: "90%" }}
    />
  );
};

export default LogoutDialog;
