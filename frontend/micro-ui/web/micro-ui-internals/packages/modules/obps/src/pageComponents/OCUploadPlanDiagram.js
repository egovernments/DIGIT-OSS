import {
    CardLabel, FormStep,
    UploadFile,
    Toast,
    Loader
} from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

const OCUploadPlanDiagram = ({ t, config, onSelect, userType, formData, ownerIndex = 0, addNewOwner, isShowToast, isSubmitBtnDisable, setIsShowToast }) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = Digit.ULBService.getStateId();
    const [uploadedFile, setUploadedFile] = useState(() => formData?.uploadData?.file || null);
    const [file, setFile] = useState(formData?.uploadData?.file);
    const [uploadMessage, setUploadMessage] = useState("");
    const history = useHistory();

    function selectfile(e) {
        setUploadedFile(e.target.files[0]);
        setFile(e.target.files[0]);
    }

    const onSkip = () => { };

    useEffect(() => {
        if (uploadMessage || isShowToast) {
            setUploadedFile(null);
            setFile("");
            setUploadMessage("");
        }
        if (isShowToast) {
            history.push(
                `/digit-ui/citizen/obps/edcrscrutiny/oc-apply/acknowledgement`,
                { data: isShowToast?.label ? isShowToast?.label : "BPA_INTERNAL_SERVER_ERROR", type: "ERROR"}
              );
        }
    }, [uploadMessage, isShowToast, isSubmitBtnDisable]);

    function onAdd() { };

    const handleSubmit = () => {
        const data = { };
        data.file = file;
        onSelect(config.key, data, true, true);
    };

    if (isSubmitBtnDisable) return <Loader />;

    return (
        <FormStep
            t={t}
            config={config}
            onSelect={handleSubmit}
            onSkip={onSkip}
            isDisabled={!file || isSubmitBtnDisable}
            onAdd={onAdd}
            isMultipleAllow={true}
        >
            <CardLabel>{`${t("BPA_OC_PLAN_DIAGRAM_DXF")} *`}</CardLabel>
            <UploadFile
                id={"oc-doc"}
                extraStyleName={"propertyCreate"}
                // accept=".dxf"
                onUpload={selectfile}
                onDelete={() => {
                    setUploadedFile(null);
                    setFile("");
                }}
                message={uploadedFile ? `1 ${t(`PT_ACTION_FILEUPLOADED`)}` : t(`ES_NO_FILE_SELECTED_LABEL`)}
                uploadMessage={uploadMessage}
            />
            <div style={{ disabled: "true", height: "30px", width: "100%", fontSize: "14px" }}></div>
            {isShowToast && <Toast error={isShowToast.key} label={t(isShowToast.label)} onClose={() => setIsShowToast(null)} isDleteBtn={true} />}
        </FormStep>
    );
};

export default OCUploadPlanDiagram;
