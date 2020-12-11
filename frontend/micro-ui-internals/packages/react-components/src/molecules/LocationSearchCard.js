import React from "react";
import PropTypes from "prop-types";
// import { Card, CardHeader, CardText, LocationSearch, SubmitBar, LinkButton } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

import Card from "../atoms/Card";
import CardHeader from "../atoms/CardHeader";
import CardText from "../atoms/CardText";
import LocationSearch from "../atoms/LocationSearch";
import SubmitBar from "../atoms/SubmitBar";
import LinkButton from "../atoms/LinkButton";

const LocationSearchCard = ({ header, cardText, nextText, skipAndContinueText, skip, onSave }) => {
  return (
    <Card>
      <CardHeader>{header}</CardHeader>
      <CardText>
        {/* Click and hold to drop the pin to complaint location. If you are not
        able to pin the location you can skip the continue for next step. */}
        {cardText}
      </CardText>

      <LocationSearch />

      <SubmitBar label={nextText} onSubmit={onSave} />
      {skip ? <LinkButton label={skipAndContinueText} /> : null}
    </Card>
  );
};

LocationSearchCard.propTypes = {
  header: PropTypes.string.isRequired,
  cardText: PropTypes.string.isRequired,
  nextText: PropTypes.string.isRequired,
  skipAndContinueText: PropTypes.string.isRequired,
  skip: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
};

LocationSearchCard.defaultProps = {
  header: "",
  cardText: "",
  nextText: "",
  skipAndContinueText: "",
  skip: false,
  onSave: null,
};

export default LocationSearchCard;
