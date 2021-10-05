import React, { useState, useCallback } from "react";
import { Card, Header, LabelFieldPair, CardLabel, TextInput, Dropdown, FormComposer, SubmitBar, ActionBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { documentsFormConfig } from "../../../config/doc-create";
import { useHistory } from "react-router-dom";
import Confirmation from "../../../components/Modal/Confirmation";

const Documents = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [canSubmit, setSubmitValve] = useState(false);
 

  const onFormValueChange = useCallback(
    (setValue, updatedFormData, formState) => {
      if (
        updatedFormData?.documentName &&
        updatedFormData?.description &&
        updatedFormData?.docCategory &&
        (updatedFormData?.document.filestoreId || updatedFormData?.document.documentLink) &&
        updatedFormData?.ULB?.length
      ) {
        setSubmitValve(true);
      } else {
        setSubmitValve(false);
      }
    },
    [],
  )

  const update = (data) => {
    const DocumentEntity = {
      ...props.location?.state?.DocumentEntity,
      name: data.documentName,
      description: data?.description,
      category: data.docCategory?.name,
      filestoreId: data.document?.filestoreId?.fileStoreId,
      fileSize: data.document?.filestoreId?.fileSize,
      fileType: data.document?.filestoreId?.fileType,
      documentLink: data.document?.documentLink,
      tenantIds: data.ULB.map((e) => e.code),
    };
    history.push("/digit-ui/employee/engagement/documents/update-response", { DocumentEntity });
  };

  return (
    <React.Fragment>
      <Header>{t("ES_ENGAGEMENT_EDIT_DOC")}</Header>
      <FormComposer
        label={t("ES_COMMON_UPDATE")}     
        config={documentsFormConfig}
        onSubmit={(data) => {
          update(data);
        }}
        fieldStyle={{}}
        onFormValueChange={onFormValueChange}
        defaultValues={props.location.state?.DocumentEntity}
        isDisabled={!canSubmit}
      />
     
    </React.Fragment>
  );
};

export default Documents;
