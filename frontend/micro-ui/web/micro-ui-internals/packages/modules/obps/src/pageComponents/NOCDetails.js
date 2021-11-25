import React, { useEffect, useMemo, useState } from "react";
import {
    CardLabel,
    Dropdown,
    UploadFile,
    Toast,
    Loader,
    FormStep,
    StatusTable,
    MultiUploadWrapper,
    Row
} from "@egovernments/digit-ui-react-components";
import Timeline from "../components/Timeline";
import PropertyDocuments from "../../../templates/ApplicationDetails/components/PropertyDocuments";


const NOCDetails = ({ t, config, onSelect, userType, formData, setError: setFormError, clearErrors: clearFormErrors, formState }) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = Digit.ULBService.getStateId();
    const [nocDocuments, setNocDocuments] = useState(formData?.nocDocuments?.nocDocuments || []);
    const [error, setError] = useState(null);
    const [nocTaxDocuments, setNocTaxDocuments] = useState([]);
    const [enableSubmit, setEnableSubmit] = useState(true)
    const [checkRequiredFields, setCheckRequiredFields] = useState(false);
    const [PrevStateNocDocuments, setPrevStateNocDocuments] = useState(formData?.PrevStateNocDocuments || []);
    const checkingFlow = formData?.uiFlow?.flow;

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
                    doc.uploadedDocuments = [];
                    commonDocMaping && commonDocMaping.forEach(value => {
                        let values = value.code.slice(0, code.length);
                        if (code === values) {
                            doc.hasDropdown = true;
                            doc.dropdownData.push(value);
                        }
                    });
                    doc.uploadedDocuments[0] = {};
                    doc.uploadedDocuments[0].values = [];
                    PrevStateNocDocuments.map(upDocs => {
                        if (code === `${upDocs?.documentType?.split('.')[0]}.${upDocs?.documentType?.split('.')[1]}`) {
                        doc.uploadedDocuments[0].values.push(upDocs)
                    }
            })
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
    const onSkip = () =>{ 
        let nocDocument = formData.nocDocuments;
        let nocDocumentStep;
        nocDocumentStep = { ...nocDocument, nocDocuments: nocDocuments, NocDetails: nocDatils, nocTaxDocuments: nocTaxDocuments };
        onSelect(config.key, nocDocumentStep);
    };
    function onAdd() { }
    
    // useEffect(() => {
    //     let count = 0;
    //     nocTaxDocuments.map(doc => {
    //         let isRequired = false;
    //         nocDocuments.map(data => {
    //             if (doc.required && doc.code == `${data.documentType.split('.')[0]}.${data.documentType.split('.')[1]}`) {
    //                 isRequired = true;
    //             }
    //         });
    //         if (!isRequired && doc.required) {
    //             count = count + 1;
    //         }
    //     });
    //     if ((count == "0" || count == 0) && nocDocuments.length > 0) setEnableSubmit(false);
    //     else setEnableSubmit(true);
    // }, [nocDocuments, checkRequiredFields])

    return (
        <div>
            <Timeline currentStep={3} flow= {checkingFlow === "OCBPA" ? "OCBPA" : ""}/>
            {!nocDocsLoading ?
                <FormStep
                    t={t}
                    config={config}
                    onSelect={handleSubmit}
                    onSkip={onSkip}
                    // isDisabled={enableSubmit}
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
                                formData={formData}
                                PrevStateNocDocuments={PrevStateNocDocuments}
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
    setCheckRequiredFields,
    formData,
    PrevStateNocDocuments
}) {

    const filteredDocument = nocDocuments?.filter((item) => item?.documentType?.includes(doc?.code))[0] || PrevStateNocDocuments?.filter((item) => item?.documentType?.includes(doc?.code))[0];
    const tenantId = Digit.ULBService.getCurrentTenantId(doc);
    const [selectedDocument, setSelectedDocument] = useState(doc?.dropdownData?.[0]);
    const [file, setFile] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(() => ({fileStoreId: nocDocuments?.filter((item) => item?.documentType?.includes(doc?.code))[0]?.fileStoreId,fileName:nocDocuments?.filter((item) => item?.documentType?.includes(doc?.code))[0]?.fileName}) || null);
    const [newArray, setnewArray ] = useState([]);

    const handleSelectDocument = (value) => setSelectedDocument(value);


    function selectfile(e, key) {
        e && setSelectedDocument({ documentType: key });
        e && setFile(e.file);
    }

    function getData(e, key) {
       let data,newArr;
        if(e)
        {   data = Object.fromEntries(e);
            newArr = Object.values(data);
        }
        else
        {newArr = formData?.nocDocuments?.nocDocuments.filter((ob) => ob.documentType === selectedDocument.documentType);}
        setnewArray(newArr);
        if(nocDocuments && newArr && nocDocuments.filter(ob => ob.documentType === key).length > newArr.length)
        {
            setNocDocuments(nocDocuments.filter(ob => ob.documentType !== key));
        }
    
        newArr && newArr.map((ob) => {
          ob.file.documentType = key;
          selectfile(ob,key);
        })
      }

    useEffect(() => {
        if (selectedDocument?.documentType && (( nocDocuments.filter((ob) => ob.documentType === selectedDocument?.documentType)).length == 0 || ((newArray.filter((ob) => ob?.file?.documentType === selectedDocument?.documentType)).length) !== (nocDocuments.filter((ob) => ob.documentType === selectedDocument?.documentType)).length)) {
            setNocDocuments((prev) => {
                //const filteredDocumentsByDocumentType = prev?.filter((item) => item?.documentType !== selectedDocument?.code);

                if (uploadedFile === null || uploadedFile?.fileStoreId === undefined || uploadedFile?.fileStoreId === null) {
                    return prev;
                }

                const filteredDocumentsByFileStoreId = prev?.filter((item) => item?.fileStoreId !== uploadedFile.fileStoreId);
                return [
                    ...filteredDocumentsByFileStoreId,
                    {
                        documentType: doc?.dropdownData?.[0]?.code,
                        fileStoreId: uploadedFile.fileStoreId,
                        documentUid: uploadedFile.fileStoreId,
                        fileName: uploadedFile?.fileName || "",
                    },
                ];
            });
        }
    }, [uploadedFile, selectedDocument]);


    useEffect(() => {
        (async () => {
            setError(null);
            if (file && !file.fileStoreId && (file.type.includes("/"))) {
                if (file.size >= 5242880) {
                    setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
                } else {
                    try {
                        setUploadedFile(null);
                        const response = await Digit.UploadServices.Filestorage("PT", file, Digit.ULBService.getStateId());
                        if (response?.data?.files?.length > 0) {
                            setUploadedFile({fileStoreId: response?.data?.files[0]?.fileStoreId, fileName:file.name});
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

    const uploadedFilesPreFill = useMemo(()=>{
        //const filesDictionary = new Map()
        // formData?.nocDocuments?.nocDocuments.filter((ob) => ob.documentType === doc?.documentType.replaceAll(".", "_")).forEach(file => {
        //     filesDictionary.set(file.fileName, file)
        // })
        let selectedUplDocs=[];
        formData?.nocDocuments?.nocDocuments?.filter((ob) => ob.documentType === doc?.dropdownData?.[0]?.code).forEach(e =>
            selectedUplDocs.push([e.fileName, {file: {name: e.fileName, type: e.documentType}, fileStoreId: {fileStoreId: e.fileStoreId, tenantId}}])
             )
        return selectedUplDocs;
    },[formData])


    return (
        <div style={{ border: "1px solid #D6D5D4", padding: "16px 8px 16px 8px", background: "#FAFAFA", borderRadius: "5px", marginBottom: "24px", marginTop:"5px" }}>
            <div>
                <h1 style={{ color: "#0B0C0C", lineHeight: "37px", fontWeight: "700", fontSize: "32px", fontFamily: "Roboto Condensed", paddingBottom: "24px" }}>{t(`BPA_${doc?.nocType}_HEADER`)}</h1>
                <div style={{ display: "flex", paddingBottom: "24px" }}>
                    <h1 style={{ color: "#0B0C0C", lineHeight: "19px", fontWeight: "700", fontSize: "16px", fontFamily: "Roboto", marginRight: "10px" }}>{t(`BPA_${doc?.nocType}_LABEL`)}</h1>
                    <h1>{doc?.additionalDetails?.appNumberLink}</h1>
                </div>
            </div>
            {doc?.uploadedDocuments?.length && <PropertyDocuments isSendBackFlow={true} documents={doc?.uploadedDocuments} svgStyles={{ width: "100px", height: "100px", viewBox: "0 0 25 25", minWidth: "100px" }} />}
            {/* <UploadFile
                id={"noc-doc"}
                extraStyleName={"propertyCreate"}
                accept=".jpg,.png,.pdf"
                onUpload={selectfile}
                onDelete={() => {
                    setUploadedFile(null);
                    setCheckRequiredFields(true);
                }}
                message={uploadedFile ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`ES_NO_FILE_SELECTED_LABEL`)}
                error={error}
            /> */}
            <MultiUploadWrapper
            module="BPA"
            tenantId={tenantId}
            getFormState={e => getData(e,doc?.documentType.replaceAll(".", "_"))}
            setuploadedstate={uploadedFilesPreFill}
            t={t}
          />
        </div>
    );
}

export default NOCDetails;
