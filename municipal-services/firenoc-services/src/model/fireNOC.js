// const Role = {
//   type: "object",
//   description:
//     "minimal representation of the Roles in the system to be carried along in UserInfo with RequestInfo meta data. Actual authorization service to extend this to have more role related attributes\n",
//   properties: {
//     name: {
//       type: "string",
//       description: "Unique name of the role",
//       maxLength: 64
//     },
//     code: {
//       type: "string",
//       description: "Unique code of the role",
//       maxLength: 64
//     },
//     description: {
//       type: "string",
//       description: "brief description of the role"
//     }
//   },
//   // required: ["name"]
// };

const AuditDetails = {
  type: "object",
  description: "Collection of audit related fields used by most models",
  readOnly: true,
  properties: {
    createdBy: {
      type: "string",
      description:
        "username (preferred) or userid of the user that created the object"
    },
    lastModifiedBy: {
      type: "string",
      description:
        "username (preferred) or userid of the user that last modified the object"
    },
    createdTime: {
      type: "integer",
      // format: "int64",
      description: "epoch of the time object is created"
    },
    lastModifiedTime: {
      type: "integer",
      // format: "int64",
      description: "epoch of the time object is last modified"
    }
  }
};

// const TenantRole = {
//   type: "object",
//   description:
//     "User role carries the tenant related role information for the user. A user can have multiple roles per tenant based on the need of the tenant. A user may also have multiple roles for multiple tenants.",
//   properties: {
//     tenantId: {
//       type: "string",
//       description: "tenantid for the tenant"
//     },
//     roles: {
//       type: "array",
//       description:
//         "Roles assigned for a particular tenant - array of role codes/names",
//       items: Role
//     }
//   },
//   // required: ["tenantId", "roles"]
// };

// const UserInfo = {
//   type: "object",
//   description:
//     "This is acting ID token of the authenticated user on the server. Any value provided by the clients will be ignored and actual user based on authtoken will be used on the server.",
//   readOnly: true,
//   properties: {
//     tenantId: {
//       type: "string",
//       description:
//         "Unique Identifier of the tenant to which user primarily belongs"
//     },
//     uuid: {
//       type: "string",
//       description: "System Generated User id of the authenticated user."
//     },
//     userName: {
//       type: "string",
//       description: "Unique user name of the authenticated user"
//     },
//     password: {
//       type: "string",
//       description: "password of the user."
//     },
//     idToken: {
//       type: "string",
//       description: "This will be the OTP."
//     },
//     mobile: {
//       type: "string",
//       description: "mobile number of the autheticated user"
//     },
//     email: {
//       type: "string",
//       description: "email address of the authenticated user"
//     },
//     primaryrole: {
//       type: "array",
//       description: "List of all the roles for the primary tenant",
//       items: Role
//     },
//     additionalroles: {
//       type: "array",
//       description:
//         "array of additional tenantids authorized for the authenticated user",
//       items: TenantRole
//     }
//   },
//   // required: ["tenantId", "userName", "primaryrole"]
// };

const Address = {
  type: "object",
  description:
    "Representation of a address. Indiavidual APIs may choose to extend from this using allOf if more details needed to be added in their case.\n",
  properties: {
    tenantId: {
      type: "string",
      valid_htmlData: true,
      description:
        "Unique Identifier of the tenant to which user primarily belongs"
    },
    doorNo: {
      type: "string",
      valid_htmlData: true,
      description: "House number or door number."
    },
    latitude: {
      type: "number",
      // format: "double",
      description: "latitude of the address"
    },
    longitude: {
      type: "number",
      // format: "double",
      description: "longitude of the address"
    },
    addressId: {
      type: "string",
      valid_htmlData: true,
      description: "System generated id for the address",
      readOnly: true
    },
    addressNumber: {
      description: "House, Door, Building number in the address",
      valid_htmlData: true,
      type: "string"
    },
    type: {
      type: "string",
      description: "Blood group of the user.",
      items: {
        type: "string",
        enum: ["PERMANENT", "CORRESPONDENCE"]
      }
    },
    addressLine1: {
      description: "Apartment, Block, Street of the address",
      valid_htmlData: true,
      type: "string"
    },
    addressLine2: {
      description: "Locality, Area, Zone, Ward of the address",
      valid_htmlData: true,
      type: "string"
    },
    landmark: {
      description: "additional landmark to help locate the address",
      valid_htmlData: true,
      type: "string"
    },
    city: {
      description:
        "City of the address. Can be represented by the tenantid itself",
      type: "string",
      valid_htmlData: true,
    },
    pincode: {
      type: "string",
      valid_htmlData: true,
      description:
        "PIN code of the address. Indian pincodes will usually be all numbers."
    },
    detail: {
      type: "string",
      valid_htmlData: true,
      description: "more address detail as may be needed"
    },
    buildingName: {
      type: "string",
      description: "Name of the building",
      valid_htmlData: true,
      maxLength: 64,
      minLength: 2
    },
    street: {
      type: "string",
      description: "Street Name",
      valid_htmlData: true,
      maxLength: 64,
      minLength: 2
    },
    locality: {
      type: "object",
      properties: {
        code: {
          type: "string",
          valid_boundary: true
        }
      },
      required: ["code"]
    }
  },
  required: ["locality", "city"]
};

