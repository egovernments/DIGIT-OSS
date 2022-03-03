import React, { useState } from "react";
import {
    FormStep,
    RadioOrSelect
} from "@egovernments/digit-ui-react-components";
import Timeline from "../components/Timeline";

const WSPlumberPreference = ({ t, config, onSelect, formData }) => {

    const [plumberPreference, setPlumberPreference] = useState(formData?.plumberPreference || "");

    const plumberPreferenceList = [
        {
            i18nKey: "WS_I_WOULD_PREFER_FROM_MUNICIPAL_OFFICE",
            code: "ULB"
        },
        {
            i18nKey: "WS_I_WILL_ARRAGE_THE_PLUMBER_MYSELF",
            code: "Self"
        }
    ];

    function onAdd() { }

    function onPlumberPreferenceSelect(value) {
        setPlumberPreference(value);
    }

    const onSkip = () => onSelect();

    const handleSubmit = () => {
        onSelect(config.key, plumberPreference);
    };

    return (
        <div>
            <Timeline currentStep={2} />
            <FormStep
                t={t}
                config={config}
                onSelect={handleSubmit}
                onSkip={onSkip}
                isDisabled={!plumberPreference}
                onAdd={onAdd}
            >
                <RadioOrSelect
                    name="plumberPreference"
                    options={plumberPreferenceList}
                    selectedOption={plumberPreference}
                    optionKey="i18nKey"
                    onSelect={onPlumberPreferenceSelect}
                    t={t}
                />
            </FormStep>
        </div>
    );
}

export default WSPlumberPreference;