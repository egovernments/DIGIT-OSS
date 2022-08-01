import { BackButton, CardHeader, CardLabelError, PageBasedInput, SearchOnRadioButtons } from "@egovernments/digit-ui-react-components";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";

const LocationSelection = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const { data: cities, isLoading } = Digit.Hooks.useTenants();

  const [selectedCity, setSelectedCity] = useState(() => ({ code: Digit.ULBService.getCitizenCurrentTenant(true) }));
  const [showError, setShowError] = useState(false);

  const texts = useMemo(
    () => ({
      header: t("CS_COMMON_CHOOSE_LOCATION"),
      submitBarLabel: t("CORE_COMMON_CONTINUE"),
    }),
    [t]
  );

  function selectCity(city) {
    setSelectedCity(city);
    setShowError(false);
  }

  const RadioButtonProps = useMemo(() => {
    return {
      options: cities,
      optionsKey: "i18nKey",
      additionalWrapperClass: "reverse-radio-selection-wrapper",
      onSelect: selectCity,
      selectedOption: selectedCity,
    };
  }, [cities, t, selectedCity]);

  function onSubmit() {
    if (selectedCity) {
      Digit.SessionStorage.set("CITIZEN.COMMON.HOME.CITY", selectedCity);
      const redirectBackTo = location.state?.redirectBackTo;
      if (redirectBackTo) {
        history.replace(redirectBackTo);
      } else history.push("/digit-ui/citizen");
    } else {
      setShowError(true);
    }
  }

  return isLoading ? (
    <loader />
  ) : (
    <div className="selection-card-wrapper">
      <BackButton />
      <PageBasedInput texts={texts} onSubmit={onSubmit} className="location-selection-container">
        <CardHeader>{t("CS_COMMON_CHOOSE_LOCATION")}</CardHeader>
        <SearchOnRadioButtons {...RadioButtonProps} placeholder={t("COMMON_TABLE_SEARCH")} />
        {showError ? <CardLabelError>{t("CS_COMMON_LOCATION_SELECTION_ERROR")}</CardLabelError> : null}
      </PageBasedInput>
    </div>
  );
};

export default LocationSelection;
