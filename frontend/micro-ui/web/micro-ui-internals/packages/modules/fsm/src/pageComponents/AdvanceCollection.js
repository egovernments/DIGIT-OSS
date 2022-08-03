import React, { useEffect, useState } from "react";
// import { getVehicleType } from "../../utils";
import { LabelFieldPair, CardLabel, TextInput, Dropdown, Loader, CardLabelError } from "@egovernments/digit-ui-react-components";
import { useLocation, useParams } from "react-router-dom";

const AdvanceCollection = ({ t, config, onSelect, formData = {}, userType, FSMTextFieldStyle }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = Digit.ULBService.getStateId();
  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");
  let { id: applicationNumber } = useParams();
  const userInfo = Digit.UserService.getUser();
  const { isLoading: applicationLoading, isError, data: applicationData, error } = Digit.Hooks.fsm.useSearch(
    tenantId,
    { applicationNos: applicationNumber, uuid: userInfo.uuid },
    { staleTime: Infinity }
  );

  const [vehicle, setVehicle] = useState({ label: formData?.tripData?.vehicleCapacity });
  const [billError, setError] = useState(false);

  const { isLoading: isVehicleMenuLoading, data: vehicleData } = Digit.Hooks.fsm.useMDMS(state, "Vehicle", "VehicleType", { staleTime: Infinity });

  const { data: dsoData, isLoading: isDsoLoading, isSuccess: isDsoSuccess, error: dsoError } = Digit.Hooks.fsm.useDsoSearch(tenantId, { limit: -1, status: 'ACTIVE' });

  const { data: paymentData, isLoading } = Digit.Hooks.fsm.useMDMS(state, "FSM", "PaymentType");

  const [vehicleMenu, setVehicleMenu] = useState([]);
  const [paymentType, setPaymentType] = useState({});


  // useEffect(() => {
  //   if (dsoData && vehicleData) {
  //     const allVehicles = dsoData.reduce((acc, curr) => {
  //       return curr.vehicles && curr.vehicles.length ? acc.concat(curr.vehicles) : acc;
  //     }, []);

  //     const cpacityMenu = Array.from(new Set(allVehicles.map(a => a.capacity)))
  //       .map(capacity => allVehicles.find(a => a.capacity === capacity))

  //     setVehicleMenu(cpacityMenu);
  //   }
  // }, [dsoData, vehicleData]);

  useEffect(() => {
    if (!isLoading && paymentData) {
      const preFilledPaymentType = paymentData.filter(
        (paymentType) => paymentType.code === (formData?.paymentPreference?.code || formData?.paymentPreference)
      )[0];
      preFilledPaymentType ? setPaymentType(preFilledPaymentType) : setPaymentType(paymentData.find((i) => i.code === "POST_PAY"))
    }
  }, [formData, formData?.paymentPreference?.code, formData?.paymentPreference, paymentData]);

const {code}=paymentType;

  const inputs = [
    
    {
      label: "Advance Collection",
      type: "text",
      name: "amount",
      validation: {
        isRequired: true,
        title: t("ES_APPLICATION_BILL_SLAB_ERROR"),
      },
      default: formData?.tripData?.amount,
      disable: false,
      isMandatory: true,
    },
  ];

  function setTripNum(value) {
    // onSelect(config.key, { ...formData[config.key], noOfTrips: value });
  }

  function selectVehicle(value) {
    setVehicle({ label: value.capacity });
    onSelect(config.key, { ...formData[config.key], vehicleType: value });
  }

  function setValue(object) {
    onSelect(config.key, { ...formData[config.key], ...object });
  }
  // useEffect(() => {
  //   (async () => {

  //     if (formData?.tripData?.vehicleType !== vehicle) {
  //       setVehicle({ label: formData?.tripData?.vehicleType?.capacity });
  //     }

  //     if (formData?.propertyType && formData?.subtype && formData?.address && formData?.tripData?.vehicleType?.capacity) {
  //       const capacity = formData?.tripData?.vehicleType.capacity;
  //       const { slum: slumDetails } = formData.address;
  //       const slum = slumDetails ? "YES" : "NO";
  //       const billingDetails = await Digit.FSMService.billingSlabSearch(tenantId, {
  //         propertyType: formData?.subtype,
  //         capacity,
  //         slum,
  //       });

  //       const billSlab = billingDetails?.billingSlab?.length && billingDetails?.billingSlab[0];
  //       if (billSlab?.price) {
  //         setValue({
  //           amountPerTrip: billSlab.price,
  //           amount: billSlab.price * formData.tripData.noOfTrips,
  //         });
  //         setError(false);
  //       } else {
  //         setValue({
  //           amountPerTrip: "",
  //           amount: "",
  //         });
  //         setError(true);
  //       }
  //     }
  //   })();
  // }, [formData?.propertyType, formData?.subtype, formData?.address, formData?.tripData?.vehicleType?.capacity, formData?.tripData?.noOfTrips]);

  return isVehicleMenuLoading && isDsoLoading ? (
    <Loader />
  ) : (
    <div>
      { code==="PRE_PAY"?inputs?.map((input, index) => (
        <LabelFieldPair key={index}>
          <CardLabel className="card-label-smaller">
            {t(input.label)}
            {input.isMandatory ? " * " : null}
          </CardLabel>
          <div className="field">
            <TextInput
              type={input.type}
              // onChange={(e) => setTripNum(e.target.value)}
              key={input.name}
              // value={input.default ? input.default : formData && formData[config.key] ? formData[config.key][input.name] : null}
              {...input.validation}
              disable={input.disable}
              style={FSMTextFieldStyle}
            />
          </div>
        </LabelFieldPair>
      )):null}
      {billError ? <CardLabelError style={{ width: "100%", textAlign: "center" }}>{t("ES_APPLICATION_BILL_SLAB_ERROR")}</CardLabelError> : null}
    </div>
  );
};

export default AdvanceCollection;