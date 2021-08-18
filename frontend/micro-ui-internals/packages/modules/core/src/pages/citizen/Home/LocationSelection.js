import React, { useEffect, useMemo, useState } from "react"
import { PageBasedInput, Loader, RadioButtons, CardHeader, Dropdown } from "@egovernments/digit-ui-react-components"
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const LocationSelection = () => {
    const { t } = useTranslation()
    const history = useHistory()
    
    const {data: cities, isLoading} = Digit.Hooks.useTenants();

     const [selectedCity, setSelectedCity ] = useState(() => Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY"))

    const texts = useMemo(() => ({
        header: t("CS_COMMON_CHOOSE_LOCATION"),
        submitBarLabel: t( "CS_COMMON_SUBMIT")
    }), [t])

    function selectCity(city) {
        setSelectedCity(city)
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
        Digit.SessionStorage.set("CITIZEN.COMMON.HOME.CITY",selectedCity)
        history.push("/digit-ui/citizen")
    }

    return isLoading ? <loader/> : <PageBasedInput texts={texts} onSubmit={onSubmit}>
        <CardHeader>{t("CS_COMMON_CHOOSE_LOCATION")}</CardHeader>
        <Dropdown
            className="form-field"
            selected={selectedCity}
            option={cities}
            select={selectCity}
            optionKey="i18nKey"
            t={t}
          />
        <RadioButtons {...RadioButtonProps}/>
    </PageBasedInput>
}

export default LocationSelection