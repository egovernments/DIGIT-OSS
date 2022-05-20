import React from "react";
import { useTranslation } from "react-i18next";
import { CardSubHeader, PDFSvg } from "@egovernments/digit-ui-react-components";

function DocumentsPreview({ documents, svgStyles = {}, isSendBackFlow = false, isHrLine = false, titleStyles }) {
    const { t } = useTranslation();
    const isStakeholderApplication = window.location.href.includes("stakeholder");

    return (
        <div style={{ marginTop: "19px" }}>
            {!isStakeholderApplication && documents?.map((document, index) => (
                <React.Fragment key={index}>
                    {document?.title ? <CardSubHeader style={titleStyles ? titleStyles : { marginTop: "32px", marginBottom: "8px", color: "#505A5F", fontSize: "24px" }}>{t(document?.title)}</CardSubHeader> : null}
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                        {document?.values && document?.values.length > 0 ? document?.values?.map((value, index) => (
                            <a target="_" href={value?.url} style={{ minWidth: "80px", marginRight: "10px", maxWidth: "100px", height: "auto", minWidth: "100px" }} key={index}>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <PDFSvg />
                                </div>
                                <p style={{ marginTop: "8px", fontWeight: "bold", textAlign: "center", color: "#505A5F"  }}>{t(value?.title)}</p>
                                {isSendBackFlow ? value?.documentType?.includes("NOC") ? <p style={{ textAlign: "center" }}>{t(value?.documentType.split(".")[1])}</p> : <p style={{ textAlign: "center" }}>{t(value?.documentType)}</p> : ""}
                            </a>
                        )) : !(window.location.href.includes("citizen")) && <div><p>{t("BPA_NO_DOCUMENTS_UPLOADED_LABEL")}</p></div>}
                    </div>
                    {isHrLine && documents?.length != index + 1 ? <hr style={{ color: "#D6D5D4", backgroundColor: "#D6D5D4", height: "2px", marginTop: "20px", marginBottom: "20px" }} /> : null}
                </React.Fragment>
            ))}
            {isStakeholderApplication && documents?.map((document, index) => (
                <React.Fragment key={index}>
                    {document?.title ? <CardSubHeader style={{ marginTop: "32px", marginBottom: "8px", color: "#505A5F", fontSize: "24px" }}>{t(document?.title)}</CardSubHeader> : null}
                    <div>
                        {document?.values && document?.values.length > 0 ? document?.values?.map((value, index) => (
                            <a target="_" href={value?.url} style={{ minWidth: svgStyles?.minWidth ? svgStyles?.minWidth : "160px", marginRight: "20px" }} key={index}>
                                <div style={{ maxWidth: "940px", padding: "8px", borderRadius: "4px", border: "1px solid #D6D5D4", background: "#FAFAFA" }}>
                                    <p style={{ marginTop: "8px", fontWeight: "bold", marginBottom: "10px" }}>{t(value?.title)}</p>
                                    {value?.docInfo ? <div style={{ fontSize: "12px", color: "#505A5F", fontWeight: 400, lineHeight: "15px", marginBottom: "10px" }}>{`${t(value?.docInfo)}`}</div> : null}
                                    <PDFSvg />
                                    <p style={{ marginTop: "8px", fontSize: "16px", lineHeight: "19px", color: "#505A5F", fontWeight: "400", textAlign: "center", color: "#505A5F"  }}>{`${t(value?.title)}`}</p>
                                </div>
                            </a>
                        )) : !(window.location.href.includes("citizen")) && <div><p>{t("BPA_NO_DOCUMENTS_UPLOADED_LABEL")}</p></div>}
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}

export default DocumentsPreview;
