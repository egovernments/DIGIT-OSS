import React, { useEffect, useState } from "react";
import {
    CardLabel,
    Dropdown,
    LabelFieldPair,
    MultiUploadWrapper,
    CardSubHeader
} from "@egovernments/digit-ui-react-components";
import DocumentsPreview from "./DocumentsPreview";

const BPADocuments = ({ t, formData, applicationData, docs, bpaActionsDetails }) => {
    const applicationStatus = applicationData?.status || "";
    const actions = bpaActionsDetails?.data?.nextActions || [];
    const stateId = Digit.ULBService.getStateId();
    const [documents, setDocuments] = useState(formData?.documents?.documents || []);
    const [error, setError] = useState(null);
    const [bpaTaxDocuments, setBpaTaxDocuments] = useState([]);
    const [enableSubmit, setEnableSubmit] = useState(true)
    const [checkRequiredFields, setCheckRequiredFields] = useState(false);
    const [checkEnablingDocs, setCheckEnablingDocs] = useState(false);

    const { isLoading: bpaDocsLoading, data: bpaDocs } = Digit.Hooks.obps.useMDMS(stateId, "BPA", ["DocTypeMapping"]);
    const { isLoading: commonDocsLoading, data: commonDocs } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["DocumentType"]);

    useEffect(() => {
        let filtredBpaDocs = [];
        if (bpaDocs?.BPA?.DocTypeMapping) {
            // filtredBpaDocs = bpaDocs?.BPA?.DocTypeMapping?.filter(data => (data.WFState == "INPROGRESS"))
            filtredBpaDocs = bpaDocs?.BPA?.DocTypeMapping?.filter(data => (data.WFState == applicationData?.status ? applicationData?.status : "INPROGRESS" && data.RiskType == applicationData?.riskType && data.ServiceType == applicationData?.additionalDetails?.serviceType && data.applicationType == applicationData?.additionalDetails?.applicationType))
        }
        let documentsList = [];
        filtredBpaDocs?.[0]?.docTypes?.forEach(doc => {
            let code = doc.code; doc.dropdownData = []; doc.uploadedDocuments = [];
            commonDocs?.["common-masters"]?.DocumentType?.forEach(value => {
                let values = value.code.slice(0, code.length);
                if (code === values) {
                    doc.hasDropdown = true;
                    value.i18nKey = value.code;
                    doc.dropdownData.push(value);
                }
            });
            doc.uploadedDocuments[0] = {};
            doc.uploadedDocuments[0].values = [];
            docs?.[0]?.values?.map(upDocs => {
                if (code === `${upDocs?.documentType?.split('.')[0]}.${upDocs?.documentType?.split('.')[1]}`) {
                    doc.uploadedDocuments[0].values.push(upDocs)
                }
            })
            documentsList.push(doc);
        });
        sessionStorage.setItem("BPA_DOCUMENTS", JSON.stringify(documentsList));
        setBpaTaxDocuments(documentsList);

    }, [!bpaDocsLoading, !commonDocsLoading]);

    useEffect(() => {
        let count = 0;
        bpaTaxDocuments.map(doc => {
            let isRequired = false;
            documents.map(data => {
                if (doc.required && doc.code == `${data.documentType.split('.')[0]}.${data.documentType.split('.')[1]}`) {
                    isRequired = true;
                }
            });
            if (!isRequired && doc.required) {
                count = count + 1;
            }
        });
        if ((count == "0" || count == 0) && documents.length > 0) setEnableSubmit(false);
        else setEnableSubmit(true);
    }, [documents, checkRequiredFields])

    useEffect(() => {
        if ( applicationStatus === "DOC_VERIFICATION_INPROGRESS" && actions?.length > 0 ) setCheckEnablingDocs(true);
        else setCheckEnablingDocs(false);
    }, [applicationData, bpaActionsDetails])

    return (
        <div>
            {bpaTaxDocuments?.map((document, index) => {
                return (
                    <div>
                        <SelectDocument
                            key={index}
                            index={index}
                            document={document}
                            t={t}
                            error={error}
                            setError={setError}
                            setDocuments={setDocuments}
                            documents={documents}
                            setCheckRequiredFields={setCheckRequiredFields}
                            applicationStatus={applicationStatus}
                            actions={actions}
                            bpaTaxDocuments={bpaTaxDocuments}
                            checkEnablingDocs={checkEnablingDocs}
                        />
                    </div>
                );
            })}
        </div>
    );
}

