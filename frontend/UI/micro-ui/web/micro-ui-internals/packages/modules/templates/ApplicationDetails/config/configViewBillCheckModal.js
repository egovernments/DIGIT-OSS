import { Dropdown, Loader } from '@egovernments/digit-ui-react-components';
import React, { useState } from 'react'

const configViewBillCheckModal = ({
    t,
    approvers,
    selectedApprover,
    setSelectedApprover,
    designation,
    selectedDesignation,
    setSelectedDesignation,
    department,
    selectedDept,
    setSelectedDept,
    approverLoading = false,
}) => {

    let checkConditions = true
   

    if (designation?.length === 0 || department?.length === 0) return {}

    return {
        label: {
            heading: t("EXP_FORWARD_BILL_FOR_APPROVAL"),
            submit: t("EXP_FORWARD_BILL_FOR_APPROVAL"),
            cancel: t("CS_COMMON_CANCEL"),
        },
        form: [
            {
                body: [
                    {
                        label: !checkConditions ? null : t("WORKS_APPROVER_DEPT"),
                        placeholder: !checkConditions ? null : t("WF_ASSIGNEE_NAME_PLACEHOLDER"),
                        isMandatory: true,
                        type: "goToDefaultCase",
                        populators: !checkConditions ? null : (
                            <Dropdown
                                name={"department"}
                                option={department}
                                autoComplete="off"
                                optionKey="i18nKey"
                                id="sdf"
                                select={(val) => {
                                    setSelectedDept(val)
                                    setSelectedApprover("")
                                    //setValue()
                                }}
                                selected={selectedDept}
                                t={t}
                            />
                        ),
                    },
                    {
                        label: !checkConditions ? null : t("WORKS_APPROVER_DESIGNATION"),
                        //placeholder: !checkConditions ? null : t("WF_ASSIGNEE_NAME_PLACEHOLDER"),
                        isMandatory: true,
                        type: "goToDefaultCase",
                        name: "designation",
                        populators: !checkConditions ? null : (
                            <Dropdown
                                name={"designation"}
                                option={designation}
                                autoComplete="off"
                                optionKey="i18nKey"
                                id="name2"
                                select={(val) => {
                                    setSelectedDesignation(val)
                                    setSelectedApprover("")
                                    //resetting approver dropdown when dept/designation changes
                                }}
                                selected={selectedDesignation}
                                t={t}
                            />
                        ),
                    },
                    {
                        label: !checkConditions ? null : t("WORKS_APPROVER"),
                        //placeholder: !checkConditions ? null : t("WF_ASSIGNEE_NAME_PLACEHOLDER"),
                        isMandatory: true,
                        type: "goToDefaultCase",
                        populators: !checkConditions ? null : (
                            approverLoading ? <Loader /> : <Dropdown
                                name={"approver"}
                                option={approvers}
                                autoComplete="off"
                                optionKey="nameOfEmp"
                                id="fieldInspector"
                                select={setSelectedApprover}
                                selected={selectedApprover}
                            />
                        ),
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
        ]
    }
}

export default configViewBillCheckModal;