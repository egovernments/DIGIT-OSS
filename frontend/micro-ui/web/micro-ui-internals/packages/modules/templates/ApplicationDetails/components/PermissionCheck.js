import { CheckBox, LinkButton, TextInput,Close, CardSubHeader } from "@egovernments/digit-ui-react-components";
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

  const handleRemove = (index) => {
    const values = [...newApprovals];
            values.splice(index, 1);
            setNewApprovals([...values]);     
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
      <CardSubHeader style={{ marginBottom: "16px", fontSize: "24px" }}>{t("BPA_PERMIT_CONDITIONS")}</CardSubHeader>
      {approvalChecks?.map((permission, index) => (
        <CheckBox
          key={index}
          styles={{ margin: "20px 0 40px",maxWidth:"70%" }}
          label={permission?.label}
          checked={permission?.checked}
          onChange={(event => handleCheck(event, permission?.label, index))}
          isLabelFirst={true}
          index={index}
        />
      ))}
      {newApprovals?.map((approval, index) => (
       <div> <TextInput key={index} value={approval?.label} onChange={event => handleChange(event, index)} textInputStyle={{maxWidth: "830px", width: "830px"}} placeholder={"Enter permit conditions.........."} />
         {<LinkButton
          label={
            <div>
              <span>
              <Close style={{float: "right", position: "relative", bottom: "32px", marginTop: "-21px", marginRight: "35%" }}/>
              </span>
            </div>
          }
          style={{ }}
          onClick={(e) => handleRemove(index)}
        />}
       </div>
      ))}
      <LinkButton style={{ color: "#f47738", maxWidth: "10%", /* float: "right", marginTop: "-50px", */ marginRight: "3%" }} label={t(`BPA_ADD_MORE`)} onClick={handleAdd} />
    </div>
  )
}

export default PermissionCheck;