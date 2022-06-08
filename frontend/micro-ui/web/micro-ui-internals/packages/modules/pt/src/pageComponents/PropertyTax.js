import { Card, CardHeader, CardSubHeader, CardText, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { cardBodyStyle, stringReplaceAll } from "../utils";
//import { map } from "lodash-es";

const PropertyTax = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  sessionStorage.removeItem("docReqScreenByBack");

  const docType = config?.isMutation ? ["MutationDocuments"] : "Documents";

  const { isLoading, data: Documentsob = {} } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", docType);

  let docs = Documentsob?.PropertyTax?.[config?.isMutation ? docType[0] : docType];
  if (!config?.isMutation) docs = docs?.filter((doc) => doc["digit-citizen"]);
  function onSave() {}

  function goNext() {
    onSelect();
  }

  return (
    <React.Fragment>
      <Card>
        <CardHeader>{!config.isMutation ? t("PT_DOC_REQ_SCREEN_HEADER") : t("PT_REQIURED_DOC_TRANSFER_OWNERSHIP")}</CardHeader>
        <div>
          <CardText className={"primaryColor"}>{t("PT_DOC_REQ_SCREEN_SUB_HEADER")}</CardText>
          <CardText className={"primaryColor"}>{t("PT_DOC_REQ_SCREEN_TEXT")}</CardText>
          <CardText className={"primaryColor"}>{t("PT_DOC_REQ_SCREEN_SUB_TEXT")}</CardText>
          <CardSubHeader>{t("PT_DOC_REQ_SCREEN_LABEL")}</CardSubHeader>
          <CardText className={"primaryColor"}>{t("PT_DOC_REQ_SCREEN_LABEL_TEXT")}</CardText>
          <div>
            {isLoading && <Loader />}
            {Array.isArray(docs)
              ? config?.isMutation ?
                  docs.map(({ code, dropdownData }, index) => (
                    <div key={index}>
                      <CardSubHeader>
                        {index + 1}. {t(code)}
                      </CardSubHeader>
                      <CardText className={"primaryColor"}>
                        {dropdownData.map((dropdownData) => (
                          t(dropdownData?.code)
                        )).join(', ')}
                      </CardText>
                      {/* <CardText>{t(`${code.split('.')[0]}.${code.split('.')[1]}.${code.split('.')[1]}_DESCRIPTION`)}</CardText> */}
                    </div>
                  )) :
                  docs.map(({ code, dropdownData }, index) => (
                    <div key={index}>
                      <CardSubHeader>
                        {index + 1}. {t("PROPERTYTAX_" + stringReplaceAll(code, ".", "_") + "_HEADING")}
                      </CardSubHeader>
                      {dropdownData.map((dropdownData) => (
                        <CardText className={"primaryColor"}>{t("PROPERTYTAX_" + stringReplaceAll(dropdownData?.code, ".", "_") + "_LABEL")}</CardText>
                      ))}
                    </div>
                  ))
              : null}
          </div>
        </div>
        <span>
          <SubmitBar label={t("PT_COMMON_NEXT")} onSubmit={onSelect} />
        </span>
      </Card>
    </React.Fragment>
  );
};

export default PropertyTax;
