import React, { useEffect, useMemo, useState } from "react";
import {
    CardLabel,
    Dropdown,
    UploadFile,
    Toast,
    Loader,
    FormStep,
    MultiUploadWrapper,
    CitizenInfoLabel
} from "@egovernments/digit-ui-react-components";
import Timeline from "../components/Timeline";
import PropertyDocuments from "../../../templates/ApplicationDetails/components/PropertyDocuments";

const DocumentDetails = ({ t, config, onSelect, userType, formData, setError: setFormError, clearErrors: clearFormErrors, formState }) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = Digit.ULBService.getStateId();
    const [documents, setDocuments] = useState(formData?.documents?.documents || []);
    const [error, setError] = useState(null);
    const [bpaTaxDocuments, setBpaTaxDocuments] = useState([]);
    const [enableSubmit, setEnableSubmit] = useState(true)
    const [checkRequiredFields, setCheckRequiredFields] = useState(false);
    const [PrevStateDocuments, setPrevStateDocuments] = useState(formData?.PrevStateDocuments || []);
    const checkingFlow = formData?.uiFlow?.flow;

    const { isLoading: bpaDocsLoading, data: bpaDocs } = Digit.Hooks.obps.useMDMS(stateId, "BPA", ["DocTypeMapping"]);
    const { isLoading: commonDocsLoading, data: commonDocs } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["DocumentType"]);

    useEffect(() => {
        let filtredBpaDocs = [];
        if (bpaDocs?.BPA?.DocTypeMapping) {
            filtredBpaDocs = bpaDocs?.BPA?.DocTypeMapping?.filter(data => (data.WFState == formData?.status ? formData?.status : "INPROGRESS" && data.RiskType == formData?.riskType && data.ServiceType == formData?.data?.serviceType && data.applicationType == formData?.data?.applicationType))
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
            PrevStateDocuments.map(upDocs => {
                if (code === `${upDocs?.documentType?.split('.')[0]}.${upDocs?.documentType?.split('.')[1]}`) {
                    doc.uploadedDocuments[0].values.push(upDocs)
                }
            })
            documentsList.push(doc);
        });

        setBpaTaxDocuments(documentsList);

    }, [!bpaDocsLoading, !commonDocsLoading]);

    const handleSubmit = () => {
        let document = formData.documents;
        let documentStep;
        documentStep = { ...document, documents: documents };
        onSelect(config.key, documentStep);
     };
    const onSkip = () => onSelect();
    function onAdd() { }

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

    // if (bpaDocsLoading) {
    //     return <Loader />;
    // }

    return (
        <div>
            <Timeline currentStep={checkingFlow === "OCBPA" ? 3 : 2} flow= {checkingFlow === "OCBPA" ? "OCBPA" : ""}/>
            {!bpaDocsLoading ?
                <FormStep
                    t={t}
                    config={config}
                    onSelect={handleSubmit}
                    onSkip={onSkip}
                    isDisabled={window.location.href.includes("editApplication")||window.location.href.includes("sendbacktocitizen")?false:enableSubmit}
                    onAdd={onAdd}
                >
                    {bpaTaxDocuments?.map((document, index) => {
                        return (
                            <div style={{ background: "#FAFAFA", border: "1px solid #D6D5D4", padding: "8px", borderRadius: "4px", maxWidth:"600px", minWidth: "280px", marginBottom:"15px", paddingTop:"15px" }}>
                            <SelectDocument
                                key={index}
                                document={document}
                                t={t}
                                error={error}
                                setError={setError}
                                setDocuments={setDocuments}
                                documents={documents}
                                setCheckRequiredFields={setCheckRequiredFields}
                                formData={formData}
                                PrevStateDocuments={PrevStateDocuments}
                            />
                            </div>
                        );
                    })}
                    {error && <Toast label={error} onClose={() => setError(null)} error />}
                </FormStep>: <Loader />}
                <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={`${t("BPA_APPLICATION_NUMBER_LABEL")} ${formData?.applicationNo} ${t("BPA_DOCS_INFORMATION")}`} />
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
    formData,
    PrevStateDocuments
}) {

    const filteredDocument = documents?.filter((item) => item?.documentType?.includes(doc?.code))[0] || PrevStateDocuments?.filter((item) => item?.documentType?.includes(doc?.code))[0];
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [selectedDocument, setSelectedDocument] = useState(
        filteredDocument
            ? { ...filteredDocument, active: true, code: filteredDocument?.documentType, i18nKey: filteredDocument?.documentType }
            : doc?.dropdownData?.length === 1
                ? doc?.dropdownData[0]
                : {}
    );
    const [file, setFile] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(() => ({fileStoreId: documents?.filter((item) => item?.documentType?.includes(doc?.code))[0]?.fileStoreId,fileName: documents?.filter((item) =>item?.documentType?.includes(doc?.code))[0]?.fileName || ""}) || null);
    const [newArray, setnewArray ] = useState([]);
    const [uploadedfileArray, setuploadedfileArray] = useState([]);
    const [fileArray, setfileArray] = useState([] || formData?.documents?.documents.filter((ob) => ob.documentType === selectedDocument.code) );

    const handleSelectDocument = (value) => setSelectedDocument(value);

    function selectfile(e, key) {
        e && setFile(e.file);
        e && setfileArray([...fileArray,e.file]);
    }

    function getData(e) {
        let key = selectedDocument.code;
        let data,newArr;
        if(e)
        {   data = Object.fromEntries(e);
            newArr = Object.values(data);
        }
        else
        {newArr = formData?.documents?.documents.filter((ob) => ob.documentType === selectedDocument.code);}
    
        setnewArray(newArr);
        if(documents && newArr && documents.filter(ob => ob.documentType === key).length > newArr.length)
        {
          setDocuments(documents.filter(ob => ob.documentType !== key));
        }
    
        newArr && newArr.map((ob) => {
          ob.file.documentType = key;
          selectfile(ob,key);
        })
      }

    function setcodeafterupload(){
        if (selectedDocument?.code) {
            setDocuments((prev) => {
                //const filteredDocumentsByDocumentType = prev?.filter((item) => item?.documentType !== selectedDocument?.code);

                if (uploadedFile === null || uploadedFile?.fileStoreId === undefined || uploadedFile?.fileStoreId === null) {
                    return prev;
                }

                const filteredDocumentsByFileStoreId = prev?.filter((item) => item?.fileStoreId !== uploadedFile.fileStoreId);
                let newfiles = [];
                uploadedfileArray && uploadedfileArray.map((docc, index) => {
                    newfiles.push({
                        documentType: selectedDocument?.code,
                            fileStoreId: docc.fileStoreId,
                            documentUid: docc.fileStoreId,
                            fileName: fileArray[index]?.name || "",
                            id:documents? documents.find(x => x.documentType === selectedDocument?.code)?.id:undefined,
                    })
                })
                
                return [
                    ...filteredDocumentsByFileStoreId,
                    ...newfiles,
                ];
            });
            setuploadedfileArray([]);
        }
    }

    useEffect(() => {
        uploadedfileArray.length>0 && setcodeafterupload();

        if (selectedDocument?.code) {
            setDocuments((prev) => {
                //const filteredDocumentsByDocumentType = prev?.filter((item) => item?.documentType !== selectedDocument?.code);

                if (uploadedFile === null|| uploadedFile?.fileStoreId === undefined || uploadedFile?.fileStoreId === null) {
                    return prev;
                }
                const filteredDocumentsByFileStoreId = prev?.filter((item) => item?.fileStoreId !== uploadedFile.fileStoreId);
                return [
                    ...filteredDocumentsByFileStoreId,
                    {
                        documentType: selectedDocument?.code,
                        fileStoreId: uploadedFile.fileStoreId,
                        documentUid: uploadedFile.fileStoreId,
                        fileName: file?.name ||uploadedFile.fileName || "document",
                        id:documents? documents.find(x => x.documentType === selectedDocument?.code)?.id:undefined,
                    },
                ];
            });
        }
    }, [uploadedFile, selectedDocument]);

    useEffect(() => {
        if(!selectedDocument.code && uploadedFile!== null)
        setuploadedfileArray([...uploadedfileArray,uploadedFile])
    },[uploadedFile]);


    useEffect(() => {
        (async () => {
            setError(null);
            if (file && !file.fileStoreId && !(file.documentType === file.type)) {
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
    const allowedFileTypes = /(.*?)(jpg|jpeg|png|image|pdf|msword|openxmlformats)$/i;

    const uploadedFilesPreFill = useMemo(()=>{
        // const filesDictionary = new Map()
        // formData?.documents?.documents.length > 0 && formData?.documents?.documents.filter((ob) => ob.documentType === selectedDocument.code).forEach(file => {
        //     filesDictionary.set(file.fileName, file)
        // })
        let selectedUplDocs=[];
        formData?.documents?.documents?.filter((ob) => ob.documentType === selectedDocument.code).forEach(e =>
            selectedUplDocs.push([e.fileName, {file: {name: e.fileName, type: e.documentType}, fileStoreId: {fileStoreId: e.fileStoreId, tenantId}}])
            )
        return selectedUplDocs;
    },[formData])

    return (
        <div /* style={{ marginBottom: "24px" }} */>
            <CardLabel>{doc?.required ? `${t(doc?.code)} *` : `${t(doc?.code)}`}</CardLabel>
            <Dropdown
                t={t}
                isMandatory={false}
                option={doc?.dropdownData}
                selected={selectedDocument}
                optionKey="i18nKey"
                select={handleSelectDocument}
            />
            {/* <UploadFile
                id={"obps-doc"}
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
            getFormState={e => getData(e)}
            allowedFileTypesRegex={allowedFileTypes}
            allowedMaxSizeInMB={5}
            setuploadedstate={uploadedFilesPreFill}
            t={t}
          />
        {doc?.uploadedDocuments?.length && <PropertyDocuments isSendBackFlow={true} documents={doc?.uploadedDocuments} svgStyles={{ width: "100px", height: "100px", viewBox: "0 0 25 25", minWidth: "100px" }} />}
        </div>
    );

}

export default DocumentDetails;
