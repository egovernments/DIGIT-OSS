import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  handleScreenConfigurationFieldChange as handleField, prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getLocaleLabels, getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import {
  createEmployee,
  getSearchResults,
  updateEmployee
} from "../../../../..//ui-utils/commons";
import {
  convertDateToEpoch,
  epochToYmdDate,
  showHideAdhocPopup,
  validateFields
} from "../../utils";

// SET ALL SIMPLE DATES IN YMD FORMAT
const setDateInYmdFormat = (obj, values) => {
  values.forEach(element => {
    set(obj, element, epochToYmdDate(get(obj, element)));
  });
};

// SET ALL MULTIPLE OBJECT DATES IN YMD FORMAT
const setAllDatesInYmdFormat = (obj, values) => {
  values.forEach(element => {
    let elemObject =
      get(obj, `${element.object}`, []) === null
        ? []
        : get(obj, `${element.object}`, []);
    for (let i = 0; i < elemObject.length; i++) {
      element.values.forEach(item => {
        set(
          obj,
          `${element.object}[${i}].${item}`,
          epochToYmdDate(get(obj, `${element.object}[${i}].${item}`))
        );
      });
    }
  });
};

// SET ALL MULTIPLE OBJECT EPOCH DATES YEARS
const setAllYears = (obj, values) => {
  values.forEach(element => {
    let elemObject =
      get(obj, `${element.object}`, []) === null
        ? []
        : get(obj, `${element.object}`, []);
    for (let i = 0; i < elemObject.length; i++) {
      element.values.forEach(item => {
        let ymd = epochToYmdDate(get(obj, `${element.object}[${i}].${item}`));
        let year = ymd ? ymd.substring(0, 4) : null;
        year && set(obj, `${element.object}[${i}].${item}`, year);
      });
    }
  });
};

const setRolesData = obj => {
  let roles = get(obj, "user.roles", []);
  let newRolesArray = [];
  roles.forEach(element => {
    newRolesArray.push({
      label: element.name,
      value: element.code
    });
  });
  set(obj, "user.roles", newRolesArray);
};

const returnEmptyArrayIfNull = value => {
  if (value === null || value === undefined) {
    return [];
  } else {
    return value;
  }
};

export const setRolesList = (state, dispatch) => {



  let jurisdictions = get(
    state.screenConfiguration.preparedFinalObject,
    `Employee[0].jurisdictions`,
    []
  );


  jurisdictions.map((judis, ind) => {
    let furnishedRolesList = judis && judis.roles && Array.isArray(judis.roles) && judis.roles.map(role => {
      return ` ${getLocaleLabels("NA", `ACCESSCONTROL_ROLES_ROLES_${getTransformedLocale(role.code||role.value)}`)}`;
    }) || [];
    dispatch(
      prepareFinalObject(
        `Employee[0].jurisdictions[${ind}].furnishedRolesList`,
        furnishedRolesList.join()
      )
    );
  })


  // let rolesList = get(
  //   state.screenConfiguration.preparedFinalObject,
  //   `Employee[0].user.roles`,
  //   []
  // );
  // let furnishedRolesList = rolesList.map(item => {
  //   return " " + item.label;
  // });
  // dispatch(
  //   prepareFinalObject(
  //     "Employee[0].jurisdictions[0].furnishedRolesList",
  //     furnishedRolesList.join()
  //   )
  // );
};

