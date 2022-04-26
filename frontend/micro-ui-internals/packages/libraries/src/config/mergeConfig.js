// let defaultConfig = require("./default2.json");
import { ifObjectContainsArray } from "./configUtils";

let defaultConfigCopy = {};
let sectionToBeUpdated = {};
let currentUpdatableSection = [];
let selectedProperty = "";

const MergeConfigObj = (defaultConfig, deltaConfig) => {
  defaultConfigCopy = JSON.parse(JSON.stringify(defaultConfig));
  let deltaConfigCopy = JSON.parse(JSON.stringify(deltaConfig));
  processStateConfig(deltaConfigCopy);
  return defaultConfigCopy;
};

const processStateConfig = (deltaConfig) => {
  if (Array.isArray(deltaConfig)) {
    deltaConfig.forEach((forms) => {
      sectionToBeUpdated = {};
      InitSectionToUpdate(forms);
    });
  }
};

const InitSectionToUpdate = (forms) => {
  if (forms.id && !forms.__property__) {
    GetCurrentUpdatableSection(forms.id, defaultConfigCopy);
  }
  if (forms.__property__ && forms.__action__) {
    selectedProperty = forms.__property__;
    currentUpdatableSection = currentUpdatableSection.length === 0 ? defaultConfigCopy : currentUpdatableSection;
    findSectionById(selectedProperty, currentUpdatableSection);
    seachInDefaultConfig(forms.__property__, forms);
  } else if (Array.isArray(forms)) {
    forms.forEach((form) => {
      InitSectionToUpdate(form);
    });
  } else if (ifObjectContainsArray(forms).hasArray) {
    let array = ifObjectContainsArray(forms).value;
    InitSectionToUpdate(array);
  } else {
    throw new Error("__property__ or  __action__ not found");
  }
};

const GetCurrentUpdatableSection = (id, defaultConfigCopy) => {
  if (Array.isArray(defaultConfigCopy)) {
    for (let i = 0; i < defaultConfigCopy.length; i++) {
      if (defaultConfigCopy[i].id === id) {
        currentUpdatableSection.push(defaultConfigCopy[i]);
      } else if (ifObjectContainsArray(defaultConfigCopy[i]).hasArray) {
        let array = ifObjectContainsArray(defaultConfigCopy[i]).value;
        GetCurrentUpdatableSection(id, array);
      }
    }
  }
};

const findSectionById = (id, currentUpdatableSection) => {
  if (Array.isArray(currentUpdatableSection)) {
    for (let i = 0; i < currentUpdatableSection.length; i++) {
      if (currentUpdatableSection[i].id === id) {
        sectionToBeUpdated = currentUpdatableSection;
      } else if (ifObjectContainsArray(currentUpdatableSection[i]).hasArray) {
        let arr = ifObjectContainsArray(currentUpdatableSection[i]).value;
        findSectionById(id, arr);
      }
    }
  }

  return sectionToBeUpdated;
};

const seachInDefaultConfig = (id, action) => {
  if (!Array.isArray(sectionToBeUpdated) && !sectionToBeUpdated.id) {
    throw new Error("id not found");
  }
  if (sectionToBeUpdated.id === id) {
    actionHandler(action, id, sectionToBeUpdated);
  } else if (Array.isArray(sectionToBeUpdated)) {
    sectionToBeUpdated.forEach((section) => {
      if (section.id === id) {
        actionHandler(action, id, sectionToBeUpdated);
      }
    });
  } else if (ifObjectContainsArray(sectionToBeUpdated).hasArray) {
    sectionToBeUpdated = ifObjectContainsArray(sectionToBeUpdated).value;
    seachInDefaultConfig(id, action);
  }
};

const actionHandler = (action, id, fieldList) => {
  const index = getIndex(id, fieldList);
  if (!action) {
    return;
  }
  if (action.__action__ === "UPDATE") {
    updateAt(index, action, fieldList);
    deleteExtraKeys(action);
  }
  if (action.__action__ === "DELETE") {
    deleteAt(index, fieldList);
    deleteExtraKeys(action);
  }
  if (["INSERT_AFTER", "INSERT_BEFORE"].includes(action.__action__)) {
    handleInsertion(index, action, fieldList);
  }
};

const handleInsertion = (index, action, fields) => {
  index = action.__action__ === "INSERT_BEFORE" ? index : index + 1;
  insertAt(index, action, fields);
  deleteExtraKeys(action);
};

const getIndex = (propertyValue, fields) => {
  let index = fields.findIndex((option) => option.id === propertyValue);

  return index;
};

const insertAt = (index, data, fields) => {
  if (!data.id) {
    throw new Error("id is required is required to insert a record");
  }
  fields.splice(index, 0, data);
};

const updateAt = (index, data, fields) => {
  if (fields[index].id !== data.id) {
    throw new Error(`id ${data.id} not matched`);
  }
  fields[index] = { ...fields[index], ...data };
};

const deleteAt = (index, fields) => {
  fields.splice(index, 1);
};

const deleteExtraKeys = (data) => {
  delete data.__action__;
  delete data.__property__;
};

const getMergedConfig = (defaultConfig, deltaConfig) => {
  let mergedConfigObj = defaultConfig;

  for (const key in deltaConfig) {
    if (deltaConfig.hasOwnProperty(key)) {
      const mergedConfig = MergeConfigObj(defaultConfig[key], deltaConfig[key]);
      mergedConfigObj[key] = mergedConfig;
    }
  }
  return mergedConfigObj;
};

export default getMergedConfig;
