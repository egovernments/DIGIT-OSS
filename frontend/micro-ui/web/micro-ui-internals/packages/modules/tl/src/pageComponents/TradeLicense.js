import { Card, CardHeader, CardSubHeader, CardText, CitizenInfoLabel, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { stringReplaceAll } from "../utils";

const TradeLicense = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();

  const { isLoading, data: Documentsob = {} } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "TradeLicense", "TLDocuments");
  let docs = Documentsob?.TradeLicense?.Documents;
  function onSave() { }

  function goNext() {
    onSelect();
  }
  return (
    <React.Fragment>
      <Card>
        <CardHeader>{t("TL_DOC_REQ_SCREEN_HEADER")}</CardHeader>
        <div>
          <CardText>{t("TL_DOC_REQ_SCREEN_TEXT")}</CardText>
          <div>
            {isLoading && <Loader />}
            {Array.isArray(docs)
              ? docs.map(({ code, dropdownData }, index) => (
                <div key={index}>
                  <CardSubHeader>{t("TRADELICENSE_" + stringReplaceAll(code, ".", "_") + "_HEADING")}</CardSubHeader>
                  {dropdownData.map((dropdownData) => (
                    <CardText>{t("TRADELICENSE_" + stringReplaceAll(dropdownData?.code, ".", "_") + "_LABEL")}</CardText>
                  ))}
                </div>
              ))
              : null}
          </div>
        </div>
        <span>
          <SubmitBar label={t("CS_COMMON_NEXT")} onSubmit={onSelect} />
        </span>
      </Card>
      {<CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("TL_DOCUMENT_SIZE_INFO_MSG")} />}
    </React.Fragment>
  );
};

export default TradeLicense;
