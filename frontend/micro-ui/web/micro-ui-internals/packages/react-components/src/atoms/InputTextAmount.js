import TextInput from "./TextInput";

import React, { forwardRef, useImperativeHandle, useMemo, useRef, useEffect, useState } from "react";
import {
  cleanValue,
  fixedDecimalValue,
  formatValue,
  getLocaleConfig,
  getIntlConfig,
  getSuffix,
  isNumber,
  padTrimValue,
  repositionCursor,
} from "./amtUtils";

/* Amount component by default round offs and formats for amount   */

const InputTextAmount = ({ value, prefix = "₹ ",intlConfig = getIntlConfig(prefix), onChange, inputRef,...otherProps }) => {
  return <InputAmountWrapper ref={inputRef} defaultValue={value} intlConfig={intlConfig}  onValueChange={onChange} otherProps={otherProps} prefix={prefix}></InputAmountWrapper>;
};

export default InputTextAmount;

export const CurrencyInput = forwardRef(
  (
    {
      allowDecimals = true,
      allowNegativeValue = true,
      id,
      name,
      className,
      customInput,
      decimalsLimit,
      defaultValue,
      disabled = false,
      maxLength: userMaxLength,
      value: userValue,
      onValueChange,
      fixedDecimalLength,
      placeholder,
      decimalScale,
      prefix,
      suffix,
      intlConfig,
      step,
      min,
      max,
      disableGroupSeparators = false,
      disableAbbreviations = false,
      decimalSeparator: _decimalSeparator,
      groupSeparator: _groupSeparator,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      onKeyUp,
      transformRawValue,
      otherProps,
      inputRef:inputRefFrom,
      ...props
    },
    ref
  ) => {
    if (_decimalSeparator && isNumber(_decimalSeparator)) {
      throw new Error("decimalSeparator cannot be a number");
    }

    if (_groupSeparator && isNumber(_groupSeparator)) {
      throw new Error("groupSeparator cannot be a number");
    }

    const localeConfig = useMemo(() => getLocaleConfig(intlConfig), [intlConfig]);
    const decimalSeparator = _decimalSeparator || localeConfig.decimalSeparator || "";
    const groupSeparator = _groupSeparator || localeConfig.groupSeparator || "";

    if (decimalSeparator && groupSeparator && decimalSeparator === groupSeparator && disableGroupSeparators === false) {
      throw new Error("decimalSeparator cannot be the same as groupSeparator");
    }

    const formatValueOptions = {
      decimalSeparator,
      groupSeparator,
      disableGroupSeparators,
      intlConfig,
      prefix: prefix || localeConfig.prefix,
      suffix: suffix,
    };

    const cleanValueOptions = {
      decimalSeparator,
      groupSeparator,
      allowDecimals,
      decimalsLimit: decimalsLimit || fixedDecimalLength || 2,
      allowNegativeValue,
      disableAbbreviations,
      prefix: prefix || localeConfig.prefix,
      transformRawValue,
    };

    const formattedStateValue =
      defaultValue !== undefined && defaultValue !== null
        ? formatValue({ ...formatValueOptions, decimalScale, value: String(defaultValue) })
        : userValue !== undefined && userValue !== null
        ? formatValue({ ...formatValueOptions, decimalScale, value: String(userValue) })
        : "";

    const [stateValue, setStateValue] = useState(formattedStateValue);
    const [dirty, setDirty] = useState(false);
    const [cursor, setCursor] = useState(0);
    const [changeCount, setChangeCount] = useState(0);
    const [lastKeyStroke, setLastKeyStroke] = useState(null);
    const inputRef = useRef(inputRefFrom);
    useImperativeHandle(ref, () => inputRef.current);

    /**
     * Process change in value
     */
    const processChange = (value, selectionStart) => {
      setDirty(true);

      const { modifiedValue, cursorPosition } = repositionCursor({
        selectionStart,
        value,
        lastKeyStroke,
        stateValue,
        groupSeparator,
      });

      const stringValue = cleanValue({ value: modifiedValue, ...cleanValueOptions });

      if (userMaxLength && stringValue.replace(/-/g, "").length > userMaxLength) {
        return;
      }

      if (stringValue === "" || stringValue === "-" || stringValue === decimalSeparator) {
        onValueChange && onValueChange(undefined, name, { float: null, formatted: "", value: "" });
        setStateValue(stringValue);
        return;
      }

      const stringValueWithoutSeparator = decimalSeparator ? stringValue.replace(decimalSeparator, ".") : stringValue;

      const numberValue = parseFloat(stringValueWithoutSeparator);

      const formattedValue = formatValue({
        value: stringValue,
        ...formatValueOptions,
      });

      if (cursorPosition !== undefined && cursorPosition !== null) {
        // Prevent cursor jumping
        let newCursor = cursorPosition + (formattedValue.length - value.length);
        newCursor = newCursor <= 0 ? (prefix ? prefix.length : 0) : newCursor;

        setCursor(newCursor);
        setChangeCount(changeCount + 1);
      }

      setStateValue(formattedValue);

      if (onValueChange) {
        const values = {
          float: numberValue,
          formatted: formattedValue,
          value: stringValue,
        };
        onValueChange(stringValue, name, values);
      }
    };

    /**
     * Handle change event
     */
    const handleOnChange = (event) => {
      const {
        target: { value, selectionStart },
      } = event;

      processChange(value, selectionStart);

      onChange && onChange(event);
    };

    /**
     * Handle focus event
     */
    const handleOnFocus = (event) => {
      onFocus && onFocus(event);
      return stateValue ? stateValue.length : 0;
    };

    /**
     * Handle blur event
     *
     * Format value by padding/trimming decimals if required by
     */
    const handleOnBlur = (event) => {
      const {
        target: { value },
      } = event;

      const valueOnly = cleanValue({ value, ...cleanValueOptions });

      if (valueOnly === "-" || !valueOnly) {
        setStateValue("");
        onBlur && onBlur(event);
        return;
      }

      const fixedDecimals = fixedDecimalValue(valueOnly, decimalSeparator, fixedDecimalLength);

      const newValue = padTrimValue(fixedDecimals, decimalSeparator, decimalScale !== undefined ? decimalScale : fixedDecimalLength);

      const numberValue = parseFloat(newValue.replace(decimalSeparator, "."));

      const formattedValue = formatValue({
        ...formatValueOptions,
        value: newValue,
      });

      if (onValueChange) {
        onValueChange(newValue, name, {
          float: numberValue,
          formatted: formattedValue,
          value: newValue,
        });
      }

      setStateValue(formattedValue);

      onBlur && onBlur(event);
    };

    /**
     * Handle key down event
     *
     * Increase or decrease value by step
     */
    const handleOnKeyDown = (event) => {
      const { key } = event;

      setLastKeyStroke(key);

      if (step && (key === "ArrowUp" || key === "ArrowDown")) {
        event.preventDefault();
        setCursor(stateValue.length);

        const currentValue =
          parseFloat(
            userValue !== undefined && userValue !== null
              ? String(userValue).replace(decimalSeparator, ".")
              : cleanValue({ value: stateValue, ...cleanValueOptions })
          ) || 0;
        const newValue = key === "ArrowUp" ? currentValue + step : currentValue - step;

        if (min !== undefined && newValue < min) {
          return;
        }

        if (max !== undefined && newValue > max) {
          return;
        }

        const fixedLength = String(step).includes(".") ? Number(String(step).split(".")[1].length) : undefined;

        processChange(String(fixedLength ? newValue.toFixed(fixedLength) : newValue).replace(".", decimalSeparator));
      }

      onKeyDown && onKeyDown(event);
    };

    /**
     * Handle key up event
     *
     * Move cursor if there is a suffix to prevent user typing past suffix
     */
    const handleOnKeyUp = (event) => {
      const {
        key,
        currentTarget: { selectionStart },
      } = event;
      if (key !== "ArrowUp" && key !== "ArrowDown" && stateValue !== "-") {
        const suffix = getSuffix(stateValue, { groupSeparator, decimalSeparator });

        if (suffix && selectionStart && selectionStart > stateValue.length - suffix.length) {
          /* istanbul ignore else */
          if (inputRef.current) {
            const newCursor = stateValue.length - suffix.length;
            inputRef.current.setSelectionRange(newCursor, newCursor);
          }
        }
      }

      onKeyUp && onKeyUp(event);
    };

    useEffect(() => {
      // prevent cursor jumping if editing value
      if (dirty && stateValue !== "-" && inputRef.current && document.activeElement === inputRef.current) {
        inputRef.current.setSelectionRange(cursor, cursor);
      }
    }, [stateValue, cursor, inputRef, dirty, changeCount]);

    /**
     * If user has only entered "-" or decimal separator,
     * keep the char to allow them to enter next value
     */
    const getRenderValue = () => {
      if (userValue !== undefined && userValue !== null && stateValue !== "-" && (!decimalSeparator || stateValue !== decimalSeparator)) {
        return formatValue({
          ...formatValueOptions,
          decimalScale: dirty ? undefined : decimalScale,
          value: String(userValue),
        });
      }

      return stateValue;
    };

    const inputProps = {
      type: "text",
      inputMode: "decimal",
      id,
      name,
      className,
      onChange: handleOnChange,
      onBlur: handleOnBlur,
      onFocus: handleOnFocus,
      onKeyDown: handleOnKeyDown,
      onKeyUp: handleOnKeyUp,
      placeholder,
      disabled,
      value: getRenderValue(),
      ref: inputRef,
      ...props,
    };

    if (customInput) {
      const CustomInput = customInput;
      return <CustomInput {...inputProps} {...otherProps} />;
    }

    return <input {...inputProps} />;
  }
);

