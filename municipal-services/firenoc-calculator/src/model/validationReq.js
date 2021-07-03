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
//   required: ["name"]
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
//   required: ["tenantId", "roles"]
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
//   required: ["tenantId", "userName", "primaryrole"]
// };

const Address = {
  type: "object",
  description:
    "Representation of a address. Indiavidual APIs may choose to extend from this using allOf if more details needed to be added in their case.\n",
  properties: {
    tenantId: {
      type: "string",
      description:
        "Unique Identifier of the tenant to which user primarily belongs"
    },
    doorNo: {
      type: "string",
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
      description: "System generated id for the address",
      readOnly: true
    },
    addressNumber: {
      description: "House, Door, Building number in the address",
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
      type: "string"
    },
    addressLine2: {
      description: "Locality, Area, Zone, Ward of the address",
      type: "string"
    },
    landmark: {
      description: "additional landmark to help locate the address",
      type: "string"
    },
    city: {
      description:
        "City of the address. Can be represented by the tenantid itself",
      type: "string"
    },
    pincode: {
      type: "string",
      description:
        "PIN code of the address. Indian pincodes will usually be all numbers."
    },
    detail: {
      type: "string",
      description: "more address detail as may be needed"
    },
    buildingName: {
      type: "string",
      description: "Name of the building",
      maxLength: 64,
      minLength: 2
    },
    street: {
      type: "string",
      description: "Street Name",
      maxLength: 64,
      minLength: 2
    }
  }
};

const BuildingUOM = {
  type: "object",
  description: "This master will have list of UOM's",
  properties: {
    code: {
      type: "string",
      description: "Code of the unit code"
    },
    value: {
      type: "number",
      description: "Value entered for the uom"
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
      description: "Unique Identifier of ULB",
      maxLength: 128,
      minLength: 2
    },
    documentType: {
      type: "string",
      minLength: 2,
      maxLength: 64,
      description:
        "1.Unique document type code from common master. 2. This is defined under mdms common master. 3. Object defination is defined under 'https://raw.githubusercontent.com/egovernments/egov-services/master/docs/common/contracts/v1-1-1.yml#/definitions/DocumentType'"
    },
    fileStoreId: {
      type: "string",
      minLength: 2,
      maxLength: 64,
      description: "Unique file store id of uploaded document."
    },
    documentUid: {
      type: "string",
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
      description:
        "Type of owner, based on this option Exemptions will be applied. This is master data defined in mdms.",
      //maxLength: 256,
      //minLength: 4
    },
    relationship: {
      type: "string",
      description: "Relationship with owner.",
      enum: ["FATHER", "HUSBAND"]
    },
    documents: {
      description: "Document of the owner.",
      items: Document
    }
  }
};

