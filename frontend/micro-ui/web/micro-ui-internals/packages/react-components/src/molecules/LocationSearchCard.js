import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import Card from "../atoms/Card";
import CardHeader from "../atoms/CardHeader";
import CardText from "../atoms/CardText";
import CardLabelError from "../atoms/CardLabelError";
import LocationSearch from "../atoms/LocationSearch";
import SubmitBar from "../atoms/SubmitBar";
import LinkButton from "../atoms/LinkButton";

const LocationSearchCard = ({
  header,
  cardText,
  nextText,
  t,
  skipAndContinueText,
  forcedError,
  skip,
  onSave,
  onChange,
  position,
  disabled,
  cardBodyStyle = {},
  isPTDefault,
  PTdefaultcoord,
  isPlaceRequired,
  handleRemove,
  Webview=false,
  isPopUp=false,
}) => {
  let isDisabled = false || disabled;
  const onLocationChange = (val, location) => {
    isDisabled = val ? false : true;
    onChange(val, location);
  };

  const onLocationChangewithPlace = (val, location, place) => {
    isDisabled = val ? false : true;
    onChange(val, location, place);
  };

  return (
    <Card>
      <CardHeader>{header}</CardHeader>
      <div style={cardBodyStyle}>
      {isPopUp && <LinkButton
            label={
            <div>
            <span>
            <svg style={{float:"right", position:"relative",bottom:"32px",marginTop:Webview?"-20px":"-18px",marginRight:Webview?"-280px":"-5px",marginLeft:Webview?"5px":"" }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="#0B0C0C"/>
            </svg>
            </span>
            </div>
            }
              style={{width: "100px", display:"inline"}}
              onClick={(e) => handleRemove()}
           />}
        <CardText>
          {/* Click and hold to drop the pin to complaint location. If you are not
        able to pin the location you can skip the continue for next step. */}
          {cardText}
        </CardText>

        <LocationSearch onChange={isPlaceRequired?onLocationChangewithPlace:onLocationChange} position={position} isPTDefault={isPTDefault} PTdefaultcoord={PTdefaultcoord} isPlaceRequired={isPlaceRequired} />
        {forcedError && <CardLabelError>{t(forcedError)}</CardLabelError>}
      </div>
      <SubmitBar label={nextText} onSubmit={onSave} disabled={isDisabled} />
      {skip ? <LinkButton onClick={skip} label={skipAndContinueText} /> : null}
    </Card>
  );
};

LocationSearchCard.propTypes = {
  header: PropTypes.string,
  cardText: PropTypes.string,
  nextText: PropTypes.string,
  skipAndContinueText: PropTypes.string,
  skip: PropTypes.func,
  onSave: PropTypes.func,
  onChange: PropTypes.func,
  position: PropTypes.any,
  isPTDefault: PropTypes.any,
  PTdefaultcoord: PropTypes.any,
  isPlaceRequired: PropTypes.any,
};

LocationSearchCard.defaultProps = {
  header: "",
  cardText: "",
  nextText: "",
  skipAndContinueText: "",
  skip: () => {},
  onSave: null,
  onChange: () => {},
  position: undefined,
  isPTDefault: false,
  PTdefaultcoord: {},
  isPlaceRequired: false,
  handleRemove: () => {},
  Webview:false,
  isPopUp:false,
};

export default LocationSearchCard;
