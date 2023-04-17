import { Loader, Modal, FormComposer, Toast } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useQueryClient } from "react-query";
import { UploadPitPhoto } from "@egovernments/digit-ui-react-components";

import { configAssignDso, configCompleteApplication, configReassignDSO, configAcceptDso, configRejectApplication, configScheduleDso, configUpdateTrips, configRejectFstpo } from "../config";

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

const popupActionBarStyles = {
  boxShadow: '0 -2px 8px rgb(0 0 0 / 16%)',
  maxWidth: '480px',
  zIndex: '100',
  left: '0',
  bottom: '0',
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255)',
  padding: '8px',
  position: 'fixed',
  textAlign: 'right',
  display: 'flex',
  justifyContent: 'space-around'
}

const ActionModal = ({ t, action, tenantId, state, id, closeModal, submitAction, actionData, module }) => {
  const mobileView = Digit.Utils.browser.isMobile() ? true : false;
  const { data: dsoData, isLoading: isDsoLoading, isSuccess: isDsoSuccess, error: dsoError } = Digit.Hooks.fsm.useDsoSearch(tenantId, { limit: '-1', status: 'ACTIVE' });
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

  const { data: propertyList, isLoading: isPropertyData, isSuccess: isPropertyDataLoaded } = Digit.Hooks.fsm.useMDMS(
    stateCode,
    "FSM",
    "PropertyType",
    { staleTime: Infinity }
  );

  const { data: propertySubList, isLoading: isPropertySubData, isSuccess: isPropertySubDataLoaded } = Digit.Hooks.fsm.useMDMS(
    stateCode,
    "FSM",
    "PropertySubtype",
    { staleTime: Infinity }
  );

  const { data: pitList, isLoading: isPitData, isSuccess: isPitDataLoaded } = Digit.Hooks.fsm.useMDMS(
    stateCode,
    "FSM",
    "PitType",
    { staleTime: Infinity }
  );

  const { data: Reason, isLoading: isReasonLoading } = Digit.Hooks.fsm.useMDMS(stateCode, "FSM", "Reason", { staleTime: Infinity }, [
    "ReassignReason",
    "RejectionReason",
    "DeclineReason",
    "CancelReason"
  ]);

  const { data: FSTPORejectionReasons, isLoading: isFSTPORejectionReasonData } = Digit.Hooks.fsm.useMDMS(
    stateCode,
    "Vehicle",
    "FSTPORejectionReason",
    { staleTime: Infinity }
  );

  const [dsoList, setDsoList] = useState([]);
  const [vehicleNoList, setVehicleNoList] = useState([]);
  const [config, setConfig] = useState({});
  const [dso, setDSO] = useState(null);
  const [vehicleNo, setVehicleNo] = useState(null);
  const [vehicleMenu, setVehicleMenu] = useState([]);
  const [vehicle, setVehicle] = useState(null);

  const [reassignReason, selectReassignReason] = useState(null);
  const [rejectionReason, setRejectionReason] = useState(null);
  const [declineReason, setDeclineReason] = useState(null);
  const [cancelReason, selectCancelReason] = useState(null);

  const [formValve, setFormValve] = useState(false);

  const [property, setProperty] = useState(null);
  const [propertyMenu, setPropertyMenu] = useState([]);
  const [propertySubType, setPropertySubType] = useState(null);
  const [pitType, setPitType] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fileStoreId, setFileStoreId] = useState();
  const [pitDetail, setPitDetail] = useState();
  const [fstpoRejectionReason, setFstpoRejectionReason] = useState();
  const [noOfTrips, setNoOfTrips] = useState(null);

  const [defaultValues, setDefautValue] = useState({
    capacity: vehicle?.capacity,
    wasteCollected: vehicle?.capacity,
    propertyType: applicationData?.propertyUsage.split('.')[0],
    subtype: applicationData?.propertyUsage,
    pitType: applicationData?.sanitationtype,
    pitDetail: applicationData?.pitDetail,
  });

  useEffect(() => {
    if (isSuccess && isVehicleDataLoaded && applicationData) {
      const [vehicle] = vehicleList.filter((item) => item.code === applicationData.vehicleType);
      let arrayList = defaultValues
      arrayList.capacity = applicationData?.vehicleCapacity;
      arrayList.wasteCollected = applicationData?.vehicleCapacity
      setVehicleMenu([vehicle]);
      setVehicle(vehicle);
      setDefautValue(arrayList);
    }
  }, [isVehicleDataLoaded, isSuccess]);

  useEffect(() => {
    if (isSuccess && isPropertyDataLoaded && applicationData) {
      const [property] = propertyList.filter((item) => item.code === applicationData.propertyUsage.split('.')[0]);
      let arrayList = defaultValues;
      arrayList.propertyType = property;
      setPropertyMenu([property]);
      setProperty(property);
      setDefautValue(arrayList);
    }
  }, [isPropertyDataLoaded, isSuccess]);

  useEffect(() => {
    if (isSuccess && isPropertySubDataLoaded && applicationData) {
      const [propertySub] = propertySubList.filter((item) => item.code === applicationData.propertyUsage);
      let arrayList = defaultValues;
      arrayList.subtype = propertySub;
      setPropertySubType(propertySub);
      setDefautValue(arrayList);
    }
  }, [isPropertySubDataLoaded, isSuccess]);

  useEffect(() => {
    if (isSuccess && isPitDataLoaded && applicationData) {
      const [pitType] = pitList.filter((item) => item.code === applicationData.sanitationtype);
      const pitDetail = applicationData.pitDetail;
      let arrayList = defaultValues;
      arrayList.pitType = pitType;
      arrayList.pitDetail = pitDetail;
      setPitType(pitType);
      setPitDetail(applicationData.pitDetail)
      setDefautValue(arrayList)

    }
  }, [isPitDataLoaded, isSuccess]);

  useEffect(() => {
    if (vehicle && isDsoSuccess) {
      const dsoList = dsoData.filter((dso) => dso?.vehicles?.find((dsoVehicle) => dsoVehicle.type === vehicle.code));
      setDsoList(dsoList);
    }
  }, [vehicle, isDsoSuccess]);

  useEffect(() => {
    if (isSuccess && isDsoSuccess && applicationData && applicationData.dsoId) {
      const [dso] = dsoData.filter((dso) => dso.id === applicationData.dsoId);
      const tempList = dso?.vehicles?.filter((vehicle) => vehicle.capacity == applicationData?.vehicleCapacity);
      const vehicleNoList = tempList.sort((a,b) => (a.registrationNumber > b.registrationNumber ? 1 : -1 ));
      setVehicleNoList(vehicleNoList);
    }
  }, [isSuccess, isDsoSuccess]);

  useEffect(() => {
    reassignReason || (actionData && actionData[0] && actionData[0].comment?.length > 0 && actionData[0]?.status === "DSO_REJECTED")
      ? setFormValve(true)
      : setFormValve(false);
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
    // setVehicleMenu(dsoDetails.vehicles);
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

  function selectReason(reason) {
    setFstpoRejectionReason(reason);
  }

  function getImage(e) {
    setImageFile(e.target.files);
  }


  function addCommentToWorkflow(state, workflow, data) {
    workflow.comments = data.comments ? state.code + "~" + data.comments : state.code;
  }

  const handleUpload = (ids) => {
    if (!fileStoreId || fileStoreId.length < 4) {
      setFileStoreId(ids);
    } else {
    }
    // Digit.SessionStorage.set("PGR_CREATE_IMAGES", ids);
  };

  function submit(data) {
    const workflow = { action: action };

    if (dso) applicationData.dsoId = dso.id;
    if (vehicleNo && action === "ACCEPT") applicationData.vehicleId = vehicleNo.id;
    if (vehicleNo && action === "DSO_ACCEPT") applicationData.vehicleId = vehicleNo.id;
    if (vehicle && action === "ASSIGN") applicationData.vehicleType = vehicle.code;
    if (data.date) applicationData.possibleServiceDate = new Date(`${data.date}`).getTime();
    if (data.desluged) applicationData.completedOn = new Date(data.desluged).getTime();
    if (data.wasteCollected) applicationData.wasteCollected = data.wasteCollected;

    if (data.pitDetail) applicationData.pitDetail.height = Number(data.pitDetail.height);
    if (data.pitDetail) applicationData.pitDetail.width = Number(data.pitDetail.width);
    if (data.pitDetail) applicationData.pitDetail.diameter = Number(data.pitDetail.diameter);
    if (data.pitDetail) applicationData.pitDetail.length = Number(data.pitDetail.length);
    if (data.pitType) applicationData.sanitationtype = data.pitType.code;
    if (data.subtype && typeof (data.subtype) === "object") applicationData.propertyUsage = data.subtype.code;
    if (data.subtype && typeof (data.subtype) === "string") applicationData.propertyUsage = data.subtype;
    if (data.noOfTrips) applicationData.noOfTrips = data.noOfTrips;

    if (fileStoreId) {
      if (applicationData.pitDetail.additionalDetails && applicationData.pitDetail.additionalDetails.fileStoreId) {
        applicationData.pitDetail.additionalDetails.fileStoreId = { ...applicationData.pitDetail.additionalDetails.fileStoreId, FSM_DSO: fileStoreId };
      } else {
        applicationData.pitDetail.additionalDetails = { fileStoreId: { FSM_DSO: fileStoreId } };
      }
    }
    if (data.noOfTrips) applicationData.noOfTrips = Number(data.noOfTrips);
    if (action === "REASSING") applicationData.vehicleId = null;

    if (reassignReason) addCommentToWorkflow(reassignReason, workflow, data);
    if (rejectionReason) addCommentToWorkflow(rejectionReason, workflow, data);
    if (declineReason) addCommentToWorkflow(declineReason, workflow, data);
    if (cancelReason) addCommentToWorkflow(cancelReason, workflow, data);
    if (fstpoRejectionReason && data.comments) workflow.comments = data.comments;
    if (fstpoRejectionReason) workflow.fstpoRejectionReason = fstpoRejectionReason?.code;

    submitAction({ fsm: applicationData, workflow });
  }
  useEffect(() => {
    switch (action) {
      case "UPDATE":
      case "SCHEDULE":
      case "ES_FSM_SCHEDULE":
        setFormValve(true);
        return setConfig(
          configUpdateTrips({
            t,
            noOfTrips: applicationData?.noOfTrips,
            action,
          })
        );
      case "DSO_ACCEPT":
      case "ACCEPT":
        //TODO: add accept UI
        setFormValve(vehicleNo ? true : false);
        return setConfig(
          configAcceptDso({
            t,
            dsoData,
            dso,
            vehicle,
            vehicleCapacity: applicationData?.vehicleCapacity,
            noOfTrips: applicationData?.noOfTrips,
            vehicleNo,
            vehicleNoList,
            selectVehicleNo,
            action,
          })
        );

      case "ASSIGN":
      case "GENERATE_DEMAND":
      case "FSM_GENERATE_DEMAND":
        setFormValve(dso ? true : false);
        return setConfig(
          configAssignDso({
            t,
            dsoData,
            dso,
            selectDSO,
            vehicleMenu,
            vehicle,
            vehicleCapacity: applicationData?.vehicleCapacity,
            selectVehicle,
            action,
          })
        );
      case "REASSIGN":
      case "REASSING":
      case "FSM_REASSING":
        dso &&
          (reassignReason || (actionData && actionData[0] && actionData[0].comment?.length > 0 && actionData[0]?.status === "DSO_REJECTED"))
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
            vehicleCapacity: applicationData?.vehicleCapacity,
            selectVehicle,
            reassignReasonMenu: Reason?.ReassignReason,
            reassignReason,
            selectReassignReason,
            action,
            showReassignReason:
              actionData && actionData[0] && actionData[0].comment?.length > 0 && actionData[0]?.status === "DSO_REJECTED" ? false : true,
          })
        );
      case "COMPLETE":
      case "COMPLETED":
        setFormValve(true);
        return setConfig(configCompleteApplication({ t, vehicle, vehicleCapacity: applicationData?.vehicleCapacity, noOfTrips: applicationData?.noOfTrips, applicationCreatedTime: applicationData?.auditDetails?.createdTime, action, module }));
      case "SUBMIT":
      case "FSM_SUBMIT":
        return history.push("/digit-ui/employee/fsm/modify-application/" + applicationNumber);
      case "DECLINE":
      case "DSO_REJECT":
        //declinereason
        setFormValve(declineReason ? true : false);
        return setConfig(
          configRejectApplication({
            t,
            rejectMenu: Reason?.DeclineReason,
            setTrips: setNoOfTrips,
            trips: applicationData?.noOfTrips,
            setReason: setDeclineReason,
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
      // case "SCHEDULE":
      // case "ES_FSM_SCHEDULE":
        // setFormValve(true);
        // return setConfig(
          // configScheduleDso({
            // t,
            // rejectMenu: Reason?.DeclineReason,
            // setReason: setDeclineReason,
            // reason: declineReason,
            // applicationCreatedTime: applicationData?.auditDetails?.createdTime,
            // vehicle,
            // vehicleCapacity: applicationData?.vehicleCapacity,
            // action,
            // noOfTrips: applicationData?.noOfTrips
          // })
        // );

      case "PAY":
      case "ADDITIONAL_PAY_REQUEST":
      case "FSM_PAY":
        return history.push(`/digit-ui/employee/payment/collect/FSM.TRIP_CHARGES/${applicationNumber}`);
      case "DECLINEVEHICLE":
        setFormValve(fstpoRejectionReason ? true : false);
        return setConfig(
          configRejectFstpo({
            t,
            rejectMenu: FSTPORejectionReasons,
            selectReason,
            reason: fstpoRejectionReason,
            action,
          })
        );
      default:
        break;
    }
  }, [action, reassignReason, isDsoLoading, dso, vehicleMenu, rejectionReason, vehicleNo, vehicleNoList, Reason, fstpoRejectionReason]);

  const hiddenFileInput = React.useRef(null);

  return action && config.form && !isDsoLoading && !isReasonLoading && isVehicleDataLoaded ? (
    <Modal
      popupStyles={mobileView ? { height: 'fit-content', minHeight: '100vh' } : { height: "fit-content" }}
      headerBarMain={<Heading label={t(config.label.heading)} />}
      headerBarEnd={<CloseBtn onClick={closeModal} />}
      actionCancelLabel={t(config.label.cancel)}
      actionCancelOnSubmit={closeModal}
      actionSaveLabel={t(config.label.submit)}
      actionSaveOnSubmit={() => { }}
      formId="modal-action"
      isDisabled={!formValve}
      popupModuleMianStyles={mobileView ? { paddingBottom: '60px' } : {}}
      popupModuleActionBarStyles={mobileView ? popupActionBarStyles : {}}
    >
      <FormComposer
        config={config.form}
        noBoxShadow
        inline
        childrenAtTheBottom
        onSubmit={submit}
        formId="modal-action"
        defaultValues={defaultValues}
      >
      </FormComposer>
      {action === "COMPLETED" ? <UploadPitPhoto
        header=""
        tenantId={tenantId}
        cardText=""
        onPhotoChange={handleUpload}
        uploadedImages={null} /> : null
      }

      {/* {toastError && <Toast {...toastError} />} */}
    </Modal>
  ) : (
    <Loader />
  );
};

export default ActionModal;