const setDeactivationDocuments = (state, dispatch) => {
  // GET THE DEACTIVATION DOCUMENTS FROM UPLOAD FILE COMPONENT
  let deactivationDocuments = get(
    state.screenConfiguration.preparedFinalObject,
    `deactivationDocuments`,
    []
  );
  // FORMAT THE NEW DOCUMENTS ARRAY ACCORDING TO THE REQUIRED STRUCTURE
  let addedDocuments = deactivationDocuments.map(document => {
    return {
      documentName: get(document, "fileName", ""),
      documentId: get(document, "fileStoreId", ""),
      referenceType: "DEACTIVATION"
    };
  });
  // GET THE PREVIOUS DOCUMENTS FROM EMPLOYEE OBJECT
  let documents = get(
    state.screenConfiguration.preparedFinalObject,
    `Employee[0].documents`,
    []
  );
  // ADD THE NEW DOCUMENTS TO PREVIOUS DOCUMENTS
  documents = [...documents, ...addedDocuments];
  // SAVE THE DOCUMENTS BACK TO EMPLOYEE
  dispatch(prepareFinalObject("Employee[0].documents", documents));
};
const setActivationDocuments = (state, dispatch) => {
  // GET THE DEACTIVATION DOCUMENTS FROM UPLOAD FILE COMPONENT
  let activationDocuments = get(
    state.screenConfiguration.preparedFinalObject,
    `ActivationDocuments`,
    []
  );
  // FORMAT THE NEW DOCUMENTS ARRAY ACCORDING TO THE REQUIRED STRUCTURE
  let addedDocuments = activationDocuments.map(document => {
    return {
      documentName: get(document, "fileName", ""),
      documentId: get(document, "fileStoreId", ""),
      referenceType: "ACTIVATION"
    };
  });
  // GET THE PREVIOUS DOCUMENTS FROM EMPLOYEE OBJECT
  let documents = get(
    state.screenConfiguration.preparedFinalObject,
    `Employee[0].documents`,
    []
  );
  // ADD THE NEW DOCUMENTS TO PREVIOUS DOCUMENTS
  documents = [...documents, ...addedDocuments];
  // SAVE THE DOCUMENTS BACK TO EMPLOYEE
  dispatch(prepareFinalObject("Employee[0].documents", documents));
};


// Remove objects from Arrays not having the specified key (eg. "id")
// and add the key-value isActive:false in those objects having the key
// so as to deactivate them after the API call
const handleDeletedCards = (jsonObject, jsonPath, key) => {
  let originalArray = get(jsonObject, jsonPath, []);
  let modifiedArray = originalArray.filter(element => {
    return element.hasOwnProperty(key) || !element.hasOwnProperty("isDeleted");
  });
  modifiedArray = modifiedArray.map(element => {
    if (element.hasOwnProperty("isDeleted")) {
      element["isActive"] = false;
    }
    return element;
  });
  set(jsonObject, jsonPath, modifiedArray);
};

export const furnishEmployeeData = (state, dispatch) => {
  let employeeObject = get(
    state.screenConfiguration.preparedFinalObject,
    "Employee",
    []
  );
  setDateInYmdFormat(employeeObject[0], ["dateOfAppointment", "user.dob"]);
  setAllDatesInYmdFormat(employeeObject[0], [
    { object: "assignments", values: ["fromDate", "toDate"] },
    { object: "serviceHistory", values: ["serviceFrom", "serviceTo"] }
  ]);
  setAllYears(employeeObject[0], [
    { object: "education", values: ["yearOfPassing"] },
    { object: "tests", values: ["yearOfPassing"] }
  ]);
  setRolesData(employeeObject[0]);
  setRolesList(state, dispatch);
  dispatch(prepareFinalObject("Employee", employeeObject));
};

export const handleCreateUpdateEmployee = (state, dispatch) => {
  let uuid = get(
    state.screenConfiguration.preparedFinalObject,
    "Employee[0].uuid",
    null
  );
  if (uuid) {
    createUpdateEmployee(state, dispatch, "UPDATE");
  } else {
    createUpdateEmployee(state, dispatch, "CREATE");
  }
};

