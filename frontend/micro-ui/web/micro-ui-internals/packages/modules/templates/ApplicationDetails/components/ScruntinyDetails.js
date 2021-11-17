import { StatusTable, Row, PDFSvg } from "@egovernments/digit-ui-react-components";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";

const ScruntinyDetails = ({ scrutinyDetails }) => {
  const { t } = useTranslation();
  let count = 0;
  return (
    <Fragment>
      {!scrutinyDetails?.isChecklist && <div style={{ background: "#FAFAFA", border: "1px solid #D6D5D4", padding: "8px", borderRadius: "4px", maxWidth: "950px", minWidth: "280px" }}>
        <StatusTable>
          <div>
            {scrutinyDetails?.values?.map((value, index) => {
              return <Row className="border-none" textStyle={value?.value === "Paid"?{color:"darkgreen"}:{}} key={`${value.title}:`} label={`${t(`${value.title}`)}:`} text={value?.value ? value?.value : ""} />
            })}
          </div>
          <div>
            {scrutinyDetails?.scruntinyDetails?.map((report, index) => {
              return (
                <Fragment>
                  <Row className="border-none" label={`${t(report?.title)}:`} />
                  <a href={report?.value}> <PDFSvg /> </a>
                  <p style={{ margin: "8px 0px", fontWeight: "bold", fontSize: "16px", lineHeight: "19px", color: "#505A5F" }}>{t(report?.text)}</p>
                </Fragment>
              )
            })}
          </div>
        </StatusTable>
      </div>}
    </Fragment>
  )
}

export default ScruntinyDetails;