const BuildingUOM = {
  type: "object",
  description: "This master will have list of UOM's",
  properties: {
    code: {
      type: "string",
      description: "Code of the unit code",
      valid_uom: true
    },
    value: {
      type: "integer",
      description: "Value entered for the uom",
      minimum: 0
    },
    isActiveUom: {
      type: "boolean",
      description: "Active uom for current usage type"
    },
    active: {
      type: "boolean"
    }
  }
};

const Document = {
  type: "object",
  description: "A Object holds the basic data for a Fire NOC",
  properties: {
    tenantId: {
      type: "string",
      valid_htmlData: true,
      description: "Unique Identifier of ULB",
      maxLength: 128,
      minLength: 2
    },
    documentType: {
      type: "string",
      valid_htmlData: true,
      minLength: 2,
      maxLength: 64,
      description:
        "1.Unique document type code from common master. 2. This is defined under mdms common master. 3. Object defination is defined under 'https://raw.githubusercontent.com/egovernments/egov-services/master/docs/common/contracts/v1-1-1.yml#/definitions/DocumentType'"
    },
    fileStoreId: {
      type: "string",
      valid_htmlData: true,
      minLength: 2,
      maxLength: 64,
      description: "Unique file store id of uploaded document."
    },
    documentUid: {
      type: "string",
      valid_htmlData: true,
      minLength: 2,
      maxLength: 64,
      description: "document number(eg.Pan number, aadhar number)."
    },
    auditDetails: AuditDetails
  },
  required: ["tenantId", "documentType", "fileStoreId"]
};

const OwnerInfo = {
  type: "object",
  properties: {
    isPrimaryOwner: {
      type: "boolean",
      description: "The owner is primary or not"
    },
    ownerShipPercentage: {
      type: "number",
      // format: "double",
      description: "Ownership percentage."
    },
    ownerType: {
      type: "string",
      valid_htmlData: true,
      description:
        "Type of owner, based on this option Exemptions will be applied. This is master data defined in mdms."
      // maxLength: 256,
      // minLength: 4
    },
    relationship: {
      type: "string",
      description: "Relationship with owner.",
      enum: ["FATHER", "HUSBAND"]
    },
    documents: {
      description: "Document of the owner.",
      items: Document
    },
    mobileNumber: {
      type: "string",
      description: "mobile number of the autheticated user",
      valid_htmlData: true,
      pattern: "^[6789][0-9]{9}$"
    },
    gender: {
      oneOf: [
        { type: "null" },
        {
          type: "string",
          enum: ["MALE", "FEMALE", "TRANSGENDER", "OTHERS"]
        }
      ]
      // type: ["string","null"],
      // valid_gender:true
      // enum: ["MALE", "FEMALE", "TRANSGENDER"]
    },
    name: {
      type: "string",
      valid_htmlData: true
    },
    dob: {
      type: ["integer", "null"]
    },
    fatherOrHusbandName: {
      type: ["string", "null"]
    }
  },
  required: [
    "name",
    "mobileNumber",
    // "gender",
    // "relationship",
    "correspondenceAddress"
    // "dob",
    // "fatherOrHusbandName"
  ]
};

const PropertyDetails = {
  type: "object",
  description: "It will have fire noc related entities",
  properties: {
    id: {
      type: "string",
      minLength: 2,
      maxLength: 64,
      valid_htmlData: true,
      description: "Unique Identifier of the property details (UUID)",
      readOnly: true
    },
    propertyId: {
      type: "string",
      valid_htmlData: true
    },
    address: Address
  }
};

