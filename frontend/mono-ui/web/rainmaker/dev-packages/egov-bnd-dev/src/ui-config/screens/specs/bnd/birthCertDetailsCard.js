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
  data = data!="NA"?genderValues[data]:data;
  return data;
};

export const getBirthCertDetailsCard = (inJsonPath) => {

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
        )
      }),
    //divider1: getDivider(),
    certDetailsContainer2: getCommonContainer(
      {
        dob: getLabelWithValue(
          {
            labelName: "Date of Birth",
            labelKey: "BND_DOB_LABEL"
          },
          {
            jsonPath: inJsonPath + ".dateofbirth",
            callBack: convertEpochToDateWithTimeIST
          }
        ),
        placeOfBirth: getLabelWithValue(
          {
            labelName: "Place of Birth",
            labelKey: "BND_BIRTH_LABEL"
          },
          {
            jsonPath: inJsonPath + ".placeofbirth",
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
            labelKey: "BND_MOTHER_NAME_LABEL"
          },
          {
            jsonPath: inJsonPath + ".birthMotherInfo.fullName",
            callBack: checkNoData
          }
        ),
        nameOfFather: getLabelWithValue(
          {
            labelName: "Name of Father",
            labelKey: "BND_FATHER_NAME_LABEL"
          },
          {
            jsonPath: inJsonPath + ".birthFatherInfo.fullName",
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
    //         jsonPath: inJsonPath + ".birthMotherInfo.aadharno",
    //         //callBack: checkNoData
    //       }
    //     ),
    //     fathersUid: getLabelWithValue(
    //       {
    //         labelName: "Father's Aadhar No",
    //         labelKey: "Father's Aadhar No"
    //       },
    //       {
    //         jsonPath: inJsonPath + ".birthFatherInfo.aadharno",
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
            labelName: "ADDRESS OF PARENTS AT THE TIME OF BIRTH OF THE CHILD",
            labelKey: "BND_ADDRESS_OF_PARENTS_TIME_BIRTH"
          },
          {
            jsonPath: inJsonPath + ".birthPresentaddr.fullAddress",
            callBack: checkNoData
          }
        ),
        permenantAddr: getLabelWithValue(
          {
            labelName: "PERMANENT ADDRESS OF THE PARENTS",
            labelKey: "BND_ADDRESS_OF_PARENTS"
          },
          {
            jsonPath: inJsonPath + ".birthPermaddr.fullAddress",
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