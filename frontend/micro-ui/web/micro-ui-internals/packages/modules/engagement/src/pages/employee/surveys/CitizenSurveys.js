import React from 'react'


const CitizenSurveys = () => {
    return (
        <div>
            <span>
                <button
                className=""
                onClick={()=>{history.push(`/digit-ui/employee/engagement/surveys/create`)}}
                >Create New Survey</button>
            </span>
        </div>
    )
}

export default CitizenSurveys;
