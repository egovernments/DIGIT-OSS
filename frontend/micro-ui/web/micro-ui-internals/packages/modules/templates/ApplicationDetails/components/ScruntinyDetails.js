import { StatusTable, Row, PDFSvg } from "@egovernments/digit-ui-react-components";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";

const ScruntinyDetails = ({ scrutinyDetails }) => {
  const { t } = useTranslation();
  return (
    <Fragment>
      {!scrutinyDetails?.isChecklist && <div style={{ background: "#FAFAFA", border: "1px solid #D6D5D4", padding: "8px", borderRadius: "4px", maxWidth: scrutinyDetails?.isChecklist ?"1200px":"600px", minWidth: "280px" }}>
        <StatusTable>
          <div>
            {scrutinyDetails?.values?.map((value, index) => {
              return <Row className="border-none" key={`${value.title}:`} label={`${t(`${value.title}`)}:`} text={value?.value ? value?.value : ""} />
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
      {scrutinyDetails?.isChecklist && <div>
            {scrutinyDetails.values.filter((ob,index) => (index%2==0)).map((val,ind) => {
              return(
                <Fragment>
                  <div style={{ background: "#FAFAFA", border: "1px solid #D6D5D4", padding: "8px", borderRadius: "4px", maxWidth: scrutinyDetails?.isChecklist ?"1200px":"600px", minWidth: "280px", marginBottom:"10px" }}>
                  <StatusTable>
                  <Row className="border-none" key={`${val.title}:`} label={`${t(`${val.title}`)}:`} text={val?.value ? val?.value : ""} />
                  <Row className="border-none" key={`${scrutinyDetails.values[ind+1].title}:`} label={`${t(`${scrutinyDetails.values[ind+1].title}`)}:`} text={scrutinyDetails.values[ind+1]?.value ? scrutinyDetails.values[ind+1]?.value : ""} />
                  </StatusTable>
                  </div>
                </Fragment>
              )
            })
            }

          </div>}
    </Fragment>
  )
}

export default ScruntinyDetails;