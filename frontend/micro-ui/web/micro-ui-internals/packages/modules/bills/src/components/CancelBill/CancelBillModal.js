import React,{useMemo, useState} from "react";
import { Modal, Card, CardText,CardLabelError, TextArea ,Dropdown, Loader} from "@egovernments/digit-ui-react-components";
import { Controller, useForm,useWatch } from "react-hook-form";

const Heading = (props) => {
    return <h1 className="heading-m">{props.t("ABG_CANCEL_BILL")}</h1>;
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



const CancelBillModal = ({ t, closeModal, actionCancelLabel, actionCancelOnSubmit, actionSaveLabel, actionSaveOnSubmit,onSubmit }) => {
    

    const { isLoading: isReasonsLoading, data: reasonOptions, isFetched: isReasonsFetched } = Digit.Hooks.useCustomMDMS(
        Digit.ULBService.getStateId(),
        "common-masters",
        [
            {
                name: "CancelCurrentBillReasons",
            },
        ],
        {
            select: (data) => {
                const formattedData = data?.["common-masters"]?.["CancelCurrentBillReasons"]
                return formattedData;
            },
        }
    );

    const getOptionsArr = (options) => {
        const arr = options?.map(option => {
            const obj = {
                code:option?.code,
                active:option?.active,
                message:`BC_REASON_${option?.code}`
            }
            return obj
        })
        return arr
    }
    const showReasonOptions = useMemo(()=>{return getOptionsArr(reasonOptions)},[reasonOptions])


    const { control, handleSubmit,formState } = useForm();
    const formErrors = formState?.errors;

    
    const selectedReason = useWatch({ control: control, name: "reason", defaultValue: "" });
    //const [othersSelected,setOthersSelected] = useState(false)
    let othersSelected = false
    if(selectedReason?.code?.includes("OTHER")) othersSelected = true

    return (
        <Modal
            headerBarMain={<Heading t={t}/>}
            headerBarEnd={<CloseBtn onClick={closeModal} />}
            actionCancelLabel={t(actionCancelLabel)}
            actionCancelOnSubmit={actionCancelOnSubmit}
            actionSaveLabel={t(actionSaveLabel)}
            actionSaveOnSubmit={handleSubmit(actionSaveOnSubmit)}
            formId="modal-action"
        >
            <Card style={{ boxShadow: "none" }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {!isReasonsLoading && isReasonsFetched ?<span>
                        <label>{`${t("BC_RECEIPT_CANCELLATION_REASON_LABEL")}*`}</label>
                        <Controller
                            control={control}
                            rules={{ required: t("REQUIRED_FIELD") }}
                            name="reason"
                            render={(props) => (
                                <Dropdown
                                    option={showReasonOptions}
                                    select={(e) => {
                                        props.onChange(e);
                                    }}
                                    optionKey="message"
                                    onBlur={props.onBlur}
                                    t={t}
                                    selected={props.value}
                                />
                            )}
                        />
                        {formErrors && formErrors?.reason && formErrors?.reason?.type === "required" && (
                            <CardLabelError>{t(`CS_COMMON_REQUIRED_ERROR`)}</CardLabelError>)}
                    </span>:<Loader/>}
                    {selectedReason?.code==="OTHER" && <span className="surveyformfield">
                        <label>{`${t("BC_MORE_DETAILS_LABEL")}*`}</label>
                        <Controller
                            control={control}
                            rules={othersSelected?{ required: t("REQUIRED_FIELD") }:{}}
                            name="details"
                            render={({ onChange }) => <TextArea disabled={othersSelected?false:true} onChange={onChange} />}
                        />
                        {formErrors && formErrors?.details && formErrors?.details?.type === "required" && (
                            <CardLabelError>{t(`CS_COMMON_REQUIRED_ERROR`)}</CardLabelError>)}
                    </span>}
                </form>
            </Card>
        </Modal>
    );
};
export default CancelBillModal;