const PropertyDetails = {
  type: "object",
  description: "It will have fire noc related entities",
  properties: {
    id: {
      type: "string",
      minLength: 2,
      maxLength: 64,
      description: "Unique Identifier of the property details (UUID)",
      readOnly: true
    },
    propertyId: {
      type: "string"
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
      description: "Unique Identifier of the Fire NOC building details (UUID)",
      readOnly: true
    },
    tenantId: {
      type: "string",
      description: "Unique Identifier of ULB",
      maxLength: 128,
      minLength: 2
    },
    name: {
      type: "string",
      description: "name of the building"
    },
    usageType: {
      type: "string",
      description: "building usage type"
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
      description: "Unique Identifier of the Fire FireNOC Details (UUID)",
      readOnly: true
    },
    applicationNumber: {
      type: "string",
      description:
        "Unique Application FireNOC Number of the Fire FireNOC. This is  unique in system for a tenant. This is mandatory but always be generated on the final approval.",
      maxLength: 64,
      minLength: 2,
      readOnly: true
    },
    fireNOCType: {
      type: "string",
      description: "type of fire NOC from mdms"
    },
    firestationId: {
      type: "string",
      description: "Fire station id where we are applying fire fireNOC."
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
      minLength: 2
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
      description: "it might be single or multiple"
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
          type: "string"
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
      readOnly: true
    },
    tenantId: {
      type: "string",
      description: "Unique Identifier of ULB",
      maxLength: 128,
      minLength: 2
    },
    fireNOCNumber: {
      type: "string",
      description:
        "Unique Fire NOC Number of the Fire NOC. This is  unique in system for a tenant. This is mandatory but always be generated on the final approval.",
      maxLength: 64,
      minLength: 2,
      readOnly: true
    },
    provisionFireNOCNumber: {
      type: "string",
      description:
        "Unique Fire NOC Number of the Provision Fire NOC number that will be used for linking provision fire NOC number with new fire NOC number. This is  unique in system for a tenant. This is mandatory but always be generated on the final approval.",
      maxLength: 64,
      minLength: 2
    },
    oldFireNOCNumber: {
      type: "string",
      description:
        "Unique Old License Number of the Fire NOC. This is  unique in system for a tenant. This is mandatory  for legacy license(DataEntry).",
      maxLength: 64,
      minLength: 2
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

const CalulationCriteria = {
  description:
    "Either Fire NOC object or the application number is mandatory apart from tenantid.",
  type: "object",
  properties: {
    fireNOC: FireNOC,
    applicationNumber: {
      type: "string",
      minLength: 2,
      maxLength: 64
    },
    tenantId: {
      type: "string",
      minLength: 2,
      maxLength: 256
    }
  },
  required: ["tenantId"]
};

const Calculation = {
  type: "object",
  properties: {
    applicationNumber: {
      type: "string",
      description: "Fire NOC application number."
    },
    totalAmount: {
      type: "number",
      format: "double",
      description: "Total payable tax amount."
    },
    penalty: {
      type: "number",
      format: "double",
      description: "Total Penality if applicable."
    },
    exemption: {
      type: "number",
      format: "double",
      description: "Total Exemption amount if applicable."
    },
    rebate: {
      type: "number",
      format: "double",
      description: "Total Rebate amount if applicable."
    },
    tenantId: {
      type: "string",
      minLength: 2,
      maxLength: 256
    }
  }
};
const BillingSlab = {
  type: "object",
  properties: {
    tenantId: {
      type: "string",
      description: "Unique ulb identifier",
      maxLength: 128,
      minLength: 4
    },
    id: {
      type: "string",
      description: "unique identifier of the billing slab uuid",
      maxLength: 64,
      minLength: 2
    },
    isActive: {
      type: "boolean",
      description: "boolean value to specify if billslab entry is active or not"
    },
    fireNOCType: {
      type: "string",
      description: "FireNOCType, is unique enum value for a noc",
      enum: ["NEW", "PROVISIONAL"]
    },
    buildingUsageType: {
      type: "string",
      description:
        "buildingUsageType, this is mdms data which specifies builiding usage and one of the factor to decide rate.",
      maxLength: 64,
      minLength: 2
    },
    calculationType: {
      type: "string",
      description: "Type will define the rate value is flat amount or rate.",
      enum: ["SINGLESLAB", "MULTISLAB", "FLAT"]
    },
    rate: {
      type: "number",
      // format: "double",
      description:
        "Rate of the Fire NOC, this can be the rate of flat amount based on type or can be slab rate per unit based on type."
    },
    uom: {
      type: "string",
      description: "unit of measurement of bill slab.",
      maxLength: 64,
      minLength: 2
    },
    fromUom: {
      type: "number",
      // format: "double",
      description: "uom value lower bound."
    },
    toUom: {
      type: "number",
      // format: "double",
      description: "uom value upper bound."
    },
    fromDate: {
      type: "integer",
      //format: "int64",
      description: "Epoch Date for starting of billing slab."
    },
    toDate: {
      type: "integer",
      //format: "int64",
      description: "Epoch Date for ending of billing slab."
    },
    AuditDetails
  },
  required: [
    "tenantId",
    "calculationType",
    "rate",
    "uom",
    "buildingUsageType",
    "fireNOCType"
  ]
};

export const CalculationReq = {
  type: "object",
  properties: {
    RequestInfo,
    CalulationCriteria: {
      type: "array",
      maximum: 100,
      items: CalulationCriteria
    }
  },
  required: ["RequestInfo", "CalulationCriteria"]
};

export const BillingSlabReq = {
  type: "object",
  properties: {
    RequestInfo,
    BillingSlabs: {
      type: "array",
      maximum: 100,
      items: BillingSlab
    }
  },
  required: ["RequestInfo", "BillingSlabs"]
};

export const BillingSlabSearch = {
  summary:
    "Get the list of bill slabs defined in the system for Fire NOC calculation.",
  description: "Get the properties list based on the input parameters.\n",
  tags: ["BillingSlab"],
  properties: {
    tenantId: {
      name: "tenantId",
      in: "query",
      description: "Unique id for a tenant.",
      type: "string"
      // format: "varchar"
    },
    isActive: {
      name: "isActive",
      in: "query",
      description:
        "True will be set in cases where only active billslab entries are needed and False will be set when inactive billslab entries are needed .",
      type: "boolean",
      // format: "varchar",
      allowEmptyValue: true
    },
    fireNOCType: {
      name: "fireNOCType",
      in: "query",
      description: "Fire NOC type for bulling slab.",
      type: "string",
      // format: "varchar",
      enum: ["NEW", "PROVISIONAL"]
    },
    buildingUsageType: {
      name: "buildingUsageType",
      in: "query",
      description: "buildingUsageType of property.",
      type: "string",
      exclusiveMinimum: 4,
      exclusiveMaximum: 128
    },
    calculationType: {
      name: "calculationType",
      in: "query",
      description: "Enum for billing slab type.",
      type: "string",
      exclusiveMinimum: 4,
      exclusiveMaximum: 128,
      enum: ["SINGLESLAB", "MULTISLAB", "FLAT"]
    }
  },
  required: ["tenantId"]
};

export const getBillReq = {
  summary:
    "Updates demand with time based penalty if applicable and Generates bill for the given criteria.",
  description: "Generates bill for payment.",
  tags: ["Fire NOC Bill"],
  properties: {
    tenantId: {
      name: "tenantId",
      in: "query",
      description: "Unique id for a tenant.",
      type: "string"
      // format: "varchar"
    },

    applicationNumber: {
      name: "applicationNumber",
      in: "query",
      description: "Unique Fire NOC application number.",
      // required: true,
      type: "string"
    }
  },
  required: ["tenantId", "applicationNumber"]
};
