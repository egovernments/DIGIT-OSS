import React from "react";
// import DropDown from "../components/DropDownUi";
import DropDown from "../components/DropDownUiNew";
import FlatButton from "material-ui/FlatButton";
import Grid from "@material-ui/core/Grid";

const View = ({
  templateDisabled,
  selectedModuleTemplate,
  moduleItems,
  selectedModule,
  moduleDefinitons,
  handleModuleDropDownChange,
  handleFileTypeDropDownChange,
  selectedModuleDefinition
}) => {
  return (
    <Grid container="true" sm="12" spacing={16} marginTop={16}>
      {/* <DropDown
        style={{ marginRight: "15px" }}
        options={moduleItems}
        label="Module Name"
        selected={selectedModule}
        handleChange={handleModuleDropDownChange}
      />
      <DropDown
        options={moduleDefinitons}
        label="Module Definition"
        selected={selectedModuleDefinition}
        handleChange={handleFileTypeDropDownChange}
      /> */}
      <Grid item sm="4">
        <DropDown
          style={{ marginRight: "15px" }}
          options={moduleItems}
          label="Module Name"
          value={selectedModule}
          onChange={handleModuleDropDownChange}
          placeholder="Select Module"
        />
      </Grid>
      <Grid item sm="4">
        <DropDown
          options={moduleDefinitons}
          label="Module Definition"
          value={selectedModuleDefinition}
          onChange={handleFileTypeDropDownChange}
          placeholder="Select Module Defination"
        />
      </Grid>
      <Grid item sm="4">
        <FlatButton
          primary={true}
          disabled={templateDisabled}
          style={{ height: "60px" }}
          label={templateDisabled ? "No Template Found" : "Download Template"}
          target="_blank"
          href={selectedModuleTemplate}
        />
      </Grid>
    </Grid>
  );
};
export default View;
