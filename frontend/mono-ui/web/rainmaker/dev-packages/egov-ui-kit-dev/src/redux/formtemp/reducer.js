import _ from "lodash";

const defaultState = {
  form: {},
  files: [],
  msg: "",
  toastMsg: "",
  dialogOpen: false,
  snackbarOpen: false,
  fieldErrors: {},
  isFormValid: false,
  validationData: {},
  validatePropertyOwner: {},
  validatePropertyFloor: {},
  showTable: false,
  buttonText: "Search",
  editIndex: -1,
  isSuccess: false,
  isError: false,
  isOwnerValid: false,
  isFloorValid: false,
  noOfFloors: 0,
  hasDemandError: false,
  isDatesValid: {
    type: "",
    error: false,
  },
  isPrimaryOwner: "PrimaryOwner",
  hasGuidanceBoundries: false,
};

function validate(isRequired, pattern, name, value, validationData, fielderrorMsg) {
  let errorText = "";
  if (isRequired) {
    if (value.toString().trim().length > 0) {
      if (_.indexOf(validationData.required.current, name) === -1) {
        validationData.required.current.push(name);
      }
    } else {
      validationData.required.current = _.remove(validationData.required.current, (item) => {
        return item !== name;
      });
      errorText = "This field is required";
    }
  }
  if (pattern.toString().trim().length > 0) {
    if (value !== "") {
      if (pattern.test(value)) {
        //when pattern succeeds, remove it from pattern current array
        validationData.pattern.current = _.remove(validationData.pattern.current, (item) => {
          return item !== name;
        });
      } else if (pattern === "/^[0-9]+$/") {
        //when pattern fails, add it in pattern current array
        if (_.indexOf(validationData.pattern.current, name) === -1) {
          validationData.pattern.current.push(name);
        }
        errorText = "It expects numeric only";
      } else {
        validationData.required.current = _.remove(validationData.required.current, (item) => {
          return item !== name;
        });
        //when pattern fails, add it in pattern current array
        if (_.indexOf(validationData.pattern.current, name) === -1) {
          validationData.pattern.current.push(name);
        }
        //Get cusom message and show it
        errorText = fielderrorMsg ? fielderrorMsg : "Invalid field data";
      }
    } else {
      validationData.pattern.current = _.remove(validationData.pattern.current, (item) => {
        return item != name;
      });
    }
  }
  if (!isRequired && value === "") {
    errorText = "";
  }
  return {
    errorText: errorText,
    validationData: validationData,
    isFormValid:
      validationData.required.required.length === validationData.required.current.length &&
      (validationData.pattern ? validationData.pattern.current.length === 0 : true),
  };
}

function validate2(isRequired, pattern, name, value, validatePropertyOwner) {
  let errorText = "";
  if (isRequired) {
    if (value.length || value) {
      if (_.indexOf(validatePropertyOwner.required.current, name) === -1) {
        validatePropertyOwner.required.current.push(name);
      }
    } else {
      validatePropertyOwner.required.current = _.remove(validatePropertyOwner.required.current, (item) => {
        return item != name;
      });
      errorText = "This field is required";
    }
  }

  if (!value.match(/[a-z]/i)) {
    if (value.match(/^\d+$/) && parseInt(value) > 0) {
    } else {
      validatePropertyOwner.required.current = _.remove(validatePropertyOwner.required.current, (item) => {
        return item != name;
      });

      errorText = "Invalid field data";
    }
  }

  if (pattern.toString().length > 0) {
    if (value !== "") {
      if (pattern.test(value)) {
        // if (_.indexOf(validationData.pattern.current, name) == -1) {
        //   validationData.pattern.current.push(name);
        // }
      } else if (pattern === "/^[0-9]+$/") {
        validatePropertyOwner.required.current = _.remove(validatePropertyOwner.required.current, (item) => {
          return item != name;
        });
        // validationData.pattern.current = _.remove(validationData.pattern.current, (item) => {
        //   return item != name
        // });
        errorText = "It expects numeric only";
      } else {
        validatePropertyOwner.required.current = _.remove(validatePropertyOwner.required.current, (item) => {
          return item != name;
        });
        // validationData.pattern.current = _.remove(validationData.pattern.current, (item) => {
        //   return item != name
        // });
        errorText = "Invalid field data";
      }
    }
  }
  if (!isRequired && value === "") {
    errorText = "";
  }
  return {
    errorText: errorText,
    validatePropertyOwner: validatePropertyOwner,
    isOwnerValid: validatePropertyOwner.required.required.length == validatePropertyOwner.required.current.length && errorText == "",
  };
}

