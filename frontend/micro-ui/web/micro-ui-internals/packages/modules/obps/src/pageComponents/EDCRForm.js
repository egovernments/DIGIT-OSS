import React, { useState, useEffect } from "react";
import { FormStep, UploadFile, CardLabelDesc, Dropdown, CardLabel, TextInput, RadioOrSelect, Loader, Toast } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import { getPattern, stringReplaceAll } from "../utils";

const EDCRForm = ({ t, config, onSelect, userType, formData, ownerIndex = 0, addNewOwner, isShowToast }) => {
    const { pathname: url } = useLocation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = tenantId.split(".")[0];
    const [citymoduleList, setCitymoduleList] = useState([]);
    const [name, setName] = useState(formData?.Scrutiny?.[0]?.applicantName);
    const [tenantIdData, setTenantIdData] = useState(formData?.Scrutiny?.[0]?.tenantIdData);
    const [uploadedFile, setUploadedFile] = useState(() => formData?.Scrutiny?.[0]?.proofIdentity?.fileStoreId || null);
    const [file, setFile] = useState(formData?.owners?.documents?.proofIdentity);
    const [error, setError] = useState(null);
    const [uploadMessage, setUploadMessage] = useState("");
    const [showToast, setShowToast] = useState(null);

    let validation = {};


    function setApplicantName(e) {
        setName(e.target.value);
    }

    function setTypeOfTenantID(value) {
        setTenantIdData(value);
    }

    function selectfile(e) {
        setUploadedFile(e.target.files[0]);
        setFile(e.target.files[0]);
    }

    const onSkip = () => {
        setUploadMessage("NEED TO DELETE");
    };

    const { isLoading, data: citymodules } = Digit.Hooks.obps.useMDMS(stateId, "tenant", ["citymodule"]);

    useEffect(() => {
        if (citymodules?.tenant?.citymodule?.length > 0) {
            const list = citymodules?.tenant?.citymodule?.filter(data => data.code == "BPAAPPLY");
            list?.[0]?.tenants?.forEach(data => {
                data.i18nKey = `TENANT_TENANTS_${stringReplaceAll(data?.code?.toUpperCase(), ".", "_")}`;
            })
            if (Array.isArray(list?.[0]?.tenants)) list?.[0]?.tenants.reverse();
            setCitymoduleList(list?.[0]?.tenants);
        }
    }, [citymodules]);

    useEffect(() => {
        if (uploadMessage) {
            setName("");
            setTenantIdData("");
            setUploadedFile(null);
            setFile("");
            setUploadMessage("");
        }
    }, [uploadMessage]);

    function onAdd() {
        setUploadMessage("NEED TO DELETE");
    }

    const handleSubmit = () => {
        const data = {};
        data.tenantId = tenantIdData;
        data.applicantName = name;
        data.file = file;
        onSelect(config.key, data);
    };

    if (isLoading) {
        return <Loader />;
    }
    return (
        <FormStep
            t={t}
            config={config}
            onSelect={handleSubmit}
            onSkip={onSkip}
            isDisabled={!tenantIdData || !name || !file}
            onAdd={onAdd}
            isMultipleAllow={true}
        >
            <CardLabel>{`${t("EDCR_SCRUTINY_CITY")}*`}</CardLabel>
            <Dropdown
                t={t}
                isMandatory={false}
                option={citymoduleList}
                selected={tenantIdData}
                optionKey="i18nKey"
                select={setTypeOfTenantID}
                uploadMessage={uploadMessage}
            />
            <CardLabel>{`${t("EDCR_SCRUTINY_NAME_LABEL")}*`}</CardLabel>
            <TextInput
                isMandatory={false}
                optionKey="i18nKey"
                t={t}
                name="applicantName"
                onChange={setApplicantName}
                uploadMessage={uploadMessage}
                value={name}
                {...(validation = {
                    isRequired: true,
                    pattern: getPattern("Name"),
                    title: t("BPA_INVALID_NAME"),
                })}
            />
            <CardLabel>{`${t("EDCR_BUILDINGPLAN")}*`}</CardLabel>
            <UploadFile
                extraStyleName={"propertyCreate"}
                accept=".dxf"
                onUpload={selectfile}
                onDelete={() => {
                    setUploadedFile(null);
                }}
                message={uploadedFile ? `1 ${t(`PT_ACTION_FILEUPLOADED`)}` : t(`ES_NO_FILE_SELECTED_LABEL`)}
                error={error}
                uploadMessage={uploadMessage}
            />
            <div style={{ disabled: "true", height: "30px", width: "100%", fontSize: "14px" }}>{t("EDCR_UPLOAD_FILE_LIMITS_LABEL")}</div>
            {isShowToast && <Toast error={isShowToast.key} label={t(isShowToast.label)} onClose={() => setShowToast(null)} />}
        </FormStep>
    );
};

export default EDCRForm;
