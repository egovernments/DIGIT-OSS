import React, { useEffect, useMemo, useReducer, useState } from "react";
import {
    CardLabel,
    Dropdown,
    MultiUploadWrapper,
} from "@egovernments/digit-ui-react-components";
import PropertyDocuments from "../../../templates/ApplicationDetails/components/PropertyDocuments";
import { FormProvider, useForm } from "react-hook-form";

const UploadDocument = ({ t, document: currentDocumentData }) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();

    const initData = { 
        documentType: currentDocumentData?.dropdownData?.length > 0 ? currentDocumentData?.dropdownData[0] : {},
        documents: []
    }

    const CHANGE_DOCUMENT_TYPE = "CHANGE_DOCUMENT_TYPE"
    const UPLOAD_FILE_DATA = "EDIT_UPLOADED_FILE_DATA"

    const reducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_DOCUMENT_TYPE":
              return {...state, documentType: action.payload};
            case "UPLOAD_FILE_DATA":
              return {...state, documents: action.payload};
            default:
              console.warn("invalid action!");
        }
    }
    const [uploadedData, dispatch] = useReducer(reducer, initData)
    // const [selectedDocument, setSelectedDocument] = useState(
    //     filteredDocument
    //         ? { ...filteredDocument, active: true, code: filteredDocument?.documentType, i18nKey: filteredDocument?.documentType }
    //         : currentDocumentData?.dropdownData?.length > 0
    //             ? currentDocumentData?.dropdownData[0]
    //             : {}
    // )
    const handleSelectDocument = (value) => setSelectedDocument(value);

    function getData(e) {
        let key = selectedDocument.code;
        let data,newArr;
        if (e?.length > 0) {
            data = Object.fromEntries(e);
            newArr = Object.values(data);
            newArr = formData?.documents?.documents?.filter((ob) => ob.documentType === selectedDocument.code);
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
        }
    
        newArr?.map((ob) => {
            if(!ob?.file){
                ob.file = {}
            }
            ob.file.documentType = key;
            selectfile(ob,key);
        })
    }


    // useEffect(() => {

    //     if (selectedDocument?.code) {
    //         setDocuments((prev) => {
    //             //const filteredDocumentsByDocumentType = prev?.filter((item) => item?.documentType !== selectedDocument?.code);

    //             if (uploadedFile === null|| uploadedFile?.fileStoreId === undefined || uploadedFile?.fileStoreId === null) {
    //                 return prev;
    //             }
    //             const filteredDocumentsByFileStoreId = prev?.filter((item) => item?.fileStoreId !== uploadedFile.fileStoreId);
    //             return [
    //                 ...filteredDocumentsByFileStoreId,
    //                 {
    //                     documentType: selectedDocument?.code,
    //                     fileStoreId: uploadedFile.fileStoreId,
    //                     documentUid: uploadedFile.fileStoreId,
    //                     fileName: file?.name ||uploadedFile.fileName || "document",
    //                     id:documents? documents.find(x => x.documentType === selectedDocument?.code)?.id:undefined,
    //                 },
    //             ];
    //         });
    //     }
    // }, [selectedDocument]);

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
            <CardLabel>{currentDocumentData?.required ? `${t(currentDocumentData?.code)} *` : `${t(currentDocumentData?.code)}`}</CardLabel>
            <Dropdown
                t={t}
                isMandatory={false}
                option={currentDocumentData?.dropdownData}
                selected={selectedDocument}
                optionKey="i18nKey"
                select={handleSelectDocument}
            />
            {selectedDocument?.code ? <MultiUploadWrapper
                module="BPA"
                tenantId={tenantId}
                getFormState={getData}
                allowedFileTypesRegex={allowedFileTypes}
                allowedMaxSizeInMB={5}
                setuploadedstate={uploadedFilesPreFill}
                t={t}
            /> : null}
        {currentDocumentData?.uploadedDocuments?.length && <PropertyDocuments isSendBackFlow={true} documents={currentDocumentData?.uploadedDocuments} svgStyles={{ width: "100px", height: "100px", viewBox: "0 0 25 25", minWidth: "100px" }} />}
        </div>
    );

}

export default UploadDocument