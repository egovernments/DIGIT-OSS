import { Clock } from '@egovernments/digit-ui-react-components'
import React from 'react'
import {format, formatDistanceToNow} from "date-fns";
import { useTranslation } from 'react-i18next';

const SurveyListCard = ({header, about, activeTime, postedAt, responseStatus, hasResponded, onCardClick }) => {
    
    const {t} = useTranslation()
    return (
        <div className="WhatsNewCard" onClick={onCardClick}>
            <h2>{header}</h2>
            <p>{about}</p>
            <div className="surveyListclockDiv">
                <Clock /> <span>{`Active till ${format(new Date(activeTime), "do MMM HH:mm")}`}</span>
            </div>
            <div className="surveyListstatus">
                <p>{formatDistanceToNow(new Date(postedAt),{addSuffix:true})}</p>
                {/* <span className={hasResponded ? 'surveyLisResponded' : 'surveyLisNotResponded'}>{t(responseStatus)}</span> */}
                <span className={responseStatus ==="CS_SURVEY_RESPONDED"?'surveyLisResponded':'surveyLisNotResponded'}>{t(responseStatus)}</span>
            </div>
        </div>
    )
}

export default SurveyListCard;