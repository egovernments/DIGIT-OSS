import React,{useState} from "react";
import { FormStep, TextInput, CardLabel, RadioButtons, LabelFieldPair, Dropdown, Menu, MobileNumber, Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import UploadDrawer from "./ImageUpload/UploadDrawer";
import { useQuery } from "react-query";

const UserProfile = ({stateCode}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const stateId = Digit.ULBService.getStateId();
  const tenant = Digit.ULBService.getStateId();

  const userInfo = Digit.UserService.getUser()?.info || {};
  console.log('userInfo-', userInfo);

  const [name, setName] = useState(userInfo?.name);
  const [email, setEmail] = useState(userInfo?.emailId);
  const [gender, setGender] = useState(userInfo?.gender);
  const [profilePic, setProfilePic] = useState(null);
  const [profileImg, setProfileImg] = useState("https://picsum.photos/200"); // To-do: pass placeholder image
  const [openUploadSlide,SetOpenUploadSide]=useState("false")

  const editScreen = false; // To-do: Deubug and make me dynamic or remove if not needed

  const onClickAddPic = (isOpen) => {
    {openUploadSlide==true?SetOpenUploadSide(false):SetOpenUploadSide(true)}
    // SetOpenUploadSide(true);
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
      
      <div style={{display:"flex",width:"96%",height:"20%",backgroundColor:"gray",margin:"2%",justifyContent:'center'}}>
        <img style={{justifyContent:'center'}} src={profileImg} />
        <button onClick={onClickAddPic} >++++</button>
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