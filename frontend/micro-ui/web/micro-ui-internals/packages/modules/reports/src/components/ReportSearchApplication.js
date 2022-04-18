import React, { Fragment,useState,useEffect } from 'react'
import SearchFormFieldsComponent from './SearchFormFieldsComponent'
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from 'react-i18next';
import {
    CloseSvg,
    SearchForm,
    Table,
    Card,
    SearchAction,
    PopUp,
    DetailsCard,
    Loader,
    Toast,
} from "@egovernments/digit-ui-react-components";


const ReportSearchApplication = ({onSubmit,isLoading,data}) => {
    const {t} = useTranslation()
    const { register, control, handleSubmit, setValue, getValues, reset, formState } = useForm()

    useEffect(()=>{
        if (formState.isSubmitSuccessful) {
            let resetObj = {}
            data?.reportDetails?.searchParams?.map(el => resetObj[el?.name] = "")
            reset(resetObj)
        }
    },[formState])
    
    const searchFormFieldsComponentProps = { formState, Controller, register, control, t,reset,data };
    return (
        <React.Fragment>
            {isLoading ? <Loader /> : 
            <SearchForm onSubmit={onSubmit} handleSubmit={handleSubmit}>
                <SearchFormFieldsComponent {...searchFormFieldsComponentProps} />
            </SearchForm>}
            
        </React.Fragment>
    )
}

export default ReportSearchApplication