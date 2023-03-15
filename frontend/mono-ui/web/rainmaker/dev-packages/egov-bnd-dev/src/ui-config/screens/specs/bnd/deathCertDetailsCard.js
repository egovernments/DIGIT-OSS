import {
  getCommonContainer,
  getDivider,
  getCommonGrayCard,
  getLabelWithValue,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { checkValueForNA } from "egov-ui-framework/ui-config/screens/specs/utils";
import {genderValues} from "./../../../../ui-utils/constants";
import {convertEpochToDateWithTimeIST} from "../utils";

const addSpace = data => {
  return ""+checkValueForNA(data);;
};

const addMoneySuffix = data => {
  data = checkValueForNA(data);
  return data==="NA"? data: data+" /-";
};

const checkNoData = data => {
  data = checkValueForNA(data);
  return data==="NA"? "-": data;
};

const getGenderStr = data => {
  data = checkValueForNA(data);
  data = data!="NA"?genderValues(data):data;
  return data;
};

export const getDeathCertDetailsCard = (inJsonPath) => {

  return getCommonGrayCard({

    // value2: getCommonValue({
    //   jsonPath: inJsonPath + ".detailsAndMutDate",
    //   callBack: addSpace
    // }),
    certDetailsContainer: getCommonContainer(
      {
        name: getLabelWithValue(
          {
            labelName: "Name",
            labelKey: "BND_NAME_LABEL"
          },
          {
            jsonPath: inJsonPath + ".fullName",
            callBack: checkNoData
          }
        ),
        genderStr: getLabelWithValue(
          {
            labelName: "Gender",
            labelKey: "BND_GENDER_LABEL"
          },
          {
            jsonPath: inJsonPath + ".genderStr",
            //callBack: getGenderStr
          }
        ),
        age: getLabelWithValue(
          {
            labelName: "Age",
            labelKey: "BND_AGE_LABEL"
          },
          {
            jsonPath: inJsonPath + ".age",
            //callBack: getGenderStr
          }
        ),
      }),
    //divider1: getDivider(),
    certDetailsContainer2: getCommonContainer(
      {
        dob: getLabelWithValue(
          {
            labelName: "Date of death",
            labelKey: "BND_DATE_DEATH"
          },
          {
            jsonPath: inJsonPath + ".dateofdeath",
            callBack: convertEpochToDateWithTimeIST
          }
        ),
        placeOfDeath: getLabelWithValue(
          {
            labelName: "Place of Death",
            labelKey: "BND_PLACE_DEATH"
          },
          {
            jsonPath: inJsonPath + ".placeofdeath",
            callBack: checkNoData
          }
        )
      }),
    //divider2: getDivider(),
    certDetailsContainer3: getCommonContainer(
      {
        nameOfMother: getLabelWithValue(
          {
            labelName: "Name of Mother",
            labelKey: "BND_NAME_MOTHER_LABEL"
          },
          {
            jsonPath: inJsonPath + ".deathMotherInfo.fullName",
            callBack: checkNoData
          }
        ),
        nameOfFather: getLabelWithValue(
          {
            labelName: "Name of Father",
            labelKey: "BND_NAME_FATHER_LABEL"
          },
          {
            jsonPath: inJsonPath + ".deathFatherInfo.fullName",
            callBack: checkNoData
          }
        ),
      },
      {
        style: {
          overflow: "visible"
        }
      }
    ),
    divider2: getDivider(),
    // certDetailsContainer4: getCommonContainer(
    //   {
    //     mothersUid: getLabelWithValue(
    //       {
    //         labelName: "Mother's Aadhar No",
    //         labelKey: "Mother's Aadhar No"
    //       },
    //       {
    //         jsonPath: inJsonPath + ".deathMotherInfo.aadharno",
    //         //callBack: checkNoData
    //       }
    //     ),
    //     fathersUid: getLabelWithValue(
    //       {
    //         labelName: "Father's Aadhar No",
    //         labelKey: "Father's Aadhar No"
    //       },
    //       {
    //         jsonPath: inJsonPath + ".deathFatherInfo.aadharno",
    //         //callBack: checkNoData
    //       }
    //     ),
    //   },
    //   {
    //     style: {
    //       overflow: "visible"
    //     }
    //   }
    // ),
    //divider4: getDivider(),
    certDetailsContainer6: getCommonContainer(
      {
        presentAddr: getLabelWithValue(
          {
            labelName: "",
            labelKey: "BND_DEATH_DECEASED_ADDRESS"
          },
          {
            jsonPath: inJsonPath + ".deathPresentaddr.fullAddress",
            callBack: checkNoData
          }
        ),
        permenantAddr: getLabelWithValue(
          {
            labelName: "",
            labelKey: "BND_DEATH_DECEASED_PERM_ADDRESS"
          },
          {
            jsonPath: inJsonPath + ".deathPermaddr.fullAddress",
            callBack: checkNoData
          }
        ),
      },
      {
        style: {
          overflow: "visible"
        }
      }
    ),
    divider5: getDivider(),
    certDetailsContainer7: getCommonContainer(
      {
        registrationNo: getLabelWithValue(
          {
            labelName: "Registration Number",
            labelKey: "BND_REGISTRATION_NUMBER"
          },
          {
            jsonPath: inJsonPath + ".registrationno",
            callBack: checkNoData
          }
        ),
        dateOfRegistration: getLabelWithValue(
          {
            labelName: "Date of Registration",
            labelKey: "BND_DATE_REGISTRATION"
          },
          {
            jsonPath: inJsonPath + ".dateofreport",
            callBack: convertEpochToDateWithTimeIST
          }
        ),
      },
      {
        style: {
          overflow: "visible"
        }
      }
    ),
    divider6: getDivider(),
    certDetailsContainer8: getCommonContainer(
      {
        dateOfIssue: getLabelWithValue(
          {
            labelName: "Date of Issue",
            labelKey: "BND_DATE_ISSUE"
          },
          {
            jsonPath: inJsonPath + ".dateofissue",
            callBack: convertEpochToDateWithTimeIST
          }
        ),
      },
      {
        style: {
          overflow: "visible"
        }
      }
    )
  });
}