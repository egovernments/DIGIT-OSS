import { CheckBox, LinkButton, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";

const PermissionCheck = ({ permissions, t }) => {
  const [approvalChecks, setApprovalChecks] = useState(() => permissions?.map(permission => ({ label: permission, checked: false })))
  const [newApprovals,  setNewApprovals] = useState([]);

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

  return (
    <div>
      {approvalChecks?.map(permission => (
        <CheckBox
          styles={{ margin: "20px 0 40px" }}
          label={permission?.label}
          checked={permission?.checked}
        />
      ))}
      {newApprovals?.map((approval, index) => (
        <TextInput key={index} value={approval?.label} onChange={event => handleChange(event, index)} />
      ))}
      <LinkButton style={{ color: "#f47738" }} label={t(`BPA_ADD_MORE`)} onClick={handleAdd} />
    </div>
  )
}

export default PermissionCheck;