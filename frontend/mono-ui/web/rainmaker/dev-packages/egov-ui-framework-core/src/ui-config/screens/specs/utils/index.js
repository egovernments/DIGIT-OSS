import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField } from "../../../../ui-redux/screen-configuration/actions";
import { getTranslatedLabel } from "../../../../ui-utils/commons";

const appCardHeaderStyle = (colorOne = "#ec407a", colorTwo = "#d81b60") => {
  return {
    color: "#FFFFFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "50px",
    padding: "15px",
    marginTop: "-36px",
    borderRadius: "3px",
    background: `linear-gradient(60deg,${colorOne} ,${colorTwo} )`,
    boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.14)"
  };
};

export const getStepperObject = (
  stpperProps,
  stepsData,
  uiFramework = "material-ui"
) => {
  let stepperData = {};
  if (uiFramework === "material-ui") {
    stepperData = {
      componentPath: "Stepper",
      uiFramework: "custom-molecules",
      props: {
        steps: stepsData,
        ...stpperProps.props
      }
    };
  }
  return stepperData;
};

export const getCommonHeader = (header, props) => {
  return {
    componentPath: "Typography",
    props: {
      variant: "headline",
      ...props
    },
    children: {
      // [header]: getLabel(header)
      key: getLabel(header)
    }
  };
};

export const getCommonTitle = (header, props = {}) => {
  return getCommonHeader(header, { variant: "title", ...props });
};

export const getCommonSubHeader = (header, props = {}) => {
  return getCommonHeader(header, { variant: "subheading", ...props });
};

export const getCommonParagraph = (paragraph, props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: {
        color: "rgba(0, 0, 0, 0.60)",
        fontFamily: "Roboto",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "20px",
        marginBottom: "12px",
        position: "relative",
        top: "1px",
        flex: "none"
      },
      ...props
    },

    children: {
      [paragraph]: getLabel(paragraph)
    }
  };
  // getCommonHeader(paragraph, { variant: "body1", ...props });
};

export const getCommonCaption = (paragraph, props = {}) => {
  return getCommonHeader(paragraph, { variant: "caption", ...props });
};

export const getCommonValue = (value, props = {}) => {
  return getCommonHeader(value, { variant: "body2", ...props });
};


export const getCommonLabelWithValue = (paragraph, value, props = {}) => {
  return getCommonLabelValue(paragraph, value, { variant: "caption", ...props });
}

export const getCommonLabelValue = (header, value, props) => {
  return {
    componentPath: "Typography",
    props: {
      variant: "headline",
      ...props
    },
    children: {
      // [header]: getLabel(header)
      key: getLabelForModify(header, value),
    }
  };
};

export const getCommonCard = (children, cardProps = {}, cardContentProps = {}) => {
  return {
    componentPath: "Card",
    props: {
      ...cardProps
    },
    children: {
      cardContent: {
        componentPath: "CardContent",
        props: {
          ...cardContentProps
        },
        children
      }
    }
  };
};

export const getCommonCardWithHeader = (
  children,
  header = {},
  cardProps = {}
) => {
  return getCommonCard({
    cardContainer: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      children: {
        header: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          props: {
            style: appCardHeaderStyle()
          },
          children: header,
          gridDefination: {
            xs: 12
          }
        },
        body: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          children,
          gridDefination: {
            xs: 12
          }
        }
      }
    }
  });
};

export const getCommonGrayCard = children => {
  return getCommonCard(children, {
    style: {
      backgroundColor: "rgb(242, 242, 242)",
      boxShadow: "none",
      borderRadius: 0,
      overflow: "visible"
    }
  });
};
export const getCommonCardWithNoShadow = children => {
  return getCommonCard(children, {
    style: {
      boxShadow: "none",
      borderRadius: 0,
      overflow: "visible"
    }
  });
};

export const getBreak = (props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Break",
    props
  };
};

export const getLabel = (label, labelKey, props = {}) => {
  return {
    uiFramework: "custom-containers",
    componentPath: "LabelContainer",
    props: {
      ...label,
      ...props
    }
  };
};

export const getLabelForModify = (label, jsonPath, props = {}) => {
  return {
    uiFramework: "custom-containers",
    componentPath: "ModifyLabelConatiner",
    props: {
      ...label,
      ...jsonPath,
      ...props
    }
  };
};

export const getSelectField = selectScheama => {
  return getTextField({
    ...selectScheama,
    props: { select: true, ...selectScheama.props }
  });
};

