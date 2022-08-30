import React, { useState } from "react";
import {
    FormStep,
    RadioOrSelect,
    CardLabel
} from "@egovernments/digit-ui-react-components";
import Timeline from "../components/Timeline";

const WSServiceName = ({ t, config, onSelect, userType, formData }) => {
    const [serviceName, setServiceName] = useState(formData?.serviceName || "");
    const [formDetails, setFormDetails] = useState(formData || {});
    const isEdit = window.location.href.includes("/ws/edit-application/");

    const serviceNameList = [
        {
            i18nKey: "WS_WATER_CONNECTION_ONLY",
            code: "WATER"
        },
        {
            i18nKey: "WS_SEWERAGE_CONNECTION_ONLY",
            code: "SEWERAGE"
        },
        {
            i18nKey: "WS_BOTH_WATER_AND_SEWERAGE",
            code: "BOTH"
        }
    ];

    function onAdd() { }

    function onServiceNameSelect(value) {
        setServiceName(value);
    }

    const onSkip = () => onSelect();

    const handleSubmit = () => {
        if (serviceName?.code == "WATER") sessionStorage.setItem("serviceName", "WATER");
        else if (serviceName?.code == "SEWERAGE") sessionStorage.setItem("serviceName", "SEWERAGE");
        else sessionStorage.setItem("serviceName", "");

        if (serviceName?.code != "BOTH" && formDetails?.serviceName?.code != serviceName?.code) {
            let data = formDetails;
            data.waterConectionDetails = {};
            data.sewerageConnectionDetails = {};
            data.serviceName = serviceName;
            onSelect("", data);
        } else {
            onSelect(config.key, serviceName);
        }
    };

    return (
        <div>
            {userType === "citizen" && (<Timeline currentStep={2} />)}
            <FormStep
                t={t}
                config={config}
                onSelect={handleSubmit}
                onSkip={onSkip}
                isDisabled={!serviceName}
                onAdd={onAdd}
            >
                <CardLabel>{t("WS_SELECT_SERVICE_TYPE_WANT_TO_APPLY")}</CardLabel>
                <RadioOrSelect
                    name="gender"
                    options={serviceNameList}
                    selectedOption={serviceName}
                    optionKey="i18nKey"
                    onSelect={onServiceNameSelect}
                    t={t}
                    disabled={isEdit}
                />
            </FormStep>
        </div>
    );
}

export default WSServiceName;