import { StatusTable, Row, CardSectionHeader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import PropertyDocuments from "./PropertyDocuments";

const getDocuments = (fiDocuments) => {
    const returnDocuments = [{
        title: "BPA_DOCUMENT_DETAILS_LABEL",
        values: fiDocuments?.map(doc => ({
            title: doc?.documentType?.replaceAll('.', '_'),
            documentType: doc?.documentType,
            documentUid: doc?.documentUid,
            fileStoreId: doc?.fileStoreId,
            id: doc?.id
        }))
    }];
    return returnDocuments;
};

function InspectionReport({ fiReport }) {
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <div style={{ marginTop: "10px" }}>
                <CardSectionHeader>{`${t(`BPA_FI_REPORT`)}`}</CardSectionHeader>
                {fiReport.map((fiData, index) =>
                    <div style={{ background: "#FAFAFA", border: "1px solid #D6D5D4", padding: "8px", borderRadius: "4px", maxWidth: "950px", minWidth: "280px", marginBottom: "24px" }}>
                        <StatusTable>
                            <Row className="border-none" label={fiReport?.length == 1 ? `${t(`BPA_FI_REPORT`)}:` : `${t(`BPA_FI_REPORT`)} - ${index + 1}:`} text={""} />
                            <Row className="border-none" label={`${t(`BPA_FI_DATE_LABEL`)}:`} text={fiData?.date ? fiData?.date : "NA"} />
                            <Row className="border-none" label={`${t(`BPA_FI_TIME_LABEL`)}:`} text={fiData?.time ? fiData?.time : "NA"} />
                            {fiData?.questions?.length &&
                                fiData?.questions?.map((qstn) =>
                                    <div style={{ background: "white", border: "1px solid #D6D5D4", padding: "8px", borderRadius: "4px", marginTop: "10px" }}>
                                        <Row className="border-none" label={`${t(`${qstn.question}`)}:`} text={qstn?.value ? qstn?.value : "NA"} />
                                        <Row className="border-none" label={`${t(`BPA_ENTER_REMARKS`)}:`} text={qstn.remarks ? qstn.remarks : "NA"} />
                                    </div>)}
                            <PropertyDocuments documents={getDocuments(fiData?.docs)} svgStyles={{ width: "100px", height: "100px", viewBox: "0 0 25 25", minWidth: "100px" }} />
                        </StatusTable>
                    </div>)}
            </div>
        </React.Fragment>
    );
}

export default InspectionReport;
