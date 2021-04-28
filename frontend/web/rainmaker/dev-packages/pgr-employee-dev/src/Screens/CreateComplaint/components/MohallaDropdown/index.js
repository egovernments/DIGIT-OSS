import React from "react";
import { AutoSuggestDropdown } from "components";

const MohallaDD = ({ handleFieldChange, mohalla }) => {
  return (
    <div>
      <AutoSuggestDropdown
        className="fix-for-layout-break"
        fullWidth={true}
        dataSource={mohalla && mohalla.dropDownData}
        onChange={(chosenRequest, index) => {
          handleFieldChange("mohalla", chosenRequest.value);
        }}
        floatingLabelText={mohalla && mohalla.floatingLabelText}
        {...mohalla}
      />
    </div>
  );
};

export default MohallaDD;
