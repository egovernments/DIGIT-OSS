import React from "react";
import { FormStep, TextInput, CardLabel, RadioButtons, LabelFieldPair, Dropdown, Menu, MobileNumber } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
// import ImageUpload from './ImageUpload'

const userProfile = () => {
    const { t } = useTranslation()
    const editScreen = false;

    return (
        <React.Fragment>
        {/* <ImageUpload/> */}
        <LabelFieldPair>
         <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("PT_OWNER_NAME")}`}</CardLabel>
          <div className="field">
            <TextInput
              t={t}
              type={"text"}
              isMandatory={false}
              name="name"
              value={name}
              onChange={() => null}
            //   {...(validation = {
            //     isRequired: true,
            //     pattern: "^[a-zA-Z-.`' ]*$",
            //     type: "tel",
            //     title: t("PT_NAME_ERROR_MESSAGE"),
            //   })}
              disable={editScreen}
            /></div>
            </LabelFieldPair>
            <LabelFieldPair>
          <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("PT_FORM3_GENDER")}`}</CardLabel>
          <Dropdown
            className="form-field"
            selected={gender?.length === 1 ? gender[0] : gender}
            disable={gender?.length === 1 || editScreen}
            option={menu}
            select={setGenderName}
            optionKey="code"
            t={t}
            name="gender"
          />
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("PT_OWNER_EMAIL")}`}</CardLabel>
          <div className="field">
            <TextInput
              t={t}
              type={"email"}
              isMandatory={false}
              optionKey="i18nKey"
              name="email"
              value={email}
              onChange={setOwnerEmail}
              disable={editScreen}
            />
          </div>
        </LabelFieldPair>
        </React.Fragment>
    )
}

export default userProfile