import React, { useState } from "react";
import {
    FormStep,
    TextInput,
    CardLabel
} from "@egovernments/digit-ui-react-components";
import Timeline from "../components/Timeline";

const WSSewerageConnectionDetails = ({ t, config, onSelect, formData }) => {
    const [proposedWaterClosets, setProposedWaterClosets] = useState(formData?.sewerageConnectionDetails?.proposedWaterClosets || "");
    const [proposedToilets, setProposedToilets] = useState(formData?.sewerageConnectionDetails?.proposedToilets || "");
    let validation = {};

    function onAdd() { }

    function setNumberOfProposedWaterClosets(e) {
        setProposedWaterClosets(e.target.value);
    }

    function setNumberOfProposedToilets(e) {
        setProposedToilets(e.target.value);
    }

    const onSkip = () => onSelect();

    const handleSubmit = () => {
        let details = {};
        details.proposedWaterClosets = proposedWaterClosets;
        details.proposedToilets = proposedToilets;
        onSelect(config.key, details);
    };

    return (
        <div>
            <Timeline currentStep={2} />
            <FormStep
                t={t}
                config={config}
                onSelect={handleSubmit}
                onSkip={onSkip}
                isDisabled={!proposedWaterClosets || !proposedToilets}
                onAdd={onAdd}
            >
                <CardLabel>{t("WS_NO_OF_WATER_CLOSETS")}*</CardLabel>
                <TextInput
                    type={"number"}
                    isMandatory={false}
                    optionKey="i18nKey"
                    t={t}
                    name="proposedWaterClosets"
                    onChange={setNumberOfProposedWaterClosets}
                    value={proposedWaterClosets}
                    {...(validation = {
                        isRequired: true,
                        pattern: "^[0-9]*$",
                        title: t("ERR_DEFAULT_INPUT_FIELD_MSG"),
                    })}
                />
                <CardLabel>{t("WS_SERV_DETAIL_NO_OF_TOILETS")}*</CardLabel>
                <TextInput
                    type={"number"}
                    isMandatory={false}
                    optionKey="i18nKey"
                    t={t}
                    name="proposedToilets"
                    onChange={setNumberOfProposedToilets}
                    value={proposedToilets}
                    {...(validation = {
                        isRequired: true,
                        pattern: "^[0-9]*$",
                        title: t("ERR_DEFAULT_INPUT_FIELD_MSG"),
                    })}
                />
            </FormStep>
        </div>
    );
}

export default WSSewerageConnectionDetails;