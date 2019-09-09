import React, { Component } from "react";
import { connect } from "react-redux";
import { Banner } from "modules/common";
import { LanguageSelectionForm } from "modules/common";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";

class LanguageSelection extends Component {
  state = {
    value: getLocale(),
    items: [
      {
        label: "ENGLISH",
        value: "en_IN"
      },
      {
        label: "हिंदी",
        value: "hi_IN"
      },
      {
        label: "ਪੰਜਾਬੀ",
        value: "pn_IN"
      }
    ]
  };

  onClick = value => {
    this.setState({ value });
    this.props.fetchLocalizationLabel(value);
  };

  onLanguageSelect = () => {
    this.props.history.push("/user/register");
  };

  render() {
    const { items, value } = this.state;
    const { onLanguageSelect, onClick } = this;

    return (
      <Banner className="language-selection">
        <LanguageSelectionForm
          items={items}
          value={value}
          onLanguageSelect={onLanguageSelect}
          onClick={onClick}
        />
      </Banner>
    );
  }
}

const dispatchToProps = dispatch => {
  return {
    fetchLocalizationLabel: locale => dispatch(fetchLocalizationLabel(locale))
  };
};

export default connect(
  null,
  dispatchToProps
)(LanguageSelection);