CurrencyInput.displayName = "CurrencyInput";

export const InputAmountWrapper = ({ref,...props}) => {
  const limit = 1000;
  const prefix = props?.prefix;

  const [errorMessage, setErrorMessage] = useState("");
  const [className, setClassName] = useState("");
  const [value, setValue] = useState(props?.defaultValue);
  const [values, setValues] = useState();
  const [rawValue, setRawValue] = useState(" ");

  useEffect(() => {
    props.onValueChange(value);
  }, [value]);

  /**
   * Handle validation
   */
  const handleOnValueChange = (value, _, values) => {
    setValues(values);
    setRawValue(value === undefined ? "undefined" : value || " ");

    if (!value) {
      setClassName("");
      setValue("");
      return;
    }

    if (Number.isNaN(Number(value))) {
      // setErrorMessage('Please enter a valid number');
      // setClassName('is-invalid');
      return;
    }

    if (Number(value) > limit) {
      // setErrorMessage(`Max: ${prefix}${limit}`);
      // setClassName('is-invalid');
      setValue(value);
      return;
    }

    // setClassName('is-valid');
    setValue(value);
  };

  return (
    <CurrencyInput
      id="validationCustom01"
      name="input-1"
      customInput={TextInput}
      className={`form-control ${className}`}
      value={ props.defaultValue ? props.defaultValue : (value ? value : "") }
      onValueChange={handleOnValueChange}
      // placeholder="Please enter a number"
      prefix={prefix}
      step={1}
      otherProps={props?.otherProps}
      inputRef={ref}
    />
  );
};
