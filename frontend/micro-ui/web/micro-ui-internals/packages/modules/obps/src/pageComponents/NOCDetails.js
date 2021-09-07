import React, { useEffect, useState } from "react";
import {
    CardLabel,
    Dropdown,
    UploadFile,
    Toast,
    Loader,
    FormStep,
    StatusTable,
    Row
} from "@egovernments/digit-ui-react-components";
import Timeline from "../components/Timeline";

const NOCDetails = ({ t, config, onSelect, userType, formData, setError: setFormError, clearErrors: clearFormErrors, formState }) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = Digit.ULBService.getStateId();
    const [nocDocuments, setNocDocuments] = useState(formData?.nocDocuments?.nocDocuments || []);
    const [error, setError] = useState(null);
    const [nocTaxDocuments, setNocTaxDocuments] = useState([]);
    const [enableSubmit, setEnableSubmit] = useState(true)
    const [checkRequiredFields, setCheckRequiredFields] = useState(false);

    const [sourceRefId, setSourceRefId] = useState(formData?.applicationNo);
    const [nocDatils, setNocDetails] = useState([]);
    const [nocDocumentTypeMaping, setNocDocumentTypeMaping] = useState([]);
    const [commonDocMaping, setCommonDocMaping] = useState([]);

    const { data, isLoading, refetch } = Digit.Hooks.obps.useNocDetails(formData?.tenantId, { sourceRefId: sourceRefId });
    const { isLoading: nocDocsLoading, data: nocDocs } = Digit.Hooks.obps.useMDMS(stateId, "NOC", ["DocumentTypeMapping"]);
    const { isLoading: commonDocsLoading, data: commonDocs } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["DocumentType"]);

    useEffect(() => {
        setNocDetails(data);
    }, [data]);

    useEffect(() => {
        setNocDocumentTypeMaping(nocDocs?.NOC?.DocumentTypeMapping);
    }, [nocDocs]);


    useEffect(() => {
        setCommonDocMaping(commonDocs?.["common-masters"]?.DocumentType);
    }, [commonDocs]);

    useEffect(() => {
        if (nocDatils?.length && nocDocumentTypeMaping?.length) {
            let documents = [];
            nocDatils.map(noc => {
                const filteredData = nocDocumentTypeMaping.filter(data => (data.applicationType === noc.applicationType && data.nocType === noc.nocType))
                if (filteredData?.[0]?.docTypes?.[0]) {
                    filteredData[0].docTypes[0].nocType = filteredData[0].nocType;
                    filteredData[0].docTypes[0].additionalDetails = {
                        submissionDetails: noc.additionalDetails,
                        applicationStatus: noc.applicationStatus,
                        appNumberLink: noc.applicationNo,
                        nocNo: noc.nocNo
                    }
                    documents.push(filteredData[0].docTypes[0]);
                }
            });

            let documentsList = [];
            if (documents && documents.length > 0) {
                documents.map(doc => {
                    let code = doc.documentType;
                    let nocType = doc.nocType;
                    doc.dropdownData = [];
                    commonDocMaping.forEach(value => {
                        let values = value.code.slice(0, code.length);
                        if (code === values) {
                            doc.hasDropdown = true;
                            doc.dropdownData.push(value);
                        }
                    });
                    documentsList.push(doc);
                })
            }
            documentsList.forEach(data => {
                data.code = data.documentType;
                data.dropdownData.forEach(dpData => {
                    dpData.i18nKey = dpData.code;
                })
            })
            setNocTaxDocuments(documentsList);
        }
    }, [nocDatils, nocDocumentTypeMaping, commonDocMaping]);

    const handleSubmit = () => {
        let nocDocument = formData.nocDocuments;
        let nocDocumentStep;
        nocDocumentStep = { ...nocDocument, nocDocuments: nocDocuments, NocDetails: nocDatils, nocTaxDocuments: nocTaxDocuments };
        onSelect(config.key, nocDocumentStep);
    };
    const onSkip = () => onSelect();
    function onAdd() { }

    useEffect(() => {
        let count = 0;
        nocTaxDocuments.map(doc => {
            let isRequired = false;
            nocDocuments.map(data => {
                if (doc.required && doc.code == `${data.documentType.split('.')[0]}.${data.documentType.split('.')[1]}`) {
                    isRequired = true;
                }
            });
            if (!isRequired && doc.required) {
                count = count + 1;
            }
        });
        if ((count == "0" || count == 0) && nocDocuments.length > 0) setEnableSubmit(false);
        else setEnableSubmit(true);
    }, [nocDocuments, checkRequiredFields])

    return (
        <div>
            <Timeline currentStep={3} />
            {!nocDocsLoading ?
                <FormStep
                    t={t}
                    config={config}
                    onSelect={handleSubmit}
                    onSkip={onSkip}
                    isDisabled={enableSubmit}
                    onAdd={onAdd}
                >
                    {nocTaxDocuments?.map((document, index) => {
                        return (
                            <SelectDocument
                                key={index}
                                document={document}
                                t={t}
                                error={error}
                                setError={setError}
                                setNocDocuments={setNocDocuments}
                                nocDocuments={nocDocuments}
                                setCheckRequiredFields={setCheckRequiredFields}
                            />
                        );
                    })}
                    {error && <Toast label={error} onClose={() => setError(null)} error />}
                </FormStep> : <Loader />}
        </div>
    );
}

