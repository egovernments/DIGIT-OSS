import React, { useState, useEffect } from "react";
import { FormStep, Dropdown, Loader, RadioOrSelect, CitizenInfoLabel } from "@egovernments/digit-ui-react-components";

const SelectTripNo = ({ config, formData, t, onSelect, userType }) => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = Digit.ULBService.getStateId();
    const { data: tripNumberData, isLoading } = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "TripNumber");
    const [tripNo, setTripNo] = useState(formData?.tripNo);

    useEffect(() => {
        if (!isLoading && tripNumberData) {
            const preFilledTripNumber = tripNumberData.filter(
                (tripNumber) => tripNumber.code === (formData?.selectTripNo?.code || formData?.selectTripNo)
            )[0];
            setTripNo(preFilledTripNumber);
        }
    }, [formData?.selectTripNo, tripNumberData]);

    const SelectTrip = (value) => {
        setTripNo(value);
        if (userType === "employee") {
            null
        }
    };

    const onSkip = () => {
        onSelect();
    };

    const onSubmit = () => {
        if (tripNo) {
            onSelect(config.key, tripNo);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    if (userType === "employee") {
        return null;
    }
    return (
        <React.Fragment>
            <FormStep config={config} onSelect={onSubmit} onSkip={onSkip} isDisabled={!tripNo} t={t}>
                <RadioOrSelect
                    options={tripNumberData}
                    selectedOption={tripNo}
                    optionKey="i18nKey"
                    onSelect={SelectTrip}
                    optionCardStyles={{ zIndex: "60" }}
                    t={t}
                    isMandatory={config.isMandatory}
                />
            </FormStep>
        </React.Fragment>
    );
};

export default SelectTripNo;