import React, { Component } from "react";
import { TextFieldIcon, Dialog } from "components";
import DownArrow from "material-ui/svg-icons/navigation/arrow-drop-down";
import ComplaintType from "egov-ui-kit/common/pgr/ComplaintType";
import "./index.css";

class ComplaintTypeField extends Component {
  state = { open: false };

  onClose = () => {
    this.setState({ open: false });
  };

  onFieldClicked = () => {
    this.setState({
      open: true,
    });
  };

  render() {
    let { localizationLabels, complaintType } = this.props;
    let { onClose, onFieldClicked } = this;
    let { open } = this.state;
    const complainTypeMessage =
      (complaintType && complaintType.value && (localizationLabels["SERVICEDEFS." + (complaintType.value || "").toUpperCase()] || {}).message) || "";
    return (
      <div className="complaint-type-main-cont">
        <div onClick={onFieldClicked}>
          <TextFieldIcon
            {...{ ...complaintType, value: complainTypeMessage }}
            iconPosition="after"
            fullWidth={true}
            Icon={DownArrow}
            iconStyle={{ marginTop: "9px", right: 12 }}
            name="complaint-type"
            disabled={false}
          />
        </div>
        <Dialog
          open={open}
          // title={<Label label="CS_ADDCOMPLAINT_COMPLAINT_TYPE_PLACEHOLDER" />}
          title="Select Complaint Type"
          titleStyle={{ textAlign: "left", paddingRight: "20px", fontWeight: "500" }}
          children={[
            <ComplaintType
              onClose={onClose}
              key={"complaintType"}
              employeeScreen={true}
              containerStyle={{}}
              textFieldStyle={{ backgroundColor: "#f7f7f7" }}
            />,
          ]}
          bodyStyle={{ backgroundColor: "#ffffff" }}
          isClose={false}
          onRequestClose={onClose}
          contentStyle={{ width: "34%", minWidth: 336, height: "65%" }}
          autoScrollBodyContent={true}
          style={{
            paddingTop: "0",
            bottom: "0",
            marginTop: "50px",
            height: "auto",
          }}
        />
      </div>
    );
  }
}

export default ComplaintTypeField;
