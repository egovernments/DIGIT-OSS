import React from "react";
import TextInput from "../atoms/TextInput";
import CardText from "../atoms/CardText";

const DimentionInput = ({ name, value, onChange, disable }) => (
  <TextInput type="number" name={name} value={value} onChange={onChange} disable={disable} pattern="[0-9]{1,2}" min="0.1" max="99.9" step="0.1" />
);

const PitDimension = ({ sanitationType, t, size = {}, handleChange, disable = false }) => {
  return sanitationType?.dimension === "dd" ? (
    <div className="inputWrapper">
      <div>
        <DimentionInput name="diameter" value={size["diameter"] || ""} onChange={handleChange} disable={disable} />
        <CardText style={{ textAlign: "center" }} disable={disable}>
          {t("CS_FILE_PROPERTY_DIAMETER")}
        </CardText>
      </div>
      <span>x</span>
      <div>
        <DimentionInput name="height" value={size["height"] || ""} onChange={handleChange} disable={disable} />
        <CardText style={{ textAlign: "center" }} disable={disable}>
          {t("CS_FILE_PROPERTY_HEIGHT")}
        </CardText>
      </div>
    </div>
  ) : (
    <div className="inputWrapper">
      <div>
        <DimentionInput name="length" value={size["length"] || ""} onChange={handleChange} disable={disable} />
        <CardText style={{ textAlign: "center" }} disable={disable}>
          {t("CS_FILE_PROPERTY_LENGTH")}
        </CardText>
      </div>
      <span>x</span>
      <div>
        <DimentionInput name="width" value={size["width"] || ""} onChange={handleChange} disable={disable} />
        <CardText style={{ textAlign: "center" }} disable={disable}>
          {t("CS_FILE_PROPERTY_WIDTH")}
        </CardText>
      </div>
      <span>x</span>
      <div>
        <DimentionInput name="height" value={size["height"] || ""} onChange={handleChange} disable={disable} />
        <CardText style={{ textAlign: "center" }} disable={disable}>
          {t("CS_FILE_PROPERTY_HEIGHT")}
        </CardText>
      </div>
    </div>
  );
};

export default PitDimension;
