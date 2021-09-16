import { StatusTable, Row, PDFSvg } from "@egovernments/digit-ui-react-components";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";

const ScruntinyDetails = ({ scrutiny }) => {
  const { t } = useTranslation();
  return (
    <Fragment>
      <StatusTable>
        {scrutiny?.map((report, index) => {
          return (
            <Fragment>
              <Row label={t(report?.title)} />
              <a>
                <PDFSvg />
              </a>
            </Fragment>
          )
        })}
      </StatusTable>
        
    </Fragment>
  )
}

export default ScruntinyDetails;