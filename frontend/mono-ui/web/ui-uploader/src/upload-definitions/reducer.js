import * as actionTypes from "../constants/actionTypes";

const initialState = {
  isFetching: false,
  error: false,
  selectedModule: null,
  selectedModuleTemplate: null,
  selectedModuleDefinition: null,
  items: {}
};

const transformUploadDefinitions = uploadDefinitions => {
  return uploadDefinitions.reduce((transformedDefinition, moduleDefinition) => {
    transformedDefinition[
      moduleDefinition.name
    ] = moduleDefinition.Definitions.map(definition => {
      return { definition: definition.name, template: definition.templatePath };
    });
    return transformedDefinition;
  }, {});
};

const uploadDefinitions = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INITIATE_UPLOAD_DEFINITIONS_FETCH:
      return { ...state, isFetching: true, error: false };

    case actionTypes.UPLOAD_DEFINTIONS_RECEIVED:
      const uploadDefinitions = transformUploadDefinitions(
        action.uploadDefinitions
      );
      const selectedModule = Object.keys(uploadDefinitions)[0];
      const selectedModuleDefinition =
        uploadDefinitions[selectedModule][0].definition;
      const selectedModuleTemplate =
        uploadDefinitions[selectedModule][0].template;

      return {
        ...state,
        items: uploadDefinitions,
        selectedModule,
        selectedModuleDefinition,
        selectedModuleTemplate,
        isFetching: false,
        error: false
      };

    case actionTypes.FETCH_UPLOAD_DEFINITIONS_FAILURE:
      return { ...state, error: true, isFetching: false };

    case actionTypes.MODULE_SELECTED:
      return {
        ...state,
        selectedModule: action.moduleName,
        selectedModuleDefinition: state.items[action.moduleName][0].definition,
        selectedModuleTemplate: state.items[action.moduleName][0].template
      };

    case actionTypes.MOUDULE_DEFINITION_SELECTED:
      return {
        ...state,
        selectedModuleDefinition: action.moduleDefinition,
        selectedModuleTemplate: state.items[state.selectedModule].filter(
          definition => definition.definition == action.moduleDefinition
        )[0].template
      };

    default:
      return state;
  }
};
export default uploadDefinitions;
