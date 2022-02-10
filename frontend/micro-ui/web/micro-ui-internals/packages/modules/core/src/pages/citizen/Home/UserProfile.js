import React,{useState} from "react";
import { FormStep, TextInput, CardLabel, RadioButtons, LabelFieldPair, Dropdown, Menu, MobileNumber } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import UploadDrawer from "./ImageUpload/UploadDrawer";

const UserProfile = ({stateCode}) => {
  const history = useHistory();
  const { t } = useTranslation()

  const [openUploadSlide,SetOpenUploadSide]=useState("false")

  const editScreen = false; // To-do: Deubug and make me dynamic or remove if not needed

  const onClickAddPic = (isOpen) => {
    {openUploadSlide==true?SetOpenUploadSide(false):SetOpenUploadSide(true)}
    // SetOpenUploadSide(true);
  };
 
  const userInfo = Digit.UserService.getUser()?.info || {};

  const updateProfile = async () => {
    const requestData = {
      ...userInfo,
      name,
      gender:gender?.value,
      emailId:email,
      photo:""
      
    }
    const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.updateUser(requestData, stateCode);
  }

 
  const setOwnerName = (e) => {
    setName(e.target.value)
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

  let menu = [];
  const { data: Menu } = Digit.Hooks.pt.useGenderMDMS(stateId, "common-masters", "GenderType");

  Menu &&
    Menu.map((genderDetails) => {
      menu.push({ i18nKey: `PT_COMMON_GENDER_${genderDetails.code}`, code: `${genderDetails.code}`, value: `${genderDetails.code}` });
    });

  return (
    <React.Fragment>
    
    <div style={{backgroundColor:"white",borderRadius:'5px',margin:"10px",padding:"10px"}}>
      <h1>Edit Profile</h1>
      
    <div style={{display:"flex",width:"96%",height:"20%",backgroundColor:"gray",margin:"2%",justifyContent:'center'}}>
  
    <img style={{justifyContent:'center'}} src="https://picsum.photos/200"/>   <button onClick={onClickAddPic} >++++</button>
    
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
      <button onClick={updateProfile} style={{backgroundColor:"#C1592F",width:"100%", color:"white" ,borderBottom:"1px solid black"}}>Save</button>
    </LabelFieldPair>
    </div>
    {openUploadSlide==true?<UploadDrawer />:""}
    </React.Fragment>
    
  )
}

export default UserProfile