export const getDateField = dateScheama => {
  return getTextField({
    ...dateScheama,
    props: {
      type: "date",
      ...dateScheama.props
    }
  });
};

export const getTimeField = timeScheama => {
  return getTextField({
    ...timeScheama,
    props: {
      type: "time",
      ...timeScheama.props
    }
  });
};

export const getDateTimeField = dateTimeScheama => {
  return getTextField({
    ...dateTimeScheama,
    props: {
      type: "datetime-local",
      ...dateTimeScheama.props
    }
  });
};

export const getTextField = textScheama => {
  const {
    label = {},
    placeholder = {},
    localePrefix = {},
    required = false,
    pattern,
    jsonPath = "",
    sourceJsonPath = "",
    cityDropdown = "",
    data = [],
    optionValue = "code",
    optionLabel = "code",
    iconObj = {},
    gridDefination = {
      xs: 12,
      sm: 6
    },
    props = {},
    minLength,
    maxLength,
    minValue,
    maxValue,
    infoIcon,
    title = {},
    multiline = false,
    rows = "1",
    disabled = false,
    errorMessage = "",
    requiredMessage = "",
    ...rest
  } = textScheama;
  return {
    uiFramework: "custom-containers",
    componentPath: "TextFieldContainer",
    props: {
      label,
      InputLabelProps: {
        shrink: true
      },
      placeholder,
      localePrefix,
      fullWidth: true,
      required,
      data,
      optionValue,
      optionLabel,
      sourceJsonPath,
      cityDropdown,
      jsonPath,
      iconObj,
      title,
      disabled,
      multiline,
      rows,
      infoIcon,
      errorMessage,
      ...props
    },
    gridDefination,
    required,
    pattern,
    jsonPath,
    minLength,
    maxLength,
    minValue,
    maxValue,
    errorMessage,
    requiredMessage,
    ...rest
  };
};

export const getLocaleLabelsforTL = (label, labelKey, localizationLabels) => {
  if (labelKey) {
    let translatedLabel = getTranslatedLabel(labelKey, localizationLabels);
    if (!translatedLabel || labelKey === translatedLabel) {
      return label;
    } else {
      return translatedLabel;
    }
  } else {
    return label;
  }
};

export const getCheckBoxwithLabel = (
  label,
  gridDefination = {
    xs: 12,
    sm: 12
  },
  props = {}
) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination,
    props,
    children: {
      div: {
        uiFramework: "material-ui",
        componentPath: "Checkbox",
        props: {
          color: "primary"
        }
      },
      label: getLabel(label)
    }
  };
};

export const getRadiobuttonwithLabel = (label, props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props,
    children: {
      div: {
        uiFramework: "material-ui",
        componentPath: "Radio",
        props: {
          color: "primary"
        }
      },
      label: getLabel(label)
    }
  };
};

export const getRadiobuttonGroup = (
  labels,
  gridDefination = {
    xs: 12,
    sm: 12
  }
) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    gridDefination,
    children:
      labels &&
      labels.map(label => {
        return getRadiobuttonwithLabel(label);
      })
  };
};

export const getRadioButton = (buttons, jsonPath, defaultValue) => {
  return {
    uiFramework: "custom-containers",
    componentPath: "RadioGroupContainer",
    gridDefination: {
      xs: 12,
      sm: 4
    },

    props: {
      buttons,
      jsonPath,
      defaultValue
    },
    jsonPath
  };
};

export const getCommonContainer = (children, props = {}) => {
  return {
    componentPath: "Grid",
    props: {
      container: true,
      ...props
    },
    children
  };
};

export const getDivider = (props = {}) => {
  return {
    componentPath: "Divider",
    props
  };
};

export const dispatchMultipleFieldChangeAction = (
  screenKey,
  actionDefination = [],
  dispatch
) => {
  for (var i = 0; i < actionDefination.length; i++) {
    const { path, property, value } = actionDefination[i];
    dispatch(handleField(screenKey, path, property, value));
  }
};

export const getLabelWithValue = (label, value, props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 6,
      sm: 3
    },
    props: {
      style: {
        marginBottom: "16px",
        wordBreak: "break-word"
      },
      ...props
    },
    children: {
      label: getCommonCaption(label),
      value: getCommonValue(value)
    }
  };
};

