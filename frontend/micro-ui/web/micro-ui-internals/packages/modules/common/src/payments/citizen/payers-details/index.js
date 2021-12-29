import React, { useState, useEffect } from "react";
import {
  Header,
  Card,
  RadioButtons,
  SubmitBar,
  BackButton,
  CardLabel,
  CardLabelDesc,
  CardSectionHeader,
  InfoBanner,
  Loader,
  TextInput,
  MobileNumber
} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { useParams, useHistory, useLocation, Redirect } from "react-router-dom";

const SelectPaymentType = (props) => {
  

  const optionFirst = 'I am making the payment as the owner/consumer of the service'
  const optionSecound = 'I am making the payment on behalf of the owner/consumer of the service'

  const userInfo = Digit.UserService.getUser();
  const payersActiveName=userInfo?.info?.name;
  const payersActiveMobileNumber=userInfo?.info?.mobileNumber;

  const { t } = useTranslation();
  const history = useHistory();
  const { state, ...location } = useLocation();
  const { consumerCode, businessService, paymentAmt } = useParams();
  const { workflow: wrkflow, tenantId: _tenantId } = Digit.Hooks.useQueryParams();
  const [bill, setBill] = useState(state ?.bill);
  const tenantId = state ?.tenantId || _tenantId || Digit.UserService.getUser().info ?.tenantId;

  const { data, isLoading } = state ?.bill ? { isLoading: false } : Digit.Hooks.useFetchPayment({ tenantId, businessService, consumerCode });


  const billDetails = bill ?.billDetails ?.sort((a, b) => b.fromPeriod - a.fromPeriod) ?.[0] || [];
  const Arrears =
    bill ?.billDetails
      ?.sort((a, b) => b.fromPeriod - a.fromPeriod)
        ?.reduce((total, current, index) => (index === 0 ? total : total + current.amount), 0) || 0;


  const [paymentType, setPaymentType] = useState(optionFirst);
  const [payersName, setPayersName] = useState('')
  const [payersMobileNumber, setPayersMobileNumber] = useState('')
  const { control, handleSubmit } = useForm();
  const [canSubmit, setCanSubmit] = useState(false);
  const [mobileNumberError, setmobileNumberError] = useState(null);


  useEffect(() => {
    if (!bill && data) {
      let requiredBill = data.Bill.filter((e) => e.consumerCode == consumerCode)[0];
      setBill(requiredBill);
    }
  }, [isLoading]);

  


  const onChangePayersMobileNumber = (e) => {
 
    setmobileNumberError(null)
    let validation = "^\\d{10}$";
    if(!e.match(validation))
    {
      setmobileNumberError("CORE_COMMON_PHONENO_INVALIDMSG");
      setCanSubmit(false)
    }
    setPayersMobileNumber(e);
   
   e.length==10 && payersName!='' ? setCanSubmit(true) : setCanSubmit(false) 

  }

  const onChangePayersName = (value) => {
    setPayersName(value)
    value.length!==0 &&  mobileNumberError!='CORE_COMMON_PHONENO_INVALIDMSG' && payersName!=''  ? setCanSubmit(true) : setCanSubmit(false) 
  }

  const onSubmit = () => {
     history.push(`/digit-ui/citizen/payment/collect/${businessService}/${consumerCode}`, {
      paymentAmount: paymentAmt,
      tenantId: billDetails.tenantId,
      name: paymentType !== optionSecound ? payersActiveName : payersName,
      mobileNumber: paymentType !== optionSecound ? payersActiveMobileNumber : payersMobileNumber,
    }); 

  };


  /* if (isLoading || paymentLoading) {
    return <Loader />;
  } */

  return (
    <React.Fragment>
      <BackButton>{t("CS_COMMON_BACK")}</BackButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/*  <Header>{t("PAYMENT_CS_HEADER")}</Header> */}
        <Header>Payer's Details</Header>
        <Card>
        <span className='card-label-error'>{t(mobileNumberError)}</span>
          <RadioButtons
            selectedOption={paymentType}
            onSelect={setPaymentType}
            options={[optionFirst, optionSecound]}
          />
          <div style={{ position: "relative" }}>

            {paymentType !== optionFirst ? (
              <div style={{ position: "relative" }}>
                <span>
                  <span>Payer's Mobile Number</span>
                  <MobileNumber
                    style={{ width: "35%" }}
                    // className="text-indent-xl"
                    onChange={onChangePayersMobileNumber}
                    value={payersMobileNumber}

                  />
                 
                </span>
                <span>
                  <span>Payer's Name</span>
                  <TextInput
                    style={{ width: "40%" }}
                   
                    onChange={(e) => onChangePayersName(e.target.value)}
                    value={payersName}
                  
                  />
                </span>

              </div>
            ) : (
                null
              )}

          </div>
          <SubmitBar label='NEXT'  disabled={paymentType !== optionSecound ? false : !canSubmit} submit={true} />
        </Card>
      </form>

    </React.Fragment>
  );
};

export default SelectPaymentType;