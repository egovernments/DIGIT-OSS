import React, { useEffect, useState,useRef,Fragment } from "react";
import { useTranslation } from "react-i18next";
import { ActionBar, Header, Loader, SubmitBar,Card,CardSubHeader,CardSectionHeader,LinkLabel, CardLabel, CardHeader, CardText} from "@egovernments/digit-ui-react-components";
import { Modal,Dropdown, Row, StatusTable } from "@egovernments/digit-ui-react-components";
import { dropRightWhile } from "lodash";


const WSFeeEstimation = ({ wsAdditionalDetails }) => {
    const { t } = useTranslation();
    const isPaid = (wsAdditionalDetails?.additionalDetails?.appDetails?.applicationStatus === 'CONNECTION_ACTIVATED' || wsAdditionalDetails?.additionalDetails?.appDetails?.applicationStatus === 'PENDING_FOR_CONNECTION_ACTIVATION') ? true : false;
    
    const [popup,showPopUp]=useState(false);
    const [selectedPenalityReason,setSelectedPenalityReason]=useState(null);
    const [selectedRebateReason,setSelectedRebateReason]=useState(null);
  
  
    const first_temp=useRef();
    const second_temp=useRef();
    const third_temp=useRef();
    const fourth_temp=useRef();
    
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
      function change(){
        var total_amount=ptCalculationEstimateData?.Calculation[0]?.totalAmount
        const [first,second]=[parseInt(first_temp.current.value),parseInt(second_temp.current.value)];
          if((selectedPenalityReason && first>0)/* &&(!selectedRebateReason) */){
            if(selectPenalityReason.value!=='Others'){
              if(first<total_amount){
                var additionalPenality=first;
                ptCalculationEstimateData.Calculation[0].taxHeadEstimates[6]={
                  "taxHeadCode": "WS_TIME_PENALTY",
                  "estimateAmount": ptCalculationEstimateData.Calculation[0].taxHeadEstimates[6]?.estimateAmount+first,
                  "category": "TAX"
              }
              AssessmentData.additionalDetails={
                "adhocPenalty":additionalPenality,
                "adhocPenaltyReason":selectedPenalityReason.value,
              }
              ptCalculationEstimateData.Calculation[0].totalAmount=ptCalculationEstimateData?.Calculation[0]?.totalAmount+first;
                 }
                 else{
                   alert("Penality cannot exceed total amount");
                 }
            }
            else{
              if(first<total_amount){
                var additionalPenality=first;
                ptCalculationEstimateData.Calculation[0].taxHeadEstimates[6]={
                  "taxHeadCode": "WS_TIME_PENALTY",
                  "estimateAmount": ptCalculationEstimateData.Calculation[0].taxHeadEstimates[6]?.estimateAmount+first,
                  "category": "TAX"
              }
              AssessmentData.additionalDetails={
                "adhocPenalty":additionalPenality,
                "adhocPenaltyReason":fourth_temp.current.value,
              }
              ptCalculationEstimateData.Calculation[0].totalAmount=ptCalculationEstimateData?.Calculation[0]?.totalAmount+first;
                 }
                 else{
                   alert("Penality cannot exceed total amount");
                 }
            }
          } 
   

         if((selectedRebateReason && second) /* && (!selectedPenalityReason) */){
          if(selectedRebateReason.value!=="Others"){
            if(second>0){
              if(second<total_amount){
                ptCalculationEstimateData.Calculation[0].taxHeadEstimates[5]={
                  "taxHeadCode": "WS_TIME_REBATE",
                  "estimateAmount": ptCalculationEstimateData.Calculation[0].taxHeadEstimates[5]?.estimateAmount+second,
                  "category": "TAX"
              }
              AssessmentData.additionalDetails={
                "adhocExemption":second,
                "adhocExemptionReason":selectedRebateReason.value,
              }
              ptCalculationEstimateData.Calculation[0].totalAmount=ptCalculationEstimateData?.Calculation[0]?.totalAmount-second;
                 }
                 else{
                   alert( "Adhoc Exemption cannot be greater than the estimated tax for the given property");
                 }
            }
          }
          else{
            if(second>0){
              if(second<total_amount){
                ptCalculationEstimateData.Calculation[0].taxHeadEstimates[5]={
                  "taxHeadCode": "WS_TIME_REBATE",
                  "estimateAmount": ptCalculationEstimateData.Calculation[0].taxHeadEstimates[5]?.estimateAmount-second,
                  "category": "TAX"
              }
              AssessmentData.additionalDetails={
                "adhocExemption":second,
                "adhocExemptionReason":third_temp.current.value,
              }
              ptCalculationEstimateData.Calculation[0].totalAmount=ptCalculationEstimateData?.Calculation[0]?.totalAmount-second;
                 }
                 else{
                   alert( "Adhoc Exemption cannot be greater than the estimated tax for the given property");
                 }
            }
          }
        }
        setSelectedPenalityReason(null);
        setSelectedRebateReason(null);
        showPopUp(false);
      }
      
      const Penality_menu=[
        {
          title:"WS_PENDING_DUES_FROM_EARLIER",
          value:"Pending dues from earlier",
        },
        {
          title:"WS_MISCALCULATION_OF_EARLIER_ASSESSMENT",
          value:"Miscalculation of earlier Assessment",
        },
        {
          title:"WS_ONE_TIME_PENALITY",
          value:"One time penality",
        },
        {
          title:"WS_OTHERS",
          value:"Others",
        },
        ]
        const Rebate_menu=[
          {
            title:"WS_ADVANCED_PAID_BY_CITIZEN_EARLIER",
            value:"Advanced Paid By Citizen Earlier",
          },
          {
            title:"WS_REBATE_PROVIDED_BY_COMMISSIONER_EO",
            value:"Rebate provided by commissioner/EO",
          },
          {
            title:"WS_ADDITIONAL_AMOUNT_CHARGED_FROM_THE_CITIZEN",
            value:"Additional amount charged from the citizen",
          },
          {
            title:"WS_OTHERS",
            value:"Others",
          },
          ]
        const selectPenalityReason=(reason)=>{
          setSelectedPenalityReason(reason);
        }
        const selectRebateReason=(reason)=>{
          setSelectedRebateReason(reason);
        }
    return (
        <Fragment>
            <div style={{ lineHeight: "19px", maxWidth: "950px", minWidth: "280px" }}>
                {wsAdditionalDetails?.additionalDetails?.values &&
                    <StatusTable>
                        <div>
                            {wsAdditionalDetails?.additionalDetails?.values?.map((value, index) => {
                                return <Row className="border-none" key={`${value.title}`} label={`${t(`${value.title}`)}`} text={value?.value ? value?.value : ""} />
                            })}
                        </div>
                        <hr style={{ border: "1px solid #D6D5D4", color: "#D6D5D4", margin: "16px 0px" }}></hr>
                        <div>
                            <Row className="border-none" key={`WS_COMMON_TOTAL_AMT`} label={`${t(`WS_COMMON_TOTAL_AMT`)}`} text={wsAdditionalDetails?.additionalDetails?.data?.totalAmount} />
                            <Row className="border-none" key={`CS_INBOX_STATUS_FILTER`} label={`${t(`CS_INBOX_STATUS_FILTER`)}`} text={isPaid ? t("WS_COMMON_PAID") : t("WS_COMMON_NOT_PAID")} textStyle={!isPaid ? { color: "#D4351C" }: {color : "#00703C"}} />
                        </div>
                    </StatusTable>}
                    <LinkLabel onClick={()=>{showPopUp(true)}}>{t("WS_ADD_REBATE_PENALITY")}</LinkLabel>
            </div> 
            {  popup && <Modal
          headerBarMain={<Heading label={t("WS_ADD_REBATE_PENALITY")}/>}
          headerBarEnd={<CloseBtn onClick={()=> {showPopUp(false), ptCalculationEstimateData.Calculation[0] = ptCalculationEstimateDataCopy; setSelectedPenalityReason(null); setSelectedRebateReason(null);}}/>}
          actionCancelLabel={t("WS_CANCEL")}
          actionCancelOnSubmit={()=>{ptCalculationEstimateData.Calculation[0] = ptCalculationEstimateDataCopy; setSelectedPenalityReason(null);setSelectedRebateReason(null); showPopUp(false)}}
          actionSaveLabel={t("WS_ADD")}
          actionSaveOnSubmit={()=>(change())}
          hideSubmit={false}
          >
      {
      <div>
        <Card>
        <CardSectionHeader>{t("WS_AD_PENALTY")}</CardSectionHeader>
            <CardLabel>
            {t("WS_TX_HEADS")}
            </CardLabel>
            <div className="field">
              <div className="field-container">
                <div className="text-input field">
                <Dropdown
                 isMandatory
                 option={Penality_menu}
                 optionKey="value"
                 select={selectPenalityReason}
                 selected={selectedPenalityReason}
                 isPropertyAssess={true}
                 t={t}
                 />
                </div>
              </div>
            </div>  
            {selectedPenalityReason && selectedPenalityReason.value==="Others" && <div className="field">
            <CardLabel>{t("WS_REASON")}</CardLabel>
              <div className="field-container">
                <div className="text-input field">
                <input type="type" className="employee-card-input false focus-visible undefined" ref={fourth_temp}/>
                </div>
              </div>
            </div>}      
            <CardLabel>{t("WS_HEAD_AMT")}</CardLabel>
            <div className="field">
              <div className="field-container">
                <div className="text-input field">
                <input key="firstTemp" type="number" className="employee-card-input false focus-visible undefined" ref={first_temp}/>
                </div>
                {/* <TextInput
                t={t}
                type={"text"}
                isMandatory={false}
                optionKey="i18nKey"
                name="first_temp"
                value={first_temp}
                onChange={setFirstTemp}
                />  */}
              </div>
            </div>                  
        </Card>
        <Card>
        <CardSectionHeader>{t("WS_AD_REBATE")}</CardSectionHeader>
            <CardLabel>{t("WS_TX_HEADS")}</CardLabel>
            <div className="field">
              <div className="field-container">
                <div className="text-input field">
                <Dropdown
                 isMandatory
                 option={Rebate_menu}
                 optionKey="value"
                 select={selectRebateReason}
                 selected={selectedRebateReason}
                 isPropertyAssess={true}
                 t={t}
                 />
                </div>
              </div>
            </div>    
            {selectedRebateReason && selectedRebateReason.value==="Others" && <div className="field">
            <CardLabel>{t("WS_REASON")}</CardLabel>
              <div className="field-container">
                <div className="text-input field">
                <input type="type" className="employee-card-input false focus-visible undefined" ref={third_temp}/>
                </div>
              </div>
            </div>}  
            <CardLabel>{t("WS_HEAD_AMT")}</CardLabel>
            <div className="field">
              <div className="field-container">
                <div className="text-input field">
                <input type="number" className="employee-card-input false focus-visible undefined" ref={second_temp}/>
                </div>
              </div>
            </div> 
        </Card>
      </div>
    } </Modal>}
        </Fragment>
    )
}

export default WSFeeEstimation;