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
      <div style={{display: "flex"}}>
      <svg style={{ marginTop: Webview?"16px":"8px", Webview }} width="24" height="24" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.9999 9.66666C12.0533 9.66666 9.66658 12.0533 9.66658 15C9.66658 17.9467 12.0533 20.3333 14.9999 20.3333C17.9466 20.3333 20.3333 17.9467 20.3333 15C20.3333 12.0533 17.9466 9.66666 14.9999 9.66666ZM26.9199 13.6667C26.3066 8.10666 21.8933 3.69333 16.3333 3.07999V0.333328H13.6666V3.07999C8.10658 3.69333 3.69325 8.10666 3.07992 13.6667H0.333252V16.3333H3.07992C3.69325 21.8933 8.10658 26.3067 13.6666 26.92V29.6667H16.3333V26.92C21.8933 26.3067 26.3066 21.8933 26.9199 16.3333H29.6666V13.6667H26.9199ZM14.9999 24.3333C9.83992 24.3333 5.66658 20.16 5.66658 15C5.66658 9.83999 9.83992 5.66666 14.9999 5.66666C20.1599 5.66666 24.3333 9.83999 24.3333 15C24.3333 20.16 20.1599 24.3333 14.9999 24.3333Z" fill="#505A5F" />
      </svg>
      <CardHeader>{header}</CardHeader>
      </div>
      <div style={cardBodyStyle}>
      {isPopUp && <LinkButton
            label={
            <div>
            <span>
            <svg style={{float:"right", position:"relative",bottom:Webview?"32px":"48px",marginTop:Webview?"-20px":"-18px",marginRight:"-5px",marginLeft:Webview?"5px":"" }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
