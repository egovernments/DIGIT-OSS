
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { createPropertyPayload } from "egov-ui-kit/config/forms/specs/PropertyTaxPay/propertyCreateUtils";
import { setRoute } from "egov-ui-kit/redux/app/actions";
import { hideSpinner } from "egov-ui-kit/redux/common/actions";
import { httpRequest } from "egov-ui-kit/utils/api";
import { getBusinessServiceNextAction } from "egov-ui-kit/utils/PTCommon/FormWizardUtils";
import { get } from "lodash";
import store from "ui-redux/store";
import { getPurpose, PROPERTY_FORM_PURPOSE } from "./formUtils";

export const assessProperty = async (action, props) => {
    const purpose = getPurpose()
    let propertyMethodAction = purpose == PROPERTY_FORM_PURPOSE.REASSESS ? "_update" : '_create';
    const propertyId = getQueryArg(
        window.location.href,
        "propertyId"
    );
    const assessmentId = getQueryArg(
        window.location.href,
        "assessmentId"
    );
    const financialYear = getQueryArg(window.location.href, "FY");
    const tenant = getQueryArg(window.location.href, "tenantId");
    let assessment = {
        "tenantId": tenant,
        "propertyId": propertyId,
        "financialYear": financialYear,
        "assessmentDate": new Date().getTime() - 60000,
        "source": "MUNICIPAL_RECORDS",
        "channel": "CFC_COUNTER",
    }
    const adhocExemptionPenalty = get(props, 'adhocExemptionPenalty', {});
    assessment.additionalDetails = {}
    if (Object.keys(adhocExemptionPenalty).length > 1) {
        assessment.additionalDetails.adhocPenalty = Number(adhocExemptionPenalty.adhocPenalty);
        assessment.additionalDetails.adhocPenaltyReason = adhocExemptionPenalty.adhocPenaltyReason == 'Others' ? adhocExemptionPenalty.adhocOtherPenaltyReason : adhocExemptionPenalty.adhocPenaltyReason;
        assessment.additionalDetails.adhocExemption = Number(adhocExemptionPenalty.adhocExemption);
        assessment.additionalDetails.adhocExemptionReason = adhocExemptionPenalty.adhocExemptionReason == 'Others' ? adhocExemptionPenalty.adhocOtherExemptionReason : adhocExemptionPenalty.adhocExemptionReason;
    }
    if (purpose == PROPERTY_FORM_PURPOSE.REASSESS) {
        let assessments = await getAssessmentDetails();
        if (assessments.Assessments.length > 0) {
            let assessmentResponse = assessments.Assessments[0];
            assessment = assessmentResponse;
            assessment.assessmentDate = new Date().getTime() - 60000;
        }
    }
    try {
        let assessPropertyResponse = await httpRequest(
            `property-services/assessment/${propertyMethodAction}`,
            `${propertyMethodAction}`,
            [],
            {
                Assessment: assessment
            }
        );
        const assessmentNumber = get(assessPropertyResponse, "Assessments[0].assessmentNumber", '');
        routeToAcknowledgement(purpose, 'success', assessment.propertyId, assessment.tenantId, assessmentNumber, assessment.financialYear);
    } catch (e) {
        store.dispatch(
            hideSpinner());
        routeToAcknowledgement(purpose, 'failure', assessment.propertyId, assessment.tenantId, null, assessment.financialYear);
    }
}

const getAssessmentDetails = async () => {
    try {
        const tenantId = getQueryArg(window.location.href, "tenantId");
        const assessmentId = getQueryArg(
            window.location.href,
            "assessmentId"
        );
        let searchPropertyResponse = await httpRequest(
            `property-services/assessment/_search?assessmentNumbers=${assessmentId}&tenantId=${tenantId}`,
            "_search",
            [],
            {

            }, [], {}, true
        );
        return searchPropertyResponse;
    } catch (e) {
        console.log(e.message);
    }
}
export const createProperty = async (Properties, action, props) => {
    const { documentsUploadRedux, newProperties, propertiesEdited } = props;
    const propertyPayload = createPropertyPayload(Properties, documentsUploadRedux, newProperties);
    const propertyMethodAction = action;
    if (action === "_update") {
        const workflow = {
            "businessService": "PT.CREATE",
            "action": getBusinessServiceNextAction('PT.CREATE', null) || "OPEN",
            "moduleName": "PT"
        }
        if (propertyPayload.workflow) {
            propertyPayload.workflow = { ...propertyPayload.workflow, ...workflow }
        } else {
            propertyPayload.workflow = workflow
        }
    }
    try {
        propertyPayload.creationReason = action == '_create' ? 'CREATE' : 'UPDATE';
        const propertyResponse = await httpRequest(
            `property-services/property/${propertyMethodAction}`,
            `${propertyMethodAction}`,
            [],
            {
                Property: propertyPayload
            },
            [],
            {},
            true
        );
        if (propertyResponse && propertyResponse.Properties && propertyResponse.Properties.length) {
            if (propertyResponse.Properties[0].propertyId) {
                const propertyId = get(propertyResponse, "Properties[0].propertyId", '');
                const tenantId = get(propertyResponse, "Properties[0].tenantId", '');
                const acknowldgementNumber = get(propertyResponse, "Properties[0].acknowldgementNumber", '');
                // Navigate to success page
                if (action == '_create') {
                    routeToAcknowledgement(PROPERTY_FORM_PURPOSE.CREATE, 'success', propertyId, tenantId, acknowldgementNumber);
                } else {
                    routeToAcknowledgement(PROPERTY_FORM_PURPOSE.UPDATE, 'success', propertyId, tenantId, acknowldgementNumber);
                }
            }
        }
    } catch (e) {
        store.dispatch(hideSpinner());
        if (action == '_create') {
            routeToAcknowledgement(PROPERTY_FORM_PURPOSE.CREATE, 'failure');
        } else {
            routeToAcknowledgement(PROPERTY_FORM_PURPOSE.UPDATE, 'failure');
        }

    }
}

const routeToAcknowledgement = (purpose, status, propertyId, tenantId, secondNumber, FY) => {

    let routeLink = `/property-tax/pt-acknowledgment?purpose=${purpose}&status=${status}`;
    routeLink = propertyId ? `${routeLink}&propertyId=${propertyId}` : `${routeLink}`;
    routeLink = tenantId ? `${routeLink}&tenantId=${tenantId}` : `${routeLink}`;
    routeLink = secondNumber ? `${routeLink}&secondNumber=${secondNumber}` : `${routeLink}`;
    routeLink = FY ? `${routeLink}&FY=${FY}` : `${routeLink}`;

    store.dispatch(
        setRoute(
            routeLink
        )
    );
}
