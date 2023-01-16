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
import { useHistory } from "react-router-dom";
import axios from "axios";

const StakeholderDocuments = ({ t, config, onSelect, userType, formData, setError: setFormError, clearErrors: clearFormErrors, formState }) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = Digit.ULBService.getStateId();
    const [documents, setDocuments] = useState(formData?.documents?.documents || []);
    const [error, setError] = useState(null);
    const [bpaTaxDocuments, setBpaTaxDocuments] = useState([]);
    const userInfo = Digit.UserService.getUser();
    const [enableSubmit, setEnableSubmit] = useState(true)
    const [checkRequiredFields, setCheckRequiredFields] = useState(false);
    const isCitizenUrl = Digit.Utils.browser.isMobile()?true:false;
    let isopenlink = window.location.href.includes("/openlink/");



    if(isopenlink)  
    window.onunload = function () {
      sessionStorage.removeItem("Digit.BUILDING_PERMIT");
    }
   
    const { data, isLoading } = Digit.Hooks.obps.useMDMS(stateId, "StakeholderRegistraition", "TradeTypetoRoleMapping");
    const getDeveloperData = async () => {
        try {
          const requestResp = {
    
            "RequestInfo": {
              "api_id": "1",
              "ver": "1",
              "ts": "",
              "action": "_getDeveloperById",
              "did": "",
              "key": "",
              "msg_id": "",
              "requester_id": "",
              "auth_token": ""
            },
          }
          const getDevDetails = await axios.get(`/user/developer/_getDeveloperById?id=${userInfo?.info?.id}&isAllData=true`, requestResp, {
            
          });
          const developerDataGet = getDevDetails?.data;
          setTradeType(developerDataGet?.devDetail[0]?.applicantType?.licenceType);

          console.log("TRADETYPE",tradeType);
        let filtredBpaDocs = [];
        if (data?.StakeholderRegistraition?.TradeTypetoRoleMapping) {
            filtredBpaDocs = data?.StakeholderRegistraition?.TradeTypetoRoleMapping?.filter(ob => (ob.tradeType === developerDataGet?.devDetail[0]?.applicantType?.licenceType))
        }

        let documentsList = [];
        filtredBpaDocs?.[0]?.docTypes?.forEach(doc => {
            documentsList.push(doc);
        });
        console.log("log123",documentsList)
        setBpaTaxDocuments(documentsList);
        //   console.log("TRADETYPE",developerDataGet?.devDetail[0]?.applicantType?.licenceType);
        } catch (error) {
          console.log(error);
        }
      }

      const [tradeType, setTradeType] = useState("");

      useEffect(() => {
        getDeveloperData();

        
      }, [!isLoading]);

      
    
    
    // useEffect(() => {
        

    // }, [!isLoading]);

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
        if ((count == "0" || count == 0) && documents.length > 0) setEnableSubmit(false);
        else setEnableSubmit(true);
    }, [documents, checkRequiredFields])


    const navigate = useHistory();

    const changeStep = (step) => {
        if(tradeType === 'ARCHITECT.CLASSA'){
            switch (step) {
                case 1 :
                  navigate.replace("/digit-ui/citizen/obps/stakeholder/apply/provide-license-type");
                  break;
                case 2 :
                  navigate.replace("/digit-ui/citizen/obps/stakeholder/apply/license-details");
                break;
                case 3 :
                  navigate.replace("/digit-ui/citizen/obps/stakeholder/apply/stakeholder-document-details");
                break;
              }
        } else {
            switch (step) {
              case 1 :
                navigate.replace("/digit-ui/citizen/obps/stakeholder/apply/provide-license-type");
                break;
              case 2 :
                navigate.replace("/digit-ui/citizen/obps/stakeholder/apply/license-add-info");
              break;
              case 3 :
                navigate.replace("/digit-ui/citizen/obps/stakeholder/apply/add-authorized-user");
              break;
              case 4 :
                navigate.replace("/digit-ui/citizen/obps/stakeholder/apply/developer-capacity");
              break;
            }
        }
    }


    return (
        <div>
            <div className={isopenlink? "OpenlinkContainer":""}>
            {isopenlink && <BackButton style={{ border: "none" }}>{t("CS_COMMON_BACK")}</BackButton>}
            <Timeline currentStep={tradeType === 'ARCHITECT.CLASSA' ? 3 : 5} flow={tradeType === 'ARCHITECT.CLASSA' ? 'ARCHITECT.CLASSA' : "STAKEHOLDER"} onChangeStep={changeStep} isAPILoaded={tradeType ? true : false} />
            {!isLoading ?
                <FormStep
                    t={t}
                    config={config}
                    onSelect={handleSubmit}
                    onSkip={onSkip}
                    onAdd={onAdd}
                    cardStyle={{paddingRight:"16px"}}
                >
                    {bpaTaxDocuments?.map((document, index) => {
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
                    })}
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
                const allowedFileTypesRegex = /(.*?)(jpg|jpeg|png|image|pdf)$/i
                if (file.size >= 5242880) {
                    setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
                } else if (file?.type && !allowedFileTypesRegex.test(file?.type)) {
                    setError(t(`NOT_SUPPORTED_FILE_TYPE`))
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
                accept="image/*, .pdf, .png, .jpeg, .jpg"
                onUpload={selectfile}
                onDelete={() => {
                    setUploadedFile(null);
                    setCheckRequiredFields(true);
                }}
                message={uploadedFile ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`CS_ACTION_NO_FILEUPLOADED`)}
                iserror={error}
            />
        </div>
    );

}

export default StakeholderDocuments;