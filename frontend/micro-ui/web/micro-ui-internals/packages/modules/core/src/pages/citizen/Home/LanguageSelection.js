import React, { useMemo } from "react"
import { PageBasedInput, Loader, RadioButtons, CardHeader } from "@egovernments/digit-ui-react-components"
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const LanguageSelection = () => {
    const { t } = useTranslation()
    const history = useHistory();
    
    const { data: { languages, stateInfo } = {}, isLoading } = Digit.Hooks.useStore.getInitData();
    const selectedLanguage = Digit.StoreData.getCurrentLanguage();

    const texts = useMemo(() => ({
        header: t("CS_COMMON_CHOOSE_LANGUAGE"),
        submitBarLabel: t( "CORE_COMMON_CONTINUE")
    }), [t])
    console.log("BHG");
    const RadioButtonProps = useMemo(() => ({
        options: languages,
        optionsKey: "label",
        additionalWrapperClass: "reverse-radio-selection-wrapper",
        onSelect: (language) => Digit.LocalizationService.changeLanguage(language.value, stateInfo.code),
        selectedOption: languages?.filter(i => i.value === selectedLanguage)[0]
    }),[selectedLanguage, languages])
    
    function onSubmit () {
        history.push(`/digit-ui/citizen/select-location`)
    }

    return isLoading ? <Loader/> : <PageBasedInput texts={texts} onSubmit={onSubmit}>
        <CardHeader>{t("CS_COMMON_CHOOSE_LANGUAGE")}</CardHeader>
        <RadioButtons {...RadioButtonProps}/>
    </PageBasedInput>
    // additionalWrapperClass
}

export default LanguageSelection