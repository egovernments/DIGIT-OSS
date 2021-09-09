import React, { useState } from "react";
import { Card, Header, LabelFieldPair, CardLabel, TextInput, Dropdown, FormComposer, Menu, ActionBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { documentsFormConfig } from "../../../config/doc-create";
import { useHistory } from "react-router-dom";

const Documents = (props) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [canSubmit, setSubmitValve] = useState(false);
  const [formData, setData] = useState(() => props.defaultValues);
  const [showMenu, setMenu] = useState(false);

  const onFormValueChange = (setValue, formData, formState) => {
    console.log(formData, ">>>>>>");
    if (
      formData?.documentName &&
      formData?.description &&
      formData?.docCategory &&
      (formData?.document.filestoreId || formData?.document.documentLink) &&
      formData?.ULB?.length
    ) {
      setSubmitValve(true);
    } else {
      setSubmitValve(false);
    }
  };

  const update = (data) => {
    const DocumentEntity = {
      ...props.defaultValues?.originalData,
      name: data.documentName,
      description: data.description,
      category: data.docCategory,
      filestoreId: data.document.filestoreId,
      documentLink: data.document.documentLink,
      tenantIds: data.ULB.map((e) => e.code),
    };
    history.push("/digit-ui/employee/engagement/documents/update-response", { DocumentEntity });
  };

  const _delete = () => {
    history.push("/digit-ui/employee/engagement/documents/delete-response", { DocumentEntity: props.defaultValues?.originalData });
  };

  const onActionSelect = (action) => {
    console.log(action, "actions on action select");
    setMenu(false);
    if (action === "UPDATE") update(formData);
    else if (action === "DELETE") _delete();
  };

  return (
    <React.Fragment>
      <FormComposer
        heading={t("ES_ENGAGEMENT_DOCUMENTS")}
        label={t("ES_COMMON_ACTION")}
        config={documentsFormConfig}
        onSubmit={(data) => {
          setMenu(!showMenu);
          setData(data);
        }}
        fieldStyle={{}}
        onFormValueChange={onFormValueChange}
        defaultValues={props.defaultValues}
        isDisabled={!canSubmit}
      />
      <ActionBar>
        {showMenu ? <Menu localeKeyPrefix="ES_DOCS" options={["DELETE", "UPDATE"]} onSelect={onActionSelect} /> : <React.Fragment />}
      </ActionBar>
    </React.Fragment>
  );
};

export default Documents;
