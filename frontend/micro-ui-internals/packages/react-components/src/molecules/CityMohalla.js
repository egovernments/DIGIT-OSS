import React from "react";
import PropTypes from "prop-types";

import Card from "../atoms/Card";
import CardHeader from "../atoms/CardHeader";
import CardText from "../atoms/CardText";
import SubmitBar from "../atoms/SubmitBar";
import CardSubHeader from "../atoms/CardSubHeader";
import CardLabel from "../atoms/CardLabel";
import Dropdown from "../atoms/Dropdown";

const CityMohalla = ({
  header,
  subHeader,
  cardText,
  cardLabelCity,
  cardLabelMohalla,
  nextText,
  selectedCity,
  cities,
  localities,
  selectCity,
  selectLocalities,
  onSave,
  selectedLocality,
}) => {
  return (
    <Card>
      <CardSubHeader>{subHeader}</CardSubHeader>
      <CardHeader>{header}</CardHeader>
      <CardText>
        {/* Choose the locality/mohalla of the complaint from the list given below. */}
        {cardText}
      </CardText>
      <CardLabel>{cardLabelCity}* </CardLabel>
      <Dropdown isMandatory selected={selectedCity} option={cities} select={selectCity} />
      <CardLabel>{cardLabelMohalla} *</CardLabel>
      <Dropdown isMandatory selected={selectedLocality} option={localities} select={selectLocalities} />
      <SubmitBar label={nextText} onSubmit={onSave} />
    </Card>
  );
};

CityMohalla.propTypes = {
  header: PropTypes.string.isRequired,
  subHeader: PropTypes.string.isRequired,
  cardText: PropTypes.string.isRequired,
  cardLabelCity: PropTypes.string.isRequired,
  cardLabelMohalla: PropTypes.string.isRequired,
  nextText: PropTypes.string.isRequired,
  selectedCity: PropTypes.string.isRequired,
  cities: PropTypes.array.isRequired,
  localities: PropTypes.array.isRequired,
  selectCity: PropTypes.string.isRequired,
  selectedLocality: PropTypes.string.isRequired,
  selectLocalities: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

CityMohalla.defaultProps = {
  header: "",
  subHeader: "",
  cardText: "",
  cardLabelCity: "",
  cardLabelMohalla: "",
  nextText: "",
  selectedCity: "",
  cities: [],
  localities: [],
  selectCity: "",
  selectedLocality: "",
  selectLocalities: undefined,
  onSave: undefined,
};

export default CityMohalla;
