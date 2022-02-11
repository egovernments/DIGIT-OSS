import React,{useState} from "react";
import { FormStep, TextInput, CardLabel, RadioButtons, LabelFieldPair, Dropdown, Menu, MobileNumber, Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import UploadDrawer from "./ImageUpload/UploadDrawer";
import { useQuery } from "react-query";

const defaultImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO4AAADUCAMAAACs0e/bAAAAM1BMVEXK0eL" +
  "/" +
  "/" +
  "/" +
  "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";

const UserProfile = ({stateCode,userType}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const stateId = Digit.ULBService.getStateId();
  const tenant = Digit.ULBService.getStateId();

  const userInfo = Digit.UserService.getUser()?.info || {};
  console.log('userInfo-', userInfo);

  const [name, setName] = useState(userInfo?.name);
  const [email, setEmail] = useState(userInfo?.emailId);
  const [gender, setGender] = useState(userInfo?.gender);
  const [mobileNumber, setMobileNo]=useState(userInfo?.mobileNumber)
  const [profilePic, setProfilePic] = useState(null);
  const [profileImg, setProfileImg] = useState(""); // To-do: pass placeholder image
  const [openUploadSlide,SetOpenUploadSide]=useState("false")
  const [chengepassword,setChengepassword]=useState(false)
  const [currentPassword,setCurrentPassword]=useState('')
  const [newPassword,setNewPassword]=useState('')
  const [confirmPassword,setConfirmPassword]=useState('')


  const editScreen = false; // To-do: Deubug and make me dynamic or remove if not needed

  const onClickAddPic = (isOpen) => {
    {openUploadSlide==true?SetOpenUploadSide(false):SetOpenUploadSide(true)}
    // SetOpenUploadSide(true);
  };
  const TogleforPassword =()=>{
    {chengepassword==true?setChengepassword(false):setChengepassword(true)}
  };
  
  const updateProfile = async () => {
    const requestData = {
      ...userInfo,
      name,
      gender:gender?.value,
      emailId:email,
      photo: profilePic,
    }

    const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.updateUser(requestData, stateCode);

    if(currentPassword && newPassword && confirmPassword) { 
      const requestData = {
        existingPassword: currentPassword,
        newPassword: newPassword,
        tenantId: tenant,
        type: "EMPLOYEE",
        username: userInfo?.userName
      }
      const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.changePassword(requestData, tenant);
    }
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

  let menu = [];
  const { data: Menu } = Digit.Hooks.pt.useGenderMDMS(stateId, "common-masters", "GenderType");
  Menu && Menu.map((genderDetails) => {
    menu.push({ i18nKey: `PT_COMMON_GENDER_${genderDetails.code}`, code: `${genderDetails.code}`, value: `${genderDetails.code}` });
  });

  const setFileStoreId = async (fileStoreId) => {
    console.log('Id of the uploaded file - ', fileStoreId);
    setProfilePic(fileStoreId);
    // getImgUrl(fileStoreId);
    const thumbnails = fileStoreId ? await getThumbnails([fileStoreId], tenant) : null;
    setProfileImg(thumbnails?.thumbs[0])
    console.log('thumbnails-', thumbnails);
  }

  // const getImgUrl = async (url) => {
  //   console.log('here', url);
  //   const imgUrl = await Digit.Utils.getFileUrl(url)
  //   console.log('image - ', imgUrl);
  //   setProfileImg(imgUrl);
  // }

  const getThumbnails = async (ids, tenantId) => {
    const res = await Digit.UploadServices.Filefetch(ids, tenantId);
    if (res.data.fileStoreIds && res.data.fileStoreIds.length !== 0) {
      return { thumbs: res.data.fileStoreIds.map((o) => o.url.split(",")[3]), images: res.data.fileStoreIds.map((o) => Digit.Utils.getFileUrl(o.url)) };
    } else {
      return null;
    }
  };

  // const { isLoading, error, data: profileImgData } = useQuery([`citizen-profile`, [profilePic]], () => Digit.UploadServices.Filefetch([profilePic], tenant));
  // if(profileImgData) {
  //   console.log('profileImgData-', profileImgData)
  //   // getImgUrl(profileImgData)
  // }
  // console.log('img url-', profileImgData);

  // if(isLoading)
  //   return <Loader />

  return (
    <React.Fragment>
    
    <div style={{backgroundColor:"white",borderRadius:'5px',margin:"10px",padding:"10px"}}>
      <h1>Edit Profile</h1>
      
      <div style={{justifyContent:"center",alignItems:"center",borderRadius:"5px",display:"",width:"96%",height:"20%",backgroundColor:"gray",margin:"2%"}}>
        {profileImg===""?<img style={{margin:"auto",borderRadius:"50%",justifyContent:'center'}} src={defaultImage} />
:        <img style={{margin:"auto",borderRadius:"50%",justifyContent:'center'}} src={profileImg} />
}
        <button style={{position: 'absolute',
  top: '50%',
  left: '50%'}} onClick={onClickAddPic} >++++</button>
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
    {userType==='citizen'?
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
: <LabelFieldPair>
<CardLabel>{`${t("Mobile Number")}*`}</CardLabel>
            <MobileNumber
              value={mobileNumber}
              name="mobileNumber"
              onChange={(value) => setMobileNo({ target: { value } })}
              // disable={mobileNumber && !isOpenLinkFlow ? true : false}
              {...{ required: true, pattern: "[6-9]{1}[0-9]{9}", type: "tel", title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID") }}
            />
</LabelFieldPair>
}
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
            {userType==='employee'?<a style={{color:"orange",    cursor:'default'}} onClick={TogleforPassword}>Change Password</a>:""}
        {chengepassword?<div>
          <LabelFieldPair>
      <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("Current Password*")}`}</CardLabel>
      <div className="field">
        <TextInput
          
          t={t}
          type={"password"}
          isMandatory={true}
          name="name"
          
          onChange={(e) => setCurrentPassword(e.target.value)}
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
      <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("New Password*")}`}</CardLabel>
      <div className="field">
        <TextInput
          
          t={t}
          type={"password"}
          isMandatory={true}
          name="name"
          
          onChange={(e) => setNewPassword(e.target.value)}
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
      <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("Confirm Password*")}`}</CardLabel>
      <div className="field">
        <TextInput
          
          t={t}
          type={"password"}
          isMandatory={true}
          name="name"
          
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        

        
        </div>:""}
      </div>
      <button onClick={updateProfile} style={{backgroundColor:"#C1592F",width:"100%", color:"white" ,borderBottom:"1px solid black"}}>Save</button>
    </LabelFieldPair>
    </div>
    { openUploadSlide==true
    ?
    <UploadDrawer
      setProfilePic={setFileStoreId}
     />
     : ""
     }
    </React.Fragment>
    
  )
}

export default UserProfile