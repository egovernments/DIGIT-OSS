import React, { Fragment } from "react";
import { Card, CardHeader, CardLabel, CardText, CitizenInfoLabel, SubmitBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const OCEDCRDocsRequired = ({ onSelect, onSkip, config }) => {
  const { t } = useTranslation();

  const data = [
    {
      code: "BPA_PERMIT_NUMBER_OC_SCRUTINY_LABEL"
    },
    {
      code: "BPA_PERMIT_DATE_LABEL"
    },
    {
      code: "BPA_OC_PLAN_DXF_FILE"
    }
  ]
  const goNext = () => { onSelect(); };

  return (
    <Fragment>
      <Card>
        <CardHeader>{t(`BPA_OC_NEW_BUILDING_CONSTRUCTION_LABEL`)}</CardHeader>
        {/* <CitizenInfoLabel text={t(`OBPS_OCEDCR_DOCS_REQUIRED_TIME`)} showInfo={false} /> */}
        <CardText style={{ color: "#0B0C0C", marginTop: "12px", fontSize: "16px", fontWeight: "400", lineHeight: "24px" }}>{t(`OBPS_OCEDCR_BUILDING_PERMIT_DESCRIPTION`)}</CardText>
        <Fragment>
          {data?.map((doc, index) => (
            <CardLabel style={{ fontWeight: 700 }} key={index}>
              <div style={{ display: "flex" }}>
                <div>{`${index + 1}.`}&nbsp;</div>
                <div>{` ${t(doc?.code.replace('.', '_'))}`}</div>
              </div>
            </CardLabel>
          ))}
        </Fragment>
        <SubmitBar label={t(`CS_COMMON_NEXT`)} onSubmit={goNext} />
      </Card>
      <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t(`OBPS_OC_DOCS_FILE_SIZE`)} className={"info-banner-wrap-citizen-override"}/>
    </Fragment>
  );
};

export default OCEDCRDocsRequired;