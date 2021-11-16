import { CheckBox, LinkButton, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";

const PermissionCheck = ({ permissions, t }) => {
  const [approvalChecks, setApprovalChecks, clearApprovals] = Digit.Hooks.useSessionStorage("OBPS_APPROVAL_CHECKS", permissions?.map(permission => ({ label: permission, checked: false }))); //useState(() => permissions?.map(permission => ({ label: permission, checked: false })))
  const [newApprovals,  setNewApprovals, clearNewApprovals] = Digit.Hooks.useSessionStorage('OBPS_NEW_APPROVALS', []);

  useEffect(() => {
    return () => {
      Digit.SessionStorage.del("OBPS_NEW_APPROVALS");
      Digit.SessionStorage.del("OBPS_APPROVAL_CHECKS");
    }
  }, [])

  const handleAdd = () => {
    setNewApprovals([...newApprovals, { label: '' }]);
  }

  const handleChange = (event, index) => {
    setNewApprovals(() => {
      return newApprovals?.map((approval, id) => {
        if (index === id) {
          return {
            label: event?.target?.value,
          }
        }
        return approval;
      })
    })
  }

  const handleCheck = (event, label, index) => {
    const isChecked = event.target.checked;
    setApprovalChecks(() => {
      return approvalChecks?.map((approval, id) => {
        if (index === id) {
          return {
            ...approval,
            checked: isChecked
          }
        }
        return approval;
      })
    })
  }

  return (
    <div>
      {approvalChecks?.map((permission, index) => (
        <CheckBox
          key={index}
          styles={{ margin: "20px 0 40px" }}
          label={permission?.label}
          checked={permission?.checked}
          onChange={(event => handleCheck(event, permission?.label, index))}
          isLabelFirst={true}
          index={index}
        />
      ))}
      {newApprovals?.map((approval, index) => (
        <TextInput key={index} value={approval?.label} onChange={event => handleChange(event, index)} textInputStyle={{maxWidth: "80%", width: "80%"}} placeholder={"Enter permit conditions.........."} />
      ))}
      <LinkButton style={{ color: "#f47738", maxWidth: "10%", float: "right", marginTop: "-50px", marginRight: "3%" }} label={t(`BPA_ADD_MORE`)} onClick={handleAdd} />
    </div>
  )
}

export default PermissionCheck;