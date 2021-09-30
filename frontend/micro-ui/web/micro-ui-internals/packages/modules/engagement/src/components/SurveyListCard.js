import { Clock } from '@egovernments/digit-ui-react-components'
import React from 'react'

const SurveyListCard = ({header, about, activeTime, day, statusData, status }) => {
    return (
        <div className="WhatsNewCard">
            <h2>{header}</h2>
            <p>{about}</p>
            <div className="surveyListclockDiv">
                <Clock /> <span>{activeTime}</span>
            </div>
            <div className="surveyListstatus">
                <p>{day}</p>
                <span className={status ? 'surveyLisResponded' : 'surveyLisNotResponded'}>{statusData}</span>
            </div>
        </div>
    )
}

export default SurveyListCard
