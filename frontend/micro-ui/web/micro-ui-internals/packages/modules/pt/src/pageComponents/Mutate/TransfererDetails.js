import React from "react";
import { FormStep, StatusTable, Row, CardHeader, KeyNote, CardCaption } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import Timeline from "../../components/TLTimeline";
// import { cardBodyStyle, stringReplaceAll } from "../utils";

const TransfererDetails = ({ userType, formData, config, onSelect }) => {
  const { t } = useTranslation();
  const propertyDetails = userType === "employee" ? formData.originalData : formData.searchResult.property;
  const ownershipType = propertyDetails?.ownershipCategory?.split?.(".");

  if (userType === "employee") {
    return (
      <React.Fragment>
        <StatusTable>
          {propertyDetails?.owners
            ?.filter((e) => e.status === "ACTIVE")
            .map((owner, index, arr) => {
              return (
                <React.Fragment>
                  {propertyDetails?.owners?.filter((e) => e.status === "ACTIVE").length > 1 ? (
                    <CardCaption style={{ marginTop: "24px", marginBottom: "12px", display: "block" }}>
                      {t("ES_OWNER") + "  " + (index + 1)}
                    </CardCaption>
                  ) : null}
                  {config.labels
                    ?.filter(
                      (e) => e.ownershipType === "ALL" || ownershipType?.[0].includes(e.ownershipType) || e.ownershipType === ownershipType?.[0]
                    )
                    .map((label) => {
                      let noteValue = label?.keyPath
                        ?.filter((e) => !["searchResult", "property"].includes(e))
                        ?.reduce((acc, curr) => (curr === "_index_" ? acc?.[index] : acc?.[curr]), propertyDetails);
                      return <Row key={label.label} label={t(label.label)} text={noteValue || "N/A"} />;
                    })}
                </React.Fragment>
              );
            })}
        </StatusTable>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Timeline currentStep={1} flow="PT_MUTATE" />
      <FormStep t={t} config={config} onSelect={onSelect} onSkip={() => {}} isDisabled={false}>
        <CardHeader>{t("PT_MUTATION_TRANSFEROR_DETAILS")}</CardHeader>
        {propertyDetails?.owners
          ?.filter((e) => e.status === "ACTIVE")
          .map((owner, index, arr) => {
            return (
              <React.Fragment key={index}>
                {propertyDetails?.owners?.filter((e) => e.status === "ACTIVE").length > 1 ? (
                  <CardCaption style={{ marginTop: "24px", marginBottom: "12px", display: "block" }}>
                    {t("ES_OWNER") + "  " + (index + 1)}
                  </CardCaption>
                ) : null}
                {config.labels
                  ?.filter((e) => e.ownershipType === "ALL" || ownershipType?.[0].includes(e.ownershipType) || e.ownershipType === ownershipType?.[0])
                  .map((label) => {
                    let noteValue = label?.keyPath?.reduce((acc, curr) => (curr === "_index_" ? acc?.[index] : acc?.[curr]), formData);
                    return (
                      <KeyNote
                        key={label.label}
                        keyValue={t(label.label)}
                        note={typeof noteValue === "string" ? t(noteValue) : "N/A"}
                        noteStyle={label.noteStyle}
                      />
                    );
                  })}
              </React.Fragment>
            );
          })}
      </FormStep>
    </React.Fragment>
  );
};

export default TransfererDetails;
