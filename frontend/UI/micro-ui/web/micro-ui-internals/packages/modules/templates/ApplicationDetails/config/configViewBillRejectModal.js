import React from 'react'
import { LabelFieldPair,CardLabel} from '@egovernments/digit-ui-react-components';

const configViewBillRejectModal = ({
    t,
}) => {

    const fieldLabelStyle = {
        "display" : "grid",
        "gridTemplateColumns" : "60% 1fr"
    };

    return {
        label: {
            heading: t("EXP_PROCESSINGMODAL_HEADER"),
            submit: t("EXP_CONFIRM_REJECT"),
            cancel: t("CS_COMMON_CANCEL"),
        },
        form: [
            {
                body: [
                    {
                        withoutLabel:true,
                        populators: <LabelFieldPair style={fieldLabelStyle}>
                            <CardLabel style={{ "fontSize": "16px", fontWeight: "bold", width: "100%" }}>{t("EXP_DEPARTMENT")}</CardLabel>
                            <CardLabel style={{ width: "100%" }}>Engineering</CardLabel>
                        </LabelFieldPair>,
                    },
                    {
                        withoutLabel:true,
                        populators: <LabelFieldPair  style={fieldLabelStyle}>
                            <CardLabel style={{ "fontSize": "16px", fontWeight: "bold", width: "100%" }}>{t("EXP_DESIGNATION")}</CardLabel>
                            <CardLabel style={{ width: "100%" }}>Junior Engineer</CardLabel>
                        </LabelFieldPair>,
                    },
                    {
                        withoutLabel:true,
                        populators: <LabelFieldPair  style={fieldLabelStyle}>
                            <CardLabel style={{ "fontSize": "16px", fontWeight: "bold", width: "100%" }}>{t("EXP_REJECTED_BY")}</CardLabel>
                            <CardLabel style={{ width: "100%" }}>{"RASHMI"}</CardLabel>
                        </LabelFieldPair>,
                    },
                    {
                        label: t("WF_COMMON_COMMENTS"),
                        type: "textarea",
                        populators: {
                            name: "comments",
                        },
                    },
                ]
            }
        ],
        defaultValues : {
            comments : "",
        }
    }
}

export default configViewBillRejectModal