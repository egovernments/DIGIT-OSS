import React from "react";
import { LabelFieldPair, CardLabel, TextInput } from "@egovernments/digit-ui-react-components";


const DocumentName = ({ userType, t, setValue, onSelect, config, data, formData, register, errors, setError, clearErrors, formState, control }) => {
  return (
    <React.Fragment>
      <LabelFieldPair style={{marginBottom:'20px'}}> 
        <CardLabel style={{ fontWeight: "bold"}}>{t("ES_COMMON_DOC_NAME") + " *"}</CardLabel>
        <div className="field">
          <TextInput name={config.key} inputRef={register()} />
        </div>
      </LabelFieldPair>
    </React.Fragment>
  );
};

export default DocumentName;
