import React from 'react'
import SurveyDetailsForm from '../../../components/Survey/SurveyDetailsForm';
import SurveyFormsMaker from '../../../components/Survey/SurveyFormsMaker';

const createNewSurvey = () => {
return(
    <div>
    <SurveyDetailsForm/>
    <SurveyFormsMaker/>
    </div>
);
}

export default createNewSurvey;
