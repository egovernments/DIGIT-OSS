import { Loader, Modal, FormComposer, Toast } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useQueryClient } from "react-query";

import { configAssignDso, configCompleteApplication, configReassignDSO, configAcceptDso, configRejectApplication } from "../config";

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

const ActionModal = ({ t, action, tenantId, state, id, closeModal, submitAction, actionData }) => {
  const { data: dsoData, isLoading: isDsoLoading, isSuccess: isDsoSuccess, error: dsoError } = Digit.Hooks.fsm.useDsoSearch(tenantId);
  const { isLoading, isSuccess, isError, data: applicationData, error } = Digit.Hooks.fsm.useSearch(
    tenantId,
    { applicationNos: id },
    {
      staleTime: Infinity,
      select: (details) => {
        let { additionalDetails } = details;

        const parseTillObject = (str) => {
          if (typeof str === "object") return str;
          else return parseTillObject(JSON.parse(str));
        };

        additionalDetails = parseTillObject(additionalDetails);
        return { ...details, additionalDetails };
      },
    }
  );
  const client = useQueryClient();
  const stateCode = Digit.ULBService.getStateId();
  const { data: vehicleList, isLoading: isVehicleData, isSuccess: isVehicleDataLoaded } = Digit.Hooks.fsm.useMDMS(
    stateCode,
    "Vehicle",
    "VehicleType",
    { staleTime: Infinity }
  );
  const [dsoList, setDsoList] = useState([]);
  const [vehicleNoList, setVehicleNoList] = useState([]);
  const [config, setConfig] = useState({});
  const [dso, setDSO] = useState(null);
  const [vehicleNo, setVehicleNo] = useState(null);
  const [vehicleMenu, setVehicleMenu] = useState([]);
  const [vehicle, setVehicle] = useState(null);
  const [defaultValues, setDefautValue] = useState({
    capacity: vehicle?.capacity,
    wasteCollected: vehicle?.capacity,
  });
  // const [toastError, setToastError] = useState(false);
  const { data: Reason, isLoading: isReasonLoading } = Digit.Hooks.fsm.useMDMS(stateCode, "FSM", "Reason", { staleTime: Infinity }, [
    "ReassignReason",
    "RejectionReason",
    "DeclineReason",
    "CancelReason",
  ]);

  const [reassignReason, selectReassignReason] = useState(null);
  const [rejectionReason, setRejectionReason] = useState(null);
  const [declineReason, setDeclineReason] = useState(null);
  const [cancelReason, selectCancelReason] = useState(null);

  const [formValve, setFormValve] = useState(false);

  useEffect(() => {
    if (isSuccess && isVehicleDataLoaded) {
      const [vehicle] = vehicleList.filter((item) => item.code === applicationData.vehicleType);
      setVehicleMenu([vehicle]);
      setVehicle(vehicle);
      setDefautValue({
        capacity: vehicle?.capacity,
        wasteCollected: vehicle?.capacity,
      });
    }
  }, [isVehicleDataLoaded, isSuccess]);

  useEffect(() => {
    if (vehicle && isDsoSuccess) {
      const dsoList = dsoData.filter((dso) => dso.vehicles.find((dsoVehicle) => dsoVehicle.type === vehicle.code));
      setDsoList(dsoList);
    }
  }, [vehicle, isDsoSuccess]);

  useEffect(() => {
    if (isSuccess && isDsoSuccess && applicationData.dsoId) {
      const [dso] = dsoData.filter((dso) => dso.id === applicationData.dsoId);
      const vehicleNoList = dso.vehicles.filter((vehicle) => vehicle.type === applicationData.vehicleType);
      setVehicleNoList(vehicleNoList);
    }
  }, [isSuccess, isDsoSuccess]);

  useEffect(() => {
    reassignReason || (actionData && actionData[0] && actionData[0].comment?.length > 0) ? setFormValve(true) : setFormValve(false);
  }, [reassignReason]);

  useEffect(() => {
    setFormValve(rejectionReason ? true : false);
  }, [rejectionReason]);

  useEffect(() => {
    setFormValve(declineReason ? true : false);
  }, [declineReason]);

  useEffect(() => {
    setFormValve(cancelReason ? true : false);
  }, [cancelReason]);

  function selectDSO(dsoDetails) {
    setDSO(dsoDetails);
  }

  function selectVehicleNo(vehicleNo) {
    setVehicleNo(vehicleNo);
  }

  function selectVehicle(value) {
    setVehicle(value);
    setDefautValue({
      capacity: value?.capacity,
      wasteCollected: value?.capacity,
    });
  }

  function addCommentToWorkflow(state, workflow, data) {
    workflow.comments = data.comments ? state.code + "~" + data.comments : state.code;
  }

  function submit(data) {
    const workflow = { action: action };

    if (dso) applicationData.dsoId = dso.id;
    if (vehicleNo && action === "ACCEPT") applicationData.vehicleId = vehicleNo.id;
    if (vehicleNo && action === "DSO_ACCEPT") applicationData.vehicleId = vehicleNo.id;
    if (vehicle && action === "ASSIGN") applicationData.vehicleType = vehicle.code;
    if (data.date) applicationData.possibleServiceDate = new Date(`${data.date}`).getTime();
    if (data.desluged) applicationData.completedOn = new Date(data.desluged).getTime();
    if (data.wasteCollected) applicationData.wasteCollected = data.wasteCollected;
    if (reassignReason) addCommentToWorkflow(reassignReason, workflow, data);
    if (rejectionReason) addCommentToWorkflow(rejectionReason, workflow, data);
    if (declineReason) addCommentToWorkflow(declineReason, workflow, data);
    if (cancelReason) addCommentToWorkflow(cancelReason, workflow, data);

    submitAction({ fsm: applicationData, workflow });
  }
  useEffect(() => {
    switch (action) {
      case "DSO_ACCEPT":
      case "ACCEPT":
        setFormValve(vehicleNo ? true : false);
        return setConfig(
          configAcceptDso({
            t,
            dsoData,
            dso,
            vehicle,
            vehicleNo,
            vehicleNoList,
            selectVehicleNo,
            action,
          })
        );

      case "ASSIGN":
      case "GENERATE_DEMAND":
      case "FSM_GENERATE_DEMAND":
        setFormValve(dso && vehicle ? true : false);
        return setConfig(
          configAssignDso({
            t,
            dsoData,
            dso,
            selectDSO,
            vehicleMenu,
            vehicle,
            selectVehicle,
            action,
          })
        );
      case "REASSIGN":
      case "REASSING":
      case "FSM_REASSING":
        dso && vehicle && (reassignReason || (actionData && actionData[0] && actionData[0].comment?.length > 0))
          ? setFormValve(true)
          : setFormValve(false);
        return setConfig(
          configReassignDSO({
            t,
            dsoData,
            dso,
            selectDSO,
            vehicleMenu,
            vehicle,
            selectVehicle,
            reassignReasonMenu: Reason?.ReassignReason,
            reassignReason,
            selectReassignReason,
            action,
            showReassignReason: actionData && actionData[0] && actionData[0].comment?.length > 0 ? false : true,
          })
        );
      case "COMPLETE":
      case "COMPLETED":
        setFormValve(true);
        return setConfig(configCompleteApplication({ t, vehicle, applicationCreatedTime: applicationData?.auditDetails?.createdTime, action }));
      case "SUBMIT":
      case "FSM_SUBMIT":
        return history.push(`/${window?.contextPath}/employee/fsm/modify-application/` + applicationNumber);
      case "DECLINE":
      case "DSO_REJECT":
        //declinereason
        setFormValve(declineReason ? true : false);
        return setConfig(
          configRejectApplication({
            t,
            rejectMenu: Reason?.DeclineReason,
            setReason: setDeclineReason,
            reason: declineReason,
            action,
          })
        );
      case "REJECT":
      case "SENDBACK":
        // rejectionReason
        setFormValve(rejectionReason ? true : false);
        return setConfig(
          configRejectApplication({
            t,
            rejectMenu: Reason?.RejectionReason,
            setReason: setRejectionReason,
            reason: rejectionReason,
            action,
          })
        );
      case "CANCEL":
        ///cancellreason
        setFormValve(cancelReason ? true : false);
        return setConfig(
          configRejectApplication({
            t,
            rejectMenu: Reason?.CancelReason,
            setReason: selectCancelReason,
            reason: cancelReason,
            action,
          })
        );

      case "PAY":
      case "ADDITIONAL_PAY_REQUEST":
      case "FSM_PAY":
        return history.push(`/${window?.contextPath}/employee/payment/collect/FSM.TRIP_CHARGES/${applicationNumber}`);
      default:
        break;
    }
  }, [action, isDsoLoading, dso, vehicleMenu, rejectionReason, vehicleNo, vehicleNoList, Reason]);

  return action && config.form && !isDsoLoading && !isReasonLoading && isVehicleDataLoaded ? (
    <Modal
      headerBarMain={<Heading label={t(config.label.heading)} />}
      headerBarEnd={<CloseBtn onClick={closeModal} />}
      actionCancelLabel={t(config.label.cancel)}
      actionCancelOnSubmit={closeModal}
      actionSaveLabel={t(config.label.submit)}
      actionSaveOnSubmit={() => {}}
      formId="modal-action"
      isDisabled={!formValve}
    >
      <FormComposer
        config={config.form}
        noBoxShadow
        inline
        childrenAtTheBottom
        onSubmit={submit}
        defaultValues={defaultValues}
        formId="modal-action"
      />
      {/* {toastError && <Toast {...toastError} />} */}
    </Modal>
  ) : (
    <Loader />
  );
};

export default ActionModal;
