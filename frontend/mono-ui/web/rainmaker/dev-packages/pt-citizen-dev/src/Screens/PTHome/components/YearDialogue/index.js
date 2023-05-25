import React, { Component } from "react";
import { Dialog } from "components";
import SingleButton from "./components/SingleButton/index";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

class YearDialog extends Component {
  render() {
    let { open, yearList, closeDialogue } = this.props;
    return (
      <Dialog
        open={open}
        children={[
          <div key={1}>
            <div className="dialogue-question">
              <Label label="PT_PROPERTY_TAX_WHICH_YEAR_QUESTIONS" fontSize="16px" color="#484848" />
            </div>
            <div className="year-range-botton-cont">
              {yearList.map((item, index) => <SingleButton key={index} label={item} handleClose={closeDialogue} />)}
            </div>
          </div>,
        ]}
        bodyStyle={{ backgroundColor: "#ffffff" }}
        isClose={false}
        onRequestClose={closeDialogue}
        contentStyle={{ width: "20%" }}
      />
    );
  }
}

export default YearDialog;
