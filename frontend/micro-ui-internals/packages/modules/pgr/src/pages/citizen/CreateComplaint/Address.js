import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { fetchLocalities } from "../../../redux/actions";
import { useTranslation } from "react-i18next";
import { CityMohalla } from "@egovernments/digit-ui-react-components";

const Address = (props) => {
  const SessionStorage = Digit.SessionStorage;
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [rerender, setRerender] = useState(1);
  const appState = useSelector((state) => state);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();

  const cities = [];
  var localities = [];

  useEffect(() => {
    if (SessionStorage.get("city_complaint")) {
      setSelectedCity(SessionStorage.get("city_complaint"));
    }
  }, []);

  useEffect(() => {
    appState.cities.map((city) => cities.push(city.name));
    if (appState.localities.localityList) {
      appState.localities.localityList.map((locality) => localities.push(locality.name));
    }
    // if (appState.localities.city) {
    //   setSelectedCity(appState.localities.city);
    // }
  }, [localities, cities]);

  async function selectCity(city) {
    setSelectedCity(city);
    const SessionStorage = Digit.SessionStorage;
    SessionStorage.set("city_complaint", city);
    await dispatch(fetchLocalities(city));
  }
  function selectLocalities(locality) {
    let localityDetails = appState.localities.localityList.find((o) => o.name === locality);
    setSelectedLocality(localityDetails);
  }

  function save() {
    props.save(selectedCity, selectedLocality);
    SessionStorage.del("city_complaint");
    history.push("/create-complaint/landmark");
  }

  function onSkip() {
    history.push("/create-complaint/landmark");
  }

  return (
    <CityMohalla
      header={t("CS_ADDCOMPLAINT_PROVIDE_COMPLAINT_ADDRESS")}
      subHeader={t("CS_ADDCOMPLAINT_COMPLAINT_LOCATION")}
      cardText={t("CS_CHOOSE_CITY_MOHALLA_TEXT")}
      cardLabelCity={t("MYCITY_CODE_LABEL")}
      cardLabelMohalla={t("CS_CREATECOMPLAINT_MOHALLA")}
      nextText={t("PT_COMMONS_NEXT")}
      isMandatory
      selectedCity={selectedCity}
      onSave={save}
      cities={cities}
      selectCity={selectCity}
      localities={localities}
      selectLocalities={selectLocalities}
      onSkip={onSkip}
    />
  );
};

export default Address;
