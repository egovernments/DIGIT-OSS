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
  CardText
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

const VehicleDetails = (props) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = Digit.ULBService.getStateId();
  const { t } = useTranslation();
  const history = useHistory();
  const queryClient = useQueryClient();
  let { id: vehicleId } = useParams();
  const [displayMenu, setDisplayMenu] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [config, setCurrentConfig] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(null);

  const { data: vehicleData, isLoading: isLoading, isSuccess: isVehicleSuccess, error: vehicleError, refetch } = Digit.Hooks.fsm.useVehicleDetails(
    tenantId,
    { registrationNumber: vehicleId },
    { staleTime: Infinity }
  );

  const { data: dsoData, isLoading: isVendorLoading, isSuccess: isVendorSuccess, error: vendorError } = Digit.Hooks.fsm.useDsoSearch(
    tenantId,
    { vehicleIds: vehicleId },
    { staleTime: Infinity }
  );

  const {
    isLoading: isUpdateLoading,
    isError: vehicleUpdatError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.fsm.useUpdateVehicle(tenantId);

  function onActionSelect(action) {
    setDisplayMenu(false);
    setSelectedAction(action);
  }

  useEffect(()=>{
    refetch();
  },[])

  useEffect(() => {
    switch (selectedAction) {
      case "DELETE":
        return setShowModal(true);
      case "EDIT":
        return history.push("/digit-ui/employee/fsm/registry/modify-vehicle/" + vehicleId);
      default:
        break;
    }
  }, [selectedAction]);

  const closeToast = () => {
    setShowToast(null);
  };

  const closeModal = () => {
    setSelectedAction(null)
    setShowModal(false);
  };

  const handleDelete = () => {
    let vehicleDetails = vehicleData?.[0]?.vehicleData;
    const formData = {
      vehicle: {
        ...vehicleDetails,
        status: "INACTIVE"
      }
    };

    mutate(formData, {
      onError: (error, variables) => {
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: (data, variables) => {
        setShowToast({ key: "success", action: 'DELETE_VEHICLE' });
        queryClient.invalidateQueries("FSM_VEICLES_SEARCH");
        setTimeout(() => {
          closeToast
          history.push(`/digit-ui/employee/fsm/registry`)
        }, 5000);
      },
    });
    setShowModal(false)
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      {!isLoading ? (
        <React.Fragment>
          <Header style={{ marginBottom: "16px" }}>{t("ES_FSM_REGISTRY_VEHICLE_DETAILS")}</Header>
          <Card style={{ position: "relative" }}>
            {vehicleData?.[0]?.employeeResponse?.map((detail, index) => (
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
                </StatusTable>
              </React.Fragment>
            ))}

          </Card>
          {showModal &&
            <Modal
              headerBarMain={<Heading label={t('ES_FSM_REGISTRY_DELETE_POPUP_HEADER')} />}
              headerBarEnd={<CloseBtn onClick={closeModal} />}
              actionCancelLabel={t("CS_COMMON_CANCEL")}
              actionCancelOnSubmit={closeModal}
              actionSaveLabel={t('ES_EVENT_DELETE')}
              actionSaveOnSubmit={handleDelete}
            >
              <Card style={{ boxShadow: "none" }}>
                <CardText>{t(`ES_FSM_REGISTRY_DELETE_TEXT`)}</CardText>
              </Card>
            </Modal>
          }
          {showToast && (
            <Toast
              error={showToast.key === "error" ? true : false}
              label={t(showToast.key === "success" ? `ES_FSM_REGISTRY_${showToast.action}_SUCCESS` : showToast.action)}
              onClose={closeToast}
            />
          )}
          <ActionBar style={{ zIndex: '19' }}>
            {displayMenu ? (
              <Menu
                localeKeyPrefix={"ES_FSM_REGISTRY_ACTION"}
                options={['EDIT', 'DELETE']}
                t={t}
                onSelect={onActionSelect}
              />
            ) : null}
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
