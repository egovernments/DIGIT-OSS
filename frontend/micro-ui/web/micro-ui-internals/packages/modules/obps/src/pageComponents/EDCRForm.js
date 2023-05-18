import { CardLabel, Dropdown, FormStep, Loader, TextInput, Toast, UploadFile } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Hr } from "react-bootstrap-icons";
import { useLocation, useHistory } from "react-router-dom";
import { getPattern, stringReplaceAll, sortDropdownNames } from "../utils";
import axios from "axios";

const EDCRForm = ({ t, config, onSelect, userType, formData, ownerIndex = 0, addNewOwner, isShowToast, isSubmitBtnDisable, setIsShowToast }) => {
  const { pathname: url } = useLocation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const [citymoduleList, setCitymoduleList] = useState([]);
  const [name, setName] = useState(formData?.Scrutiny?.[0]?.applicantName);
  const [tenantIdData, setTenantIdData] = useState(formData?.Scrutiny?.[0]?.tenantIdData);
  const [uploadedFile, setUploadedFile] = useState(() => formData?.Scrutiny?.[0]?.proofIdentity?.fileStoreId || null);
  const [file, setFile] = useState(formData?.owners?.documents?.proofIdentity);
  const [error, setError] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [showToast, setShowToast] = useState(null);
  const history = useHistory();
  const [typeList, setTypeList] = useState([
    {
      i18nKey: "License",
      code: "hr.license",
    },
    {
      i18nKey: "CLU",
      code: "hr.clu",
    },
  ]);
  const [caseType, setCaseType] = useState("");
  const [caseTypeList, setCaseTypeList] = useState([
    {
      i18nKey:"Fresh",
      code:"hr.fresh"
    },
    {
      i18nKey:"Revised (Without OC certificate)",
      code:"hr.fresh"
    },
    {
      i18nKey:"Addition and Alteration (With OC)",
      code:"hr.fresh"
    },
    {
      i18nKey:"Re-construction",
      code:"hr.Reconstruction"
    },
  ]);
  const [subTypeList, setSubTypeList] = useState([]);
  const [type, setType] = useState("");
  const [subType, setSubType] = useState("");
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState();
  const [licenseNo, setLicenseNo] = useState();
  const [Licences, setLicenses] = useState([]);

  const onAddLicense = () => {
    if (licenseNo) {
      setLicenses([...Licences, licenseNo]);
      setLicenseNo();
    }
  };

  const onSearch = async () => {
    if (type?.i18nKey === "License") {
      let body = {
        Flag: 1,
        SearchParam: search,
      };

      try {
        const res = await axios.post("/api/cis/GetLicenceDetails", body);
        setSearchData(res.data);
      } catch (err) {
        return error;
      }
    } else if (type?.i18nKey === "CLU") {
      let body = {
        Flag: 1,
        SearchParam: search,
      };

      try {
        const res = await axios.post("/api/cis/GetCluDetails", body);
        if (res.data?.length === 1) {
          setLicenses(res.data);
        }
      } catch (err) {
        return error;
      }
    }
  };

  let validation = {};

  function setApplicantName(e) {
    setName(e.target.value);
  }

  function setTypeOfTenantID(value) {
    setTenantIdData(value);
  }

  function selectfile(e) {
    setUploadedFile(e.target.files[0]);
    setFile(e.target.files[0]);
  }

  const onSkip = () => {
    setUploadMessage("NEED TO DELETE");
  };

  const { isLoading, data: citymodules } = Digit.Hooks.obps.useMDMS(stateId, "tenant", ["citymodule"]);

  useEffect(() => {
    if (citymodules?.tenant?.citymodule?.length > 0) {
      const list = citymodules?.tenant?.citymodule?.filter((data) => data.code == "BPAAPPLY");
      list?.[0]?.tenants?.forEach((data) => {
        data.i18nKey = `TENANT_TENANTS_${stringReplaceAll(data?.code?.toUpperCase(), ".", "_")}`;
      });
      if (Array.isArray(list?.[0]?.tenants)) list?.[0]?.tenants.reverse();
      let sortTenants = sortDropdownNames(list?.[0]?.tenants, "code", t);
      setCitymoduleList(sortTenants);
    }
  }, [citymodules]);

  useEffect(() => {
    if (uploadMessage || isShowToast) {
      setName("");
      setTenantIdData("");
      setUploadedFile(null);
      setFile("");
      setUploadMessage("");
    }
    if (isShowToast) {
      history.replace(`/digit-ui/citizen/obps/edcrscrutiny/apply/acknowledgement`, {
        data: isShowToast?.label ? isShowToast?.label : "BPA_INTERNAL_SERVER_ERROR",
        type: "ERROR",
      });
    }
  }, [uploadMessage, isShowToast, isSubmitBtnDisable]);

  function onAdd() {
    setUploadMessage("NEED TO DELETE");
  }

  const handleSubmit = () => {
    const data = {
      licenseNo: licenseNo,
      licenses: Licences,
      caseType:caseType,
      city:tenantIdData,
      caseNo:type.i18nKey === 'License' ? search : "",
      cluNo:type.i18nKey !== 'License' ? search : "",
      landType:type
    };
    data.tenantId = tenantIdData;
    data.applicantName = name;
    data.file = file;
    console.log("logger123...",data,onSelect)
    onSelect(config.key, data);
  };

  if (isLoading || isSubmitBtnDisable) {
    return <Loader />;
  }
  return (
    <FormStep
      t={t}
      config={config}
      onSelect={handleSubmit}
      onSkip={onSkip}
      isDisabled={!tenantIdData || !name || !file || isSubmitBtnDisable}
      onAdd={onAdd}
      isMultipleAllow={true}
    >
      <div className="row">
        <div className="col col-lg-4 col-md-6 col-sm-12">
          <CardLabel>{`${t("EDCR_SCRUTINY_LAND_TYPE")} *`}</CardLabel>
          <Dropdown
            t={t}
            isMandatory={false}
            option={typeList}
            selected={type}
            optionKey="i18nKey"
            select={(value) => {
              setType(value);
              setLicenseNo();
              setSearch("");
              setSearchData();
              setLicenses([]);
            }}
            // uploadMessage={uploadMessage}
          />
        </div>
      </div>

      <div className="row">
        {type && (
          <div className="col col-lg-4 col-md-6 col-sm-12 d-flex flex-row align-items-center">
            <div className="w-100">
              <CardLabel>{`${type?.i18nKey === "License" ? t("EDCR_SCRUTINY_CASE_NO") : t("EDCR_SCRUTINY_CLU_NO")} *`}</CardLabel>
              <TextInput
                isMandatory={false}
                optionKey="i18nKey"
                t={t}
                placeholder={type?.i18nKey === "License" ? "LC_XXXXX" : "CL-XXXXX"}
                name="search"
                onChange={(e) => setSearch(e.target.value)}
                // uploadMessage={uploadMessage}
                value={search}
              />
            </div>
            <Button
              className="ml-3"
              // disabled={search === "" || subType === ""}
              onClick={onSearch}
            >
              Go
            </Button>
          </div>
        )}

        {type.i18nKey === "License" && searchData && (
          <div className="col col-lg-4 col-md-6 col-sm-12 d-flex flex-row align-items-center">
            <div className="w-100">
              <CardLabel>{`${t("EDCR_SCRUTINY_LICENSE_NO")} *`}</CardLabel>
              <Dropdown
                t={t}
                isMandatory={false}
                option={searchData}
                // selected={licenseNo}
                optionKey="Text"
                select={setLicenseNo}
                pipeSeparator={true}
                optionCardStyles={{
                  height: "200px",
                  overflow: "auto",
                }}
              />
            </div>
            <Button className="ml-3" color="success" onClick={onAddLicense}>
              Add
            </Button>
          </div>
        )}
      </div>

      <div className="row">

        {/* {
          type.i18nKey === "License" && ( */}
        <div className="col col-lg-4 col-md-6 col-sm-12">
          <CardLabel>{`${t("EDCR_SCRUTINY_CASE_TYPE")} *`}</CardLabel>
          <Dropdown
            t={t}
            isMandatory={false}
            option={caseTypeList}
            selected={caseType}
            optionKey="i18nKey"
            select={(value) => {
              setCaseType(value)
            }}
            // uploadMessage={uploadMessage}
          />
        </div>
        
      </div>

      {Licences?.map((item, index) => (
        <div className="row" key={index}>
          <div className="col-sm-12">
            <CardLabel>{t("LICENSE_NO")}</CardLabel>
            <TextInput value={item.Text?.split("|")?.[0]} disabled />
          </div>
          <div className="col col-lg-4 col-md-6 col-sm-12">
            <CardLabel>{t("DISTRICT")}</CardLabel>
            <TextInput value={item.Text?.split("|")?.[3]} disabled />
          </div>
          <div className="col col-lg-4 col-md-6 col-sm-12">
            <CardLabel>{t("PURPOSE")}</CardLabel>
            <TextInput value={item.Text?.split("|")?.[4]} disabled />
            {/* bfcndfvgbhff */}
          </div>
          <div className="col col-lg-4 col-md-6 col-sm-12">
            <CardLabel>{t("DEVELOPER_NAME")}</CardLabel>
            <TextInput value={item.Text?.split("|")?.[5]} disabled />
          </div>
          <div className="col col-lg-4 col-md-6 col-sm-12">
            <CardLabel>{t("TOWN")}</CardLabel>
            <TextInput value={item.Text?.split("|")?.[6]} disabled />
          </div>
          <div className="col col-lg-4 col-md-6 col-sm-12">
            <CardLabel>{t("SECTOR")}</CardLabel>
            <TextInput value={item.Text?.split("|")?.[7]} disabled />
          </div>
          <div className="col col-lg-4 col-md-6 col-sm-12">
            <CardLabel>{t("COLONY")}</CardLabel>
            <TextInput value={item.Text?.split("|")?.[8]} disabled />
          </div>
        </div>
      ))}

      <CardLabel>{`${t("EDCR_SCRUTINY_CITY")} *`}</CardLabel>
      <Dropdown
        t={t}
        isMandatory={false}
        option={citymoduleList}
        selected={tenantIdData}
        optionKey="i18nKey"
        select={setTypeOfTenantID}
        uploadMessage={uploadMessage}
      />
      <CardLabel>{`${t("EDCR_SCRUTINY_NAME_LABEL")} *`}</CardLabel>
      <TextInput
        isMandatory={false}
        optionKey="i18nKey"
        t={t}
        name="applicantName"
        onChange={setApplicantName}
        uploadMessage={uploadMessage}
        value={name}
        // {...(validation = {
        //     isRequired: true,
        //     pattern: "^[a-zA-Z-.`' ]*$",
        //     type: "text",
        //     title: t("TL_NAME_ERROR_MESSAGE"),
        // })}
      />
      <CardLabel>{`${t("BPA_PLAN_DIAGRAM_LABEL")} *`}</CardLabel>
      <UploadFile
        id={"edcr-doc"}
        extraStyleName={"propertyCreate"}
        accept=".dxf"
        onUpload={selectfile}
        onDelete={() => {
          setUploadedFile(null);
          setFile("");
        }}
        message={uploadedFile ? `1 ${t(`PT_ACTION_FILEUPLOADED`)}` : t(`ES_NO_FILE_SELECTED_LABEL`)}
        error={error}
        uploadMessage={uploadMessage}
      />
      <div style={{ disabled: "true", height: "30px", width: "100%", fontSize: "14px" }}>{t("EDCR_UPLOAD_FILE_LIMITS_LABEL")}</div>
      {isShowToast && <Toast error={isShowToast.key} label={t(isShowToast.label)} onClose={() => setIsShowToast(null)} isDleteBtn={true} />}
      {/* {isSubmitBtnDisable ? <Loader /> : null} */}
    </FormStep>
  );
};

export default EDCRForm;