export const createUpdateEmployee = async (state, dispatch, action) => {
  const pickedTenant = get(
    state.screenConfiguration.preparedFinalObject,
    "Employee[0].tenantId"
  );
  const tenantId = pickedTenant || getTenantId();
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    }
  ];
  let employeeObject = get(
    state.screenConfiguration.preparedFinalObject,
    "Employee",
    []
  );

  handleDeletedCards(employeeObject[0], "jurisdictions", "id");
  handleDeletedCards(employeeObject[0], "assignments", "id");
  handleDeletedCards(employeeObject[0], "serviceHistory", "id");
  handleDeletedCards(employeeObject[0], "education", "id");
  handleDeletedCards(employeeObject[0], "tests", "id");
  let deletedJurisdiction = get(
    state.screenConfiguration.preparedFinalObject,
    "deletedJurisdiction",
    []
  );
  let employeeJurisdictions = get(
    state.screenConfiguration.preparedFinalObject,
    "Employee[0].jurisdictions",
    []
  );
  deletedJurisdiction.map(jurisdiction => jurisdiction.isActive = false);

  // DEACTIVATE EMPLOYEE VALIDATIONS
  if (action === "DEACTIVATE") {
    const isDeactivateEmployeeDetailsValid = validateFields(
      `components.adhocDialog.children.popup.children.body.children`,
      state,
      dispatch,
      "view"
    );
    if (!isDeactivateEmployeeDetailsValid) {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Please fill mandatory Fields!",
            labelKey: "ERR_FILL_MANDATORY_FIELDS"
          },
          "warning"
        )
      );
      return;
    }
  } else if (action === "ACTIVATE") {
    const isDeactivateEmployeeDetailsValid = validateFields(
      "components.adhocDialog.children.popup.children.body.children",
      state,
      dispatch,
      "view"
    );
    if (!isDeactivateEmployeeDetailsValid) {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Please fill mandatory Fields!",
            labelKey: "ERR_FILL_MANDATORY_FIELDS"
          },
          "warning"
        )
      );
      return;
    }

  }

  // SET TENANT IDS IF THEY DO NOT ALREADY EXIST
  !get(employeeObject[0], "tenantId") &&
    set(employeeObject[0], "tenantId", tenantId);
  !get(employeeObject[0], "user.tenantId") &&
    set(employeeObject[0], "user.tenantId", tenantId);

  //SET TENANT IDS IN ALL NEWLY ADDED JURISDICTIONS, DOESNT CHANGE ALREADY PRESENT
  let jurisdictions = returnEmptyArrayIfNull(
    get(employeeObject[0], "jurisdictions", [])
  );
  for (let i = 0; i < jurisdictions.length; i++) {
    set(employeeObject[0], `jurisdictions[${i}].tenantId`, tenantId);
  }

  set(
    employeeObject[0],
    "dateOfAppointment",
    convertDateToEpoch(get(employeeObject[0], "dateOfAppointment"), "dayStart")
  );
  set(
    employeeObject[0],
    "user.dob",
    convertDateToEpoch(get(employeeObject[0], "user.dob"), "dayStart")
  );

  let assignments = returnEmptyArrayIfNull(
    get(employeeObject[0], "assignments", [])
  );
  for (let i = 0; i < assignments.length; i++) {
    set(
      employeeObject[0],
      `assignments[${i}].fromDate`,
      convertDateToEpoch(
        get(employeeObject[0], `assignments[${i}].fromDate`),
        "dayStart"
      )
    );
    set(
      employeeObject[0],
      `assignments[${i}].toDate`,
      convertDateToEpoch(
        get(employeeObject[0], `assignments[${i}].toDate`),
        "dayStart"
      )
    );

    // Set isCurrentAssignment to false if key not present
    let assignmentObject = get(employeeObject[0], `assignments[${i}]`);
    if (!assignmentObject.hasOwnProperty("isCurrentAssignment")) {
      set(employeeObject[0], `assignments[${i}]["isCurrentAssignment"]`, false);
    }
  }

  // Set employee id null in case of blank
  if (get(employeeObject[0], "code") === "") {
    set(employeeObject[0], "code", null);
  }

  let serviceHistory = returnEmptyArrayIfNull(
    get(employeeObject[0], "serviceHistory", [])
  );
  for (let i = 0; i < serviceHistory.length; i++) {
    set(
      employeeObject[0],
      `serviceHistory[${i}].serviceFrom`,
      convertDateToEpoch(
        get(employeeObject[0], `serviceHistory[${i}].serviceFrom`),
        "dayStart"
      )
    );
    set(
      employeeObject[0],
      `serviceHistory[${i}].serviceTo`,
      convertDateToEpoch(
        get(employeeObject[0], `serviceHistory[${i}].serviceTo`),
        "dayStart"
      )
    );
  }

  // FORMAT EDUCATION PASSING DATES TO EPOCH
  let education = returnEmptyArrayIfNull(
    get(employeeObject[0], "education", [])
  );
  for (let i = 0; i < education.length; i++) {
    let educationYearOfPassing = get(
      employeeObject[0],
      `education[${i}].yearOfPassing`
    );
    educationYearOfPassing.toString().match(/\d{4}/g) &&
      set(
        employeeObject[0],
        `education[${i}].yearOfPassing`,
        convertDateToEpoch(`${educationYearOfPassing}-01-01`),
        "dayStart"
      );
  }

  // FORMAT TESTS PASSING DATES TO EPOCH
  let tests = returnEmptyArrayIfNull(get(employeeObject[0], "tests", []));
  for (let i = 0; i < tests.length; i++) {
    let testsYearOfPassing = get(
      employeeObject[0],
      `tests[${i}].yearOfPassing`
    );
    testsYearOfPassing.toString().match(/\d{4}/g) &&
      set(
        employeeObject[0],
        `tests[${i}].yearOfPassing`,
        convertDateToEpoch(`${testsYearOfPassing}-01-01`),
        "dayStart"
      );
  }

  // PROCESS ALL ROLES IN REQUIRED FORMAT
  let roles = get(employeeObject[0], "user.roles", []);
  let processedRoles = roles.map(item => {
    return {
      code: item.value,
      name: item.label,
      tenantId: item.tenantId
    };
  });
  set(employeeObject[0], "user.roles", processedRoles);

  if (action === "CREATE") {
    try {
      let response = await createEmployee(
        queryObject,
        employeeObject,
        dispatch
      );
      let employeeId = get(response, "Employees[0].code");
      const acknowledgementUrl =
        process.env.REACT_APP_SELF_RUNNING === "true"
          ? `/egov-ui-framework/hrms/acknowledgement?purpose=create&status=success&applicationNumber=${employeeId}`
          : `/hrms/acknowledgement?purpose=create&status=success&applicationNumber=${employeeId}`;
      dispatch(setRoute(acknowledgementUrl));
    } catch (error) {
      furnishEmployeeData(state, dispatch);
    }
  } else if (action === "UPDATE") {
    try {

      // const fileStoreid=await convertToFilestoreid(get(employeeObject[0],'user.photo'));

      // set(employeeObject[0],'user.photo',fileStoreid);
      if (get(employeeObject[0], 'user.photo', null)) {
        set(employeeObject[0], 'user.photo', get(employeeObject[0], 'user.identificationMark', null));
      }
      let employee = {};
      employee = { ...employeeObject[0] }
      set(employee, 'jurisdictions', [...employeeJurisdictions, ...deletedJurisdiction])
      let response = await updateEmployee(
        queryObject,
        [employee],
        dispatch
      );
      let employeeId = response && get(response, "Employees[0].code");

      const acknowledgementUrl =
        process.env.REACT_APP_SELF_RUNNING === "true"
          ? `/egov-ui-framework/hrms/acknowledgement?purpose=update&status=success&applicationNumber=${employeeId}`
          : `/hrms/acknowledgement?purpose=update&status=success&applicationNumber=${employeeId}`;
      dispatch(setRoute(acknowledgementUrl));
    } catch (error) {
      furnishEmployeeData(state, dispatch);
    }
  } else if (action === "DEACTIVATE") {
    try {
      if (get(employeeObject[0], 'user.photo', null)) {
        set(employeeObject[0], 'user.photo', get(employeeObject[0], 'user.identificationMark', null));
      }
      set(employeeObject[0], "isActive", false);
      set(
        employeeObject[0],
        `deactivationDetails[0].effectiveFrom`,
        convertDateToEpoch(
          get(employeeObject[0], `deactivationDetails[0].effectiveFrom`),
          "dayStart"
        )
      );
      setDeactivationDocuments(state, dispatch);
      let response = await updateEmployee(
        queryObject,
        employeeObject,
        dispatch
      );
      let employeeId = response && get(response, "Employees[0].code");
      showHideAdhocPopup(state, dispatch);
      const acknowledgementUrl =
        process.env.REACT_APP_SELF_RUNNING === "true"
          ? `/egov-ui-framework/hrms/acknowledgement?purpose=deactivate&status=success&applicationNumber=${employeeId}`
          : `/hrms/acknowledgement?purpose=deactivate&status=success&applicationNumber=${employeeId}`;
      dispatch(setRoute(acknowledgementUrl));
    } catch (error) {
      furnishEmployeeData(state, dispatch);
    }
  } else if (action === "ACTIVATE") {
    try {
      if (get(employeeObject[0], 'user.photo', null)) {
        set(employeeObject[0], 'user.photo', get(employeeObject[0], 'user.identificationMark', null));
      }
      set(employeeObject[0], "reActivateEmployee", true);
      set(employeeObject[0], "isActive", true);
      set(
        employeeObject[0],
        `reactivationDetails[0].effectiveFrom`,
        convertDateToEpoch(
          get(employeeObject[0], `reactivationDetails[0].effectiveFrom`),
          "dayStart"
        )
      );
      setActivationDocuments(state, dispatch);
      let response = await updateEmployee(
        queryObject,
        employeeObject,
        dispatch
      );
      let employeeId = response && get(response, "Employees[0].code");
      showHideAdhocPopup(state, dispatch);
      const acknowledgementUrl =
        process.env.REACT_APP_SELF_RUNNING === "true"
          ? `/egov-ui-framework/hrms/acknowledgement?purpose=activate&status=success&applicationNumber=${employeeId}`
          : `/hrms/acknowledgement?purpose=activate&status=success&applicationNumber=${employeeId}`;
      dispatch(setRoute(acknowledgementUrl));
    } catch (error) {
      furnishEmployeeData(state, dispatch);
    }
  }
};

