import React,{ useState,useEffect } from 'react'
import { Loader } from "../Loader"
import configEstimateModal from './config/configEstimateModal'
import Modal from '../../hoc/Modal'
import { FormComposer } from '../../hoc/FormComposer'


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


const WorkflowPopup = ({ applicationDetails,...props}) => {
    const {
        action,
        tenantId,
        t,
        closeModal,
        submitAction,
        businessService,
        moduleCode
    } = props

    const enableAssignee = Digit?.Customizations?.["commonUiConfig"]?.enableHrmsSearch(businessService,action)
    // const [approvers,setApprovers] = useState([])
    const [config,setConfig] = useState(null)
    const [modalSubmit,setModalSubmit] = useState(true)
    //hrms user search
    let { isLoading: isLoadingHrmsSearch, isError, error, data: assigneeOptions } = Digit.Hooks.hrms.useHRMSSearch({ roles: action?.assigneeRoles?.toString(), isActive: true }, tenantId, null, null, { enabled: action?.assigneeRoles?.length > 0 && enableAssignee });
    
    assigneeOptions = assigneeOptions?.Employees
    assigneeOptions?.map(emp => emp.nameOfEmp = emp?.user?.name || t("ES_COMMON_NA"))
    
    useEffect(() => {
      if(businessService==="muster-roll-approval" && action.action==="APPROVE"){
        setModalSubmit(false)
      }
    }, [businessService])
    

    useEffect(() => {
      if(assigneeOptions?.length >=0){
      setConfig(
        configEstimateModal(t,action,assigneeOptions,businessService, moduleCode)
      )
      }
      else {
        setConfig(
            configEstimateModal(t, action, undefined, businessService, moduleCode)
        )
      }
      
    }, [assigneeOptions])
    
    const _submit = (data) => {
        //here call an UICustomizaton fn to update the payload for update call(businessService based)
        const updatePayload = Digit?.Customizations?.["commonUiConfig"]?.updatePayload(applicationDetails, data, action, businessService)
        //calling submitAction 
        submitAction(updatePayload, action)

    }

    const modalCallBack = (setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
        Digit?.Customizations?.["commonUiConfig"]?.enableModalSubmit(businessService,action,setModalSubmit,formData)
    }

    if(isLoadingHrmsSearch) return <Loader />
    
    return action && config?.form ? (
        <Modal
            headerBarMain={<Heading label={t(config.label.heading)} />}
            headerBarEnd={<CloseBtn onClick={closeModal} />}
            actionCancelLabel={t(config.label.cancel)}
            actionCancelOnSubmit={closeModal}
            actionSaveLabel={t(config.label.submit)}
            actionSaveOnSubmit={() => { }}
            formId="modal-action"
            isDisabled = {!modalSubmit}
        >
            <FormComposer
                config={config.form}
                noBoxShadow
                inline
                childrenAtTheBottom
                onSubmit={_submit}
                defaultValues={{}}
                formId="modal-action"
                onFormValueChange={modalCallBack}
            />

        </Modal>
    ) : (
        <Loader />
    );
}

export default WorkflowPopup