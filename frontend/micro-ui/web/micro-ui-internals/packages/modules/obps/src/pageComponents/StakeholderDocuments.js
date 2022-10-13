import React, { useEffect, useState } from "react";
import {
    CardLabel,
    Dropdown,
    UploadFile,
    Toast,
    Loader,
    FormStep,
    CitizenInfoLabel,
    OpenLinkContainer,
    BackButton
} from "@egovernments/digit-ui-react-components";
import Timeline from "../components/Timeline";

const StakeholderDocuments = ({ t, config, onSelect, userType, formData, setError: setFormError, clearErrors: clearFormErrors, formState }) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = Digit.ULBService.getStateId();
    const [documents, setDocuments] = useState(formData?.documents?.documents || []);
    const [error, setError] = useState(null);
    const [bpaTaxDocuments, setBpaTaxDocuments] = useState([]);
    const [enableSubmit, setEnableSubmit] = useState(true)
    const [checkRequiredFields, setCheckRequiredFields] = useState(false);
    const isCitizenUrl = Digit.Utils.browser.isMobile()?true:false;
    let isopenlink = window.location.href.includes("/openlink/");

    if(isopenlink)  
    window.onunload = function () {
      sessionStorage.removeItem("Digit.BUILDING_PERMIT");
    }

    const { data, isLoading } = Digit.Hooks.obps.useMDMS(stateId, "StakeholderRegistraition", "TradeTypetoRoleMapping");
    const addInfo = localStorage.getItem("addInfo")
    const addAuthUser = localStorage.getItem("data_user")
    const developerCapacity = localStorage.getItem("capacity")
    
    useEffect(() => {
        let filtredBpaDocs = [];
        if (data?.StakeholderRegistraition?.TradeTypetoRoleMapping) {
            //filtredBpaDocs = bpaDocs?.BPA?.DocTypeMapping?.filter(data => (data.WFState == "INITIATED" && data.RiskType == "LOW" && data.ServiceType == "NEW_CONSTRUCTION" && data.applicationType == "BUILDING_PLAN_SCRUTINY"))
        //    let  formData = {formdata:{LicenseType:{LicenseType:{tradeType : "ENGINEER.CLASSA",}}}}
            filtredBpaDocs = data?.StakeholderRegistraition?.TradeTypetoRoleMapping?.filter(ob => (ob.tradeType === formData?.formData?.LicneseType?.LicenseType?.tradeType))
        }
        console.log("BPADOClist",filtredBpaDocs);
        let documentsList = [];
        filtredBpaDocs?.[0]?.docTypes?.forEach(doc => {
            let code = doc.code; doc.dropdownData = [];
            // commonDocs?.["common-masters"]?.DocumentType?.forEach(value => {
            //     let values = value.code.slice(0, code.length);
            //     if (code === values) {
            //         doc.hasDropdown = true;
            //         value.i18nKey = value.code;
            //         doc.dropdownData.push(value);
            //     }
            // });
            documentsList.push(doc);
        });
        setBpaTaxDocuments(documentsList);
    }, [!isLoading]);

    const handleSubmit = () => {
        let document = formData.documents;
        let documentStep;
        let regularDocs = [];
        bpaTaxDocuments && documents && documents !== null && bpaTaxDocuments.map((initialob,index) => {
            let docobject = documents.find((ob) => (ob && ob !==null) && (ob.documentType === initialob.code));
            if(docobject)
            regularDocs.push(docobject);
        })
        documentStep = { ...document, documents: regularDocs };
        onSelect(config.key, documentStep);
     };
    const onSkip = () => onSelect();
    function onAdd() { }

    useEffect(() => {
        let count = 0;
        bpaTaxDocuments.map(doc => {
            let isRequired = false;
            documents.map(data => {
                if (doc.required && data !== null && data && doc.code == `${data.documentType.split('.')[0]}.${data.documentType.split('.')[1]}`) {
                    isRequired = true;
                }
            });
            if (!isRequired && doc.required) {
                count = count + 1;
            }
        });
        //if(bpaTaxDocuments.length == documents.length+1 && bpaTaxDocuments.length!==0) setEnableSubmit(false);
        if ((count == "0" || count == 0) && documents.length > 0) setEnableSubmit(false);
        else setEnableSubmit(true);
    }, [documents, checkRequiredFields])

    // if (bpaDocsLoading) {
    //     return <Loader />;
    // }

    const submitTechdevData = async (e) => {
        //   e.preventDefault();
          const formDataValues = {
            "developerDetail" :[
              {
                "devDetail":{
                  addInfo:addInfo,
                  addRemoveAuthoizedUsers:addAuthUser,
                  capacityDevelopAColony:developerCapacity,
                    
                }
              }
            ]
            
          }
          onSelect(config.key, formDataValues);
          try {
            let res = await axios.post("http://localhost:8081/user/developer/_registration",formDataValues,{
              headers:{
                'Content-Type': 'application/json',
                'Access-Control-Allow-origin':"*",
            }
            }).then((response)=>{
              return response
            });
            
            
          } catch (err) {
            console.log(err);
          }
          
          console.log("FINAL SUBMIT",formDataValues)
          localStorage.setItem("developerRegistration",JSON.stringify(formDataValues));
          
          // dispatch(setTechnicalData(
          //   formDataValues
          // ))
          
        }

    return (
        <div>
            <div className={isopenlink? "OpenlinkContainer":""}>
            {/* {isopenlink &&<OpenLinkContainer />} */}
            {/* <div style={isopenlink?{marginTop:"60px", width:isCitizenUrl?"100%":"70%", marginLeft:"auto",marginRight:"auto"}:{}}> */}
            {isopenlink && <BackButton style={{ border: "none" }}>{t("CS_COMMON_BACK")}</BackButton>}
            <Timeline currentStep={5} flow="STAKEHOLDER" />
            {!isLoading ?
                <FormStep
                    t={t}
                    config={config}
                    onSelect={handleSubmit}
                    onSkip={onSkip}
                    isDisabled={enableSubmit}
                    onAdd={onAdd}
                    cardStyle={{paddingRight:"16px"}}
                >
                    {/* {bpaTaxDocuments?.map((document, index) => {
                        return (
                            <SelectDocument
                                key={index}
                                document={document}
                                t={t}
                                error={error}
                                setError={setError}
                                setDocuments={setDocuments}
                                documents={documents}
                                setCheckRequiredFields={setCheckRequiredFields}
                                isCitizenUrl={isCitizenUrl}
                            />
                        );
                    })} */}
                    <div className="table-bd">
                        <table className="table table-bordered" size="sm">
                            <tbody>
                                <tr>
                                    <td> 1 &nbsp;&nbsp;</td>
                                    <td>Copy of SPA/GPA/Board Resolution</td>
                                    <td>
                                    <input
                                        type="file"
                                        name="upload"
                                        placeholder=""
                                        class="form-control"
                                    />
                                    </td>
                                </tr>
                                <tr>
                                    <td> 2&nbsp;&nbsp; </td>
                                    <td>
                                    Copy of memorandum/Articles of Association/ any other
                                    document of developer (if other than individual)*
                                    </td>
                                    <td>
                                    <input
                                        type="file"
                                        name="upload"
                                        placeholder=""
                                        class="form-control"
                                    />
                                    </td>
                                </tr>
                                <tr>
                                    <td> 3 &nbsp;&nbsp;</td>
                                
                                    <td>
                                    In case of firm/LLP, copy of registered irrevocable
                                    partnership deed
                                    </td>
                                    <td>
                                    <input
                                        type="file"
                                        name="upload"
                                        placeholder=""
                                        class="form-control"
                                    />
                                    </td>
                                </tr>
                                <tr>
                                    <td> 4&nbsp;&nbsp; </td>
                                    <td>
                                    In case of HUF, copy of affidavit and copy of PAN card
                                    </td>
                                    <td>
                                    <input
                                        type="file"
                                        name="upload"
                                        placeholder=""
                                        class="form-control"
                                    />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {/* <div className="col-md-4">
                            <button onClick={submitTechdevData} className="btn btn-success">Submit</button>
                        </div> */}
                    </div>
                    {error && <Toast label={error} isDleteBtn={true} onClose={() => setError(null)} error  />}
                </FormStep> : <Loader />}
                {!(formData?.initiationFlow) && <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={`${t("BPA_APPLICATION_NUMBER_LABEL")} ${formData?.result?.Licenses?.[0]?.applicationNumber} ${t("BPA_DOCS_INFORMATION")}`} className={"info-banner-wrap-citizen-override"}/>}
                </div>
            </div>
        // </div>
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
    isCitizenUrl
}) {

    const filteredDocument = documents?.filter((item) => item?.documentType?.includes(doc?.code))[0];
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [selectedDocument, setSelectedDocument] = useState(
        filteredDocument
            ? { ...filteredDocument, active: true, code: filteredDocument?.documentType, i18nKey: filteredDocument?.documentType }
            : doc?.dropdownData?.length === 1
                ? doc?.dropdownData[0]
                : {}
    );
    const [file, setFile] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(() => filteredDocument?.fileStoreId || null);

    const handleSelectDocument = (value) => setSelectedDocument(value);

    function selectfile(e) {
        setFile(e.target.files[0]);
    }

    useEffect(() => {

        setDocuments((prev) => {
            const filteredDocumentsByDocumentType = prev?.filter((item) => item?.documentType !== doc?.code);

            if (uploadedFile?.length === 0 || uploadedFile === null) {
                return filteredDocumentsByDocumentType;
            }

            const filteredDocumentsByFileStoreId = filteredDocumentsByDocumentType?.filter((item) => item?.fileStoreId !== uploadedFile);
            return [
                ...filteredDocumentsByFileStoreId,
                {
                    documentType: doc?.code,
                    fileStoreId: uploadedFile,
                    documentUid: uploadedFile,
                    fileName: file?.name || "",
                    info: doc?.info || ""
                },
            ];
        });       
    }, [uploadedFile,file]);


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
                        setError(t("CS_FILE_UPLOAD_ERROR"));
                    }
                }
            }
        })();
    }, [file]);

    return (
        <div style={{ marginBottom: "24px" }}>
            <CardLabel style={{marginBottom: "10px"}}>{doc?.required ? `${t(`BPAREG_HEADER_${doc?.code?.replace('.', '_')}`)} *` : `${t(`BPAREG_HEADER_${doc?.code?.replace('.', '_')}`)}`}</CardLabel>
            {doc?.info ? <div style={{fontSize: "12px", color: "#505A5F", fontWeight: 400, lineHeight: "15px", marginBottom: "10px"}}>{`${t(doc?.info)}`}</div> : null}
            <UploadFile
                extraStyleName={"OBPS"}
                accept=".jpg,.png,.pdf"
                onUpload={selectfile}
                onDelete={() => {
                    setUploadedFile(null);
                    setCheckRequiredFields(true);
                }}
                message={uploadedFile ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`CS_ACTION_NO_FILEUPLOADED`)}
                error={error}
                // inputStyles={{top:"0%",maxHeight:""}}
                // Multistyle={isCitizenUrl?{marginTop:"-15px",position:"absolute"}:{marginTop:"-11px",position:"absolute"}}
            />
        </div>
    );

}

export default StakeholderDocuments;
