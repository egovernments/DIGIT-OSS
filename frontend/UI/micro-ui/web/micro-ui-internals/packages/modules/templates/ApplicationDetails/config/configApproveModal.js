import { Dropdown } from '@egovernments/digit-ui-react-components';
import React, { useState } from 'react'

const configApproveModal = ({
    t,
    action
}) => {
    if(action?.action === 'ADMINSANCTION'){
    return {
        label: {
            heading: `WORKS_APPROVE_ESTIMATE`,
            submit: `WORKS_APPROVE_ESTIMATE`,
            cancel: "CS_COMMON_CANCEL",
        },
        form: [
            {
                body: [
                    {
                        label: t("WF_COMMON_COMMENTS"),
                        type: "textarea",
                        populators: {
                            name: "comments",
                        },
                    },
                ]
            }
        ]
    }

    }else
    return {
        label: {
            heading: `WORKS_APPROVE_LOI`,
            submit: `WORKS_APPROVE_LOI`,
            cancel: "CS_COMMON_CANCEL",
        },
        form: [
            {
                body: [
                    {
                        label: t("WF_COMMON_COMMENTS"),
                        type: "textarea",
                        populators: {
                            name: "comments",
                        },
                    },
                ]
            }
        ]
    }
}

export default configApproveModal