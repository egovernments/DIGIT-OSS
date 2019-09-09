import React from "react";
import { TimeLine, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

const timelineIconCommonStyle = {
  height: "38px",
  width: "38px",
  borderRadius: "50%",
  padding: "7px",
  marginLeft: "-7px",
};

const statusCommonIconStyle = {
  ...timelineIconCommonStyle,
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12)",
  border: "solid 1px #f89a3f",
};

const HowItWorks = (props) => {
  let steps = [
    {
      props: {
        active: true,
      },
      contentProps: {
        style: {
          marginTop: "-43px",
          marginLeft: "25px",
          paddingBottom: "80px",
        },
      },
      contentChildren: (
        <div style={{ marginLeft: "16px" }}>
          <Label labelClassName="dark-color" label="CS_HOWITWORKS_RAISE_COMPLAINT" />
        </div>
      ),
      labelProps: {
        icon: (
          <div>
            <Icon action="custom" name="file-send" style={statusCommonIconStyle} color={"#f5a623"} />
            <Icon action="navigation" name="arrow-drop-down" color="#f5a623" style={{ width: "25px", marginLeft: "-32px", marginBottom: "-60px" }} />
          </div>
        ),
      },
    },
    {
      props: {
        active: true,
      },
      contentProps: {
        style: {
          marginTop: "-43px",
          marginLeft: "25px",
          paddingBottom: "80px",
        },
      },
      contentChildren: (
        <div style={{ marginLeft: "16px" }}>
          <Label labelClassName="dark-color" label="CS_HOWITWORKS_CONNECT_OFFICER" />
        </div>
      ),
      // labelChildren:"Connect to Concerned Officer",
      labelProps: {
        icon: (
          <div>
            <Icon action="social" name="person" style={statusCommonIconStyle} color={"#f5a623"} />
            <Icon action="navigation" name="arrow-drop-down" color="#f5a623" style={{ width: "25px", marginLeft: "-32px", marginBottom: "-60px" }} />
          </div>
        ),
      },
    },
    {
      props: {
        active: true,
      },
      contentProps: {
        style: {
          marginTop: "-43px",
          marginLeft: "25px",
          paddingBottom: "80px",
        },
      },
      contentChildren: (
        <div style={{ marginLeft: "16px" }}>
          <Label labelClassName="dark-color" label="CS_HOWITWORKS_TRACK_STATUS" />
        </div>
      ),
      labelProps: {
        icon: (
          <div>
            <Icon action="action" name="timeline" style={statusCommonIconStyle} color={"#f5a623"} />
            <Icon action="navigation" name="arrow-drop-down" color="#f5a623" style={{ width: "25px", marginLeft: "-32px", marginBottom: "-60px" }} />
          </div>
        ),
      },
    },
    {
      props: {
        active: true,
      },
      contentProps: {
        style: {
          marginTop: "-43px",
          marginLeft: "25px",
          paddingBottom: "80px",
        },
      },
      contentChildren: (
        <div style={{ marginLeft: "16px" }}>
          <Label labelClassName="dark-color" label="CS_COMMON_RESOLVED" />
        </div>
      ),
      labelProps: {
        icon: (
          <div>
            <Icon action="action" name="done" style={statusCommonIconStyle} color={"#f5a623"} />
          </div>
        ),
      },
    },
  ];
  return (
    <div className="form-without-button-cont-generic">
      <div className="howItWorks-main-card">
        <Label labelClassName="dark-color" containerStyle={{ marginBottom: "40px" }} label={"CS_HOWITWORKS_DESCRIPTION"} />

        <TimeLine
          stepperProps={{
            orientation: "vertical",
          }}
          steps={steps}
        />
      </div>
    </div>
  );
};

export default HowItWorks;
