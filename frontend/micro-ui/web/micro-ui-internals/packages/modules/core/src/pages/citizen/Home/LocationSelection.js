import React, { useEffect, useMemo, useState } from "react"
import { PageBasedInput, Loader, RadioButtons, CardHeader, Dropdown, SearchOnRadioButtons, CardLabelError } from "@egovernments/digit-ui-react-components"
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const LocationSelection = () => {
    const { t } = useTranslation()
    const history = useHistory()
    
    const {data: cities, isLoading} = Digit.Hooks.useTenants();

    const [selectedCity, setSelectedCity ] = useState(() => Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY"))
    const [showError, setShowError] = useState(false)

    const texts = useMemo(() => ({
        header: t("CS_COMMON_CHOOSE_LOCATION"),
        submitBarLabel: t( "CS_COMMON_SUBMIT")
    }), [t])

    function selectCity(city) {
        setSelectedCity(city)
        setShowError(false)
    }

    const RadioButtonProps = useMemo(() => {
        return {
            options: cities,
            optionsKey: "i18nKey",
            additionalWrapperClass: "reverse-radio-selection-wrapper",
            onSelect: selectCity,
            selectedOption: selectedCity
        }
    },[cities, t, selectedCity])

    function onSubmit(){

        if(selectedCity){
            Digit.SessionStorage.set("CITIZEN.COMMON.HOME.CITY",selectedCity)
            history.push("/digit-ui/citizen")
        }
        else{
            setShowError(true)
        }
    }

    return isLoading ? <loader/> : <PageBasedInput texts={texts} onSubmit={onSubmit}>
        <CardHeader>{t("CS_COMMON_CHOOSE_LOCATION")}</CardHeader>
        <SearchOnRadioButtons {...RadioButtonProps} placeholder={t("COMMON_TABLE_SEARCH")} />
        {showError ? <CardLabelError>{t("CS_COMMON_LOCATION_SELECTION_ERROR")}</CardLabelError> : null}
    </PageBasedInput>
}

export default LocationSelection