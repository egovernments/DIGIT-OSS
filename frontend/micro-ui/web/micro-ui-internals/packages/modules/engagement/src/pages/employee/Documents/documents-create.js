import React, { useState } from "react";
import { FormComposer } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { documentsFormConfig } from "../../../config/doc-create";
import { useHistory } from "react-router-dom";

const Documents = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [canSubmit, setSubmitValve] = useState(false);

  const onFormValueChange = (setValue, formData, formState) => {
    if (
      formData?.documentName &&
      formData?.docCategory &&
      (formData?.document.filestoreId || formData?.document.documentLink) &&
      formData?.ULB?.length
    ) {
      setSubmitValve(true);
    } else {
      setSubmitValve(false);
    }
  };

  const onSubmit = (data) => {
    const DocumentEntity = {
      name: data.documentName,
      description: data.description,
      category: data.docCategory?.name,
      filestoreId: data.document.filestoreId,
      documentLink: data.document.documentLink,
      tenantIds: data.ULB.map((e) => e.code),
    };

    history.push("/digit-ui/employee/engagement/documents/response", { DocumentEntity });
  };

  return (
    <FormComposer
      heading={t("ES_ENGAGEMENT_DOCUMENTS")}
      label={t("ES_COMMON_APPLICATION_SUBMIT")}
      config={documentsFormConfig}
      onSubmit={onSubmit}
      fieldStyle={{}}
      onFormValueChange={onFormValueChange}
      isDisabled={!canSubmit}
    />
  );
};

export default Documents;