export const getEmployeeData = async (
  state,
  dispatch,
  employeeId,
  tenantId
) => {
  let queryObject = [
    {
      key: "codes",
      value: employeeId
    },
    {
      key: "tenantId",
      value: tenantId
    }
  ];
  let response = await getSearchResults(queryObject, dispatch);
  dispatch(prepareFinalObject("Employee", get(response, "Employees")));
  dispatch(prepareFinalObject("empPhoneNumber", get(response, "Employees[0].user.mobileNumber", '')));
  dispatch(
    handleField(
      "create",
      "components.div.children.headerDiv.children.header.children.header.children.key",
      "props",
      {
        labelName: "Edit Employee",
        labelKey: "HR_COMMON_EDIT_EMPLOYEE_HEADER"
      }
    )
  );
  dispatch(
    handleField(
      "create",
      "components.div.children.formwizardFirstStep.children.professionalDetails.children.cardContent.children.employeeDetailsContainer.children.employeeId",
      "props.disabled",
      true
    )
  );

  const judis = get(response, 'Employees[0].jurisdictions', []);
  const roles = get(response, 'Employees[0].user.roles', [])
  judis.map(judis => {
    if (judis.boundary) {
      judis.roles = roles.filter(role => role.tenantId == judis.boundary).map(role => {
        return { ...role, value: role.code, label: role.name }
      });
    }
  })
  dispatch(prepareFinalObject("Employee", get(response, "Employees")));

  if (get(response, "Employees[0].isActive", false)) {
    dispatch(
      handleField(
        "view",
        "components.div.children.footer.children.activateEmployee",
        "visible",
        false
      )
    );
    dispatch(
      handleField(
        "view",
        "components.div.children.footer.children.deactivateEmployee",
        "visible",
        true
      )
    );
    dispatch(prepareFinalObject("employeeStatus", 'DEACTIVATE'))
    showActivateDetails(dispatch, false)
  } else {
    dispatch(
      handleField(
        "view",
        "components.div.children.footer.children.activateEmployee",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "view",
        "components.div.children.footer.children.deactivateEmployee",
        "visible",
        false
      )
    );
    dispatch(prepareFinalObject("employeeStatus", 'ACTIVATE'))
    showActivateDetails(dispatch, true)
  }
  furnishEmployeeData(state, dispatch);
};



