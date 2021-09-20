import React from "react";
import { Card, Header, LabelFieldPair, CardLabel, TextInput, Dropdown, FormComposer } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const DocumentName = ({ userType, t, setValue, onSelect, config, data, formData, register, errors, setError, clearErrors, formState, control }) => {
  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel style={{ fontWeight: "bold" }}>{t("ES_COMMON_DOC_NAME") + " *"}</CardLabel>
        <div className="field">
          <TextInput name={config.key} inputRef={register()} />
        </div>
      </LabelFieldPair>
    </React.Fragment>
  );
};

export default DocumentName;
