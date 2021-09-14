import {
  ActionBar, Card, CardLabel, CardSectionHeader, CardText, Header, Loader,
  SubmitBar
} from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

const RequiredDoc = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const { t } = useTranslation();
  const history = useHistory();
  const { id } = useParams();
  const [docs, setDocs] = useState([]);
  const { isLoading, data: Documentsob } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", ["MutationDocuments"]);
  const OnSubmit = () => {
    history.push(`/digit-ui/employee/pt/property-mutate/${id}`);
  };

  useEffect(() => {
    if (Documentsob) setDocs(Documentsob?.PropertyTax?.MutationDocuments);
  }, [Documentsob]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <Header>{t("PT_REQIURED_DOC_TRANSFER_OWNERSHIP")}</Header>
      <Card>
        {docs.map((doc, index) => {
          const splitValues = doc.code.split(".");
          const dd = doc.dropdownData;
          return (
            <React.Fragment key={index}>
              <CardSectionHeader style={{ marginTop: "38px", marginBottom: "16px" }}>{t(`${splitValues[0]}.${splitValues[1]}`)}</CardSectionHeader>
              {dd.map((e, ind) => {
                return (
                  <React.Fragment key={ind}>
                    <CardLabel style={{ fontWeight: 700 }}>{ind + 1 + ". " + t(e.code)}</CardLabel>
                  </React.Fragment>
                );
              })}
              <CardText className="docsDescription">{t(`${splitValues[0]}.${splitValues[1]}.${splitValues[1]}_DESCRIPTION`)}</CardText>
            </React.Fragment>
          );
        })}
      </Card>
      <ActionBar>
        <SubmitBar style={{ display: "block", marginLeft: "auto" }} label={t("PT_TRANSFER_OWNERSHIP")} onSubmit={OnSubmit} />
      </ActionBar>
    </React.Fragment>
  );
};

export default RequiredDoc;