const showActivateDetails = (dispatch, activate = true) => {
  dispatch(
    handleField(
      "view",
      "components.adhocDialog.children.popup.children.body.children.deactivationReason",
      "jsonPath",
      activate ? "Employee[0].reactivationDetails[0].reasonForReactivation" : "Employee[0].deactivationDetails[0].reasonForDeactivation"
    )
  );
  dispatch(
    handleField(
      "view",
      "components.adhocDialog.children.popup.children.body.children.deactivationReason",
      "props.jsonPath",
      activate ? "Employee[0].reactivationDetails[0].reasonForReactivation" : "Employee[0].deactivationDetails[0].reasonForDeactivation"
    )
  );
  dispatch(
    handleField(
      "view",
      "components.adhocDialog.children.popup.children.body.children.deactivationReason",
      "props.placeholder.labelKey",
      activate ? "HR_ACTIVATION_REASON_SELECT" : "HR_DEACTIVATION_REASON_SELECT"
    )
  );
  dispatch(
    handleField(
      "view",
      "components.adhocDialog.children.popup.children.body.children.deactivationReason",
      "props.label.labelKey",
      activate ? "HR_ACTIVATION_REASON" : "HR_DEACTIVATION_REASON"
    )
  );

  dispatch(
    handleField(
      "view",
      "components.adhocDialog.children.popup.children.body.children.effectiveDate",
      "jsonPath",
      activate ? "Employee[0].reactivationDetails[0].effectiveFrom" : "Employee[0].deactivationDetails[0].effectiveFrom"
    )
  );
  dispatch(
    handleField(
      "view",
      "components.adhocDialog.children.popup.children.body.children.effectiveDate",
      "props.jsonPath",
      activate ? "Employee[0].reactivationDetails[0].effectiveFrom" : "Employee[0].deactivationDetails[0].effectiveFrom"
    )
  );


  dispatch(
    handleField(
      "view",
      "components.adhocDialog.children.popup.children.nonMandatoryBody.children.orderNo",
      "jsonPath",
      activate ? "Employee[0].reactivationDetails[0].orderNo" : "Employee[0].deactivationDetails[0].orderNo"
    )
  );
  dispatch(
    handleField(
      "view",
      "components.adhocDialog.children.popup.children.nonMandatoryBody.children.orderNo",
      "props.jsonPath",
      activate ? "Employee[0].reactivationDetails[0].orderNo" : "Employee[0].deactivationDetails[0].orderNo"
    )
  );



  dispatch(
    handleField(
      "view",
      "components.adhocDialog.children.popup.children.nonMandatoryBody.children.remarks",
      "jsonPath",
      activate ? "Employee[0].reactivationDetails[0].remarks" : "Employee[0].deactivationDetails[0].remarks"
    )
  );
  dispatch(
    handleField(
      "view",
      "components.adhocDialog.children.popup.children.nonMandatoryBody.children.remarks",
      "props.jsonPath",
      activate ? "Employee[0].reactivationDetails[0].remarks" : "Employee[0].deactivationDetails[0].remarks"
    )
  );


  dispatch(
    handleField(
      "view",
      "components.adhocDialog.children.popup.children.nonMandatoryBody.children.upload",
      "jsonPath",
      activate ? "ActivationDocuments" : "deactivationDocuments"
    )
  );
  dispatch(
    handleField(
      "view",
      "components.adhocDialog.children.popup.children.nonMandatoryBody.children.upload.children.uploadButton",
      "props.jsonPath",
      activate ? "ActivationDocuments" : "deactivationDocuments"
    )
  );
  dispatch(
    handleField(
      "view",
      "components.adhocDialog.children.popup.children.nonMandatoryBody.children.upload",
      "props.jsonPath",
      activate ? "ActivationDocuments" : "deactivationDocuments"
    )
  );


  dispatch(
    handleField(
      "view",
      "components.adhocDialog.children.popup.children.buttonDiv.children.deactivateButton.children.previousButtonLabel",
      "props.labelKey",
      activate ? "HR_ACTIVATE_EMPLOYEE_LABEL" : "HR_DEACTIVATE_EMPLOYEE_LABEL"
    )
  );
  dispatch(
    handleField(
      "view",
      "components.adhocDialog.children.popup.children.header.children.div1.children.div.children.key",
      "props.labelKey",
      activate ? "HR_ACTIVATE_EMPLOYEE_HEAD" : "HR_DEACTIVATE_EMPLOYEE_HEAD"
    )
  );


}