function validate3(isRequired, pattern, name, value, validatePropertyFloor, floordata) {
  let errorText = "";
  if (isRequired) {
    if (value.length || value) {
      if (_.indexOf(validatePropertyFloor.required.current, name) === -1) {
        validatePropertyFloor.required.current.push(name);
      }
    } else {
      validatePropertyFloor.required.current = _.remove(validatePropertyFloor.required.current, (item) => {
        return item != name;
      });
      errorText = "This field is required";
    }
  }
  if (pattern.toString().length > 0) {
    if (value !== "") {
      if (pattern.test(value)) {
        // if (_.indexOf(validationData.pattern.current, name) == -1) {
        //   validationData.pattern.current.push(name);
        // }
      } else if (pattern === "/^[0-9]+$/") {
        validatePropertyFloor.required.current = _.remove(validatePropertyFloor.required.current, (item) => {
          return item !== name;
        });
        // validationData.pattern.current = _.remove(validationData.pattern.current, (item) => {
        //   return item != name
        // });
        errorText = "It expects numeric only";
      } else {
        validatePropertyFloor.required.current = _.remove(validatePropertyFloor.required.current, (item) => {
          return item !== name;
        });
        // validationData.pattern.current = _.remove(validationData.pattern.current, (item) => {
        //   return item != name
        // });
        errorText = "Invalid field data";
      }
    }
  }
  if (!isRequired && value === "") {
    errorText = "";
  }
  return {
    errorText: errorText,
    validatePropertyFloor: validatePropertyFloor,
    isFloorValid: validatePropertyFloor.required.required.length === validatePropertyFloor.required.current.length && errorText == "",
  };
}

function validateFileField(isRequired, code, files, validationData, errorMsg) {
  var errorText = "";
  if (isRequired) {
    if (files && files.length > 0) {
      if (_.indexOf(validationData.required.current, code) === -1) {
        validationData.required.current.push(code);
      }
    } else {
      validationData.required.current = _.remove(validationData.required.current, (item) => {
        return item !== code;
      });
      errorText = errorMsg || "This document is required";
    }
  }

  return {
    errorText: errorText,
    validationData: validationData,
    isFormValid:
      validationData.required.required.length === validationData.required.current.length &&
      (validationData.pattern ? validationData.pattern.current.length === 0 : true),
  };
}

function validateCollection(addDemand) {
  var hasError = false;
  var demands = [];
  var collections = [];

  for (var key in addDemand) {
    if (addDemand.hasOwnProperty(key)) {
      if (key.match("collections")) {
        collections.push(addDemand[key]);
      } else {
        demands.push(addDemand[key]);
      }
    }
  }

  for (var i = 0; i < collections.length; i++) {
    var count = 0;
    for (var key in collections[i]) {
      if (collections[i][key] && demands[i]["demand" + count] && Number(collections[i][key]) > Number(demands[i]["demand" + count])) {
        hasError = true;
        return hasError;
      } else if (Number(collections[i][key]) > 0 && (demands[i]["demand" + count] == null || demands[i]["demand" + count] == "")) {
        hasError = true;
        return hasError;
      } else {
        hasError = false;
      }
      count++;
    }
  }

  return hasError;
}

