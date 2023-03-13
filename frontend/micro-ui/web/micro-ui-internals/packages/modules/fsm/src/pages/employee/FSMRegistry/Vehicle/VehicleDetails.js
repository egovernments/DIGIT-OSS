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
  CardText,
  AddIcon,
  Dropdown,
} from "@egovernments/digit-ui-react-components";

import { useQueryClient } from "react-query";

import { useHistory, useParams } from "react-router-dom";
import ConfirmationBox from "../../../../components/Confirmation";

const Heading = (props) => {
  return <h1 className="heading-m">{props.label}</h1>;
};
const Close = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const CloseBtn = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick}>
      <Close />
    </div>
  );
};

const VehicleDetails = (props) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = Digit.ULBService.getStateId();
  const { t } = useTranslation();
  const history = useHistory();
  const queryClient = useQueryClient();
  let { id: vehicleNumber } = useParams();
  const [displayMenu, setDisplayMenu] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [config, setCurrentConfig] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [selectedOption, setSelectedOption] = useState({});
  const [vehicleId, setVehicleId] = useState(null);

  const { data: vehicleData, isLoading: isLoading, isSuccess: isVehicleSuccess, error: vehicleError, refetch } = Digit.Hooks.fsm.useVehicleDetails(
    tenantId,
    { registrationNumber: vehicleNumber },
    { staleTime: Infinity }
  );

  useEffect(() => {
    if (!isLoading && vehicleData) {
      setVehicleId(vehicleData?.[0]?.vehicleData?.id);
    }
  }, [vehicleData, isLoading]);

  const { data: vendorData, isLoading: isVendorDataLoading, isSuccess: isVendorDataSuccess, error: vendorDataError } = Digit.Hooks.fsm.useDsoSearch(
    tenantId,
    { sortBy: "name", sortOrder: "ASC", status: "ACTIVE" },
    {}
  );

  useEffect(() => {
    if (vendorData) {
      let vendors = vendorData.map((data) => data.dsoDetails);
      setVendors(vendors);
    }
  }, [vendorData]);

  const {
    isLoading: isUpdateLoading,
    isError: vehicleUpdatError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.fsm.useUpdateVehicle(tenantId);

  const {
    isLoading: isVendorUpdateLoading,
    isError: isVendorUpdateError,
    data: vendorUpdateResponse,
    error: vendorUpdateError,
    mutate: mutateVendor,
  } = Digit.Hooks.fsm.useVendorUpdate(tenantId);

  function onActionSelect(action) {
    setDisplayMenu(false);
    setSelectedAction(action);
  }

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    switch (selectedAction) {
      case "DELETE":
      case "ADD_VENDOR":
      case "EDIT_VENDOR":
      case "DELETE_VENDOR":
        return setShowModal(true);
      case "EDIT":
        return history.push("/digit-ui/employee/fsm/registry/modify-vehicle/" + vehicleNumber);
      default:
        break;
    }
  }, [selectedAction]);

  const closeToast = () => {
    setShowToast(null);
  };

  const closeModal = () => {
    setSelectedAction(null);
    setSelectedOption({})
    setShowModal(false);
  };

  const handleAddVendor = () => {
    let dsoDetails = selectedOption;
    let vehicleDetails = vehicleData?.[0]?.vehicleData;
    vehicleDetails.vendorVehicleStatus = "ACTIVE";

    const formData = {
      vendor: {
        ...dsoDetails,
        vehicles: dsoDetails.vehicles ? [...dsoDetails.vehicles, vehicleDetails] : [vehicleDetails],
      },
    };

    mutateVendor(formData, {
      onError: (error, variables) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: (data, variables) => {
        setShowToast({ key: "success", action: "EDIT_VENDOR" });
        refetch();
        queryClient.invalidateQueries("DSO_SEARCH");
        setTimeout(closeToast, 5000);
      },
    });
    setShowModal(false);
    setSelectedAction(null);
  };

  const handleEditVendor = () => {
    let dsoDetails = selectedOption;
    let vehicleDetails = vehicleData?.[0]?.vehicleData;
    vehicleDetails.vendorVehicleStatus = "ACTIVE";

    const formData = {
      vendor: {
        ...dsoDetails,
        vehicles: dsoDetails.vehicles ? [...dsoDetails.vehicles, vehicleDetails] : [vehicleDetails],
      },
    };

    mutateVendor(formData, {
      onError: (error, variables) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: (data, variables) => {
        setShowToast({ key: "success", action: "EDIT_VENDOR" });
        refetch();
        queryClient.invalidateQueries("DSO_SEARCH");
        setTimeout(closeToast, 5000);
      },
    });
    setShowModal(false);
    setSelectedAction(null);
  };

  const handleDeleteVendor = () => {
    let formData = {};
    let dsoDetails = vehicleData?.[0]?.vendorDetails?.vendor?.[0];
    let getVehicleVendorDetails = dsoDetails?.vehicles;

    getVehicleVendorDetails = getVehicleVendorDetails.map((data) => {
      if (data.id === vehicleId) {
        data.vendorVehicleStatus = "INACTIVE";
      }
      return data;
    });

    formData = {
      vendor: {
        ...dsoDetails,
        vehicles: getVehicleVendorDetails,
      },
    };

    mutateVendor(formData, {
      onError: (error, variables) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: (data, variables) => {
        setShowToast({ key: "success", action: "DELETE_VENDOR" });
        queryClient.invalidateQueries("FSM_VENDOR_SEARCH");
        refetch();
        setTimeout(closeToast, 5000);
      },
    });
    setShowModal(false);
  };

  const handleModalAction = () => {
    switch (selectedAction) {
      case "DELETE":
        return handleDelete();
      case "DELETE_VENDOR":
        return handleDeleteVendor();
      case "ADD_VENDOR":
        return handleAddVendor();
      case "EDIT_VENDOR":
        return handleEditVendor();
      default:
        break;
    }
  };

  const handleDelete = () => {
    let vehicleDetails = vehicleData?.[0]?.vehicleData;
    const formData = {
      vehicle: {
        ...vehicleDetails,
        status: "INACTIVE",
      },
    };

    mutate(formData, {
      onError: (error, variables) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: (data, variables) => {
        setShowToast({ key: "success", action: "DELETE_VEHICLE" });
        queryClient.invalidateQueries("FSM_VEICLES_SEARCH");
        setTimeout(() => {
          closeToast;
          history.push(`/digit-ui/employee/fsm/registry`);
        }, 5000);
      },
    });
    setShowModal(false);
  };

  const renderModalContent = () => {
    if (selectedAction === "DELETE" || selectedAction === "DELETE_VENDOR") {
      return <ConfirmationBox t={t} title={"ES_FSM_REGISTRY_DELETE_TEXT"} />;
    }
    if (selectedAction === "ADD_VENDOR") {
      return (
        <>
          <CardText>{t(`ES_FSM_REGISTRY_SELECT_VENODOR`)}</CardText>
          <Dropdown t={t} option={vendors} value={selectedOption} selected={selectedOption} select={setSelectedOption} optionKey={"name"} />
        </>
      );
    }
    if (selectedAction === "EDIT_VENDOR") {
      return (
        <>
          <CardText>{t(`ES_FSM_REGISTRY_SELECT_VENODOR`)}</CardText>
          <Dropdown t={t} option={vendors} value={selectedOption} selected={selectedOption} select={setSelectedOption} optionKey={"name"} />
        </>
      );
    }
  };

  const isMobile = window.Digit.Utils.browser.isMobile();

  const modalHeading = () => {
    switch (selectedAction) {
      case "DELETE":
      case "DELETE_VENDOR":
        return "ES_FSM_REGISTRY_DELETE_POPUP_HEADER";
      case "ADD_VENDOR":
        return "ES_FSM_REGISTRY_ADD_VENDOR_POPUP_HEADER";
      case "EDIT_VENDOR":
        return "ES_FSM_REGISTRY_ADD_VENDOR_POPUP_HEADER";
      default:
        break;
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      {!isLoading ? (
        <React.Fragment>
          <Header style={{ marginBottom: "16px" }}>{t("ES_FSM_REGISTRY_VEHICLE_DETAILS")}</Header>
          <div style={!isMobile ? { marginLeft: "-15px" } : {}}>
            <Card style={{ position: "relative" }}>
              {vehicleData?.[0]?.employeeResponse?.map((detail, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <CardSectionHeader style={{ marginBottom: "16px", marginTop: "32px" }}>{t(detail.title)}</CardSectionHeader>}
                  <StatusTable>
                    {detail?.values?.map((value, index) => {
                      return value?.type === "custom" ? (
                        <>
                          <div className={`${index === detail?.values?.length - 1 ? "row last" : "row"} border-none`}>
                            <h2>{t(value.title)}</h2>
                            <div className="value" style={{ color: "#f47738", display: "flex" }}>
                              {t(value.value) || "N/A"}
                              {value.value === "ES_FSM_REGISTRY_DETAILS_ADD_VENDOR" && (
                                <span onClick={() => onActionSelect("ADD_VENDOR")}>
                                  <AddIcon className="" fill="#f47738" styles={{ cursor: "pointer", marginLeft: "20px", height: "24px" }} />
                                </span>
                              )}
                              {value.value != "ES_FSM_REGISTRY_DETAILS_ADD_VENDOR" && (
                                <span onClick={() => onActionSelect("EDIT_VENDOR")}>
                                  <EditIcon style={{ cursor: "pointer", marginLeft: "20px" }} />
                                </span>
                              )}
                              {value.value != "ES_FSM_REGISTRY_DETAILS_ADD_VENDOR" && (
                                <span onClick={() => onActionSelect("DELETE_VENDOR")}>
                                  <DeleteIcon className="delete" fill="#f47738" style={{ cursor: "pointer", marginLeft: "20px" }} />
                                </span>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <Row
                          key={t(value.title)}
                          label={t(value.title)}
                          text={t(value.value) || "N/A"}
                          last={index === detail?.values?.length - 1}
                          caption={value.caption}
                          className="border-none"
                          textStyle={value.value === "ACTIVE" ? { color: "green" } : {}}
                        />
                      );
                    })}
                  </StatusTable>
                </React.Fragment>
              ))}
            </Card>
          </div>

          {showModal && (
            <Modal
              headerBarMain={<Heading label={t(modalHeading())} />}
              headerBarEnd={<CloseBtn onClick={closeModal} />}
              actionCancelLabel={t("CS_COMMON_CANCEL")}
              actionCancelOnSubmit={closeModal}
              actionSaveLabel={t(selectedAction === "DELETE" || selectedAction === "DELETE_VENDOR" ? "ES_EVENT_DELETE" : "CS_COMMON_SUBMIT")}
              // actionSaveOnSubmit={handleDelete}
              actionSaveOnSubmit={handleModalAction}
            >
              {selectedAction === "DELETE" || selectedAction === "DELETE_VENDOR" ? (
                renderModalContent()
              ) : (
                <Card style={{ boxShadow: "none" }}>{renderModalContent()}</Card>
              )}
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

export default VehicleDetails;
