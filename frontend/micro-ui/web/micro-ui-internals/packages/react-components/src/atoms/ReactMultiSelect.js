import React from "react";
import Select from "react-select";

const MultiSelectField = (props) => {
  
  return (
    <div className="app-input-text">
        <Select
          className="basic-single"
          classNamePrefix="select"
          // defaultValue={dealAnalysisArr[0]}
          isClearable={true}
          isSearchable={true}
          name={props?.name}
          options={props?.data}
          value={props?.value}
          
         
        />
        
    </div>
  );
};
export default MultiSelectField;