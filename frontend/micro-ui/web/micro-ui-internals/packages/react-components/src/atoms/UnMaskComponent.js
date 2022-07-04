import PropTypes from "prop-types";
import React from "react";
import { PrivacyMaskIcon } from "..";

/**
 * Custom Component to demask the masked values.
 *
 * @author jagankumar-egov
 *
 * Feature :: Privacy
 *
 * @example
 * <UnMaskComponent   privacy={{ uuid: "", fieldName: "name", model: "User" ,hide: false}}   />
 */

const UnMaskComponent = React.memo(({ privacy = {} }) => {
  let { isLoading, data } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getStateId(),
    "DataSecurity",
    [{ name: "SecurityPolicy", filter: `[?(@.model == '${privacy?.model}')]` }],
    {
      select: (data) => data?.DataSecurity?.SecurityPolicy?.[0] || {},
    }
  );

  // let data =  {
  //   "model": "User",
  //   "uniqueIdentifier": {
  //     "name": "uuid",
  //     "jsonPath": "uuid"
  //   },
  //   "attributes": [
  //     {
  //       "name": "name",
  //       "jsonPath": "name",
  //       "patternId": "002",
  //       "defaultVisibility": "PLAIN"
  //     },
  //     {
  //       "name": "mobileNumber",
  //       "jsonPath": "mobileNumber",
  //       "patternId": "001",
  //       "defaultVisibility": "PLAIN"
  //     },
  //     {
  //       "name": "emailId",
  //       "jsonPath": "emailId",
  //       "patternId": "004",
  //       "defaultVisibility": "PLAIN"
  //     },
  //     {
  //       "name": "username",
  //       "jsonPath": "username",
  //       "patternId": "002",
  //       "defaultVisibility": "PLAIN"
  //     },
  //     {
  //       "name": "altContactNumber",
  //       "jsonPath": "altContactNumber",
  //       "patternId": "001",
  //       "defaultVisibility": "PLAIN"
  //     },
  //     {
  //       "name": "alternatemobilenumber",
  //       "jsonPath": "alternatemobilenumber",
  //       "patternId": "001",
  //       "defaultVisibility": "PLAIN"
  //     },
  //     {
  //       "name": "pan",
  //       "jsonPath": "pan",
  //       "patternId": "001",
  //       "defaultVisibility": "PLAIN"
  //     },
  //     {
  //       "name": "aadhaarNumber",
  //       "jsonPath": "aadhaarNumber",
  //       "patternId": "001",
  //       "defaultVisibility": "PLAIN"
  //     },
  //     {
  //       "name": "guardian",
  //       "jsonPath": "guardian",
  //       "patternId": "002",
  //       "defaultVisibility": "PLAIN"
  //     },
  //     {
  //       "name": "permanentAddress",
  //       "jsonPath": "permanentAddress/address",
  //       "patternId": "003",
  //       "defaultVisibility": "PLAIN"
  //     },
  //     {
  //       "name": "correspondenceAddress",
  //       "jsonPath": "correspondenceAddress/address",
  //       "patternId": "003",
  //       "defaultVisibility": "PLAIN"
  //     },
  //     {
  //       "name": "fatherOrHusbandName",
  //       "jsonPath": "fatherOrHusbandName",
  //       "patternId": "002",
  //       "defaultVisibility": "PLAIN"
  //     },
  //     {
  //       "name": "searchUsername",
  //       "jsonPath": "userName",
  //       "patternId": "002",
  //       "defaultVisibility": "PLAIN"
  //     }
  //   ],
  //   "roleBasedDecryptionPolicy": [
  //     {
  //       "roles": ["WS_CEMP","SW_CEMP"],
  //       "attributeAccessList": [
  //         {
  //           "attribute": "mobileNumber",
  //           "firstLevelVisibility": "MASKED",
  //           "secondLevelVisibility": "PLAIN"
  //         },
  //         {
  //           "attribute": "gender",
  //           "firstLevelVisibility": "MASKED",
  //           "secondLevelVisibility": "PLAIN"
  //         },
  //         {
  //           "attribute": "fatherOrHusbandName",
  //           "firstLevelVisibility": "MASKED",
  //           "secondLevelVisibility": "PLAIN"
  //         },
  //         {
  //           "attribute": "correspondenceAddress",
  //           "firstLevelVisibility": "MASKED",
  //           "secondLevelVisibility": "PLAIN"
  //         },
  //         {
  //           "attribute": "ownerType",
  //           "firstLevelVisibility": "MASKED",
  //           "secondLevelVisibility": "PLAIN"
  //         },
  //         // {
  //         //   "attribute": "name",
  //         //   "firstLevelVisibility": "MASKED",
  //         //   "secondLevelVisibility": "PLAIN"
  //         // },
  //         {
  //           "attribute": "emailId",
  //           "firstLevelVisibility": "MASKED",
  //           "secondLevelVisibility": "PLAIN"
  //         },
  //         {
  //           "attribute": "permanentAddress",
  //           "firstLevelVisibility": "MASKED",
  //           "secondLevelVisibility": "PLAIN"
  //         },
  //         {
  //           "attribute": "doorNo",
  //           "firstLevelVisibility": "MASKED",
  //           "secondLevelVisibility": "PLAIN"
  //         }
  //       ]
  //     }
  //   ]
  // }
  
    
  
  // useEffect
  // (() => {
  //   console.log(data,"data");
  // if(data )
  // {
  //   data.roleBasedDecryptionPolicy = [{
  //       "roles": ["WS_CEMP","SW_CEMP"],
  //       "attributeAccessList": [
  //         {
  //           "attribute": "mobileNumber",
  //           "firstLevelVisibility": "MASKED",
  //           "secondLevelVisibility": "PLAIN"
  //         },
  //         {
  //           "attribute": "gender",
  //           "firstLevelVisibility": "MASKED",
  //           "secondLevelVisibility": "PLAIN"
  //         },
  //         {
  //           "attribute": "fatherOrHusbandName",
  //           "firstLevelVisibility": "MASKED",
  //           "secondLevelVisibility": "PLAIN"
  //         },
  //         {
  //           "attribute": "correspondenceAddress",
  //           "firstLevelVisibility": "MASKED",
  //           "secondLevelVisibility": "PLAIN"
  //         },
  //         // {
  //         //   "attribute": "name",
  //         //   "firstLevelVisibility": "MASKED",
  //         //   "secondLevelVisibility": "PLAIN"
  //         // },
  //         {
  //           "attribute": "emailId",
  //           "firstLevelVisibility": "MASKED",
  //           "secondLevelVisibility": "PLAIN"
  //         },
  //         {
  //           "attribute": "permanentAddress",
  //           "firstLevelVisibility": "MASKED",
  //           "secondLevelVisibility": "PLAIN"
  //         }
  //       ]
  //     }]
  // }
  // },[data])
  
  const { privacy: privacyValue, updatePrivacy } = Digit.Hooks.usePrivacyContext();
  if (isLoading || privacy?.hide) {
    return null;
  }

  if (Digit.Utils.checkPrivacy(data, privacy)) {
    return (
      <span
        onClick={() => {
          updatePrivacy(privacy?.uuid, privacy?.fieldName);
        }}
      >
        <PrivacyMaskIcon className="privacy-icon"></PrivacyMaskIcon>
      </span>
    );
  }
  return null;
});

UnMaskComponent.propTypes = {
  privacy: PropTypes.object,
};

UnMaskComponent.defaultProps = {
  privacy: { uuid: "", fieldName: "", model: "" },
};

export default UnMaskComponent;
