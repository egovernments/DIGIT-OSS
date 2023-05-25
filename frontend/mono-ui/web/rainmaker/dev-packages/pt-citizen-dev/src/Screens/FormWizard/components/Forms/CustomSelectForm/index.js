import React from "react";
import Field from "egov-ui-kit/utils/field";

// const getDropDownData = (noFloors) => {
//   return [...Array(parseInt(noFloors))].map((item, key) => {
//     return { label: key + 1, value: key + 1 };
//   });
// };

const CustomSelectForm = ({ handleFieldChange, form,disabled }) => {
  let fields = form.fields || {};

  return (
    <div style={{ marginLeft: "30px" }}>
      <Field fieldKey="floorName" field={fields.floorName} handleFieldChange={handleFieldChange} disabled={disabled}/>
    </div>
  );
};

export default CustomSelectForm;
