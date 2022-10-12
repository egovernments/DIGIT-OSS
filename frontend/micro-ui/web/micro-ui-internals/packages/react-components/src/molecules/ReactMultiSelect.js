import React from "react";
import Select from "react-select";
import { Autocomplete,TextField} from '@mui/material';



const MultiSelectField = (props) => {
 const ApiList=props.listOfData
  return (
    <div className="app-input-text">
        {/* <Select
          className="basic-single"
          classNamePrefix="select"
          // defaultValue={dealAnalysisArr[0]}
          isClearable={true}
          isSearchable={true}
          name={props?.name}
          options={props?.data}
          value={props?.value}
          
         
        /> */}

        <Autocomplete
          id="combo-box-demo"
          options={(ApiList.length>0)?ApiList:[{"label":"none","id":null}]}
          sx={{ width: 300 }}
          onChange={(e,v)=>{console.log("selected value is",v.label)}}
          renderInput={(params) => <TextField {...params} label={props.labels} />}>

      </Autocomplete>
        
    </div>
  );
};
export default MultiSelectField;