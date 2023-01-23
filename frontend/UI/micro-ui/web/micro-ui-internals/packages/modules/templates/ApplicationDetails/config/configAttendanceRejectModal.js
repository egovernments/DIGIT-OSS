import { LabelFieldPair,CardLabel} from '@egovernments/digit-ui-react-components';
import React from 'react'

const configAttendanceRejectModal = ({
    t,
    empDepartment,
    empDesignation,
    empName
}) => {

    const fieldLabelStyle = {
        "display" : "grid",
        "gridTemplateColumns" : "60% 1fr"
    };

    return {
        label: {
            heading: t("ATM_PROCESSINGMODAL_HEADER"),
            submit: t("ATM_CONFIRM_REJECT"),
            cancel: t("CS_COMMON_CANCEL"),
        },
        form: [
            {
                body: [
                    {
                        withoutLabel:true,
                        populators: <LabelFieldPair style={fieldLabelStyle}>
                            <CardLabel style={{ "fontSize": "16px", fontWeight: "bold", width: "100%" }}>{t("ATM_DEPARTMENT")}</CardLabel>
                            <CardLabel style={{ width: "100%" }}>{empDepartment}</CardLabel>
                        </LabelFieldPair>,
                    },
                    {
                        withoutLabel:true,
                        populators: <LabelFieldPair style={fieldLabelStyle}>
                            <CardLabel style={{ "fontSize": "16px", fontWeight: "bold", width: "100%" }}>{t("ATM_DESIGNATION")}</CardLabel>
                            <CardLabel style={{ width: "100%" }}>{empDesignation}</CardLabel>
                        </LabelFieldPair>,
                    },
                    {
                        withoutLabel:true,
                        populators: <LabelFieldPair  style={fieldLabelStyle}>
                            <CardLabel style={{ "fontSize": "16px", fontWeight: "bold", width: "100%" }}>{t("ATM_REJECTED_BY")}</CardLabel>
                            <CardLabel style={{ width: "100%" }}>{empName}</CardLabel>
                        </LabelFieldPair>,
                    },
                    {
                        label: t("WF_COMMON_COMMENTS"),
                        type: "textarea",
                        key: "org_name",
                        populators: {
                            name: "comments",
                        },
                    },
                ]
            }
        ]
    }

}

export default configAttendanceRejectModal