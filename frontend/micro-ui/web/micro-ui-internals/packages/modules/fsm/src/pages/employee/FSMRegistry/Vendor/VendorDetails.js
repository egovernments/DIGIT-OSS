import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Card,
  StatusTable,
  Row,
  SubmitBar,
  Loader,
  CardSectionHeader,
  ActionBar,
  Menu,
  Toast,
  Header,
  EditIcon,
  DeleteIcon,
  Modal,
  Close,
  CardText,
  Dropdown,
} from "@egovernments/digit-ui-react-components";

import { useQueryClient } from "react-query";

import { useHistory, useParams } from "react-router-dom";

const Heading = (props) => {
  return <h1 className="heading-m">{props.label}</h1>;
};

const CloseBtn = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick}>
      <Close />
    </div>
  );
};

const VendorDetails = (props) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = Digit.ULBService.getStateId();
  const { t } = useTranslation();
  const history = useHistory();
  const queryClient = useQueryClient();
  let { id: dsoId } = useParams();
  const [displayMenu, setDisplayMenu] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [config, setCurrentConfig] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedOption, setSelectedOption] = useState({});

  const { data: dsoData, isLoading: isLoading, isSuccess: isDsoSuccess, error: dsoError } = Digit.Hooks.fsm.useDsoSearch(
    tenantId,
    { ids: dsoId },
    { staleTime: Infinity }
  );

  const { data: vehicleData, isLoading: isVehicleDataLoading, isSuccess: isVehicleSuccess, error: vehicleError } = Digit.Hooks.fsm.useVehiclesSearch({
    tenantId,
    filters: {
      vendorVehicleStatus: "ACTIVE",
      vehicleWithNoVendor: true,
    },
  });

  const { data: driverData, isLoading: isDriverDataLoading, isSuccess: isDriverSuccess, error: driverError } = Digit.Hooks.fsm.useDriverSearch({
    tenantId,
    filters: {
      status: "ACTIVE",
      driverWithNoVendor: true,
    },
  });

  const {
    isLoading: isUpdateLoading,
    isError: vendorCreateError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.fsm.useVendorUpdate(tenantId);

  function onActionSelect(action) {
    setDisplayMenu(false);
    setSelectedAction(action);
  }

  useEffect(() => {
    switch (selectedAction) {
      case "DELETE":
      case "ADD_VEHICLE":
      case "ADD_DRIVER":
        return setShowModal(true);
      case "EDIT":
        return history.push("/digit-ui/employee/fsm/registry/modify-vendor/" + dsoId);
      default:
        break;
    }
  }, [selectedAction]);

  useEffect(() => {
    if (vehicleData) setVehicles(vehicleData?.vehicle || []);
  }, [vehicleData]);

  useEffect(() => {
    if (driverData) setDrivers(driverData?.driver || []);
  }, [driverData]);

  const closeToast = () => {
    setShowToast(null);
  };

  const closeModal = () => {
    setSelectedAction(null);
    setShowModal(false);
  };

  const handleVendorUpdate = () => {
    let dsoDetails = dsoData?.[0]?.dsoDetails;
    let formData = {};
    if (selectedAction === "DELETE") {
      formData = {
        vendor: {
          ...dsoDetails,
          status: "INACTIVE",
        },
      };
    }
    if (selectedAction === "ADD_VEHICLE") {
      let selectedVehicle = selectedOption;
      selectedVehicle.vendorVehicleStatus = "ACTIVE";
      formData = {
        vendor: {
          ...dsoDetails,
          vehicles: dsoDetails.vehicles ? [...dsoDetails.vehicles, selectedVehicle] : [selectedVehicle],
        },
      };
    }
    if (selectedAction === "ADD_DRIVER") {
      let selectedDriver = selectedOption;
      selectedDriver.vendorDriverStatus = "ACTIVE";
      formData = {
        vendor: {
          ...dsoDetails,
          drivers: dsoDetails.drivers ? [...dsoDetails.drivers, selectedDriver] : [selectedDriver],
        },
      };
    }

    mutate(formData, {
      onError: (error, variables) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: (data, variables) => {
        setShowToast({ key: "success", action: selectedAction === "DELETE" ? "DELETE_VENDOR" : selectedAction });
        queryClient.invalidateQueries("DSO_SEARCH");
        setTimeout(() => {
          closeToast();
          if (selectedAction === "DELETE") history.push(`/digit-ui/employee/fsm/registry`);
        }, 5000);
      },
    });
    setShowModal(false);
  };

  const onEdit = (details, type, id) => {
    if (type === "ES_FSM_REGISTRY_DETAILS_TYPE_DRIVER") {
      history.push("/digit-ui/employee/fsm/registry/modify-driver/" + id);
    } else {
      let registrationNumber = details?.values?.find((ele) => ele.title === "ES_FSM_REGISTRY_VEHICLE_NUMBER")?.value;
      history.push("/digit-ui/employee/fsm/registry/modify-vehicle/" + registrationNumber);
    }
  };

  const onDelete = (details, type, id) => {
    let formData = {};
    if (type === "ES_FSM_REGISTRY_DETAILS_TYPE_DRIVER") {
      let dsoDetails = dsoData?.[0]?.dsoDetails;
      let drivers = dsoDetails?.drivers;

      drivers = drivers.map((data) => {
        if (data.id === id) {
          data.vendorDriverStatus = "INACTIVE";
        }
        return data;
      });
      formData = {
        vendor: {
          ...dsoDetails,
          drivers: drivers,
        },
      };
    } else {
      let dsoDetails = dsoData?.[0]?.dsoDetails;
      let vehicles = dsoDetails?.vehicles;
      let registrationNumber = details?.values?.find((ele) => ele.title === "ES_FSM_REGISTRY_VEHICLE_NUMBER")?.value;
      vehicles = vehicles.map((data) => {
        if (data.registrationNumber === registrationNumber) {
          data.vendorVehicleStatus = "INACTIVE";
        }
        return data;
      });
      formData = {
        vendor: {
          ...dsoDetails,
          vehicles: vehicles,
        },
      };
    }
    mutate(formData, {
      onError: (error, variables) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: (data, variables) => {
        setShowToast({ key: "success", action: type === "ES_FSM_REGISTRY_DETAILS_TYPE_DRIVER" ? "DELETE_DRIVER" : "DELETE_VEHICLE" });
        queryClient.invalidateQueries("DSO_SEARCH");
        setTimeout(() => {
          closeToast();
        }, 5000);
      },
    });
  };

  const renderModalContent = () => {
    if (selectedAction === "DELETE") {
      return <CardText>{t(`ES_FSM_REGISTRY_DELETE_TEXT`)}</CardText>;
    }
    if (selectedAction === "ADD_VEHICLE") {
      return (
        <>
          <CardText>{t(`ES_FSM_REGISTRY_SELECT_VEHICLE`)}</CardText>
          <Dropdown
            t={t}
            option={vehicles}
            value={selectedOption}
            selected={selectedOption}
            select={setSelectedOption}
            optionKey={"registrationNumber"}
          />
        </>
      );
    }
    if (selectedAction === "ADD_DRIVER") {
      return (
        <>
          <CardText>{t(`ES_FSM_REGISTRY_SELECT_DRIVER`)}</CardText>
          <Dropdown t={t} option={drivers} value={selectedOption} selected={selectedOption} select={setSelectedOption} optionKey={"name"} />
        </>
      );
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      {!isLoading ? (
        <React.Fragment>
          <Header style={{ marginBottom: "16px" }}>{t("ES_FSM_REGISTRY_VENDOR_DETAILS")}</Header>
          <Card style={{ position: "relative" }}>
            {dsoData?.[0]?.employeeResponse?.map((detail, index) => (
              <React.Fragment key={index}>
                <CardSectionHeader style={{ marginBottom: "16px", marginTop: "32px" }}>{t(detail.title)}</CardSectionHeader>
                <StatusTable>
                  {detail?.values?.map((value, index) => {
                    return (
                      <Row
                        key={t(value.title)}
                        label={t(value.title)}
                        text={t(value.value) || "N/A"}
                        last={index === detail?.values?.length - 1}
                        caption={value.caption}
                        className="border-none"
                      />
                    );
                  })}
                  {detail?.child?.map((data, index) => {
                    return (
                      <Card className="card-with-background">
                        <div className="card-head">
                          <h2>
                            {t(detail.type)} {index + 1}
                          </h2>
                          <div style={{ display: "flex" }}>
                            <span onClick={() => onEdit(data, detail.type, data.id)}>
                              <EditIcon style={{ cursor: "pointer", marginRight: "20px" }} className="edit" fill="#f47738" />
                            </span>
                            <span onClick={() => onDelete(data, detail.type, data.id)}>
                              <DeleteIcon style={{ cursor: "pointer" }} className="delete" fill="#f47738" />
                            </span>
                          </div>
                        </div>
                        {data?.values?.map((value, index) => (
                          <Row
                            key={t(value.title)}
                            label={t(value.title)}
                            text={t(value.value) || "N/A"}
                            last={index === detail?.values?.length - 1}
                            caption={value.caption}
                            className="border-none"
                            textStyle={value.value === "ACTIVE" ? { color: "green" } : {}}
                          />
                        ))}
                      </Card>
                    );
                  })}
                  {detail.type && (
                    <div
                      style={{ color: "#f47738", cursor: "pointer", marginLeft: "16px" }}
                      onClick={() => onActionSelect(detail.type === "ES_FSM_REGISTRY_DETAILS_TYPE_DRIVER" ? "ADD_DRIVER" : "ADD_VEHICLE")}
                    >
                      {t(`${detail.type}_ADD`)}
                    </div>
                  )}
                </StatusTable>
              </React.Fragment>
            ))}
          </Card>
          {showModal && (
            <Modal
              headerBarMain={
                <Heading
                  label={t(
                    selectedAction === "DELETE"
                      ? "ES_FSM_REGISTRY_DELETE_POPUP_HEADER"
                      : selectedAction === "ADD_VEHICLE"
                      ? "ES_FSM_REGISTRY_ADD_VEHICLE_POPUP_HEADER"
                      : "ES_FSM_REGISTRY_ADD_DRIVER_POPUP_HEADER"
                  )}
                />
              }
              headerBarEnd={<CloseBtn onClick={closeModal} />}
              actionCancelLabel={t("CS_COMMON_CANCEL")}
              actionCancelOnSubmit={closeModal}
              actionSaveLabel={t(selectedAction === "DELETE" ? "ES_EVENT_DELETE" : "CS_COMMON_SUBMIT")}
              actionSaveOnSubmit={handleVendorUpdate}
            >
              <Card style={{ boxShadow: "none" }}>{renderModalContent()}</Card>
            </Modal>
          )}
          {showToast && (
            <Toast
              error={showToast.key === "error" ? true : false}
              label={t(showToast.key === "success" ? `ES_FSM_REGISTRY_${showToast.action}_SUCCESS` : showToast.action)}
              onClose={closeToast}
            />
          )}
          <ActionBar style={{ zIndex: "19" }}>
            {displayMenu ? <Menu localeKeyPrefix={"ES_FSM_REGISTRY_ACTION"} options={["EDIT", "DELETE"]} t={t} onSelect={onActionSelect} /> : null}
            <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
          </ActionBar>
        </React.Fragment>
      ) : (
        <Loader />
      )}
    </React.Fragment>
  );
};

export default VendorDetails;
