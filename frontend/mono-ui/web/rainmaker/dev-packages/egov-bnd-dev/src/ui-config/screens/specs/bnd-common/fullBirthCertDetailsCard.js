import {
  getCommonCard,
  getCommonTitle,
  getCommonSubHeader,
  getCommonGrayCard,
  getCommonContainer,
  getLabelWithValue,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  checkValueForNA,
  getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { genderValues } from "./../../../../ui-utils/constants";
import { convertEpochToDateWithTimeIST, ifUserRoleExists } from "../utils";

const addSpace = (data) => {
  return "" + checkValueForNA(data);
};

const addMoneySuffix = (data) => {
  data = checkValueForNA(data);
  return data === "NA" ? data : data + " /-";
};

const checkNoData = (data) => {
  data = checkValueForNA(data);
  return data === "NA" ? "-" : data;
};

const getGenderStr = (data) => {
  data = checkValueForNA(data);
  data = data != "NA" ? genderValues[data] : data;
  return data;
};

export const getPersonDetailsForm = (type, inJsonPath) => {
  return getCommonContainer({
    firstName: getLabelWithValue(
      {
        labelName: "BND_FIRSTNAME_LABEL",
        labelKey: "BND_FIRSTNAME_LABEL",
      },
      {
        jsonPath: inJsonPath + `.${type}.firstname`,
        callBack: checkNoData,
      }
    ),
    middlename: getLabelWithValue(
      {
        labelName: "BND_MIDDLENAME_LABEL",
        labelKey: "BND_MIDDLENAME_LABEL",
      },
      {
        jsonPath: inJsonPath + `.${type}.middlename`,
        callBack: checkNoData,
      }
    ),
    lastname: getLabelWithValue(
      {
        labelName: "BND_LASTNAME_LABEL",
        labelKey: "BND_LASTNAME_LABEL",
      },
      {
        jsonPath: inJsonPath + `.${type}.lastname`,
        callBack: checkNoData,
      }
    ),
    aadharNo: getLabelWithValue(
      {
        labelName: "BND_AADHAR_NO",
        labelKey: "BND_AADHAR_NO",
      },
      {
        jsonPath: inJsonPath + `.${type}.aadharno`,
        callBack: checkNoData,
      }
    ),
    emailId: getLabelWithValue(
      {
        labelName: "BND_EMAIL_ID",
        labelKey: "BND_EMAIL_ID",
      },
      {
        jsonPath: inJsonPath + `.${type}.emailid`,
        callBack: checkNoData,
      }
    ),
    mobNo: getLabelWithValue(
      {
        labelName: "CORE_COMMON_MOBILE_NUMBER",
        labelKey: "CORE_COMMON_MOBILE_NUMBER",
      },
      {
        jsonPath: inJsonPath + `.${type}.mobileno`,
        callBack: checkNoData,
      }
    ),
    education: getLabelWithValue(
      {
        labelName: "BND_EDUCATION",
        labelKey: "BND_EDUCATION",
      },
      {
        jsonPath: inJsonPath + `.${type}.education`,
        callBack: checkNoData,
      }
    ),
    profession: getLabelWithValue(
      {
        labelName: "BND_PROFESSION",
        labelKey: "BND_PROFESSION",
      },
      {
        jsonPath: inJsonPath + `.${type}.proffession`,
        callBack: checkNoData,
      }
    ),
    nationality: getLabelWithValue(
      {
        labelName: "BND_NATIONALITY",
        labelKey: "BND_NATIONALITY",
      },
      {
        jsonPath: inJsonPath + `.${type}.nationality`,
        callBack: checkNoData,
      }
    ),
    religion: getLabelWithValue(
      {
        labelName: "BND_RELIGION",
        labelKey: "BND_RELIGION",
      },
      {
        jsonPath: inJsonPath + `.${type}.religion`,
        callBack: checkNoData,
      }
    ),
  });
};

export const getAddressForm = (type, inJsonPath) => {
  return getCommonContainer({
    buildingNo: getLabelWithValue(
      {
        labelName: "BND_BUILDINGNO_LABEL",
        labelKey: "BND_BUILDINGNO_LABEL",
      },
      {
        jsonPath: inJsonPath + `.${type}.buildingno`,
        callBack: checkNoData,
      }
    ),
    houseNo: getLabelWithValue(
      {
        labelName: "BND_HOUSENO_LABEL",
        labelKey: "BND_HOUSENO_LABEL",
      },
      {
        jsonPath: inJsonPath + `.${type}.houseno`,
        callBack: checkNoData,
      }
    ),
    streetname: getLabelWithValue(
      {
        labelName: "BND_STREETNAME_LABEL",
        labelKey: "BND_STREETNAME_LABEL",
      },
      {
        jsonPath: inJsonPath + `.${type}.streetname`,
        callBack: checkNoData,
      }
    ),
    locality: getLabelWithValue(
      {
        labelName: "BND_LOCALITY_LABEL",
        labelKey: "BND_LOCALITY_LABEL",
      },
      {
        jsonPath: inJsonPath + `.${type}.locality`,
        callBack: checkNoData,
      }
    ),
    tehsil: getLabelWithValue(
      {
        labelName: "BND_TEHSIL_LABEL",
        labelKey: "BND_TEHSIL_LABEL",
      },
      {
        jsonPath: inJsonPath + `.${type}.tehsil`,
        callBack: checkNoData,
      }
    ),
    district: getLabelWithValue(
      {
        labelName: "BND_DISTRICT_LABEL",
        labelKey: "BND_DISTRICT_LABEL",
      },
      {
        jsonPath: inJsonPath + `.${type}.district`,
        callBack: checkNoData,
      }
    ),
    city: getLabelWithValue(
      {
        labelName: "BND_CITY_LABEL",
        labelKey: "BND_CITY_LABEL",
      },
      {
        jsonPath: inJsonPath + `.${type}.city`,
        callBack: checkNoData,
      }
    ),
    state: getLabelWithValue(
      {
        labelName: "BND_STATE_LABEL",
        labelKey: "BND_STATE_LABEL",
      },
      {
        jsonPath: inJsonPath + `.${type}.state`,
        callBack: checkNoData,
      }
    ),
    pinno: getLabelWithValue(
      {
        labelName: "BND_PINNO_LABEL",
        labelKey: "BND_PINNO_LABEL",
      },
      {
        jsonPath: inJsonPath + `.${type}.pinno`,
        callBack: checkNoData,
      }
    ),
    country: getLabelWithValue(
      {
        labelName: "BND_COUNTRY_LABEL",
        labelKey: "BND_COUNTRY_LABEL",
      },
      {
        jsonPath: inJsonPath + `.${type}.country`,
        callBack: checkNoData,
      }
    ),
  });
};
export const getFullBirthCertDetailsCard = (inJsonPath) => {
  return getCommonCard({
    header: getCommonTitle(
      {
        labelName: "",
        labelKey: "BND_REGISTRATION",
      },
      {
        style: {
          marginBottom: 18,
        },
      }
    ),
    editButton: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          minWidth: "50px",
          height: "30px",
          float: "right",
          borderRadius: "inherit",
        },
      },
      visible: false,
      children: {
        previousButtonLabel: getLabel({
          labelName: "Previous Step",
          labelKey: "CORE_COMMON_EDIT",
        }),
      },

      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
          const newRegData = _.clone(
            get(
              state.screenConfiguration.preparedFinalObject,
              "bnd.viewFullCertDetails",
              []
            ),
            true
          );
          let id = newRegData["id"];
          let applyUrl = `/birth-employee/newRegistration?action=EDIT&certificateId=${id}&module=birth`;
          dispatch(setRoute(applyUrl));
        },
      },
    },
    registrationInfo: getCommonGrayCard({
      header: getCommonSubHeader(
        {
          labelName: "",
          labelKey: "BND_REGISTRATION",
        },
        {
          style: {
            marginBottom: 18,
          },
        }
      ),
      registrationInfoCont: getCommonContainer({
        registrationNo: getLabelWithValue(
          {
            labelName: "BND_REG_NO_LABEL",
            labelKey: "BND_REG_NO_LABEL",
          },
          {
            jsonPath: inJsonPath + ".registrationno",
            callBack: checkNoData,
          }
        ),
        hospitalName: getLabelWithValue(
          {
            labelName: "BND_HOSPITALNAME_LABEL",
            labelKey: "BND_HOSPITALNAME_LABEL",
          },
          {
            jsonPath: inJsonPath + ".hospitalname",
            callBack: checkNoData,
          }
        ),
        dateOfRegistration: getLabelWithValue(
          {
            labelName: "BND_DOR",
            labelKey: "BND_DOR",
          },
          {
            jsonPath: inJsonPath + ".dateofreport",
            callBack: convertEpochToDateWithTimeIST,
          }
        ),
      }),
    }),
    childInfo: getCommonGrayCard({
      header: getCommonSubHeader(
        {
          labelName: "",
          labelKey: "BND_INFO_OF_CHILD",
        },
        {
          style: {
            marginBottom: 18,
          },
        }
      ),
      infoOfChild: getCommonContainer({
        dob: getLabelWithValue(
          {
            labelName: "BND_BIRTH_DOB",
            labelKey: "BND_BIRTH_DOB",
          },
          {
            jsonPath: inJsonPath + ".dateofbirth",
            callBack: convertEpochToDateWithTimeIST,
          }
        ),
        gender: getLabelWithValue(
          {
            labelName: "BND_GENDER",
            labelKey: "BND_GENDER",
          },
          {
            jsonPath: inJsonPath + ".genderStr",
            callBack: checkNoData,
          }
        ),
        firstName: getLabelWithValue(
          {
            labelName: "BND_FIRSTNAME_LABEL",
            labelKey: "BND_FIRSTNAME_LABEL",
          },
          {
            jsonPath: inJsonPath + ".firstname",
            callBack: checkNoData,
          }
        ),
        middlename: getLabelWithValue(
          {
            labelName: "BND_MIDDLENAME_LABEL",
            labelKey: "BND_MIDDLENAME_LABEL",
          },
          {
            jsonPath: inJsonPath + ".middlename",
            callBack: checkNoData,
          }
        ),
        lastname: getLabelWithValue(
          {
            labelName: "BND_LASTNAME_LABEL",
            labelKey: "BND_LASTNAME_LABEL",
          },
          {
            jsonPath: inJsonPath + ".lastname",
            callBack: checkNoData,
          }
        ),
      }),
    }),
    placeInfo: getCommonGrayCard({
      header: getCommonSubHeader(
        {
          labelName: "",
          labelKey: "BND_BIRTH_PLACE",
        },
        {
          style: {
            marginBottom: 18,
          },
        }
      ),
      placeOfBirth: getCommonContainer({
        firstName: getLabelWithValue(
          {
            labelName: "BND_BIRTH_PLACE",
            labelKey: "BND_BIRTH_PLACE",
          },
          {
            jsonPath: inJsonPath + ".placeofbirth",
            callBack: checkNoData,
          }
        ),
      }),
    }),
    fathersInfo: getCommonGrayCard({
      header: getCommonSubHeader(
        {
          labelName: "",
          labelKey: "BND_FATHERS_INFO",
        },
        {
          style: {
            marginBottom: 18,
          },
        }
      ),
      fathersInfo: getPersonDetailsForm("birthFatherInfo", inJsonPath),
    }),
    mothersInfo: getCommonGrayCard({
      header: getCommonSubHeader(
        {
          labelName: "",
          labelKey: "BND_MOTHERS_INFO",
        },
        {
          style: {
            marginBottom: 18,
          },
        }
      ),
      mothersInfo: getPersonDetailsForm("birthMotherInfo", inJsonPath),
    }),
    addrTimeOfBirth: getCommonGrayCard({
      header: getCommonSubHeader(
        {
          labelName: "",
          labelKey: "BND_PRESENT_ADDR_DURING_BIRTH",
        },
        {
          style: {
            marginBottom: 18,
          },
        }
      ),
      addrTimeOfBirth: getAddressForm("birthPresentaddr", inJsonPath),
    }),
    permAddressofParents: getCommonGrayCard({
      header: getCommonSubHeader(
        {
          labelName: "",
          labelKey: "BND_BIRTH_ADDR_PERM",
        },
        {
          style: {
            marginBottom: 18,
          },
        }
      ),
      permAddressofParents: getAddressForm("birthPermaddr", inJsonPath),
    }),
    informantsInfo: getCommonGrayCard({
      header: getCommonSubHeader(
        {
          labelName: "",
          labelKey: "BND_INFORMANTS_INFO",
        },
        {
          style: {
            marginBottom: 18,
          },
        }
      ),
      informantInfo: getCommonContainer({
        informantName: getLabelWithValue(
          {
            labelName: "CORE_COMMON_NAME",
            labelKey: "CORE_COMMON_NAME",
          },
          {
            jsonPath: inJsonPath + `.informantsname`,
            callBack: checkNoData,
          }
        ),
        informantsAddress: getLabelWithValue(
          {
            labelName: "BND_ADDRESS",
            labelKey: "BND_ADDRESS",
          },
          {
            jsonPath: inJsonPath + `.informantsaddress`,
            callBack: checkNoData,
          }
        ),
      }),
    }),
    remarksInfo: getCommonGrayCard({
      header: getCommonSubHeader(
        {
          labelName: "",
          labelKey: "BND_REMARKS_LABEL",
        },
        {
          style: {
            marginBottom: 18,
          },
        }
      ),
      informantInfo: getCommonContainer({
        remarks: getLabelWithValue(
          {
            labelName: "BND_REMARKS_LABEL",
            labelKey: "BND_REMARKS_LABEL",
          },
          {
            jsonPath: inJsonPath + `.remarks`,
            callBack: checkNoData,
          }
        ),
      }),
    }),
  });
};
