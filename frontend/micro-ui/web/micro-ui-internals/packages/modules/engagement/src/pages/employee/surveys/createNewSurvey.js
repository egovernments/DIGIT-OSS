import React from 'react'
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { surveyFormConfig } from '../../../config/survey-create';

const createNewSurvey = () => {
    const { t } = useTranslation();
    const history = useHistory();

    const [canSubmit, setSubmitValve] = useState(false);

    const onFormValueChange = (setValue, formData, formState) => {
        if (
            formData?.surveyTitle &&
            formData?.surveyDescription &&
            formData?.ULB?.length
        ) {
            setSubmitValve(true);
        } else {
            setSubmitValve(false);
        }
    };

    const onSubmit = (data) => {
        if(!data || !Object.keys(data).length) return;
       const {surveyTitle, surveyDescription, ULB} = data;
        const surveyFormDetails = {
            surveyTitle,
            surveyDescription,
            tenantIds: ULB.map((e) => e.code),
        };

        history.push("/digit-ui/employee/engagement/surveys/status", { surveyFormDetails });
    };

    return (
        <FormComposer
            heading={t("ES_ENGAGEMENT_NEW_SURVEY")}
            label={t("ES_ENGAGEMENT_CREATE_SURVEY")}
            config={surveyFormConfig}
            onSubmit={onSubmit}
            fieldStyle={{}}
            onFormValueChange={onFormValueChange}
            isDisabled={!canSubmit}
        />
    );
}

export default createNewSurvey;