const Buildings = {
  type: "object",
  description: "It will contains building details",
  properties: {
    id: {
      type: "string",
      minLength: 2,
      maxLength: 64,
      valid_htmlData: true,
      description: "Unique Identifier of the Fire NOC building details (UUID)",
      readOnly: true
    },
    tenantId: {
      type: "string",
      valid_htmlData: true,
      description: "Unique Identifier of ULB",
      maxLength: 128,
      minLength: 2
    },
    name: {
      type: "string",
      valid_htmlData: true,
      description: "name of the building"
    },
    usageType: {
      type: "string",
      description: "building usage type",
      valid_buildingType: true
    },
    uoms: {
      type: "array",
      items: BuildingUOM,
      minItems: 1
    },
    applicationDocuments: {
      description:
        "1. List of all the required documents. 2. Application can be submitted without required document 3. Once all the document submitted then only application submition process will be completed. 4. Mandatry application documents for a fireNOC type and fireNOC subtype are defined under ApplicationDocument master which is defined under MDMS.",
      type: "array",
      items: Document
    }
  },
  required: [/*"tenantId",*/ "usageType", "name", "uoms"]
};

const FireNOCDetails = {
  type: "object",
  description: "A Object holds the basic data for a Fire NOC",
  properties: {
    id: {
      type: "string",
      minLength: 2,
      maxLength: 64,
      valid_htmlData: true,
      description: "Unique Identifier of the Fire FireNOC Details (UUID)",
      readOnly: true
    },
    applicationNumber: {
      type: "string",
      valid_htmlData: true,
      description:
        "Unique Application FireNOC Number of the Fire FireNOC. This is  unique in system for a tenant. This is mandatory but always be generated on the final approval.",
      maxLength: 64,
      minLength: 2,
      readOnly: true
    },
    fireNOCType: {
      type: "string",
      valid_htmlData: true,
      description: "type of fire NOC from mdms"
    },
    firestationId: {
      type: "string",
      description: "Fire station id where we are applying fire fireNOC.",
      valid_firestation: true
    },
    applicationDate: {
      type: "integer",
      // format: "int64",
      description:
        "date on which applicaiton has been generated for new Fire NOC.",
      readOnly: true
    },
    financialYear: {
      type: "string",
      description: "Fire NOC applicable for financial year.",
      maxLength: 64,
      minLength: 2,
      valid_financialYear: true
    },
    issuedDate: {
      type: "integer",
      // format: "int64",
      description:
        "1. License issued Date of the Fire NOC as epoch. 2. Application approval date.",
      readOnly: true
    },
    validFrom: {
      type: "integer",
      // format: "int64",
      description: "Date from when Fire NOC is valid as epoch"
    },
    validTo: {
      type: "integer",
      // format: "int64",
      description: "Expiry Date of the Fire NOC as epoch"
    },
    action: {
      type: "string",
      description:
        "1. Perform action to change the state of the Fire NOC. 2. INITIATE, if application is getting submitted without required document. 3. APPLY, if application is getting submitted with application documents, in that case api will validate all the required application document. 4. APPROVE action is only applicable for specific role, that role has to be configurable at service level. Employee can approve a application only if application is in APPLIED state and Fire NOC fees is paid.",
      enum: [
        "INITIATE",
        "APPLY",
        "APPROVE",
        "REJECT",
        "CANCEL",
        "PAY",
        "ADHOC",
        "FORWARD",
        "REFER",
        "SENDBACK",
        "SENDBACKTOCITIZEN",
        "RESUBMIT"
      ]
    },
    channel: {
      type: "string",
      description: "License can be created from different channels",
      maxLength: 64,
      minLength: 2,
      enum: ["COUNTER", "CITIZEN", "DATAENTRY"]
    },
    noOfBuildings: {
      type: "string",
      description: "it might be single or multiple",
      enum: ["SINGLE", "MULTIPLE"]
    },
    buildings: {
      type: "array",
      items: Buildings,
      minItems: 1
    },
    propertyDetails: PropertyDetails,
    applicantDetails: {
      type: "object",
      description: "This will have details about applicant details",
      properties: {
        ownerShipType: {
          description: "type pf the owner ship",
          type: "string",
          valid_ownerShipCategory: true
        },
        owners: {
          description:
            "Fire NOC owners, these will be citizen users in system.",
          type: "array",
          items: OwnerInfo,
          minItems: 1
        },
        additionalDetail: {
          type: "object",
          description:
            "Json object to store additional details about license, this will be used when ownership is intitution or others"
        }
      },
      required: ["ownerShipType", "owners"]
    },
    additionalDetail: {
      type: "object",
      description: "Json object to store additional details about license"
    },
    auditDetails: AuditDetails
  },
  if: {
    properties: {
      noOfBuildings: { enum: ["SINGLE"] }
    }
  },
  then: {
    properties: {
      buildings: { maxItems: 1 }
    }
  },
  else: {
    properties: {
      buildings: { minItems: 1 }
    }
  },
  required: [
    // "tenantId",
    "fireNOCType",
    "financialYear",
    "propertyDetails",
    "applicantDetails",
    "action",
    "channel",
    "firestationId",
    "noOfBuildings",
    "buildings"
  ]
};

