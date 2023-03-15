import React, { useState, useEffect } from "react";
import { FormStep, Dropdown, Loader, RadioOrSelect, CardText } from "@egovernments/digit-ui-react-components";

const SelectTripNo = ({ config, formData, t, onSelect, userType }) => {
  const state = Digit.ULBService.getStateId();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const { data: tripNumberData, isLoading } = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "TripNumber");
  const { data: dsoData, isLoading: isDsoLoading, isSuccess: isDsoSuccess, error: dsoError } = Digit.Hooks.fsm.useDsoSearch(tenantId, {
    limit: -1,
    status: "ACTIVE",
  });
  const { isLoading: isVehicleMenuLoading, data: vehicleData } = Digit.Hooks.fsm.useMDMS(state, "Vehicle", "VehicleType", { staleTime: Infinity });
  const [tripNo, setTripNo] = useState(formData?.tripNo);
  const [vehicleCapacity, setVehicleCapacity] = useState(formData?.capacity);
  const [vehicleMenu, setVehicleMenu] = useState([]);

  useEffect(() => {
    if (dsoData && vehicleData) {
      const allVehicles = dsoData.reduce((acc, curr) => {
        return curr.vehicles && curr.vehicles.length ? acc.concat(curr.vehicles) : acc;
      }, []);

      const cpacityMenu = Array.from(new Set(allVehicles.map((a) => a.capacity))).map((capacity) => allVehicles.find((a) => a.capacity === capacity));

      setVehicleMenu(cpacityMenu);
    }
  }, [dsoData, vehicleData]);

  useEffect(() => {
    if (!isLoading && tripNumberData) {
      const preFilledTripNumber = tripNumberData.filter(
        (tripNumber) => tripNumber.code === (formData?.selectTripNo?.tripNo?.code || formData?.selectTripNo)
      )[0];
      preFilledTripNumber ? setTripNo(preFilledTripNumber) : setTripNo(tripNumberData.find((i) => i.code === 1));
    }
  }, [formData?.selectTripNo?.tripNo, tripNumberData]);

  useEffect(() => {
    if (!isLoading && vehicleMenu) {
      const preFilledCapacity = vehicleMenu.filter((i) => i.capacity === formData?.selectTripNo?.vehicleCapacity?.capacity)[0];
      let minCapacity = vehicleMenu.reduce((prev, current) => (prev.capacity < current.capacity ? prev : current), 0);
      preFilledCapacity ? setVehicleCapacity(preFilledCapacity) : setVehicleCapacity(minCapacity);
    }
  }, [formData?.selectTripNo?.vehicleCapacity, vehicleMenu]);

  const SelectTrip = (value) => {
    setTripNo(value);
    if (userType === "employee") {
      null;
    }
  };

  const selectVehicle = (value) => {
    setVehicleCapacity(value);
    if (userType === "employee") {
      null;
    }
  };

  const onSkip = () => {
    if (tripNo) {
      onSelect(config.key, { tripNo, vehicleCapacity });
    }
  };

  const onSubmit = () => {
    if (tripNo) {
      onSelect(config.key, { tripNo, vehicleCapacity });
    }
  };

  if (isLoading || vehicleMenu.length === 0) {
    return <Loader />;
  }

  if (userType === "employee") {
    return null;
  }
  return (
    <React.Fragment>
      <FormStep config={config} onSelect={onSubmit} onSkip={onSkip} isDisabled={tripNo || vehicleCapacity ? false : true} t={t}>
        <CardText> {t("ES_FSM_NUMBER_OF_TRIPS")} </CardText>
        <RadioOrSelect
          options={tripNumberData}
          selectedOption={tripNo}
          optionKey="i18nKey"
          onSelect={SelectTrip}
          optionCardStyles={{ zIndex: "60" }}
          t={t}
          isMandatory={config.isMandatory}
        />
        <CardText> {t("ES_VEHICLE CAPACITY")} </CardText>
        <RadioOrSelect
          options={vehicleMenu?.map((vehicle) => ({ ...vehicle, label: vehicle.capacity })).sort((a, b) => a.capacity - b.capacity)}
          selectedOption={vehicleCapacity}
          optionKey="capacity"
          onSelect={selectVehicle}
          optionCardStyles={{ zIndex: "60" }}
          t={t}
          isMandatory={config.isMandatory}
          isDropDown={true}
        />
      </FormStep>
    </React.Fragment>
  );
};

export default SelectTripNo;
