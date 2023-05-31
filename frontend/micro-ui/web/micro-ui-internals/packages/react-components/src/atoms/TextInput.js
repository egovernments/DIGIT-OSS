import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { LocateIcon } from "./svgindex";

const TextInput = (props) => {
  const user_type = Digit.SessionStorage.get("userType");
  const [date, setDate] = useState(props?.type==="date"&&props?.value);
  const data = props?.watch
    ? {
        fromDate: props?.watch("fromDate"),
        toDate: props?.watch("toDate"),
      }
    : {};

  const handleDate = (event) => {
    const { value } = event.target;
    setDate(getDDMMYYYY(value));
  };

  return (
    <React.Fragment>
      <div className={`text-input ${user_type === "employee" ? "" :"text-input-width"} ${props.className}`} style={props?.textInputStyle ? { ...props.textInputStyle} : {}}>
        {props.isMandatory ? (
          <input
            type={props?.validation && props.ValidationRequired ? props?.validation?.type : (props.type || "text")}
            name={props.name}
            id={props.id}
            className={`${user_type ? "employee-card-input-error" : "card-input-error"} ${props.disable && "disabled"} ${props.customClass}`}
            placeholder={props.placeholder}
            onChange={(event) => {
              if(props?.type === "number" && props?.maxlength) {
                if(event.target.value.length > props?.maxlength) {
                  event.target.value = event.target.value.slice(0,-1);
                }
              }
              if (props?.onChange) {
                props?.onChange(event);
              }
              if (props.type === "date") {
                handleDate(event);
              }
            }}
            ref={props.inputRef}
            value={props.value}
            style={{ ...props.style }}
            defaultValue={props.defaultValue}
            minLength={props.minlength}
            maxLength={props.maxlength}
            max={props.max}
            pattern={props?.validation && props.ValidationRequired ? props?.validation?.pattern : props.pattern}
            min={props.min}
            readOnly={props.disable}
            title={props?.validation && props.ValidationRequired ? props?.validation?.title :props.title}
            step={props.step}
            autoFocus={props.autoFocus}
            onBlur={props.onBlur}
            autoComplete="off"
            disabled={props.disabled}
          />
        ) : (
          <input
            type={props?.validation && props.ValidationRequired ? props?.validation?.type : (props.type || "text")}
            name={props.name}
            id={props.id}
            className={`${user_type ? "employee-card-input" : "citizen-card-input"} ${props.disable && "disabled"} focus-visible ${props.errorStyle && "employee-card-input-error"} ${props.customClass}`}
            placeholder={props.placeholder}
            onChange={(event) => {
              if(props?.type === "number" && props?.maxlength) {
                if(event.target.value.length > props?.maxlength) {
                  event.target.value = event.target.value.slice(0,-1);
                }
              }
              if (props?.onChange) {
                props?.onChange(event);
              }
              if (props.type === "date") {
                handleDate(event);
              }
            }}
            ref={props.inputRef}
            value={props.value}
            style={{ ...props.style }}
            defaultValue={props.defaultValue}
            minLength={props.minlength}
            maxLength={props.maxlength}
            max={props.max}
            required={props?.validation && props.ValidationRequired ? props?.validation?.isRequired :props.isRequired || (props.type === "date" && (props.name === "fromDate" ? data.toDate : data.fromDate))}
            pattern={props?.validation && props.ValidationRequired ? props?.validation?.pattern : props.pattern}
            min={props.min}
            readOnly={props.disable}
            title={props?.validation && props.ValidationRequired ? props?.validation?.title :props.title}
            step={props.step}
            autoFocus={props.autoFocus}
            onBlur={props.onBlur}
            onKeyPress={props.onKeyPress}
            autoComplete="off"
            disabled={props.disabled}
          />
        )}
        {/* {props.type === "date" && <DatePicker {...props} date={date} setDate={setDate} data={data} />} */}
        {props.signature ? props.signatureImg : null}
        {props.customIcon ? props.customIcon === "geolocation" ? <span className="cursor-pointer" onClick={props?.onIconSelection} ><LocateIcon className="text-input-customIcon" /></span> : null : null}
      </div>
    </React.Fragment>
  );
};

TextInput.propTypes = {
  userType: PropTypes.string,
  isMandatory: PropTypes.bool,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  ref: PropTypes.func,
  value: PropTypes.any,
};

TextInput.defaultProps = {
  isMandatory: false,
};

function DatePicker(props) {
  useEffect(() => {
    if (props?.shouldUpdate) {
      props?.setDate(getDDMMYYYY(props?.data[props.name], "yyyymmdd"));
    }
  }, [props?.data]);

  useEffect(() => {
    props.setDate(getDDMMYYYY(props?.defaultValue));
  }, []);

  return (
    <input
      type="text"
      className={`${props.disable && "disabled"} card-date-input`}
      name={props.name}
      id={props.id}
      placeholder={props.placeholder}
      defaultValue={props.date}
      readOnly={true}
    />
  );
}

function getDDMMYYYY(date) {
  if (!date) return "";

  return new Date(date).toLocaleString("en-In").split(",")[0];
}

export default TextInput;
