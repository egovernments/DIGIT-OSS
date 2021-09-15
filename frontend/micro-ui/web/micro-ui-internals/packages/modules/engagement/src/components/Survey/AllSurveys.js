import React from 'react'
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

const AllSurveys = () => {
    const { t } = useTranslation();
    const history = useHistory();
    return (
        <div>
            List of Surveys.
            <span>
                <button
                onClick={()=>{history.push(`/digit-ui/employee/engagement/surveys/create`)}}
                >Create New Survey</button>
            </span>
        </div>
    )
}

export default AllSurveys;