const FireNOC = {
  type: "object",
  description: "A Object holds the basic data for a Fire NOC",
  properties: {
    id: {
      type: "string",
      minLength: 2,
      maxLength: 64,
      description: "Unique Identifier of the Fire NOC (UUID)",
      readOnly: true,
      valid_htmlData: true
    },
    tenantId: {
      type: "string",
      description: "Unique Identifier of ULB",
      maxLength: 128,
      minLength: 2,
      valid_htmlData: true
    },
    fireNOCNumber: {
      type: "string",
      description:
        "Unique Fire NOC Number of the Fire NOC. This is  unique in system for a tenant. This is mandatory but always be generated on the final approval.",
      maxLength: 64,
      minLength: 2,
      valid_htmlData: true,
      readOnly: true
    },
    provisionFireNOCNumber: {
      type: "string",
      description:
        "Unique Fire NOC Number of the Provision Fire NOC number that will be used for linking provision fire NOC number with new fire NOC number. This is  unique in system for a tenant. This is mandatory but always be generated on the final approval.",
      maxLength: 64,
      valid_htmlData: true,
      minLength: 2
    },
    oldFireNOCNumber: {
      type: "string",
      description:
        "Unique Old License Number of the Fire NOC. This is  unique in system for a tenant. This is mandatory  for legacy license(DataEntry).",
      maxLength: 64,
      minLength: 2,
      valid_htmlData: true
    },
    dateOfApplied: {
      type: "integer",
      // format: "int64",
      description: "Applied Date of the fire NOC as epoch"
    },
    fireNOCDetails: FireNOCDetails,
    auditDetails: AuditDetails
  },
  required: ["tenantId", "fireNOCDetails"]
};

const RequestInfo = {
  type: "object",
  description:
    "RequestInfo should be used to carry meta information about the requests to the server as described in the fields below. All eGov APIs will use requestinfo as a part of the request body to carry this meta information. Some of this information will be returned back from the server as part of the ResponseInfo in the response body to ensure correlation.",
  properties: {
    apiId: {
      type: "string",
      description: "unique API ID",
      maxLength: 128
    },
    ver: {
      type: "string",
      description:
        "API version - for HTTP based request this will be same as used in path",
      maxLength: 32
    },
    // ts: {
    //   type: "integer",
    //   // format: "int64",
    //   description: "time in epoch"
    // },
    action: {
      type: "string",
      description:
        "API action to be performed like _create, _update, _search (denoting POST, PUT, GET) or _oauth etc",
      maxLength: 32
    },
    did: {
      type: "string",
      description: "Device ID from which the API is called",
      maxLength: 1024
    },
    key: {
      type: "string",
      description:
        "API key (API key provided to the caller in case of server to server communication)",
      maxLength: 256
    },
    msgId: {
      type: "string",
      description: "Unique request message id from the caller",
      maxLength: 256
    },
    requesterId: {
      type: "string",
      description: "UserId of the user calling",
      maxLength: 256
    },
    authToken: {
      type: ["string", "null"],
      description:
        "//session/jwt/saml token/oauth token - the usual value that would go into HTTP bearer token"
    },
    // userInfo: UserInfo,
    correlationId: {
      type: "string",
      readOnly: true
    }
  },
  required: ["apiId", "ver", "msgId", "action"]
};

const FireNOCRequest = {
  description: "Contract class to receive request. Array of Noc items are used",
  properties: {
    RequestInfo,
    FireNOCs: {
      description: "Used for search result and create only",
      type: "array",
      minimum: 1,
      maximum: 100,
      items: FireNOC
    }
  },
  required: ["RequestInfo", "FireNOCs"]
};

module.exports = FireNOCRequest;
