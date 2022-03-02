import { CameraIcon, CardLabel, Dropdown, LabelFieldPair, MobileNumber, TextInput, Toast } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import UploadDrawer from "./ImageUpload/UploadDrawer";

const defaultImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO4AAADUCAMAAACs0e/bAAAAM1BMVEXK0eL" +
  "/" +
  "/" +
  "/" +
  "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";

const UserProfile = ({ stateCode, userType }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const stateId = Digit.ULBService.getStateId();
  const tenant = Digit.ULBService.getCurrentTenantId();
  const userInfo = Digit.UserService.getUser()?.info || {};

  const [userDetails, setUserDetails] = useState(null);
  const [name, setName] = useState(userInfo?.name);
  const [email, setEmail] = useState(userInfo?.emailId);
  const [gender, setGender] = useState(userDetails?.gender);
  const [mobileNumber, setMobileNo] = useState(userInfo?.mobileNumber);
  const [profilePic, setProfilePic] = useState(null);
  const [profileImg, setProfileImg] = useState(""); // To-do: pass placeholder image
  const [openUploadSlide, setOpenUploadSide] = useState(false);
  const [changepassword, setChangepassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState(null);

  const getUserInfo = async () => {
    const usersResponse = await Digit.UserService.userSearch(tenant, { uuid: [userInfo?.uuid] }, {});
    usersResponse && usersResponse.user && usersResponse.user.length ? setUserDetails(usersResponse.user[0]) : null;
  };

  useEffect(() => {
    getUserInfo();

    setGender({
      i18nKey: undefined,
      code: userDetails?.gender,
      value: userDetails?.gender,
    });

    const thumbs = userDetails?.photo?.split(",");
    setProfileImg(thumbs?.at(thumbs?.length - 1));
  }, [userDetails !== null]);

  let validation = {};
  const editScreen = false; // To-do: Deubug and make me dynamic or remove if not needed
  const onClickAddPic = () => setOpenUploadSide(!openUploadSlide);
  const TogleforPassword = () => setChangepassword(!changepassword);
  const setOwnerName = (e) => setName(e.target.value);
  const setOwnerEmail = (e) => setEmail(e.target.value);
  const setGenderName = (value) => setGender(value);
  const closeFileUploadDrawer = () => setOpenUploadSide(false);

  const removeProfilePic = () => {
    setProfilePic(null);
    setProfileImg(null);
  };

  const updateProfile = async () => {
    const requestData = {
      ...userInfo,
      name,
      gender: gender?.value,
      emailId: email,
      photo: profilePic,
    };

    if (!new RegExp(/^([a-zA-Z ])*$/).test(name) || name === "") {
      setToast({ key: "error", action: `${t("CORE_COMMON_PROFILE_NAME_INVALID")}` });
      setTimeout(() => {
        setToast(null);
      }, 5000);
      return;
    }

    if (userType === "employee" && !new RegExp(/^[6-9]{1}[0-9]{9}$/).test(mobileNumber)) {
      setToast({ key: "error", action: `${t("CORE_COMMON_PROFILE_MOBILE_NUMBER_INVALID")}` });
      setTimeout(() => {
        setToast(null);
      }, 5000);
      return;
    }
    if (email.length && !(email.includes("@") && email.includes("."))) {
      setToast({ key: "error", action: `${t("CORE_COMMON_PROFILE_EMAIL_INVALID")}` });
      setTimeout(() => {
        setToast(null);
      }, 5000);
      return;
    }

    const { responseInfo, user } = await Digit.UserService.updateUser(requestData, stateCode);

    if (currentPassword && newPassword && confirmPassword) {
      if (newPassword === confirmPassword) {
        const requestData = {
          existingPassword: currentPassword,
          newPassword: newPassword,
          tenantId: tenant,
          type: "EMPLOYEE",
          username: userInfo?.userName,
        };
        const { responseInfo1 } = await Digit.UserService.changePassword(requestData, tenant);
        if (responseInfo1?.status && responseInfo1.status === "200") {
          setToast({ key: "success", action: `${t("CORE_COMMON_PROFILE_UPDATE_SUCCESS_WITH_PASSWORD")}` });
          setTimeout(() => setToast(null), 5000);
        }
      } else {
        setToast({ key: "error", action: `${t("CORE_COMMON_PROFILE_ERROR_PASSWORD_NOT_MATCH")}` });
        setTimeout(() => setToast(null), 5000);
      }
    } else {
      if (responseInfo?.status && responseInfo.status === "200") {
        setToast({ key: "success", action: `${t("CORE_COMMON_PROFILE_UPDATE_SUCCESS")}` });
        setTimeout(() => setToast(null), 5000);
      }
    }
  };

  let menu = [];
  const { data: Menu } = Digit.Hooks.pt.useGenderMDMS(stateId, "common-masters", "GenderType");
  Menu &&
    Menu.map((genderDetails) => {
      menu.push({ i18nKey: `PT_COMMON_GENDER_${genderDetails.code}`, code: `${genderDetails.code}`, value: `${genderDetails.code}` });
    });

  const setFileStoreId = async (fileStoreId) => {
    setProfilePic(fileStoreId);

    const thumbnails = fileStoreId ? await getThumbnails([fileStoreId], stateId) : null;

    setProfileImg(thumbnails?.thumbs[0]);

    closeFileUploadDrawer();
  };

  const getThumbnails = async (ids, tenantId) => {
    const res = await Digit.UploadServices.Filefetch(ids, tenantId);
    if (res.data.fileStoreIds && res.data.fileStoreIds.length !== 0) {
      return {
        thumbs: res.data.fileStoreIds.map((o) => o.url.split(",")[3]),
        images: res.data.fileStoreIds.map((o) => Digit.Utils.getFileUrl(o.url)),
      };
    } else {
      return null;
    }
  };

  return (
    <React.Fragment>
      <div>
        {userType === "citizen" ? (
          <div style={{ backgroundColor: "white", borderRadius: "5px", margin: "10px", padding: "10px" }}>
            <h1>{t("CORE_COMMON_PROFILE_EDIT")}</h1>
            <div
              style={{
                position: "relative",
                justifyContent: "center",
                alignItems: "center",
                display: "",
                width: "97%",
                height: "20%",
                backgroundColor: "#EEEEEE",
                margin: "2%",
                padding: "20px",
              }}
            >
              <div>
                {!profileImg || profileImg === "" ? (
                  <img
                    style={{ margin: "auto", borderRadius: "300px", justifyContent: "center", padding: "3%;", height: "150px", width: "150px" }}
                    src={defaultImage}
                  />
                ) : (
                  <img
                    style={{
                      display: "block",
                      marginRight: "auto",
                      marginLeft: "auto",
                      borderRadius: "300px",
                      justifyContent: "center",
                      height: "150px",
                      width: "150px",
                    }}
                    src={profileImg}
                  />
                )}
                <button style={{ position: "absolute", bottom: "3%", right: "50%", left: "45%", cursor: "pointer" }} onClick={onClickAddPic}>
                  <CameraIcon />
                </button>
              </div>
            </div>

            <LabelFieldPair>
              <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("CORE_COMMON_PROFILE_NAME")}`}*</CardLabel>
              <div className="field">
                <TextInput
                  t={t}
                  type={"text"}
                  isMandatory={false}
                  name="name"
                  value={name}
                  onChange={setOwnerName}
                  {...(validation = {
                    isRequired: true,
                    pattern: "^[a-zA-Z-.`' ]*$",
                    type: "tel",
                    title: t("CORE_COMMON_PROFILE_NAME_ERROR_MESSAGE"),
                  })}
                  disable={editScreen}
                />
              </div>
            </LabelFieldPair>

            <LabelFieldPair>
              <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("CORE_COMMON_PROFILE_GENDER")}`}</CardLabel>
              <Dropdown
                style={{ width: "100%" }}
                className="form-field"
                selected={gender?.length === 1 ? gender[0] : gender}
                disable={gender?.length === 1 || editScreen}
                option={menu}
                select={setGenderName}
                value={gender}
                optionKey="code"
                t={t}
                name="gender"
              />
            </LabelFieldPair>

            <LabelFieldPair>
              <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("CORE_COMMON_PROFILE_EMAIL")}`}</CardLabel>
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
            <div style={{ height: "88px", backgroundColor: "#FFFFFF", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={updateProfile}
                style={{
                  marginTop: "2px",
                  backgroundColor: "#F47738",
                  width: "328px",
                  height: "40px",
                  float: "right",
                  // marginRight: "31px",
                  color: "white",
                  borderBottom: "1px solid black",
                }}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: "#EEEEEE", borderRadius: "5px", margin: "10px", padding: "10px", display: "flex" }}>
            <div
              style={{
                height: "376px",
                width: "376px",
                padding: "24px",
                backgroundColor: "#FFFFFF",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "2%",
              }}
            >
              <div
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  display: "inline-block",
                  width: "328px",
                  height: "328px",
                  backgroundColor: "#EEEEEE",
                  paddingTop: "80px",
                }}
              >
                <div>
                  {!profileImg || profileImg === "" ? (
                    <img
                      style={{ margin: "auto", borderRadius: "50%", justifyContent: "center", height: "150px", width: "150px" }}
                      src={defaultImage}
                    />
                  ) : (
                    <img
                      style={{
                        display: "block",
                        marginRight: "auto",
                        marginLeft: "auto",
                        borderRadius: "50%",
                        justifyContent: "center",
                        width: "150px",
                        height: "150px",
                      }}
                      src={profileImg}
                    />
                  )}
                  <button style={{ position: "relative", left: "147.33px", right: "8.33%", top: "12.5%", bottom: "12.5%" }} onClick={onClickAddPic}>
                    <CameraIcon />
                  </button>
                </div>
              </div>
            </div>
            <div
              style={{
                position: "relative",
                justifyContent: "center",
                alignItems: "center",
                display: "inline-block",
                width: "928px",
                height: "496px",
                backgroundColor: "white",
                margin: "2%",
                padding: "20px",
              }}
            >
              <LabelFieldPair style={{ display: "flex", justifyContent: "space-between" }}>
                <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("CORE_COMMON_PROFILE_NAME")}`}*</CardLabel>
                <div className="field">
                  <TextInput
                    t={t}
                    type={"text"}
                    isMandatory={false}
                    name="name"
                    style={{ width: "640px", height: "40px" }}
                    value={name}
                    onChange={setOwnerName}
                    placeholder="Enter Your Name"
                    {...(validation = {
                      isRequired: true,
                      pattern: "^[a-zA-Z-.`' ]*$",
                      type: "text",
                      title: t("CORE_COMMON_PROFILE_NAME_ERROR_MESSAGE"),
                    })}
                    disable={editScreen}
                  />
                </div>
              </LabelFieldPair>

              <LabelFieldPair style={{ display: "flex", justifyContent: "space-between" }}>
                <CardLabel>{`${t("CORE_COMMON_PROFILE_MOBILE_NUMBER")}*`}</CardLabel>
                <MobileNumber
                  value={mobileNumber}
                  name="mobileNumber"
                  placeholder="Enter a valid Mobile No."
                  style={{ width: "600px", height: "40px" }}
                  onChange={(value) => setMobileNo(value)}
                  // disable={mobileNumber && !isOpenLinkFlow ? true : false}
                  {...{ required: true, pattern: "[6-9]{1}[0-9]{9}", type: "tel", title: t("CORE_COMMON_PROFILE_MOBILE_NUMBER_INVALID") }}
                />
              </LabelFieldPair>

              <LabelFieldPair style={{ display: "flex", justifyContent: "space-between" }}>
                <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("CORE_COMMON_PROFILE_EMAIL")}`}</CardLabel>
                <div className="field">
                  <TextInput
                    t={t}
                    type={"email"}
                    isMandatory={false}
                    placeholder="Enter a valid Email"
                    optionKey="i18nKey"
                    style={{ width: "640px", height: "40px" }}
                    name="email"
                    value={email}
                    onChange={setOwnerEmail}
                    disable={editScreen}
                  />
                </div>
              </LabelFieldPair>
              <LabelFieldPair>
                <div>
                  <a style={{ color: "orange", cursor: "default", marginBottom: "5", cursor: "pointer" }} onClick={TogleforPassword}>
                    Change Password
                  </a>
                  {changepassword ? (
                    <div style={{ marginTop: "10px" }}>
                      <LabelFieldPair style={{ display: "flex", justifyContent: "space-between" }}>
                        <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("CORE_COMMON_PROFILE_CURRENT_PASSWORD")}`}</CardLabel>
                        <div className="field">
                          <TextInput
                            t={t}
                            type={"password"}
                            isMandatory={false}
                            style={{ width: "640px", height: "40px" }}
                            name="name"
                            pattern="^([a-zA-Z0-9@#$%])+$"
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            disable={editScreen}
                          />
                        </div>
                      </LabelFieldPair>
                      <LabelFieldPair style={{ display: "flex", justifyContent: "space-between" }}>
                        <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("CORE_COMMON_PROFILE_NEW_PASSWORD")}`}</CardLabel>
                        <div className="field">
                          <TextInput
                            t={t}
                            type={"password"}
                            isMandatory={false}
                            style={{ width: "640px", height: "40px" }}
                            name="name"
                            pattern="^([a-zA-Z0-9@#$%])+$"
                            onChange={(e) => setNewPassword(e.target.value)}
                            disable={editScreen}
                          />
                        </div>
                      </LabelFieldPair>
                      <LabelFieldPair style={{ display: "flex", justifyContent: "space-between" }}>
                        <CardLabel style={editScreen ? { color: "#B1B4B6" } : {}}>{`${t("CORE_COMMON_PROFILE_CONFIRM_PASSWORD")}`}</CardLabel>
                        <div className="field">
                          <TextInput
                            t={t}
                            type={"password"}
                            isMandatory={false}
                            style={{ width: "640px", height: "40px" }}
                            name="name"
                            pattern="^([a-zA-Z0-9@#$%])+$"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disable={editScreen}
                          />
                        </div>
                      </LabelFieldPair>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </LabelFieldPair>
            </div>
          </div>
        )}
        {userType === "employee" ? (
          <div style={{ height: "88px", backgroundColor: "#FFFFFF", display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={updateProfile}
              style={{
                marginTop: "24px",
                backgroundColor: "#F47738",
                width: "248px",
                height: "40px",
                float: "right",
                marginRight: "31px",
                color: "white",
                borderBottom: "1px solid black",
              }}
            >
              Save
            </button>
          </div>
        ) : (
          ""
        )}
        {toast && (
          <Toast
            error={toast.key === "error"}
            label={t(toast.key === "success" ? `CORE_COMMON_PROFILE_UPDATE_SUCCESS` : toast.action)}
            onClose={() => setToast(null)}
            style={{ maxWidth: "670px" }}
          />
        )}
      </div>
      {openUploadSlide == true ? (
        <UploadDrawer setProfilePic={setFileStoreId} closeDrawer={closeFileUploadDrawer} userType={userType} removeProfilePic={removeProfilePic} />
      ) : (
        ""
      )}
    </React.Fragment>
  );
};

export default UserProfile;