function validateDates(floordata, type) {
  var error = false;

  if (
    type == "constructionStartDate" &&
    floordata.hasOwnProperty("floor") &&
    floordata.floor.hasOwnProperty("constructionStartDate") &&
    (floordata.floor.hasOwnProperty("constCompletionDate") || floordata.floor.hasOwnProperty("occupancyDate"))
  ) {
    if (
      floordata.floor.hasOwnProperty("constCompletionDate") &&
      new Date(floordata.floor.constructionStartDate) > new Date(floordata.floor.constCompletionDate)
    ) {
      error = true;
    } else if (
      floordata.floor.hasOwnProperty("occupancyDate") &&
      new Date(floordata.floor.occupancyDate) < new Date(floordata.floor.constructionStartDate)
    ) {
      error = true;
    }
  } else if (
    type == "constCompletionDate" &&
    floordata.hasOwnProperty("floor") &&
    floordata.floor.hasOwnProperty("constCompletionDate") &&
    (floordata.floor.hasOwnProperty("constructionStartDate") || floordata.floor.hasOwnProperty("occupancyDate"))
  ) {
    if (
      floordata.floor.hasOwnProperty("constructionStartDate") &&
      new Date(floordata.floor.constructionStartDate) > new Date(floordata.floor.constCompletionDate)
    ) {
      error = true;
    } else if (
      floordata.floor.hasOwnProperty("occupancyDate") &&
      new Date(floordata.floor.occupancyDate) < new Date(floordata.floor.constCompletionDate)
    ) {
      error = true;
    }
  } else if (
    type == "occupancyDate" &&
    floordata.hasOwnProperty("floor") &&
    floordata.floor.hasOwnProperty("occupancyDate") &&
    (floordata.floor.hasOwnProperty("constructionStartDate") || floordata.floor.hasOwnProperty("constCompletionDate"))
  ) {
    if (
      floordata.floor.hasOwnProperty("constructionStartDate") &&
      new Date(floordata.floor.occupancyDate) < new Date(floordata.floor.constructionStartDate)
    ) {
      error = true;
    } else if (
      floordata.floor.hasOwnProperty("constCompletionDate") &&
      new Date(floordata.floor.occupancyDate) < new Date(floordata.floor.constCompletionDate)
    ) {
      error = true;
    }
  }

  return (error = {
    type: type,
    error: error,
  });
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case "HAS_GUIDANCE_BOUNDRIES":
      return {
        ...state,
        hasGuidanceBoundries: action.status,
      };

    case "HANDLE_PRIMARY_OWNER":
      return {
        ...state,
        isPrimaryOwner: action.isPrimaryOwner,
      };

    case "VALIDATE_DATES":
      var validationData = validateDates(state.form, action.propertyOne);
      return {
        ...state,
        isDatesValid: validationData,
      };

    case "VALIDATE_COLLECTION":
      var validationData = validateCollection(state.form);
      return {
        ...state,
        hasDemandError: validationData,
      };

    case "ADD_REQUIRED":
      var b = state.validationData.required.required.indexOf(action.property);
      if (b === -1) {
        state.validationData.required.required.push(action.property);
      }

      return {
        ...state,
      };

    case "REMOVE_REQUIRED":
      var a = state.validationData.required.required.indexOf(action.property);
      var b = state.validationData.required.current.indexOf(action.property);

      if (a != -1) {
        state.validationData.required.required.splice(a, 1);
      }

      if (b != -1) {
        state.validationData.required.current.splice(b, 1);
      }

      return {
        ...state,
      };

    case "FLOOR_NUMBERS":
      return {
        ...state,
        noOfFloors: action.noOfFloors,
      };

    case "ADD_FLOOR_REQUIRED":
      var b = state.validatePropertyFloor.required.required.indexOf(action.property);
      if (b === -1) {
        state.validatePropertyFloor.required.required.push(action.property);
      }

      return {
        ...state,
      };

    case "REMOVE_FLOOR_REQUIRED":
      var a = state.validatePropertyFloor.required.required.indexOf(action.property);
      var b = state.validatePropertyFloor.required.current.indexOf(action.property);

      if (a !== -1) {
        state.validatePropertyFloor.required.required.splice(a, 1);
      }

      if (b !== -1) {
        state.validatePropertyFloor.required.current.splice(b, 1);
      }

      return {
        ...state,
      };

    case "PUSH_ONE":
      if (!state.form.hasOwnProperty(action.formArray)) {
        state.form[action.formArray] = [];
      }

      return {
        ...state,
        form: {
          ...state.form,
          [action.formArray]: [...state.form[action.formArray], state.form[action.formData]],
        },
      };

    case "RESET_FORM":
      return {
        ...state,
        form: {},
        hasGuidanceBoundries: false,
        validationData: {
          required: {
            current: [],
            required: [],
          },
          pattern: {
            current: [],
            required: [],
          },
        },
      };

    case "RESET_OBJECT":
      return {
        ...state,
        form: {
          ...state.form,
          [action.object]: null,
        },
        isOwnerValid: action.isSectionValid,
        isFloorValid: action.isSectionValid,
        validatePropertyOwner: action.validatePropertyOwner,
        validatePropertyFloor: action.validatePropertyFloor,
      };

    case "EMPTY_PROPERTY":
      return {
        ...state,
        form: {
          ...state.form,
          [action.property]: null,
        },
        validationData: action.validationData,
        isFormValid: action.isFormValid,
      };

    case "UPDATE_OBJECT":
      state.form[action.objectName][state.editIndex] = state.form[action.object];

      return {
        ...state,
        form: {
          ...state.form,
          [action.objectName]: state.form[action.objectName].map((e, i) => e),
        },
      };

    case "EDIT_OBJECT":
      return {
        ...state,
        form: {
          ...state.form,
          [action.objectName]: action.object,
        },
        isOwnerValid: action.isSectionValid,
        isFloorValid: action.isSectionValid,
      };

    case "EDIT_INDEX":
      return {
        ...state,
        editIndex: action.index,
      };

    case "DELETE_OBJECT":
      return {
        ...state,
        form: {
          ...state.form,
          [action.property]: [...state.form[action.property].slice(0, action.index), ...state.form[action.property].slice(action.index + 1)],
        },
      };

    case "SET_FORM":
      return {
        ...state,
        form: { ...state.form, ...action.data },
        files: action.files || [],
        fieldErrors: action.fieldErrors,
        validationData: action.validationData,
        isFormValid: action.isFormValid,
      };

    case "SET_FORM_DATA":
      return {
        ...state,
        form: action.formData || {},
      };
    case "SET_OWNER_STATE":
      return {
        ...state,
        validatePropertyOwner: action.validatePropertyOwner,
      };

    case "SET_FLOOR_STATE":
      return {
        ...state,
        validatePropertyFloor: action.validatePropertyFloor,
      };

    case "SET_FLOOR_NUMBER":
      return {
        ...state,
        noOfFloors: action.noOfFloors,
      };

    case "HANDLE_CHANGE":
      validationData = undefined;
      validationData = validate(action.isRequired, action.pattern, action.property, action.value, state.validationData, action.errorMsg);
      return {
        ...state,
        form: {
          ...state.form,
          [action.property]: action.value,
        },
        fieldErrors: {
          ...state.fieldErrors,
          [action.property]: validationData.errorText,
        },
        validationData: validationData.validationData,
        isFormValid: validationData.isFormValid,
      };

    case "FILE_UPLOAD":
      var filearray = [];
      filearray = [...state.files];
      filearray.push(action.files);
      return {
        ...state,
        files: filearray,
      };

    case "FILE_EMPTY":
      return {
        ...state,
        files: [],
      };

    case "FILE_REMOVE":
      filearray = [];
      filearray = [...state.files];
      let idx = -1;
      for (let i = 0; i < filearray.length; i++) {
        if (filearray[i].name === action.removefiles) {
          idx = i;
          break;
        }
      }
      if (idx !== -1) {
        //remove the index idx object
        filearray.splice(idx, 1);
      }
      return {
        ...state,
        files: filearray,
      };

    case "FILE_UPLOAD_BY_CODE": //this is used add file for particular field
      var filesArray = [];
      filesArray = state.files ? [...state.files] : [];
      var field = filesArray.find((field) => field.code == action.code);
      var files = [];
      if (field) {
        action.files.map((file) => {
          var isExists = field.files.find((existingFile) => existingFile.name === file.name && existingFile.size === file.size);
          if (!isExists)
            //check file is not exists in the array
            files.push(file);
        });
        field.files = [...field.files, ...files];
        files = [...field.files];
      } else {
        filesArray.push({ code: action.code, files: action.files });
        files = action.files;
      }

      validationData = validateFileField(action.isRequired, action.code, files, state.validationData, action.errorMsg);

      return {
        ...state,
        files: filesArray,
        fieldErrors: {
          ...state.fieldErrors,
          [action.code]: validationData.errorText,
        },
        validationData: validationData.validationData,
        isFormValid: validationData.isFormValid,
      };

    case "FILE_REMOVE_BY_CODE": //this is used to remove file by code {code:'YourFieldCode', files:[{...}]}
      filearray = [];
      filearray = state.files ? [...state.files] : [];

      var validationData;
      var codePos = filearray
        .map(function(field) {
          return field.code;
        })
        .indexOf(action.code);
      var idx = -1;

      if (codePos > -1) {
        var files = filearray[codePos].files;
        for (let i = 0; i < files.length; i++) {
          if (files[i].name === action.name) {
            idx = i;
            break;
          }
        }

        if (idx !== -1) {
          //remove the index idx object
          files.splice(idx, 1);
        }

        validationData = validateFileField(action.isRequired, action.code, files, state.validationData, action.errorMsg);

        return {
          ...state,
          files: filearray,
          fieldErrors: {
            ...state.fieldErrors,
            [action.code]: validationData.errorText,
          },
          validationData: validationData.validationData,
          isFormValid: validationData.isFormValid,
        };
      } else
        return {
          ...state,
        };

    case "HANDLE_CHANGE_NEXT_ONE":
      validationData = undefined;
      validationData = validate(action.isRequired, action.pattern, action.propertyOne, action.value, state.validationData);
      return {
        ...state,
        form: {
          ...state.form,
          [action.property]: {
            ...state.form[action.property],
            [action.propertyOne]: action.value,
          },
        },
        fieldErrors: {
          ...state.fieldErrors,
          [action.property]: {
            ...state.fieldErrors[action.property],
            [action.propertyOne]: validationData.errorText,
          },
        },
        validationData: validationData.validationData,
        isFormValid: validationData.isFormValid,
      };

    case "HANDLE_CHANGE_OWNER":
      let validatePropertyOwner;
      validatePropertyOwner = validate2(action.isRequired, action.pattern, action.propertyOne, action.value, state.validatePropertyOwner);
      return {
        ...state,
        form: {
          ...state.form,
          [action.property]: {
            ...state.form[action.property],
            [action.propertyOne]: action.value,
          },
        },
        fieldErrors: {
          ...state.fieldErrors,
          [action.property]: {
            ...state.fieldErrors[action.property],
            [action.propertyOne]: validatePropertyOwner.errorText,
          },
        },
        validatePropertyOwner: validatePropertyOwner.validatePropertyOwner,
        isOwnerValid: validatePropertyOwner.isOwnerValid,
      };

    case "HANDLE_CHANGE_FLOOR":
      let validatePropertyFloor;
      validatePropertyFloor = validate3(action.isRequired, action.pattern, action.propertyOne, action.value, state.validatePropertyFloor, state.form);
      return {
        ...state,
        form: {
          ...state.form,
          [action.property]: {
            ...state.form[action.property],
            [action.propertyOne]: action.value,
          },
        },
        fieldErrors: {
          ...state.fieldErrors,
          [action.property]: {
            ...state.fieldErrors[action.property],
            [action.propertyOne]: validatePropertyFloor.errorText,
          },
        },
        validatePropertyFloor: validatePropertyFloor.validatePropertyFloor,
        isFloorValid: validatePropertyFloor.isFloorValid,
      };

    case "HANDLE_CHANGE_NEXT_TWO":
      let validationData = undefined;
      validationData = validate(action.isRequired, action.pattern, action.propertyTwo, action.value, state.validationData);
      return {
        ...state,
        form: {
          ...state.form,
          [action.property]: {
            ...state.form[action.property],
            [action.propertyOne]: {
              ...state.form[action.property][action.propertyOne],
              [action.propertyTwo]: action.value,
            },
          },
        },
        fieldErrors: {
          ...state.fieldErrors,
          [action.propertyTwo]: validationData.errorText,
        },
        validationData: validationData.validationData,
        isFormValid: validationData.isFormValid,
      };

    case "ADD_MANDATORY":
      var obj = state.validationData;
      if (!obj.required.required.includes(action.property)) {
        obj.required.required.push(action.property);
        if (action.pattern.toString().length > 0) obj.pattern.required.push(action.property);
        return {
          ...state,
          validationData: obj,
        };
      } else {
        return {
          ...state,
        };
      }

    case "ADD_MANDATORY_FIELDS":
      var obj = { ...state.validationData };
      let fieldErrors = { ...state.fieldErrors };
      var validationData = { ...state.validationData };

      for (var i = 0; i < action.fields.length; i++) {
        var field = action.fields[i];
        if (!obj.required.required.includes(field.property)) {
          obj.required.required.push(field.property);
          if (field.pattern.toString().length > 0) obj.pattern.required.push(field.property);
          validationData = validate(field.isRequired, field.pattern, field.property, field.value, obj, field.errorMsg);
          fieldErrors[field.property] = validationData.errorText;
        }
      }

      return {
        ...state,
        fieldErrors,
        validationData: validationData.validationData,
        isFormValid: validationData.isFormValid,
      };

    case "ADD_MANDATORY_LATEST":
      var obj = state.validationData;
      if (!obj.required.required.includes(action.property)) {
        obj.required.required.push(action.property);
        if (action.pattern.toString().length > 0) obj.pattern.required.push(action.property);
        validationData = validate(action.isRequired, action.pattern, action.property, action.value, obj, action.errorMsg);
        return {
          ...state,
          fieldErrors: {
            ...state.fieldErrors,
            [action.code]: validationData.errorText,
          },
          validationData: validationData.validationData,
          isFormValid: validationData.isFormValid,
        };
      } else {
        return {
          ...state,
        };
      }

    case "REMOVE_MANDATORY":
      var obj = state.validationData;
      if (obj.required.required.includes(action.property)) {
        let rindex = obj.required.required.indexOf(action.property);
        obj.required.required.splice(rindex, 1);
        if (obj.required.current.includes(action.property)) {
          let cindex = obj.required.current.indexOf(action.property);
          obj.required.current.splice(cindex, 1);
        }
        if (action.pattern.toString().length > 0) {
          let pindex = obj.pattern.required.indexOf(action.property);
          obj.pattern.required.splice(pindex, 1);
        }
        return {
          ...state,
          validationData: obj,
        };
      } else {
        return {
          ...state,
        };
      }

    case "REMOVE_MANDATORY_LATEST":
      var obj = state.validationData;
      if (obj.required.required.includes(action.property)) {
        let rindex = obj.required.required.indexOf(action.property);
        obj.required.required.splice(rindex, 1);
        if (obj.required.current.includes(action.property)) {
          let cindex = obj.required.current.indexOf(action.property);
          obj.required.current.splice(cindex, 1);
        }
        if (action.pattern.toString().length > 0) {
          let pindex = obj.pattern.required.indexOf(action.property);
          obj.pattern.required.splice(pindex, 1);
        }
        validationData = validate(action.isRequired, action.pattern, action.property, action.value, obj, action.errorMsg);
        return {
          ...state,
          fieldErrors: {
            ...state.fieldErrors,
            [action.code]: validationData.errorText,
          },
          validationData: validationData.validationData,
          isFormValid: validationData.isFormValid,
        };
      } else {
        return {
          ...state,
        };
      }

    case "PUSH_ONE_ARRAY":
      if (!state.form.hasOwnProperty(action.formObject)) {
        state.form[action.formObject] = {};
        state.form[action.formObject][action.formArray] = [];
      } else if (!state.form[action.formObject]) {
        alert("Boom2");
        state.form[action.formObject] = {};
        state.form[action.formObject][action.formArray] = [];
      } else if (!state.form[action.formObject][action.formArray]) {
        state.form[action.formObject][action.formArray] = [];
      }

      return {
        ...state,
        form: {
          ...state.form,
          [action.formObject]: {
            ...state.form[action.formObject],
            [action.formArray]: [...state.form[action.formObject][action.formArray], state.form[action.formData]],
          },
        },
      };

    case "RESET_STATE":
      return {
        form: {},
        hasGuidanceBoundries: false,
        files: [],
        fieldErrors: {},
        validationData: action.validationData,
        validatePropertyOwner: action.validatePropertyOwner,
        validatePropertyFloor: action.validatePropertyFloor,
        msg: "",
        dialogOpen: false,
        snackbarOpen: false,
        isFormValid: false,
        showTable: false,
        buttonText: "Search",
        isDatesValid: {
          error: false,
          type: "",
        },
        isPrimaryOwner: action.isPrimaryOwner,
      };

    case "FIELD_ERRORS":
      return {
        ...state,
        fieldErrors: action.errors,
      };

    case "SHOW_TABLE":
      return {
        ...state,
        showTable: action.state,
      };

    case "BUTTON_TEXT":
      return {
        ...state,
        buttonText: action.text,
      };

    case "TOGGLE_DAILOG_AND_SET_TEXT":
      return {
        ...state,
        msg: action.msg,
        dialogOpen: action.dailogState,
      };

    case "TOGGLE_SNACKBAR_AND_SET_TEXT":
      return {
        ...state,
        toastMsg: action.toastMsg,
        snackbarOpen: action.snackbarState,
        isSuccess: action.isSuccess || false,
        isError: action.isError || false,
      };

    case "SET_LOADING_STATUS":
      return {
        ...state,
        loadingStatus: action.loadingStatus,
      };

    default:
      return state;
  }
};