function SelectDocument({
    t,
    document: doc,
    setDocuments,
    error,
    setError,
    documents,
    setCheckRequiredFields,
    index,
    applicationStatus,
    actions,
    bpaTaxDocuments,
    checkEnablingDocs
}) {

    const filteredDocument = documents?.filter((item) => item?.documentType?.includes(doc?.code))[0];
    const tenantId = Digit.ULBService.getStateId();
    const [selectedDocument, setSelectedDocument] = useState(
        filteredDocument
            ? { ...filteredDocument, active: true, code: filteredDocument?.documentType, i18nKey: filteredDocument?.documentType }
            : doc?.dropdownData?.length === 1
                ? doc?.dropdownData[0]
                : {}
    );
    const [file, setFile] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(() => filteredDocument?.fileStoreId || null);
    const [selectArrayFiles, SetSelectArrayFiles] = useState([]);
    const handleSelectDocument = (value) => setSelectedDocument(value);
    const allowedFileTypes = /(.*?)(jpg|jpeg|png|image|pdf)$/i;

    function selectfiles(e) {
        e && setFile(e.file);
    }


    useEffect(() => {
        if (selectedDocument?.code) {
            setDocuments((prev) => {
                const filteredDocumentsByDocumentType = prev?.filter((item) => item?.documentType !== selectedDocument?.code);
                if (uploadedFile?.length === 0 || uploadedFile === null) return filteredDocumentsByDocumentType;
                const filteredDocumentsByFileStoreId = filteredDocumentsByDocumentType?.filter((item) => item?.fileStoreId !== uploadedFile);
                return [
                    ...filteredDocumentsByFileStoreId,
                    {
                        documentType: selectedDocument?.code,
                        fileStoreId: uploadedFile,
                        documentUid: uploadedFile,
                        fileName: file?.name || "",
                        id: documents ? documents.find(x => x.documentType === selectedDocument?.code)?.id : undefined,
                    },
                ];
            });
        }
    }, [uploadedFile, selectedDocument]);

    useEffect(() => {
        (async () => {
            if (selectArrayFiles.length > 0) {
                sessionStorage.removeItem("BPA_DOCUMENTS");
                doc.newUploadedDocs = [];
                selectArrayFiles.map(newDoc => {
                    if (selectedDocument?.code) {
                        doc.newUploadedDocs.push({
                            documentType: selectedDocument?.code,
                            fileStoreId: newDoc?.fileStoreId?.fileStoreId,
                            documentUid: newDoc?.fileStoreId?.fileStoreId,
                            tenantId: newDoc?.fileStoreId?.tenantId
                        });
                    }
                })
                bpaTaxDocuments[index] = doc;
                sessionStorage.setItem("BPA_DOCUMENTS", JSON.stringify(bpaTaxDocuments));
            }
        })();
    }, [selectArrayFiles, selectedDocument]);

    useEffect(() => {
        (async () => {

        })();
    }, [file]);

    const getData = (index, state) => {
        let data = Object.fromEntries(state);
        let newArr = Object.values(data);
        if (Object.keys(data).length !== 0) SetSelectArrayFiles(newArr);
        selectfiles(newArr[newArr.length - 1]);
    }

    return (
        <div style={{ marginBottom: "24px", maxWidth: "950px", minWidth: "280px", background: "#FAFAFA", borderRadius: "4px", border: "1px solid #D6D5D4", padding: "8px" }}>
            <CardSubHeader style={{ marginBottom: "8px", paddingBottom: "9px", color: "#0B0C0C", fontSize: "16px", lineHeight: "19px" }}>{`${t(doc?.code)}`}</CardSubHeader>
            {doc?.uploadedDocuments?.length && <DocumentsPreview documents={doc?.uploadedDocuments} svgStyles={{ width: "100px", height: "100px", viewBox: "0 0 25 25", minWidth: "100px" }} />}
            {
                checkEnablingDocs ?
                    <div style={{ marginTop: "20px" }}>
                        <LabelFieldPair style={{width: "100%"}}>
                            <CardLabel style={{marginTop:"-10px", width :"100%"}}>{doc?.required ? `${t(doc?.code)}* ` : `${t(doc?.code)}`}</CardLabel>
                            <Dropdown
                                className="form-field"
                                t={t}
                                isMandatory={false}
                                option={doc?.dropdownData}
                                selected={selectedDocument}
                                optionKey="i18nKey"
                                select={handleSelectDocument}
                                style={{width: "100%"}}
                            />
                        </LabelFieldPair>
                        <LabelFieldPair style={{width: "100%"}}>
                            <CardLabel className="card-label-smaller" style={{ width :"100%"}}></CardLabel>
                            <div className="field"  style={{width: "100%"}}>
                                <MultiUploadWrapper
                                    module="BPA"
                                    tenantId={tenantId}
                                    getFormState={e => getData(index, e)}
                                    t={t}
                                    allowedFileTypesRegex={allowedFileTypes}
                                    allowedMaxSizeInMB={5}
                                    acceptFiles= "image/*, .pdf, .png, .jpeg, .jpg"
                                />
                            </div>
                        </LabelFieldPair>
                    </div> : null
            }
        </div>
    );
}

export default BPADocuments;
