import React, { Fragment, useState, useEffect, useLayoutEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import TimePicker from "react-time-picker";
import {
  Card,
  CardLabel,
  CardLabelError,
  DetailsCard,
  TextInput,
  ActionBar,
  SubmitBar,
  Loader,
  Toast,
  StatusTable,
  Row,
  LabelFieldPair,
  Menu,
  Dropdown
} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import CustomTimePicker from "../../components/CustomTimePicker";
import ActionModal from "./ApplicationDetails/Modal/index";

const config = {
  select: (data) => {
    return data.vehicleTrip[0];
  },
};

const FstpOperatorDetails = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const queryClient = useQueryClient();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = Digit.ULBService.getStateId();
  let { id: applicationNos } = useParams();
  const [filters, setFilters] = useState({ applicationNos });
  const [isVehicleSearchCompleted, setIsVehicleSearchCompleted] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [showToast, setShowToast] = useState(null);
  const [wasteCollected, setWasteCollected] = useState(null);
  const [errors, setErrors] = useState([]);
  const [tripStartTime, setTripStartTime] = useState(null);
  const [tripTime, setTripTime] = useState(() => {
    const today = new Date();
    const hour = (today.getHours() < 10 ? "0" : "") + today.getHours();
    const minutes = (today.getMinutes() < 10 ? "0" : "") + today.getMinutes();
    return `${hour}:${minutes}`;
  });
  const [displayMenu, setDisplayMenu] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tripNo, setTripNo] = useState(null);

  const { isLoading, isSuccess, data: vehicle } = Digit.Hooks.fsm.useVehicleSearch({ tenantId, filters, config });
  const { isLoading: isSearchLoading, isIdle, data: { data: { table: tripDetails } = {} } = {} } = Digit.Hooks.fsm.useSearchAll(tenantId, searchParams, null, {
    enabled: !!isVehicleSearchCompleted,
  });
  const [vehicleInfo, setVehicleInfo] = useState(vehicle);

  const workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: tenantId,
    id: applicationNos,
    moduleCode: "FSM_VEHICLE_TRIP",
    role: "FSM_EMP_FSTPO"
  });

  const mutation = Digit.Hooks.fsm.useVehicleUpdate(tenantId);

  useLayoutEffect(() => {
    if (isSuccess) {
      setVehicleInfo(vehicle);
    }
  }, [isSuccess])


  useEffect(() => {
    if (isSuccess) {
      let temp = {}
      const applicationNos = vehicle?.tripDetails?.map((tripData) => tripData.referenceNo).join(",");
      setSearchParams({ applicationNos });
      setIsVehicleSearchCompleted(true);
      vehicle?.tripDetails?.map((i, n) => {
        temp = { ...temp, [n]: vehicle.vehicle.tankCapacity }
        setWasteCollected(temp)
      })
    }
  }, [isSuccess]);

  useEffect(() => {
    switch (selectedAction) {
      case "DECLINEVEHICLE":
        return setShowModal(true);
      case "DISPOSE":
        return handleError()
      default:
        setSelectedAction()
        console.debug("default case");
        break;
    }
  }, [selectedAction]);

  const handleError = () => {
    let bool = true
    let etemp = {}  // a temporary object create and use for validation in this function
    vehicleInfo?.tripDetails?.map((i, n) => {
      const trip = { tripNo: n + 1 }
      i.additionalDetails = trip
      if (!vehicleInfo.vehicle.tankCapacity || i.volume > vehicleInfo.vehicle.tankCapacity) {
        etemp[n] = { ...etemp[n], wasteRecieved: "ES_FSTP_INVALID_WASTE_AMOUNT" }
        setErrors(etemp);
        bool = false
      }
      if (i.itemStartTime === 0) {
        etemp[n] = { ...etemp[n], tripStartTime: "ES_FSTP_INVALID_START_TIME" }
        setErrors(etemp);
        bool = false
      }
      if (n > 0 && vehicleInfo.tripDetails[n - 1].itemEndTime > i.itemStartTime) {
        etemp[n] = { ...etemp[n], tripStartTime: "ES_FSTP_INVALID_START_TIME" }
        setErrors(etemp);
        bool = false
      }
      if (i.itemEndTime === null) {
        etemp[n] = { ...etemp[n], tripTime: "ES_FSTP_INVALID_TRIP_TIME" }
        setErrors(etemp);
        bool = false
      }
      if (i.itemStartTime === i.itemEndTime || i.itemStartTime > i.itemEndTime) {
        etemp[n] = { ...etemp[n], tripTime: "ES_FSTP_INVALID_TRIP_TIME" }
        setErrors(etemp);
        bool = false
      }
    })

    setSelectedAction(null)

    if (bool) {
      setErrors({})
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    const details = {
      vehicleTrip: [vehicleInfo],
      workflow: {
        action: "DISPOSE",
      },
    };
    mutation.mutate(details, {
      onSuccess: handleSuccess,
    });
  };

  const handleDecline = (data) => {
    vehicle.additionalDetails = {
      comments: data?.workflow?.comments,
      vehicleDeclineReason: data?.workflow?.fstpoRejectionReason
    };
    const details = {
      vehicleTrip: vehicle,
      workflow: {
        action: "DECLINEVEHICLE",
      },
    };

    mutation.mutate(details, {
      onSuccess: handleSuccess,
    });
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const handleSuccess = () => {
    if (selectedAction === "DECLINEVEHICLE") {
      setShowModal(false)
    }
    /* Show Toast on success */
    queryClient.invalidateQueries("FSM_VEHICLE_DATA");
    setShowToast({ key: "success", action: `ES_FSM_DISPOSE_UPDATE_SUCCESS` });
    setTimeout(() => {
      closeToast();
      history.push(`/digit-ui/employee/fsm/fstp-inbox`);
    }, 5000);
  };

  const handleChange = (event, index) => {
    let temp = vehicleInfo //temporary object for mirroring vehicle details
    let tempWaste = wasteCollected
    const { name, value } = event.target;
    if (name === "tripTime") {
      setTripTime(value);
    } else if (name === "wasteRecieved") {
      temp["tripDetails"][0].volume = value;
      setVehicleInfo(temp);
      tempWaste = { ...tempWaste, [index]: value }
      setWasteCollected(tempWaste);
    }
  };

  const handleTripChange = (data) => {
    setTripNo(data.name)
  }

  if (isLoading) {
    return <Loader />;
  }

  const vehicleData = [
    {
      title: t("ES_INBOX_VEHICLE_LOG"),
      value: vehicle.applicationNo,
    },
    {
      title: t("ES_INBOX_DSO_NAME"),
      value: vehicle.tripOwner.name,
    },
    {
      title: t("ES_INBOX_VEHICLE_NO"),
      value: vehicle.vehicle?.registrationNumber,
    },
    {
      title: `${t("ES_VEHICLE CAPACITY")}`,
      value: vehicle.vehicle.tankCapacity,
    },
  ];


  const handleTimeChange = (value, index, cb) => {
    let temp = vehicleInfo
    value = String(value)
    const d = new Date();
    if (typeof value === 'string') {
      const timeStamp = Date.parse(new Date(d.toString().split(":")[0].slice(0, -2) + value)) / 1000;
      temp["tripDetails"][index][cb] = timeStamp;
      setVehicleInfo(temp)
    }
  }

  function onActionSelect(action) {
    setSelectedAction(action);
    setDisplayMenu(false);
  }

  const closeModal = () => {
    setSelectedAction(null);
    setShowModal(false);
  };

  return (
    <div>
      {vehicleInfo && vehicleInfo?.tripDetails && vehicleInfo?.tripDetails?.map((i, index) => (
        <Card>
          <StatusTable>
            {vehicleData.map((row, index) => (
              <Row key={row.title} label={row.title} text={row.value || "N/A"} last={false} />
            ))}
            <CardLabelError>{t(errors[index]?.tripStartTime)}</CardLabelError>
            <form>
              <Row
                key={t("ES_VEHICLE_IN_TIME")}
                label={`${t("ES_VEHICLE_IN_TIME")} * `}
                rowContainerStyle={{ marginBottom: "32px" }}
                text={
                  <div>
                    <CustomTimePicker name="tripStartTime" onChange={val => handleTimeChange(val, index, "itemStartTime")} value={tripStartTime} />
                  </div>
                }
              />
              <CardLabelError>{t(errors[index]?.wasteRecieved)}</CardLabelError>
              <Row
                key={t("ES_VEHICLE_SEPTAGE_DUMPED")}
                label={`${t("ES_VEHICLE_SEPTAGE_DUMPED")} * `}
                text={
                  <div>
                    <TextInput
                      type="number"
                      name="wasteRecieved"
                      value={wasteCollected[index]}
                      onChange={val => handleChange(val, index)}
                      style={{ width: "100%", maxWidth: "200px" }}
                    />
                  </div>
                }
              />
              <CardLabelError>{t(errors[index]?.tripTime)}</CardLabelError>
              <Row
                key={t("ES_VEHICLE_OUT_TIME")}
                label={`${t("ES_VEHICLE_OUT_TIME")} * `}
                text={
                  <div>
                    <CustomTimePicker name="tripTime" onChange={val => handleTimeChange(val, index, "itemEndTime")} value={tripTime} />
                  </div>
                }
              />
              <Row
                key={t("ES_VEHICLE_TRIP_NO")}
                label={`${t("ES_VEHICLE_TRIP_NO")} * `}
                text={
                  <div>
                    <Dropdown
                      disable
                      select={handleTripChange}
                      selected={{ "name": `${vehicle["tripDetails"].indexOf(i) + 1} of ${vehicle["tripDetails"].length}` }}
                      t={t}
                      optionKey="name"
                      style={{ maxWidth: '200px' }} />
                  </div>
                }
              >
              </Row>
              {!workflowDetails?.isLoading && workflowDetails?.data?.nextActions?.length > 0 && (
                <ActionBar>
                  {displayMenu && workflowDetails?.data?.nextActions ? (
                    <Menu
                      localeKeyPrefix={""}
                      options={workflowDetails?.data?.nextActions.map((action) => action.action)}
                      t={t}
                      onSelect={onActionSelect}
                    />
                  ) : null}
                  <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
                </ActionBar>
              )}
            </form>
            {showModal ? (
              <ActionModal
                t={t}
                action={selectedAction}
                tenantId={tenantId}
                state={state}
                id={applicationNos}
                closeModal={closeModal}
                submitAction={handleDecline}
                actionData={workflowDetails?.data?.timeline}
              />
            ) : null}
            {/* <LabelFieldPair>
            <CardLabel>{t("ES_VEHICLE_WASTE_RECIEVED")}</CardLabel>
            <div className="field-container">
              <TextInput name="wasteRecieved" value={wasteCollected} onChange={handleChange} />
            </div>
            {errors.wasteRecieved && <CardLabelError>{t(errors.wasteRecieved)}</CardLabelError>}
          </LabelFieldPair>
          <LabelFieldPair>
            <CardLabel>{t("ES_COMMON_TIME")}</CardLabel>
            <div>
              <TimePicker
                className="time-picker"
                name="tripTime"
                onChange={setTripTime}
                value={tripTime}
                locale="en-US"
                format="hh:mm a"
                clearIcon={null}
              />
            </div>
          </LabelFieldPair> */}
          </StatusTable>
        </Card>
      ))}
      <h2 style={{ fontWeight: "bold", fontSize: "16px", marginLeft: "8px", marginTop: "16px" }}>{t("ES_FSTP_OPERATOR_DETAILS_WASTE_GENERATORS")}</h2>
      {isSearchLoading || isIdle ? (
        <Loader />
      ) : (
        <Card>
          <StatusTable>
            {tripDetails?.map((trip, index) => {
              return (
                <>
                  <Row key={index} label={t("CS_FILE_DESLUDGING_APPLICATION_NO")} text={trip.applicationNo} />
                  <Row
                    key={index}
                    label={t("ES_INBOX_LOCALITY")}
                    text={t(`${trip?.tenantId?.toUpperCase()?.split(".")?.join("_")}_REVENUE_${trip?.address?.locality?.code}`)}
                  />
                  <Row key={index} label={t("ES_USAGE")} text={t(`PROPERTYTYPE_MASTERS_${trip.propertyUsage}`)} />
                  <Row key={index} label={t("ES_WASTE_RECIEVED")} text={vehicle.tripDetails[index].volume} />
                </>
              );
            })}
          </StatusTable>
        </Card>
      )}
      {showToast && (
        <Toast
          error={showToast.key === "error" ? true : false}
          label={t(showToast.key === "success" ? showToast.action : `ES_FSM_DISPOSE_UPDATE_FAILURE`)}
          onClose={closeToast}
        />
      )}
    </div>
  );
};

export default FstpOperatorDetails;
