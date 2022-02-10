import React,{useState} from "react";
import { FormStep, TextInput, CardLabel, RadioButtons, LabelFieldPair, Dropdown, Menu, MobileNumber } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import UploadDrawer from "./ImageUpload/UploadDrawer";


const [openUploadSlide,SetOpenUploadSide]=useState("false")
const UserProfile = () => {
  const history = useHistory();

  onClickAddPic = (isOpen) => {
    SetOpenUploadSide(
       "true"
    );
  };

    const updateProfile = () => {
      const requestData = {
        name: 'Test user'
      }
      const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.updateUser(requestData, stateCode);
    }

    // useEffect( () => {
    //   updateProfile
    // }, []);
   
    return (
        <React.Fragment>
        
        <div style={{backgroundColor:"white",borderRadius:'5px',margin:"10px",padding:"10px"}}>
          <h1>Edit Profile</h1>
          
        <div style={{width:"96%",height:"20%",backgroundColor:"gray",margin:"2%",justifyContent:'center'}}>
     
          
        <button onClick={onClickAddPic()} >++++</button>
        {openUploadSlide?<UploadDrawer1/>:""}
          </div>
         
         <LabelFieldPair>
          <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("Name*")}`}</CardLabel>
          <div className="field">
            <TextInput
              
              t={t}
              type={"text"}
              isMandatory={true}
              name="name"
              value={name}
              onChange={setOwnerName}
              // {...(validation = {
              //   isRequired: true,
              //   pattern: "^[a-zA-Z-.`' ]*$",
              //   type: "tel",
              //   title: t("PT_NAME_ERROR_MESSAGE"),
              // })}
              disable={editScreen}
            />
          </div>
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("Gender")}`}</CardLabel>
          <Dropdown style={{width:'100%'}}
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
          <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("Email")}`}</CardLabel>
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
          <button style={{backgroundColor:"#C1592F",width:"100%", color:"white" ,borderBottom:"1px solid black"}}>Save</button>
        </LabelFieldPair>
        </div>
        </React.Fragment>
    )
}

export default UserProfile