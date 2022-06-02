import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { Banner, LanguageSelectionForm } from "modules/common";
import React, { Component } from "react";
import { connect } from "react-redux";

class LanguageSelection extends Component {
  state = {
    value: getLocale() || 'en_IN',
  };

  componentDidMount = () => {
    this.props.fetchLocalizationLabel(this.state.value);
  }

  onClick = (value) => {
    this.setState({ value });
    this.props.fetchLocalizationLabel(value);
  };

  onLanguageSelect = () => {
    this.props.history.push("/user/register");
  };

  render() {
    const { value } = this.state;
    const { onLanguageSelect, onClick } = this;
    const { bannerUrl, logoUrl, languages } = this.props;
    return (
      <Banner className="language-selection" bannerUrl={bannerUrl} logoUrl={logoUrl}>
        <LanguageSelectionForm items={languages} value={value} onLanguageSelect={onLanguageSelect} onClick={onClick} logoUrl={logoUrl}/>
      </Banner>
    );
  }
}

const mapStateToProps = ({ common }) => {
  const { stateInfoById } = common;
  let bannerUrl = get(stateInfoById, "0.bannerUrl");
  let logoUrl = get(stateInfoById, "0.logoUrl");
  let languages = get(stateInfoById, "0.languages", []);
  return { bannerUrl, logoUrl, languages };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLocalizationLabel: (locale) => dispatch(fetchLocalizationLabel(locale)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageSelection);
