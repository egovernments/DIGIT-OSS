import React, { useEffect, useState } from "react";
import { CardLabel, Dropdown, FormStep } from "@egovernments/digit-ui-react-components";
import useTenants from "../../../../hooks/useTenants";
import useLocalities from "../../../../hooks/useLocalities";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { fetchLocalities } from "../../../../redux/actions";

const SelectAddress = ({ config, onSelect }) => {
  const cities = useTenants();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const city_complaint = Digit.SessionStorage.get("city_complaint");
  const [selectedCity, setSelectedCity] = useState(city_complaint ? city_complaint : null);
  const [localities, setLocalities] = useState(null);
  console.log("------------************", selectedCity);
  const __localities = useLocalities({ city: selectedCity });
  console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj", __localities);
  useEffect(() => {
    console.log("select address", __localities);
    setLocalities(__localities);
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk", __localities);
    // selectedCity ? (async()=>await dispatch(fetchLocalities(selectedCity)))() : null;
  }, [selectedCity]);

  async function selectCity(city) {
    setSelectedCity(city);
    Digit.SessionStorage.set("city_complaint", city);
  }

  return (
    <FormStep config={config} onSelect={onSelect}>
      <CardLabel>{t("MYCITY_CODE_LABEL")}</CardLabel>
      <Dropdown isMandatory selected={selectedCity} option={cities} select={selectCity} />
      {selectedCity && <CardLabel>{t("CS_CREATECOMPLAINT_MOHALLA")}</CardLabel>}
      {selectedCity && localities && <Dropdown isMandatory option={localities} />}
    </FormStep>
  );
};

export default SelectAddress;
