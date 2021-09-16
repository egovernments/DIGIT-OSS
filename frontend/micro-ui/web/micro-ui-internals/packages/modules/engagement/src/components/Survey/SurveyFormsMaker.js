import { CustomButton } from '@egovernments/digit-ui-react-components'
import React, { useReducer } from 'react'
import NewSurveyForm from './NewSurveyForm'

const defaultFormsConfig = {
    question:"",
    answerType:"Short Answer",
    required:false,
    options:[],
    index:1
}

const initialSurveyFormState = {
 formsConfig:[defaultFormsConfig],
 formsCount:1,   
}



const surveyFormReducer = (state, {type, payload}) =>{
    switch(type){
        case "addNewForm" :
            return {
                ...state,
                formsConfig:[...state.formsConfig, defaultFormsConfig],
                formsCount : state.formsCount + 1
            }
        case "updateForm" : 
            const remainingFormsConfig = state.formsConfig.filter(({index}) => index !== payload.index)   
            return{
                ...state,
                formsConfig:[...remainingFormsConfig, payload],
            }

    }
}

const SurveyFormsMaker = ({formsConfig}) => {

    const [surveyState, dispatch] = useReducer(surveyFormReducer, initialSurveyFormState);

    const renderPreviewForms = () =>{
        return surveyState.formsConfig.map((config)=>(<NewSurveyForm {...config} />))
    }

    return (
        <div>
            {renderPreviewForms()}
            <div className="surveyForm_addForm">
                <CustomButton/>
            </div>
        </div>
    )
}

export default SurveyFormsMaker;
