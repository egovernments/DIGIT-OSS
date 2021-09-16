import { DatePicker, Dropdown, RadioButtons, TextArea, TextInput } from '@egovernments/digit-ui-react-components'
import React, { useState } from 'react'
import TimePicker from 'react-time-picker'

const answerTypeEnum = {
    SHORT_ANSWER:"Short Answer",
    LONG_ANSWER:"Paragraph",
    MULTIPLCE_CHOICE:"Multiple Choice",
    CHECKBOXES: "Check Boxes",
    DROPDOWN:"Dropdown",
    DATE:"Date",
    TIME:"Time"
}

const dropdownOptions = [{
    title:'Short_Answer', value:"Short Answer"
}]

const NewSurveyForm = ({index, question, answerType, required, options}) => {
    const [answerTypeOption, setAnswerTypeOption] = useState(answerType) 
    const [surveyQuestion, setSurveyQuestion] = useState(question);
    //options, label for checkbox and radio buttons

    const renderAnswerComponent = (type) =>{
        switch(type){
            case answerTypeEnum.LONG_ANSWER :
                return <TextArea/>
            case answerTypeEnum.DATE :
                return <DatePicker/>
            case answerTypeEnum.TIME :
                return <TimePicker/>
            case answerTypeEnum.MULTIPLCE_CHOICE:
                return;            
            default :
                return <TextInput/>
        }
    }

    return (
        <div className="newSurveyForm_wrapper">
            <div className="newSurveyForm_questions">
                <TextInput 
                name="surveyQuestionField"
                value={surveyQuestion}
                onChange={(ev) => setSurveyQuestion(ev.target.value)}
                />
                <Dropdown
                    option={dropdownOptions}
                    select={setAnswerTypeOption}
                    selected={answerTypeOption}  
                    optionKey="value"
                />
            </div>
            <div className="newSurveyForm_answer">
                {renderAnswerComponent(answerTypeOption)}
            </div>
            <div className="newSurveyForm_seprator"/>
            <div>
                <div>Required</div>
                <div>Dustbin Icon</div>
            </div>
        </div>
    )
}

export default NewSurveyForm
