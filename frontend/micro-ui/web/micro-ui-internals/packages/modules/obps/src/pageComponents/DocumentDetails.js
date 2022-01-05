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
    const [enableSubmit, setEnableSubmit] = useState(true)
    const [checkRequiredFields, setCheckRequiredFields] = useState(false);
    const checkingFlow = formData?.uiFlow?.flow;
    const {data: bpaTaxDocuments, isLoading} = Digit.Hooks.obps.useBPATaxDocuments(stateId, formData, formData?.PrevStateDocuments || []);

    const handleSubmit = () => {
        let document = formData.documents;
        let documentStep;
        documentStep = { ...document, documents: documents };
        onSelect(config.key, documentStep);
     };
    const onSkip = () => onSelect();
    function onAdd() { }

    useEffect(() => {
        const allRequiredDocumentsCode = bpaTaxDocuments.filter( e => e.required).map(e => e.code)

        const reqDocumentEntered = allRequiredDocumentsCode.filter(reqCode => documents.reduce((acc,doc) => {
            if (reqCode == `${doc?.documentType?.split('.')?.[0]}.${doc?.documentType?.split('.')?.[1]}`) {
                return true
            }
            else{
                return acc
            }
        }, false))
        if ((reqDocumentEntered.length == allRequiredDocumentsCode.length ) && documents.length > 0) {
            setEnableSubmit(false);
        }else {
            setEnableSubmit(true);
        }
    }, [documents, checkRequiredFields])

    return (
        <div>
            <Timeline currentStep={checkingFlow === "OCBPA" ? 3 : 2} flow= {checkingFlow === "OCBPA" ? "OCBPA" : ""}/>
            {!isLoading ?
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
                                PrevStateDocuments={formData?.PrevStateDocuments || []}
                            />
                            </div>
                        );
                    })}
                    {error && <Toast label={error} onClose={() => setError(null)} error />}
                </FormStep>: <Loader />}
                {(window.location.href.includes("/bpa/building_plan_scrutiny/new_construction") || window.location.href.includes("/ocbpa/building_oc_plan_scrutiny/new_construction")) && formData?.applicationNo ? <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={`${t("BPA_APPLICATION_NUMBER_LABEL")} ${formData?.applicationNo} ${t("BPA_DOCS_INFORMATION")}`} className={"info-banner-wrap-citizen-override"} /> : ""}
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
    const [uploadedFile, setUploadedFile] = useState(() => documents?.filter((item) => item?.documentType?.includes(doc?.code)).map( e => ({fileStoreId: e?.fileStoreId, fileName: e?.fileName || ""}) ) || null);
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
        if (e?.length > 0) {
            data = Object.fromEntries(e);
            newArr = Object.values(data);
            newArr = formData?.documents?.documents?.filter((ob) => ob.documentType === selectedDocument.code);
            setnewArray(newArr);
            // const filteredDocumentsByFileStoreId = documents?.filter((item) => item?.fileStoreId !== uploadedFile.fileStoreId) || []
            let newfiles = [];
            e?.map((doc, index) => {
                newfiles.push({
                        documentType: selectedDocument?.code,
                        fileStoreId: doc?.[1]?.fileStoreId?.fileStoreId,
                        documentUid: doc?.[1].fileStoreId?.fileStoreId,
                        fileName: doc?.[0] || "",
                        id:documents? documents.find(x => x.documentType === selectedDocument?.code)?.id:undefined,
                })
            })
            const __documents = [
                ...documents.filter(e => e.documentType !== key ),
                ...newfiles,
            ]
            setDocuments(__documents)
        }
    
        newArr?.map((ob) => {
            if(!ob?.file){
                ob.file = {}
            }
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
                uploadedfileArray && uploadedfileArray.map((doc, index) => {
                    newfiles.push({
                        documentType: selectedDocument?.code,
                            fileStoreId: doc.fileStoreId,
                            documentUid: doc.fileStoreId,
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

    const allowedFileTypes = /(.*?)(jpg|jpeg|png|image|pdf|msword|openxmlformats)$/i;

    const uploadedFilesPreFill = useMemo(()=>{
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
            <MultiUploadWrapper
                module="BPA"
                tenantId={tenantId}
                getFormState={getData}
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
