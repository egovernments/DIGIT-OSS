import React, { Component } from "react";

import { DropDown, Icon, Image } from "components";
import person from "assets/images/faceTwo.jpg";

import "./index.css";

class UserSettings extends Component {
  state = {
    languageSelected: localStorage.getItem("locale"),
  };
  items = [
    {
      label: "ENGLISH",
      value: "en_IN",
    },
    {
      label: "हिंदी",
      value: "hi_IN",
    },
    {
      label: "ਪੰਜਾਬੀ",
      value: "pn_IN",
    },
  ];
  style = {
    baseStyle: {
      background: "#ffffff",
      height: "65px",
      marginRight: "30px",
      width: "98px",
      marginBottom: "24px",
    },
    label: {
      color: "#5F5C57",
      fontSize: "12px",
      paddingRight: "0px",
    },
    arrowIconStyle: {
      marginTop: "7px",
      marginLeft: "10px",
    },
    iconStyle: {
      marginRight: "30px",
    },
  };

  onChange = (event, index, value) => {
    this.setState({ languageSelected: value });
    this.props.fetchLocalizationLabel(value);
  };

  render() {
    const { languageSelected } = this.state;
    const { items, style } = this;
    const { onIconClick } = this.props;

    return (
      <div className="userSettingsContainer">
        <DropDown onChange={this.onChange} style={style.baseStyle} labelStyle={style.label} dropDownData={items} value={languageSelected} />
        <Icon action="social" name="notifications" color="#767676" style={style.iconStyle} />
        <div onClick={onIconClick} className="userSettingsInnerContainer">
          <Image height={33} width={33} circular={true} source={person} />
          <Icon action="navigation" name="arrow-drop-down" color="#767676" style={style.arrowIconStyle} />
        </div>
      </div>
    );
  }
}

export default UserSettings;
