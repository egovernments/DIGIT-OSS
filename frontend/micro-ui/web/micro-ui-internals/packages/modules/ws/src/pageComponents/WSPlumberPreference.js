import React, { useState } from "react";
import {
    FormStep,
    RadioOrSelect,
    CardLabel,
    TextInput,
    MobileNumber,
} from "@egovernments/digit-ui-react-components";
import Timeline from "../components/Timeline";

const WSPlumberPreference = ({ t, config, onSelect, userType, formData }) => {

    const [plumberPreference, setPlumberPreference] = useState(formData?.plumberPreference?.plumberPreference || {
        i18nKey: "WS_I_WOULD_PREFER_FROM_MUNICIPAL_OFFICE",
        code: "ULB"
    });
    let validation = {}

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
        let plumberDetails = {
            plumberPreference : plumberPreference,
            
        }
        onSelect(config.key, plumberDetails);
    };

    return (
        <div>
            {userType === "citizen" && (<Timeline currentStep={2} />)}
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
                    innerStyles={{display:"flex"}}
                    inputStyle={{marginTop:"10px"}}
                />
            </FormStep>
        </div>
    );
}

export default WSPlumberPreference;