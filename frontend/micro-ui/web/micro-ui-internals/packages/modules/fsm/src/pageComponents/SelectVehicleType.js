import React, { useEffect, useState } from "react";
import { CardLabel, Dropdown, LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";

const SelectVehicleType = ({ t, config, onSelect, userType, formData, setValue }) => {
  const stateId = Digit.ULBService.getStateId();
  const { data: vehicleData, isLoading } = Digit.Hooks.fsm.useMDMS(stateId, "Vehicle", "VehicleMakeModel");
  let tenantId = Digit.ULBService.getCurrentTenantId();

  const [modals, setModals] = useState([]);
  const [selectedModal, setSelectedModal] = useState({});
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState({});
  const [selectedCapacity, setSelectedCapacity] = useState("");

  useEffect(() => {
    if (vehicleData) {
      const vehicleModal = vehicleData.filter((vehicle) => vehicle.code === (formData?.vehicle?.modal?.code || formData?.vehicle?.modal));
      const vehicleType = vehicleData.filter((vehicle) => vehicle.code === (formData?.vehicle?.type?.code || formData?.vehicle?.type));
      setSelectedModal(...vehicleModal);
      setSelectedType(...vehicleType);
      setSelectedCapacity(formData?.vehicle?.tankCapacity);
    }
  }, [formData?.vehicle, vehicleData]);

  useEffect(() => {
    if (selectedModal?.code && selectedModal?.code !== formData?.vehicle?.modal) {
      setSelectedType("");
      setSelectedCapacity("");
      setValue("additionalDetails", "");
      setValue("pollutionCert", undefined);
      setValue("insurance", undefined);
      setValue("roadTax", undefined);
      setValue("fitnessValidity", undefined);
    }
  }, [formData?.vehicle?.modal]);

  useEffect(() => {
    if (vehicleData) {
      const vehicleModals = vehicleData.filter((vehicle) => vehicle.make === undefined);
      setModals(vehicleModals);
    }
  }, [vehicleData]);

  const selectModal = (modal) => {
    const types = vehicleData.filter((vehicle) => vehicle.make === modal.code);
    setTypes(types);
    setSelectedModal(modal);
    onSelect(config.key, { ...formData[config.key], modal: modal, type: "" });
  };

  const selectType = (type) => {
    setSelectedCapacity(type.capacity);
    setSelectedType(type);
    onSelect(config.key, { ...formData[config.key], type: type });
  };

  return (
    <div>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">
          {t("ES_FSM_REGISTRY_VEHICLE_MODEL")}
          {config.isMandatory ? " * " : null}
        </CardLabel>
        <Dropdown
          className="form-field"
          isMandatory
          selected={selectedModal}
          disable={false}
          option={modals}
          select={selectModal}
          optionKey="name"
          t={t}
        />
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">
          {t("ES_FSM_REGISTRY_VEHICLE_TYPE")}
          {config.isMandatory ? " * " : null}
        </CardLabel>
        <Dropdown className="form-field" isMandatory selected={selectedType} option={types} select={selectType} optionKey="name" t={t} />
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">
          {t("ES_FSM_REGISTRY_VEHICLE_CAPACITY")}
          {config.isMandatory ? " * " : null}
        </CardLabel>
        <TextInput className="" textInputStyle={{ width: "50%" }} value={selectedCapacity} onChange={() => {}} disable={true} />
      </LabelFieldPair>
    </div>
  );
};

export default SelectVehicleType;