function SelectDocument({
    t,
    document: doc,
    setNocDocuments,
    error,
    setError,
    nocDocuments,
    setCheckRequiredFields
}) {

    const filteredDocument = nocDocuments?.filter((item) => item?.documentType?.includes(doc?.code))[0];
    const tenantId = Digit.ULBService.getCurrentTenantId(doc);
    const [selectedDocument, setSelectedDocument] = useState(doc?.dropdownData?.[0]);
    const [file, setFile] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(() => filteredDocument?.fileStoreId || null);

    const handleSelectDocument = (value) => setSelectedDocument(value);

    function selectfile(e) {
        setFile(e.target.files[0]);
    }

    useEffect(() => {
        if (selectedDocument?.code) {
            setNocDocuments((prev) => {
                const filteredDocumentsByDocumentType = prev?.filter((item) => item?.documentType !== selectedDocument?.code);

                if (uploadedFile?.length === 0 || uploadedFile === null) {
                    return filteredDocumentsByDocumentType;
                }

                const filteredDocumentsByFileStoreId = filteredDocumentsByDocumentType?.filter((item) => item?.fileStoreId !== uploadedFile);
                return [
                    ...filteredDocumentsByFileStoreId,
                    {
                        documentType: selectedDocument?.code,
                        fileStoreId: uploadedFile,
                        documentUid: uploadedFile,
                        fileName: file?.name || "",
                    },
                ];
            });
        }
    }, [uploadedFile, selectedDocument]);


    useEffect(() => {
        (async () => {
            setError(null);
            if (file) {
                if (file.size >= 5242880) {
                    setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
                } else {
                    try {
                        setUploadedFile(null);
                        const response = await Digit.UploadServices.Filestorage("PT", file, tenantId?.split(".")[0]);
                        if (response?.data?.files?.length > 0) {
                            setUploadedFile(response?.data?.files[0]?.fileStoreId);
                        } else {
                            setError(t("CS_FILE_UPLOAD_ERROR"));
                        }
                    } catch (err) {
                        console.error("Modal -> err ", err);
                        setError(t("CS_FILE_UPLOAD_ERROR"));
                    }
                }
            }
        })();
    }, [file]);

    return (
        <div style={{ border: "1px solid #D6D5D4", padding: "16px 0px 16px 8px", background: "#FAFAFA", borderRadius: "5px", marginBottom: "24px" }}>
            <div>
                <h1 style={{ color: "#0B0C0C", lineHeight: "37px", fontWeight: "700", fontSize: "32px", fontFamily: "Roboto Condensed", paddingBottom: "24px" }}>{t(`BPA_${doc?.nocType}_HEADER`)}</h1>
                <div style={{ display: "flex", paddingBottom: "24px" }}>
                    <h1 style={{ color: "#0B0C0C", lineHeight: "19px", fontWeight: "700", fontSize: "16px", fontFamily: "Roboto", marginRight: "10px", width: "120px" }}>{t(`BPA_${doc?.nocType}_LABEL`)}</h1>
                    <h1>{doc?.additionalDetails?.appNumberLink}</h1>
                </div>
            </div>
            <UploadFile
                id={"noc-doc"}
                extraStyleName={"propertyCreate"}
                accept=".jpg,.png,.pdf"
                onUpload={selectfile}
                onDelete={() => {
                    setUploadedFile(null);
                    setCheckRequiredFields(true);
                }}
                message={uploadedFile ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`CS_ACTION_NO_FILEUPLOADED`)}
                error={error}
            />
        </div>
    );
}

export default NOCDetails;
