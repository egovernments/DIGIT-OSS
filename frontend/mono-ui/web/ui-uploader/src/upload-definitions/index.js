import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  fetchUploadDefinitions,
  moduleSelected,
  moduleDefinitionSelected
} from "./actions";
import View from "./view";

class UploadDefinitionsContainer extends Component {
  static propTypes = {
    moduleItems: PropTypes.array,
    moduleDefinitons: PropTypes.array,
    selectedModule: PropTypes.string,
    selectedModuleDefinition: PropTypes.string,
    fetchUploadDefinitions: PropTypes.func.isRequired,
    moduleSelected: PropTypes.func.isRequired,
    moduleDefinitionSelected: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.fetchUploadDefinitions();
  }

  handleModuleDropDownChange = (event, index, value) => {
    this.props.moduleSelected(event.target.value);
  };

  handleFileTypeDropDownChange = (event, index, value) => {
    this.props.moduleDefinitionSelected(event.target.value);
  };

  render() {
    const { selectedModuleTemplate } = this.props;
    const { handleFileTypeDropDownChange, handleModuleDropDownChange } = this;
    const templateDisabled =
      selectedModuleTemplate && selectedModuleTemplate.endsWith("/null")
        ? true
        : false;

    return (
      <View
        {...this.props}
        templateDisabled={templateDisabled}
        handleModuleDropDownChange={handleModuleDropDownChange}
        handleFileTypeDropDownChange={handleFileTypeDropDownChange}
      />
    );
  }
}

const getModuleItems = uploadDefinitions => {
  return Object.keys(uploadDefinitions);
};

const getModuleDefinitions = (uploadDefinitions, selectedModule) => {
  const moduleDefinitons =
    selectedModule === null
      ? []
      : uploadDefinitions[selectedModule].map(
          moduleDefiniton => moduleDefiniton.definition
        );
  return moduleDefinitons;
};

const mapDispatchToProps = dispatch => ({
  fetchUploadDefinitions: () => dispatch(fetchUploadDefinitions()),
  moduleSelected: moduleName => dispatch(moduleSelected(moduleName)),
  moduleDefinitionSelected: moduleDefiniton =>
    dispatch(moduleDefinitionSelected(moduleDefiniton))
});

const mapStateToProps = (state, ownProps) => {
  const selectedModule = state.uploadDefinitions.selectedModule;
  const selectedModuleDefinition =
    state.uploadDefinitions.selectedModuleDefinition;
  const selectedModuleTemplate = state.uploadDefinitions.selectedModuleTemplate;
  const uploadDefinitions = state.uploadDefinitions.items;

  //module Items
  const moduleItems = getModuleItems(uploadDefinitions);
  // module definitions
  const moduleDefinitons = getModuleDefinitions(
    uploadDefinitions,
    selectedModule
  );

  return {
    moduleItems,
    moduleDefinitons,
    selectedModule,
    selectedModuleDefinition,
    selectedModuleTemplate
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadDefinitionsContainer);