export const getLabelWithValueForModifiedLabel = (label, value, label2, value2, props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 6,
      sm: 3
    },
    props: {
      style: {
        marginBottom: "16px",
        wordBreak: "break-word"
      },
      ...props
    },
    children: {
      label1: getCommonCaption(label),
      value1: getCommonValue(value),
      label2: getCommonLabelWithValue(label2, value2)
    }
  };
};

export const convertEpochToDate = dateEpoch => {
  // Returning null in else case because new Date(null) returns initial date from calender
  if (dateEpoch) {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
  } else {
    return null;
  }
};

export const convertDateToEpoch = (dateString, dayStartOrEnd = "dayend") => {
  //example input format : "2018-10-02"
  try {
    const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
    DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
    if (dayStartOrEnd === "dayend") {
      DateObj.setHours(DateObj.getHours() + 24);
      DateObj.setSeconds(DateObj.getSeconds() - 1);
    }
    return DateObj.getTime();
  } catch (e) {
    return dateString;
  }
};

export const getTabs = (list, props = {}) => {
  return {
    uiFramework: "material-ui",
    componentPath: "Tabs",
    props,
    children:
      list &&
      list.map(element => {
        return getTab(element);
      })
  };
};

export const getTab = (label, props = {}) => {
  return {
    uiFramework: "material-ui",
    componentPath: "Tab",
    props: {
      label,
      ...props
    }
  };
};

export const getPattern = type => {
  switch (type) {
    case "Name":
      return /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i;
    case "SearchOwnerName":
      return /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{3,50}$/i;
    case "MobileNo":
      return /^[6789][0-9]{9}$/i;
    case "Amount":
      return /^[0-9]{0,8}$/i;
    case "NonZeroAmount":
      return /^[1-9][0-9]{0,7}$/i;
    case "DecimalNumber":
      return /^\d{0,8}(\.\d{1,2})?$/i;
    //return /(([0-9]+)((\.\d{1,2})?))$/i;
    case "Email":
      return /^(?=^.{1,64}$)((([^<>()\[\]\\.,;:\s$*@'"]+(\.[^<>()\[\]\\.,;:\s@'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/i;
    case "Address":
      return /^[^\$\"<>?\\\\~`!@$%^()+={}\[\]*:;“”‘’]{1,500}$/i;
    case "PAN":
      return /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/i;
    case "TradeName":
      return /^[-@.\/#&+\w\s]*$/
    //return /^[^\$\"'<>?\\\\~`!@#$%^()+={}\[\]*,.:;“”‘’]{1,100}$/i;
    case "Date":
      return /^[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/i;
    case "UOMValue":
      return /^(0)*[1-9][0-9]{0,5}$/i;
    case "OperationalArea":
      return /^(0)*[1-9][0-9]{0,6}$/i;
    case "NoOfEmp":
      return /^(0)*[1-9][0-9]{0,6}$/i;
    case "GSTNo":
      return /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/i;
    case "DoorHouseNo":
      return /^[^\$\"'<>?~`!@$%^={}\[\]*:;“”‘’]{1,50}$/i;
    case "BuildingStreet":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,64}$/i;
    case "Pincode":
      return /^[1-9][0-9]{5}$/i;
    case "Landline":
      return /^[0-9]{11}$/i;
    case "PropertyID":
      return /^[a-zA-z0-9\s\\/\-]$/i;
    case "ElectricityConnNo":
      return /^.{1,15}$/i;
    case "DocumentNo":
      return /^[0-9]{1,15}$/i;
    case "eventName":
      return /^[^\$\"<>?\\\\~`!@#$%^()+={}\[\]*,.:;“”]{1,65}$/i;
    case "eventDescription":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,500}$/i;
    case "cancelChallan":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,100}$/i;
    case "FireNOCNo":
      return /^[a-zA-Z0-9-]*$/i;
    case "consumerNo":
      return /^[a-zA-Z0-9/-]*$/i;
    case "AadharNo":
      //return /^\d{4}\s\d{4}\s\d{4}$/;
      return /^([0-9]){12}$/;
    case "ChequeNo":
      return /^(?!0{6})[0-9]{6}$/;
    case "Comments":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,50}$/i;
    case "OldLicenceNo":
      return /^[a-zA-Z0-9-/]{0,64}$/;

  }
};

export const checkValueForNA = value => {
  return value && value !== "null" ? value : "NA";
};

export const downloadHelpFile = async (state) => {
  console.info("download the help file");
  const helpurl = get(state.screenConfiguration.preparedFinalObject,
    "helpFileUrl",
    ""
  );
  window.open(helpurl, "_blank");
};
