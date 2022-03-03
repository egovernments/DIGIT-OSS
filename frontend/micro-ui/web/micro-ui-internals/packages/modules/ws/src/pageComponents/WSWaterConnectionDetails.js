import React, { useEffect, useState } from "react";
import {
    Loader,
    FormStep,
    RadioOrSelect,
    TextInput,
    CardLabel
} from "@egovernments/digit-ui-react-components";
import Timeline from "../components/Timeline";

const WSWaterConnectionDetails = ({ t, config, onSelect, formData }) => {
    const tenantId = Digit.ULBService.getStateId();
    const [proposedTaps, setProposedTaps] = useState(formData?.waterConectionDetails?.proposedTaps || "");
    const [proposedPipeSize, setProposedPipeSize] = useState(formData?.waterConectionDetails?.proposedPipeSize || "");
    const [proposedPipeSizeList, setProposedPipeSizeList] = useState([]);
    let validation = {};
    const { isLoading: wsServiceCalculationLoading, data: wsServiceCalculation } = Digit.Hooks.ws.WSSearchMdmsTypes.useWSServicesCalculation(tenantId);

    useEffect(() => {
        if (wsServiceCalculation?.PipeSize?.length > 0) {
            let pipeLists = [];
            wsServiceCalculation?.PipeSize.forEach(type => {
                pipeLists.push({
                    i18nKey: `${type.size} ${t("WS_INCHES_LABEL")}`,
                    code: type.size,
                    id: type.id,
                    size: type.size
                });
            });
            setProposedPipeSizeList(pipeLists);
        }
    }, [wsServiceCalculation]);

    function onAdd() { }

    function setNumberOfProposedTaps(e) {
        setProposedTaps(e.target.value);
    }

    function setProposedPipeSizeSelect(value) {
        setProposedPipeSize(value);
    }

    const onSkip = () => onSelect();

    const handleSubmit = () => {
        let details = {};
        details.proposedTaps = proposedTaps;
        details.proposedPipeSize = proposedPipeSize;
        onSelect(config.key, details);
    };

    return (
        <div>
            <Timeline currentStep={2} />
            {!wsServiceCalculationLoading ?
                <FormStep
                    t={t}
                    config={config}
                    onSelect={handleSubmit}
                    onSkip={onSkip}
                    isDisabled={!proposedTaps || !proposedPipeSize}
                    onAdd={onAdd}
                >
                    <CardLabel>{t("WS_NO_OF_TAPS_PROPOSED")}*</CardLabel>
                    <TextInput
                        isMandatory={false}
                        optionKey="i18nKey"
                        t={t}
                        name="proposedTaps"
                        onChange={setNumberOfProposedTaps}
                        value={proposedTaps}
                        {...(validation = {
                            isRequired: true,
                            pattern: "^[0-9]*$",
                            title: t("ERR_DEFAULT_INPUT_FIELD_MSG"),
                            type: "text"
                        })}
                    />
                    <CardLabel>{t("WS_PROPOSED_PIPE_SIZE")}*</CardLabel>
                    <RadioOrSelect
                        name="proposedPipeSize"
                        options={proposedPipeSizeList}
                        selectedOption={proposedPipeSize}
                        optionKey="i18nKey"
                        onSelect={setProposedPipeSizeSelect}
                        t={t}
                    />
                </FormStep> : <Loader />}
        </div>
    );
}

export default WSWaterConnectionDetails;