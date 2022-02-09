import React,{useState} from "react";
import { FormStep, TextInput, CardLabel, RadioButtons, LabelFieldPair, Dropdown, Menu, MobileNumber } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

// import UploadDrawer from "./ImageUpload/UploadDrawer";
// import ImgUp from './ImageUpload/ImgUp'

const userProfile = () => {
  const history = useHistory();

    const { t } = useTranslation()
    const editScreen = false;
    function setOwnerName(e) {
      setName(e.target.value);
    }
    function setOwnerEmail(e) {
      setEmail(e.target.value);
    }
    function setGenderName(value) {
      setGender(value);
    }
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const stateId = Digit.ULBService.getStateId();

    const { data: Menu } = Digit.Hooks.pt.useGenderMDMS(stateId, "common-masters", "GenderType");

  let menu = [];
  Menu &&
    Menu.map((genderDetails) => {
      menu.push({ i18nKey: `PT_COMMON_GENDER_${genderDetails.code}`, code: `${genderDetails.code}`, value: `${genderDetails.code}` });
    });
    // const showDwawerPage = () => {
    //   history.push("/digit-ui/citizen/user/drawer");
      
  
    //   console.log('Show user profile Drawer page citizen');
    // }
    const showDrawer = () => {
      history.push("/digit-ui/citizen/user/drawer");
      
  
      console.log('Show user drawer page citizen');
    }
   
    return (
        <React.Fragment>
        
        <div style={{backgroundColor:"white",borderRadius:'5px',margin:"10px",padding:"10px"}}>
          <h1>Edit Profile</h1>
          
        <div style={{width:"96%",height:"20%",backgroundColor:"gray",margin:"2%",justifyContent:'center'}}>
        
          
        <button onClick={showDrawer} >+</button>
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

export default userProfile