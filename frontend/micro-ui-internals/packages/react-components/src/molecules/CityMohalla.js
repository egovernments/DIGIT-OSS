import React from "react";
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
      <Dropdown isMandatory option={localities} select={selectLocalities} />
      <SubmitBar label={nextText} onSubmit={onSave} />
    </Card>
  );
};

export default CityMohalla;
