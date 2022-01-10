import React, { useEffect, useMemo, useState } from "react";
import {
    Loader,
    CitizenInfoLabel
} from "@egovernments/digit-ui-react-components";
import Timeline from "../components/Timeline";
import { FormProvider, useForm } from "react-hook-form";
import SelectDocument from "../components/UploadDocument";

const DocumentDetails = ({ t, config, onSelect, userType, formData, setError: setFormError, clearErrors: clearFormErrors, formState }) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = Digit.ULBService.getStateId();
    const [documents, setDocuments] = useState(formData?.documents?.documents || []);
    const [error, setError] = useState(null);
    const [enableSubmit, setEnableSubmit] = useState(true)
    const checkingFlow = formData?.uiFlow?.flow;
    const {data: bpaTaxDocuments, isLoading} = Digit.Hooks.obps.useBPATaxDocuments(stateId, formData, formData?.PrevStateDocuments || []);
    debugger
    const handleSubmit = () => {
        let document = formData.documents;
        let documentStep;
        documentStep = { ...document, documents: documents };
        onSelect(config.key, documentStep);
    };
    //need to change it
    const defaultValues = formData?.documents || null
    const { ...methods } = useForm({defaultValues})
    const { handleSubmit: handleChildFormSubmission } = methods
    return (
        <div>
            <Timeline currentStep={checkingFlow === "OCBPA" ? 3 : 2} flow= {checkingFlow === "OCBPA" ? "OCBPA" : ""}/>
            {!isLoading ? <FormProvider {...methods}>
                <form onSubmit={handleChildFormSubmission(handleSubmit)}>
                    {bpaTaxDocuments?.map((document, index) => {
                        return <div style={{ background: "#FAFAFA", border: "1px solid #D6D5D4", padding: "8px", borderRadius: "4px", maxWidth:"600px", minWidth: "280px", marginBottom:"15px", paddingTop:"15px" }}>
                                <SelectDocument key={index} document={document} t={t} />
                            </div>
                    })}
                </form>
            </FormProvider>: <Loader />}
                {(window.location.href.includes("/bpa/building_plan_scrutiny/new_construction") || window.location.href.includes("/ocbpa/building_oc_plan_scrutiny/new_construction")) && formData?.applicationNo ? <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={`${t("BPA_APPLICATION_NUMBER_LABEL")} ${formData?.applicationNo} ${t("BPA_DOCS_INFORMATION")}`} className={"info-banner-wrap-citizen-override"} /> : ""}
        </div>
    );
}


export default DocumentDetails;
