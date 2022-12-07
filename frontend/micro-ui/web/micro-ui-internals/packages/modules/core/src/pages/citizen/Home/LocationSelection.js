import React, { Fragment, useMemo, useState } from "react";
import { PageBasedInput, CardHeader, BackButton, SearchOnRadioButtons, CardLabelError } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const LocationSelection = () => {
  const { t } = useTranslation();
  const history = useHistory();

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
      // additionalWrapperClass: "selectpicker form-control",
      onSelect: selectCity,
      selectedOption: selectedCity,
    };
  }, [cities, t, selectedCity]);

  function onSubmit() {
    if (selectedCity) {
      Digit.SessionStorage.set("CITIZEN.COMMON.HOME.CITY", selectedCity);
      history.push("/digit-ui/citizen");
    } else {
      setShowError(true);
    }
  }

  return isLoading ? (
    <loader />
  ) : (
    <>
      {/* <BackButton /> */}
      <PageBasedInput texts={texts} onSubmit={onSubmit}  style={{ marginTop:4,  border: "5px solid #1266af" }}>
        {/* <CardHeader>{t("CS_COMMON_CHOOSE_LOCATION")}</CardHeader> */}
        <div  style={{ textAlign:"center" }}>{t("CS_COMMON_CHOOSE_LOCATION")}</div>
        <SearchOnRadioButtons {...RadioButtonProps} placeholder={t("COMMON_TABLE_SEARCH")} />
        {showError ? <CardLabelError>{t("CS_COMMON_LOCATION_SELECTION_ERROR")}</CardLabelError> : null}
        {/* <div class="row">
  <div class="col-sm-8">
    <div class="form-group">
      <select  className="selectpicker form-control"
      // className="basic-single"
      {...RadioButtonProps}  placeholder={t("COMMON_TABLE_SEARCH")}>
      <option value="0">CHOOSE LOCATION</option>
      <option value="1">{RadioButtonProps?.options?.[0]?.name}</option>
      <option value="2">{RadioButtonProps?.options?.[1]?.name}</option>
      <option value="3">{RadioButtonProps?.options?.[2]?.name}</option>
      <option value="4">{RadioButtonProps?.options?.[3]?.name}</option>
      <option value="5">{RadioButtonProps?.options?.[4]?.name}</option>
      <option value="6">{RadioButtonProps?.options?.[5]?.name}</option>
      <option value="7">{RadioButtonProps?.options?.[7]?.name}</option>
      <option value="8">{RadioButtonProps?.options?.[8]?.name}</option>
      <option value="9">{RadioButtonProps?.options?.[9]?.name}</option>
      <option value="10">{RadioButtonProps?.options?.[10]?.name}</option>
      <option value="11">{RadioButtonProps?.options?.[11]?.name}</option>
      <option value="12">{RadioButtonProps?.options?.[12]?.name}</option>
      <option value="13">{RadioButtonProps?.options?.[13]?.name}</option>
      <option value="14">{RadioButtonProps?.options?.[14]?.name}</option>
      <option value="15">{RadioButtonProps?.options?.[15]?.name}</option>
      <option value="16">{RadioButtonProps?.options?.[16]?.name}</option>
      <option value="17">{RadioButtonProps?.options?.[17]?.name}</option>
      <option value="18">{RadioButtonProps?.options?.[18]?.name}</option>
      <option value="19">{RadioButtonProps?.options?.[19]?.name}</option>
      <option value="20">{RadioButtonProps?.options?.[20]?.name}</option>
      <option value="21">{RadioButtonProps?.options?.[21]?.name}</option>
      <option value="22">{RadioButtonProps?.options?.[22]?.name}</option>
      </select>
    </div>
  </div>
</div> */}
      </PageBasedInput>
    </>
  );
};

export default LocationSelection;
