const useBPATaxDocuments = (stateId, formData, beforeUploadDocuments) => {

    const { isLoading: bpaDocsLoading, data: bpaDocs } = Digit.Hooks.obps.useMDMS(stateId, "BPA", ["DocTypeMapping"]);
    const { isLoading: commonDocsLoading, data: commonDocs } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["DocumentType"]);
    const documents = beforeUploadDocuments;
    const { data, isLoading, error } = Digit.Hooks.useDocumentSearch( documents, { enabled: beforeUploadDocuments?.length > 0 ? true : false});
    if (data?.pdfFiles?.length > 0) {
        beforeUploadDocuments = data?.pdfFiles
    }


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
            beforeUploadDocuments.map(upDocs => {
                if (code === `${upDocs?.documentType?.split('.')[0]}.${upDocs?.documentType?.split('.')[1]}`) {
                    doc.uploadedDocuments[0].values.push(upDocs)
                }
            })
            documentsList.push(doc);
        });


    return { data: documentsList , isLoading: bpaDocsLoading || commonDocsLoading }

}

export default useBPATaxDocuments