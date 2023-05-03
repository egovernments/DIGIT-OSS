import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useStyles } from "../../css/personalInfoChild.style";
import Collapse from "react-bootstrap/Collapse";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import FileUpload from "@mui/icons-material/FileUpload";
import { useTranslation } from "react-i18next";
import { getDocShareholding } from "../../ScrutinyDevelopment/docview.helper";
import ModalChild from "../../Remarks/ModalChild";


function SurrenderLicScrutiny({ apiResponse, refreshScrutinyData, applicationNumber, passUncheckedList, passCheckedList, dataForIcons,applicationStatus }) {

  const [selects, setSelects] = useState();
  const [showhide, setShowhide] = useState("");
  const [loader, setLoading] = useState(false);
  const [licenseData, setLicenseData] = useState();
  const { id } = useParams();
  const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
  const authToken = Digit.UserService.getUser()?.access_token || null;
  const userInfo = Digit.UserService.getUser()?.info || {};
  const { t } = useTranslation();
  const { pathname: url } = useLocation();



  const handleshowhide = (event) => {
    const getuser = event.target.value;

    setShowhide(getuser);
  };
  const handleselects = (event) => {
    const getu = event.target.value;

    setSelects(getu);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
    watch
  } = useForm({});

  const SurrenderLic = (data) => console.log(data);
  const [open2, setOpen2] = useState(false);

  const classes = useStyles();
  const currentRemarks = (data) => {
    props.showTable({ data: data.data });
  };

  const [smShow, setSmShow] = useState(false);
  const [labelValue, setLabelValue] = useState("");
  const Colors = {
    approved: "#09cb3d",
    disapproved: "#ff0000",
    info: "#FFB602",
    conditional: "#2874A6"
  };

  // // useEffect(() => {
  // //   getLicenseData();
  // // }, [])

  // const getLicenseData = async () => {
  //   console.log("Request Id1 ====> ", id)
  //   // return;
  //   try {
  //     // let id = params.get('id');
  //     setLoading(true);

  //     const requestData = {
  //       "RequestInfo": {
  //         "apiId": "Rainmaker",
  //         "authToken": authToken,
  //         "msgId": "1672136660039|en_IN",
  //         "userInfo": userInfo
  //       }
  //     }
  //     const response = await axios.post(`/tl-services/SurrendOfLicenseRequest/_search?applicationNumber=${id}`, requestData);
  //     console.log("Response ====> ", response);
  //     setLicenseData(response?.data?.surrendOfLicense?.[0]);
  //     const details = response?.data?.surrendOfLicense?.[0]
  //     setValue("licenseNo", details?.licenseNo);
  //     setValue("selectType", details?.selectType);
  //     setValue("areaFallingUnder", details?.areaFallingUnder);
  //     setValue("thirdPartyRights", details?.thirdPartyRights);
  //     setValue("reraRegistration", details?.areraRegistration);
  //     setValue("zoningLayoutPlanfileUrl", details?.zoningLayoutPlanfileUrl);
  //     setValue("licenseCopyfileUrl", details?.licenseCopyfileUrl);
  //     setValue("edcaVailedfileUrl", details?.edcaVailedfileUrl);
  //     setValue("detailedRelocationSchemefileUrl", details?.detailedRelocationSchemefileUrl);
  //     setValue("giftDeedfileUrl", details?.giftDeedfileUrl);
  //     setValue("mutationfileUrl", details?.mutationfileUrl);
  //     setValue("jamabandhifileUrl", details?.jamabandhifileUrl);
  //     setValue("thirdPartyRightsDeclarationfileUrl", details?.thirdPartyRightsDeclarationfileUrl);
  //     setValue("areaInAcres", details?.areaInAcres);
  //     setValue("declarationIDWWorksfileUrl", details?.declarationIDWWorksfileUrl);
  //     setValue("revisedLayoutPlanfileUrl", details?.revisedLayoutPlanfileUrl);
  //     setValue("availedEdcfileUrl", details?.availedEdcfileUrl);
  //     setValue("areaFallingUnderfileUrl", details?.areaFallingUnderfileUrl);
  //     setValue("areaFallingDividing", details?.areaFallingDividing);
  //     setLoading(false);
  //   } catch (error) {
  //     console.log("Get Error ====> ", error.message);
  //     setLoading(false);
  //     setShowToastError({ label: error.message, error: true, success: false });
  //   }
  // }

  const setSurrenderLicenseData = (details) => {
    setLicenseData(details);
    setValue("licenseNo", details?.licenseNo);
    setValue("selectType", details?.selectType);
    setValue("areaFallingUnder", details?.areaFallingUnder);
    setValue("thirdPartyRights", details?.thirdPartyRights);
    setValue("reraRegistration", details?.areraRegistration);
    setValue("zoningLayoutPlanfileUrl", details?.zoningLayoutPlanfileUrl);
    setValue("licenseCopyfileUrl", details?.licenseCopyfileUrl);
    setValue("edcaVailedfileUrl", details?.edcaVailedfileUrl);
    setValue("detailedRelocationSchemefileUrl", details?.detailedRelocationSchemefileUrl);
    setValue("giftDeedfileUrl", details?.giftDeedfileUrl);
    setValue("mutationfileUrl", details?.mutationfileUrl);
    setValue("jamabandhifileUrl", details?.jamabandhifileUrl);
    setValue("thirdPartyRightsDeclarationfileUrl", details?.thirdPartyRightsDeclarationfileUrl);
    setValue("areaInAcres", details?.areaInAcres);
    setValue("declarationIDWWorksfileUrl", details?.declarationIDWWorksfileUrl);
    setValue("revisedLayoutPlanfileUrl", details?.revisedLayoutPlanfileUrl);
    setValue("availedEdcfileUrl", details?.availedEdcfileUrl);
    setValue("areaFallingUnderfileUrl", details?.areaFallingUnderfileUrl);
    setValue("areaFallingDividing", details?.areaFallingDividing);

    setValue("areaAcres", details?.newAdditionalDetails?.areaAcres);
    setValue("colonizerName", details?.newAdditionalDetails?.colonizerName);
    setValue("colonyType", details?.newAdditionalDetails?.colonyType);
    setValue("developmentPlan", details?.newAdditionalDetails?.developmentPlan);
    setValue("district", details?.newAdditionalDetails?.district);
    setValue("periodOfRenewal", details?.newAdditionalDetails?.periodOfRenewal);
    setValue("renewalRequiredUpto", details?.newAdditionalDetails?.renewalRequiredUpto);
    setValue("revenueEstate", details?.newAdditionalDetails?.revenueEstate);
    setValue("sectorNo", details?.newAdditionalDetails?.sectorNo);
    setValue("selectLicence", details?.newAdditionalDetails?.selectLicence);
    setValue("tehsil", details?.newAdditionalDetails?.tehsil);
    setValue("validUpto", details?.newAdditionalDetails?.validUpto);

  }

  const handlemodaldData = (data) => {
    // setmodaldData(data.data);
    setSmShow(false);
    console.log("here", openedModal, data);
    // if (openedModal && data) {
    //   setFieldIconColors({ ...fieldIconColors, [openedModal]: data.data.isApproved ? Colors.approved : Colors.disapproved });
    // }
    setOpennedModal("");
    setLabelValue("");
  };
  const [selectedFieldData, setSelectedFieldData] = useState();
  const [fieldValue, setFieldValue] = useState("");
  const [openedModal, setOpennedModal] = useState("");



  useEffect(() => {
    console.log("logger123...",dataForIcons)
  }, [dataForIcons])

  useEffect(() => {
    if (apiResponse) {
      setSurrenderLicenseData(apiResponse);
    }
  }, [apiResponse])

  const findfisrtObj = (list=[],label) => {
    return list?.filter((item,index)=>item.fieldIdL===label)?.[0] || {}
  }

  const getIconColor = (label) => {
    if(findfisrtObj(dataForIcons?.egScrutiny,label)?.isApproved === 'In Order'){
      return Colors.approved;
    }
    if(findfisrtObj(dataForIcons?.egScrutiny,label)?.isApproved === 'Not In Order'){
      return Colors.disapproved;
    }
    if(findfisrtObj(dataForIcons?.egScrutiny,label)?.isApproved === "Conditional"){
      return Colors.conditional;
    }
    return Colors.info
  }

  useEffect(()=>{
    if(labelValue){
      setSelectedFieldData(findfisrtObj(dataForIcons?.egScrutiny,labelValue))
    } else {
      setSelectedFieldData(null)
    }
    console.log("regergerg",labelValue,selectedFieldData)
  },[labelValue])


  return (
    <form onSubmit={handleSubmit(SurrenderLic)}>
      <div
        className="collapse-header"
        onClick={() => setOpen2(!open2)}
        aria-controls="example-collapse-text"
        aria-expanded={open2}
        style={{
          background: "#f1f1f1",
          padding: "0.25rem 1.25rem",
          borderRadius: "0.25rem",
          fontWeight: "600",
          display: "flex",
          cursor: "pointer",
          color: "#817f7f",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <span style={{ color: "#817f7f" }} className="">
          Surrender of License
        </span>
        {open2 ? <RemoveIcon></RemoveIcon> : <AddIcon></AddIcon>}
      </div>
      <Collapse in={open2}>
        <div
        //  id="example-collapse-text"
         >
          <Card style={{ width: "126%" }}>
            <h4 style={{ fontSize: "25px", marginLeft: "21px" }} className="text-center">
              Surrender of License
            </h4>

            <div className="card">

              <ModalChild
                labelmodal={labelValue}
                passmodalData={handlemodaldData}
                displaymodal={smShow}
                onClose={() => setSmShow(false)}
                selectedFieldData={selectedFieldData}
                fieldValue={fieldValue}
                remarksUpdate={currentRemarks}
                applicationStatus={applicationStatus}
              ></ModalChild>

              <div className="row-12">

                <div className="row row-12 row-cols-sm-3 row-cols-md-6 mx-2 my-3">

                  <div className="col col-3">
                    <FormControl className="w-100">
                      <h2 className="FormLable">
                        {`${t("LICENSE_NO")}`} <span style={{ color: "red" }}>*</span>
                      </h2>
                      <div className="d-flex align-items-center">

                      <input className="form-control"  disabled {...register("licenseNo")}/>
                        <ReportProblemIcon
                          style={{
                            color: getIconColor(t('LICENSE_NO')),
                          }}
                          className="ml-2"
                          onClick={() => {
                            setSmShow(true);
                            setOpennedModal(t('LICENSE_NO'));
                            setLabelValue(t('LICENSE_NO')),
                              setFieldValue(watch('licenseNo') || null);
                          }}
                        ></ReportProblemIcon>
                      </div>

                      <FormHelperText error={Boolean(errors?.licenseNo)}>
                        {errors?.licenseNo?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>


                  <div className="col col-3">
                    <FormControl className="w-100">
                      <h2 className="FormLable">
                        {`${t("Area in Acres (License)")}`} <span style={{ color: "red" }}>*</span>
                      </h2>
                      <div className="d-flex align-items-center">

                      <input className="form-control"  disabled {...register("areaAcres")}/>
                        <ReportProblemIcon
                          style={{
                            color: getIconColor(t('Area in Acres (License)')),
                          }}
                          className="ml-2"
                          onClick={() => {
                            setSmShow(true);
                            setOpennedModal(t('Area in Acres (License)'));
                            setLabelValue(t('Area in Acres (License)')),
                              setFieldValue(watch('areaAcres') || null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </FormControl>
                  </div>


                  <div className="col col-3">
                    <FormControl className="w-100">
                      <h2 className="FormLable">
                        {`${t("Colonizer Name")}`} <span style={{ color: "red" }}>*</span>
                      </h2>
                      <div className="d-flex align-items-center">

                      <input className="form-control"  disabled {...register("colonizerName")}/>
                        <ReportProblemIcon
                          style={{
                            color: getIconColor(t('Colonizer Name')),
                          }}
                          className="ml-2"
                          onClick={() => {
                            setSmShow(true);
                            setOpennedModal(t('Colonizer Name'));
                            setLabelValue(t('Colonizer Name')),
                              setFieldValue(watch('colonizerName') || null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </FormControl>
                  </div>


                  <div className="col col-3">
                    <FormControl className="w-100">
                      <h2 className="FormLable">
                        {`${t("Colony Type")}`} <span style={{ color: "red" }}>*</span>
                      </h2>
                      <div className="d-flex align-items-center">

                      <input className="form-control"  disabled {...register("colonyType")}/>
                        <ReportProblemIcon
                          style={{
                            color: getIconColor(t('Colony Type')),
                          }}
                          className="ml-2"
                          onClick={() => {
                            setSmShow(true);
                            setOpennedModal(t('Colony Type'));
                            setLabelValue(t('Colony Type')),
                              setFieldValue(watch('colonyType') || null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </FormControl>
                  </div>


                  <div className="col col-3">
                    <FormControl className="w-100">
                      <h2 className="FormLable">
                        {`${t("Development Plan")}`} <span style={{ color: "red" }}>*</span>
                      </h2>
                      <div className="d-flex align-items-center">

                      <input className="form-control"  disabled {...register("developmentPlan")}/>
                        <ReportProblemIcon
                          style={{
                            color: getIconColor(t('Development Plan')),
                          }}
                          className="ml-2"
                          onClick={() => {
                            setSmShow(true);
                            setOpennedModal(t('Development Plan'));
                            setLabelValue(t('Development Plan')),
                              setFieldValue(watch('developmentPlan') || null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </FormControl>
                  </div>


                  <div className="col col-3">
                    <FormControl className="w-100">
                      <h2 className="FormLable">
                        {`${t("District")}`} <span style={{ color: "red" }}>*</span>
                      </h2>
                      <div className="d-flex align-items-center">

                      <input className="form-control"  disabled {...register("district")}/>
                        <ReportProblemIcon
                          style={{
                            color: getIconColor(t('District')),
                          }}
                          className="ml-2"
                          onClick={() => {
                            setSmShow(true);
                            setOpennedModal(t('District'));
                            setLabelValue(t('District')),
                              setFieldValue(watch('district') || null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </FormControl>
                  </div>


                  <div className="col col-3">
                    <FormControl className="w-100">
                      <h2 className="FormLable">
                        {`${t("Period of Renewal")}`} <span style={{ color: "red" }}>*</span>
                      </h2>
                      <div className="d-flex align-items-center">

                      <input className="form-control"  disabled {...register("periodOfRenewal")}/>
                        <ReportProblemIcon
                          style={{
                            color: getIconColor(t('Period of Renewal')),
                          }}
                          className="ml-2"
                          onClick={() => {
                            setSmShow(true);
                            setOpennedModal(t('Period of Renewal'));
                            setLabelValue(t('Period of Renewal')),
                              setFieldValue(watch('periodOfRenewal') || null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </FormControl>
                  </div>


                  <div className="col col-3">
                    <FormControl className="w-100">
                      <h2 className="FormLable">
                        {`${t("Renewal required upto")}`} <span style={{ color: "red" }}>*</span>
                      </h2>
                      <div className="d-flex align-items-center">

                      <input className="form-control"  disabled {...register("renewalRequiredUpto")}/>
                        <ReportProblemIcon
                          style={{
                            color: getIconColor(t('Renewal required upto')),
                          }}
                          className="ml-2"
                          onClick={() => {
                            setSmShow(true);
                            setOpennedModal(t('Renewal required upto'));
                            setLabelValue(t('Renewal required upto')),
                              setFieldValue(watch('renewalRequiredUpto') || null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </FormControl>
                  </div>


                  <div className="col col-3">
                    <FormControl className="w-100">
                      <h2 className="FormLable">
                        {`${t("Revenue Estate")}`} <span style={{ color: "red" }}>*</span>
                      </h2>
                      <div className="d-flex align-items-center">

                      <input className="form-control"  disabled {...register("revenueEstate")}/>
                        <ReportProblemIcon
                          style={{
                            color: getIconColor(t('Revenue Estate')),
                          }}
                          className="ml-2"
                          onClick={() => {
                            setSmShow(true);
                            setOpennedModal(t('Revenue Estate'));
                            setLabelValue(t('Revenue Estate')),
                              setFieldValue(watch('revenueEstate') || null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </FormControl>
                  </div>


                  <div className="col col-3">
                    <FormControl className="w-100">
                      <h2 className="FormLable">
                        {`${t("Sector No.")}`} <span style={{ color: "red" }}>*</span>
                      </h2>
                      <div className="d-flex align-items-center">

                      <input className="form-control"  disabled {...register("sectorNo")}/>
                        <ReportProblemIcon
                          style={{
                            color: getIconColor(t('Sector No.')),
                          }}
                          className="ml-2"
                          onClick={() => {
                            setSmShow(true);
                            setOpennedModal(t('Sector No.'));
                            setLabelValue(t('Sector No.')),
                              setFieldValue(watch('sectorNo') || null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </FormControl>
                  </div>


                  <div className="col col-3">
                    <FormControl className="w-100">
                      <h2 className="FormLable">
                        {`${t("Select License")}`} <span style={{ color: "red" }}>*</span>
                      </h2>
                      <div className="d-flex align-items-center">

                      <input className="form-control"  disabled {...register("selectLicence")}/>
                        <ReportProblemIcon
                          style={{
                            color: getIconColor(t('Select License')),
                          }}
                          className="ml-2"
                          onClick={() => {
                            setSmShow(true);
                            setOpennedModal(t('Select License'));
                            setLabelValue(t('Select License')),
                              setFieldValue(watch('selectLicence') || null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </FormControl>
                  </div>


                  <div className="col col-3">
                    <FormControl className="w-100">
                      <h2 className="FormLable">
                        {`${t("Tehsil")}`} <span style={{ color: "red" }}>*</span>
                      </h2>
                      <div className="d-flex align-items-center">

                      <input className="form-control"  disabled {...register("tehsil")}/>
                        <ReportProblemIcon
                          style={{
                            color: getIconColor(t('Tehsil')),
                          }}
                          className="ml-2"
                          onClick={() => {
                            setSmShow(true);
                            setOpennedModal(t('Tehsil'));
                            setLabelValue(t('Tehsil')),
                              setFieldValue(watch('tehsil') || null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </FormControl>
                  </div>


                  <div className="col col-3">
                    <FormControl className="w-100">
                      <h2 className="FormLable">
                        {`${t("Valid Upto")}`} <span style={{ color: "red" }}>*</span>
                      </h2>
                      <div className="d-flex align-items-center">

                      <input className="form-control"  disabled {...register("validUpto")}/>
                        <ReportProblemIcon
                          style={{
                            color: getIconColor(t('Valid Upto')),
                          }}
                          className="ml-2"
                          onClick={() => {
                            setSmShow(true);
                            setOpennedModal(t('Valid Upto'));
                            setLabelValue(t('Valid Upto')),
                              setFieldValue(watch('validUpto') || null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </FormControl>
                  </div>
                  
                  
                  <div className="col col-3">
                    <FormControl className="w-100">
                      <h2 className="FormLable">
                      {`${t("SELECT_TYPE_COMPLETE_OR_PARTIAL")}`} <span style={{ color: "red" }}>*</span>
                      </h2>
                      <div className="d-flex align-items-center">

                      <input className="form-control"  disabled {...register("selectType", {
                          required: "At least one should be selected"
                        })}/>
                         <ReportProblemIcon
                      style={{
                        color: getIconColor(t('SELECT_TYPE_COMPLETE_OR_PARTIAL')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('SELECT_TYPE_COMPLETE_OR_PARTIAL'));
                        setLabelValue(t('SELECT_TYPE_COMPLETE_OR_PARTIAL')),
                          setFieldValue(watch('selectType') || null);
                      }}
                    ></ReportProblemIcon>
                      </div>

                      <FormHelperText error={Boolean(errors?.licenseNo)}>
                        {errors?.licenseNo?.message}
                      </FormHelperText>
                    </FormControl>
                  </div>

                      {
                        watch('selectType') === "PARTIAL" && (
                  <div className="col col-3">
                    <FormControl className="w-100">
                      <h2 className="FormLable">
                        {`${t("AREA_IN_ACRES")}`} <span style={{ color: "red" }}>*</span>
                      </h2>
                      <div className="d-flex align-items-center">

                      <input className="form-control"  disabled {...register("areaInAcres")}/>
                        <ReportProblemIcon
                          style={{
                            color: getIconColor(t('AREA_IN_ACRES')),
                          }}
                          className="ml-2"
                          onClick={() => {
                            setSmShow(true);
                            setOpennedModal(t('AREA_IN_ACRES'));
                            setLabelValue(t('AREA_IN_ACRES')),
                              setFieldValue(watch('areaInAcres') || null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </FormControl>
                  </div>
                        )
                      }


                  {/* <FormControl>
    <h2 className="FormLable">
      {" "}
      Select Type (Complete or Partial) <span style={{ color: "red" }}>*</span>
    </h2>

    <select className="Inputcontrol error" class="form-control" disabled {...register("selectType", {
      required: "At least one should be selected"
    })} onChange={(e) => handleshowhide(e)}>
      <option value=" ">----Select value-----</option>
      <option value="1">(a)Complete</option>
      <option value="2">(b) Partial</option>
    </select>

    <FormHelperText error={Boolean(errors?.selectType)}>
      {errors?.selectType?.message}
    </FormHelperText>

  </FormControl> */}
                </div>
                <div>
                  {/* {watch('selectType') === "PARTIAL" && (
                    <div className="row-12">
                      <div className="col col-3 d-flex align-items-center">
                        <FormControl>

                          <InputLabel id="select-label" >
                            {`${t("AREA_IN_ACRES")}`} <span style={{ color: "red" }}>*</span>
                          </InputLabel>

                          <TextField variant="standard" placeholder="" className="Inputcontrol" disabled {...register("areaInAcres", {
                            required: "This field cannot be blank",
                            validate: {
                              min: (value) => Number(value) > 0 || 'Area in Acres should be minimum 1',
                              max: (value) => Number(value) <= 10 || 'Area in Acres should be maximum 10'
                            }
                          })}
                            error={Boolean(errors?.areaInAcres)}
                          />
                          <FormHelperText error={Boolean(errors?.areaInAcres)}>
                            {errors?.areaInAcres?.message}
                          </FormHelperText>
                        </FormControl>

                        <ReportProblemIcon
                          style={{
                            color: getIconColor(t('AREA_IN_ACRES')),
                          }}
                          className="ml-2"
                          onClick={() => {
                            setSmShow(true)
                            setOpennedModal(t('AREA_IN_ACRES'));
                            setLabelValue(t('AREA_IN_ACRES')),
                              setFieldValue(watch('areaInAcres') || null);
                          }}
                        ></ReportProblemIcon>
                      </div>
                    </div>
                  )} */}
                </div>
                <div className="row-12">
                  <div className="col col-12 d-flex align-items-center">
                    <h6>
                      {`${t("AREA_FALLING_UNDER_24M_ROAD_OR_SECTOR_DIVIDING_ROAD")}`} <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                      <label htmlFor="areaFallingUnder">
                        <input
                          type="radio"
                          value="yes"
                          label="Yes"
                          name="areaFallingUnder"
                          id="areaFallingUnder"
                          disabled {...register("areaFallingUnder", {
                            required: "Please Select (Yes/No)"
                          })}
                          onChange={(e) => handleselects(e)}
                        />
                        &nbsp; {`${t("YES")}`} &nbsp;&nbsp;
                      </label>
                      <label htmlFor="areaFallingUnder">
                        <input
                          type="radio"
                          value="no"
                          label="No"
                          name="areaFallingUnder"
                          id="areaFallingUnder"
                          disabled {...register("areaFallingUnder", {
                            required: "Please Select (Yes/No)"
                          })}
                          onChange={(e) => handleselects(e)}
                        />
                        &nbsp; {`${t("NO")}`} &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.areaFallingUnder && errors?.areaFallingUnder?.message}
                      </h3>
                    </h6>
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('AREA_FALLING_UNDER_24M_ROAD_OR_SECTOR_DIVIDING_ROAD')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('AREA_FALLING_UNDER_24M_ROAD_OR_SECTOR_DIVIDING_ROAD'));
                        setLabelValue(t('AREA_FALLING_UNDER_24M_ROAD_OR_SECTOR_DIVIDING_ROAD')),
                          setFieldValue(watch('areaFallingUnder') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </div>

                <div className="row-12">
                  <div className="col col-12 d-flex align-items-center">
                    <h6>
                      {`${t("THIRD_PARTY_RIGHTS_CREATED")}`} <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                      <label htmlFor="thirdPartyRights">
                        <input
                          type="radio"
                          value="yes"
                          label="Yes"
                          name="thirdPartyRights"
                          id="thirdPartyRights"
                          disabled {...register("thirdPartyRights", {
                            required: "Please Select (Yes/No)"
                          })}
                        />
                        &nbsp; {`${t("YES")}`} &nbsp;&nbsp;
                      </label>
                      <label htmlFor="thirdPartyRights">
                        <input
                          type="radio"
                          value="no"
                          label="No"
                          name="thirdPartyRights"
                          id="thirdPartyRights"
                          disabled {...register("thirdPartyRights", {
                            required: "Please Select (Yes/No)"
                          })}
                        />
                        &nbsp; {`${t("NO")}`} &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.thirdPartyRights && errors?.thirdPartyRights?.message}
                      </h3>
                    </h6>
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('THIRD_PARTY_RIGHTS_CREATED')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('THIRD_PARTY_RIGHTS_CREATED'));
                        setLabelValue(t('THIRD_PARTY_RIGHTS_CREATED')),
                          setFieldValue(watch('thirdPartyRights') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </div>

                <div className="row-12">
                  <div className="col col-12 d-flex align-items-center">
                    <h6>
                      {`${t("RERA_REGISTRATION_OF_PROJECT")}`} <span style={{ color: "red" }}>*</span> &nbsp;&nbsp;
                      <label htmlFor="reraRegistration">
                        <input
                          type="radio"
                          label="Yes"
                          name="reraRegistration"
                          id="reraRegistration"
                          value="yes"
                          disabled {...register("reraRegistration", {
                            required: "Please Select (Yes/No)"
                          })}
                          onChange={(e) => handleselects(e)}
                        />
                        &nbsp; {`${t("YES")}`} &nbsp;&nbsp;
                      </label>
                      <label htmlFor="reraRegistration">
                        <input
                          type="radio"
                          label="No"
                          name="reraRegistration"
                          id="reraRegistration"
                          value="no"
                          disabled {...register("reraRegistration", {
                            required: "Please Select (Yes/No)"
                          })}
                          onChange={(e) => handleselects(e)}
                        />
                        &nbsp; {`${t("NO")}`} &nbsp;&nbsp;
                      </label>
                      <h3 className="error-message" style={{ color: "red" }}>
                        {errors?.reraRegistration && errors?.reraRegistration?.message}
                      </h3>
                    </h6>
                    <ReportProblemIcon
                      style={{
                        color: getIconColor(t('RERA_REGISTRATION_OF_PROJECT')),
                      }}
                      className="ml-2"
                      onClick={() => {
                        setSmShow(true);
                        setOpennedModal(t('RERA_REGISTRATION_OF_PROJECT'));
                        setLabelValue(t('RERA_REGISTRATION_OF_PROJECT')),
                          setFieldValue(watch('reraRegistration') || null);
                      }}
                    ></ReportProblemIcon>
                  </div>
                </div>

                <div className="row-12">
                  <div>
                    {watch('selectType') === "COMPLETE" && (
                      //  <div className="card">
                      <div className="table table-bordered table-responsive">
                        <thead>
                          <tr>
                            <th className="fw-normal" style={{ textAlign: "center" }}>
                              {`${t("SR_NO")}`}
                            </th>
                            <th className="fw-normal" style={{ textAlign: "center" }}>
                              {`${t("FIELD_NAME")}`}
                            </th>
                            <th className="fw-normal" style={{ textAlign: "center" }}>
                              {`${t("UPLOAD_DOCUMENTS")}`}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th className="fw-normal">1</th>
                            <td>
                              {" "}
                              {`${t("APPROVED_COPY_OF_ZONING_PLAN")}`} <span style={{ color: "red" }}>*</span>
                              {/* {
                watch("zoningLayoutPlanfileUrl") &&
                (
                  <div>
                    <small>File Uploaded</small>
                  </div>
                )
              } */}
                            </td>

                            <td className="d-flex justify-content-center">

                              {watch('zoningLayoutPlanfileUrl') && (
                                <a onClick={() => getDocShareholding(watch('zoningLayoutPlanfileUrl'), setLoading)} className="btn btn-sm ">
                                  <Visibility color="info" className="icon" />
                                </a>
                              )}

                              <ReportProblemIcon
                                style={{
                                  color: getIconColor(t('APPROVED_COPY_OF_ZONING_PLAN')),
                                }}
                                className="ml-2"
                                onClick={() => {
                                  setSmShow(true)
                                  setOpennedModal(t('APPROVED_COPY_OF_ZONING_PLAN'));
                                  setLabelValue(t('APPROVED_COPY_OF_ZONING_PLAN')),
                                    setFieldValue(watch('zoningLayoutPlanfileUrl') || null);
                                }}
                              ></ReportProblemIcon>
                            </td>


                          </tr>
                          <tr>
                            <th className="fw-normal">2</th>
                            <td>
                              {" "}
                              {`${t("LICENSE_COPY")}`} <span style={{ color: "red" }}>*</span>
                              {/* {
                watch("licenseCopyfileUrl") &&
                (
                  <div>
                    <small>File Uploaded</small>
                  </div>
                )
              } */}
                            </td>

                            <td className="d-flex justify-content-center">

                              {watch('licenseCopyfileUrl') && (
                                <a onClick={() => getDocShareholding(watch('licenseCopyfileUrl'), setLoading)} className="btn btn-sm ">
                                  <Visibility color="info" className="icon" />
                                </a>
                              )}

                              <ReportProblemIcon
                                style={{
                                  color: getIconColor(t('LICENSE_COPY')),
                                }}
                                className="ml-2"
                                onClick={() => {
                                  setSmShow(true)
                                  setOpennedModal(t('LICENSE_COPY'));
                                  setLabelValue(t('LICENSE_COPY')),
                                    setFieldValue(watch('licenseCopyfileUrl') || null);
                                }}
                              ></ReportProblemIcon>
                            </td>


                          </tr>
                          <tr>
                            <th className="fw-normal">3</th>
                            <td>
                              {" "}
                              {`${t("EDC_AVAILED")}`}<span style={{ color: "red" }}>*</span>
                              {/* {
                watch("edcaVailedfileUrl") &&
                (
                  <div>
                    <small>File Uploaded</small>
                  </div>
                )
              } */}


                            </td>
                            <td className="d-flex justify-content-center">

                              {watch('edcaVailedfileUrl') && (
                                <a onClick={() => getDocShareholding(watch('edcaVailedfileUrl'), setLoading)} className="btn btn-sm ">
                                  <Visibility color="info" className="icon" />
                                </a>
                              )}

                              <ReportProblemIcon
                                style={{
                                  color: getIconColor(t('EDC_AVAILED')),
                                }}
                                className="ml-2"
                                onClick={() => {
                                  setSmShow(true)
                                  setOpennedModal(t('EDC_AVAILED'));
                                  setLabelValue(t('EDC_AVAILED')),
                                    setFieldValue(watch('edcaVailedfileUrl') || null);
                                }}
                              ></ReportProblemIcon>
                            </td>

                          </tr>

                          {
                            (watch('thirdPartyRights') === 'no') && (
                              <tr>
                                <th className="fw-normal">4</th>
                                <td>
                                  {`${t("DECLARATION_OF_THIRD_PARTY_RIGHTS")}`}
                                  <span style={{ color: "red" }}>*</span>
                                  {/* {
                    watch("thirdPartyRightsDeclarationfileUrl") &&
                    (
                      <div>
                        <small>File Uploaded</small>
                      </div>
                    )
                  } */}
                                </td>

                                <td className="d-flex justify-content-center">

                                  {watch('thirdPartyRightsDeclarationfileUrl') && (
                                    <a onClick={() => getDocShareholding(watch('thirdPartyRightsDeclarationfileUrl'), setLoading)} className="btn btn-sm ">
                                      <Visibility color="info" className="icon" />
                                    </a>
                                  )}

                                  <ReportProblemIcon
                                    style={{
                                      color: getIconColor(t('DECLARATION_OF_THIRD_PARTY_RIGHTS')),
                                    }}
                                    className="ml-2"
                                    onClick={() => {
                                      setSmShow(true)
                                      setOpennedModal(t('DECLARATION_OF_THIRD_PARTY_RIGHTS'));
                                      setLabelValue(t('DECLARATION_OF_THIRD_PARTY_RIGHTS')),
                                        setFieldValue(watch('thirdPartyRightsDeclarationfileUrl') || null);
                                    }}
                                  ></ReportProblemIcon>
                                </td>

                              </tr>
                            )
                          }

                          {
                            (watch('thirdPartyRights') === 'yes') && (
                              <tr>
                                <th className="fw-normal">4</th>
                                <td>
                                  {`${t("DETAILED_SCHEME_OF_RELOCATION")}`}
                                  <span style={{ color: "red" }}>*</span>
                                  {/* {
                    watch("detailedRelocationSchemefileUrl") &&
                    (
                      <div>
                        <small>File Uploaded</small>
                      </div>
                    )
                  } */}
                                </td>

                                <td className="d-flex justify-content-center">

                                  {watch('detailedRelocationSchemefileUrl') && (
                                    <a onClick={() => getDocShareholding(watch('detailedRelocationSchemefileUrl'), setLoading)} className="btn btn-sm ">
                                      <Visibility color="info" className="icon" />
                                    </a>
                                  )}

                                  <ReportProblemIcon
                                    style={{
                                      color: getIconColor(t('DETAILED_SCHEME_OF_RELOCATION')),
                                    }}
                                    className="ml-2"
                                    onClick={() => {
                                      setSmShow(true)
                                      setOpennedModal(t('DETAILED_SCHEME_OF_RELOCATION'));
                                      setLabelValue(t('DETAILED_SCHEME_OF_RELOCATION')),
                                        setFieldValue(watch('detailedRelocationSchemefileUrl') || null);
                                    }}
                                  ></ReportProblemIcon>
                                </td>

                              </tr>
                            )
                          }

                          <tr>
                            <th className="fw-normal">{watch('thirdPartyRights') ? '5' : '4'}</th>
                            <td>
                              {" "}
                              {`${t("AREA_FALLING_UNDER_24M_ROAD_OR_SECTOR_DIVIDING_ROAD_AND_GREEN_BELT")}`}{" "}
                              <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <fieldset>
                                <div className="row-12">
                                  <div className="col col-12 d-flex align-items-center">
                                    <label htmlFor="areaFalling">
                                      <input
                                        type="radio"
                                        label="Yes"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios1"
                                        value="yes"
                                        onChange={(e) => handleselects(e)}
                                        disabled {...register("areaFallingDividing", { required: "Please Select (Yes/No)" })}
                                      />
                                      &nbsp; {`${t("YES")}`} &nbsp;&nbsp;
                                    </label>
                                    <label htmlFor="areaFalling">
                                      <input
                                        type="radio"
                                        label="No"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios2"
                                        value="no"
                                        onChange={(e) => handleselects(e)}
                                        disabled {...register("areaFallingDividing", { required: "Please Select (Yes/No)" })}
                                      />
                                      &nbsp; {`${t("NO")}`} &nbsp;&nbsp;
                                    </label>
                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.areaFallingDividing && errors?.areaFallingDividing?.message}
                                    </h3>

                                    <ReportProblemIcon
                                      style={{
                                        color: getIconColor(t('AREA_FALLING_UNDER_24M_ROAD_OR_SECTOR_DIVIDING_ROAD_AND_GREEN_BELT')),
                                      }}
                                      className="ml-2"
                                      onClick={() => {
                                        setSmShow(true)
                                        setOpennedModal(t('AREA_FALLING_UNDER_24M_ROAD_OR_SECTOR_DIVIDING_ROAD_AND_GREEN_BELT'));
                                        setLabelValue(t('AREA_FALLING_UNDER_24M_ROAD_OR_SECTOR_DIVIDING_ROAD_AND_GREEN_BELT')),
                                          setFieldValue(watch('areaFallingDividing') || null);
                                      }}
                                    ></ReportProblemIcon>

                                  </div>
                                </div>
                              </fieldset>
                            </td>
                          </tr>

                        </tbody>
                        {/* {selects}efewfwefwef */}
                        {watch('areaFallingDividing') === "yes" && (
                          // <table class="table">
                          <tbody>
                            <tr>
                              <th className="fw-normal">{watch('thirdPartyRights') ? '6' : '5'}</th>
                              <td>
                                {" "}
                                {`${t("GIFT_DEED")}`}
                                <span style={{ color: "red" }}>*</span>
                                {/* {
                  watch("giftDeedfileUrl") &&
                  (
                    <div>
                      <small>File Uploaded</small>
                    </div>
                  )
                } */}
                              </td>

                              <td className="d-flex justify-content-center">

                                {watch('giftDeedfileUrl') && (
                                  <a onClick={() => getDocShareholding(watch('giftDeedfileUrl'), setLoading)} className="btn btn-sm ">
                                    <Visibility color="info" className="icon" />
                                  </a>
                                )}

                                <ReportProblemIcon
                                  style={{
                                    color: getIconColor(t('GIFT_DEED')),
                                  }}
                                  className="ml-2"
                                  onClick={() => {
                                    setSmShow(true)
                                    setOpennedModal(t('GIFT_DEED'));
                                    setLabelValue(t('GIFT_DEED')),
                                      setFieldValue(watch('giftDeedfileUrl') || null);
                                  }}
                                ></ReportProblemIcon>
                              </td>

                            </tr>
                            <tr>
                              <th className="fw-normal">{watch('thirdPartyRights') ? '7' : '6'}</th>
                              <td>
                                {" "}
                                {`${t("MUTATION")}`}
                                <span style={{ color: "red" }}>*</span>
                                {/* {
                  watch("mutationfileUrl") &&
                  (
                    <div>
                      <small>File Uploaded</small>
                    </div>
                  )
                } */}
                              </td>

                              <td className="d-flex justify-content-center">

                                {watch('mutationfileUrl') && (
                                  <a onClick={() => getDocShareholding(watch('mutationfileUrl'), setLoading)} className="btn btn-sm ">
                                    <Visibility color="info" className="icon" />
                                  </a>
                                )}

                                <ReportProblemIcon
                                  style={{
                                    color: getIconColor(t('MUTATION')),
                                  }}
                                  className="ml-2"
                                  onClick={() => {
                                    setSmShow(true)
                                    setOpennedModal(t('MUTATION'));
                                    setLabelValue(t('MUTATION')),
                                      setFieldValue(watch('mutationfileUrl') || null);
                                  }}
                                ></ReportProblemIcon>
                              </td>

                            </tr>
                            <tr>
                              <th className="fw-normal">{watch('thirdPartyRights') ? '8' : '7'}</th>
                              <td>
                                {" "}
                                {`${t("JAMABANDHI")}`}<span style={{ color: "red" }}>*</span>
                                {/* {
                  watch("jamabandhifileUrl") &&
                  (
                    <div>
                      <small>File Uploaded</small>
                    </div>
                  )
                } */}
                              </td>

                              <td className="d-flex justify-content-center">

                                {watch('jamabandhifileUrl') && (
                                  <a onClick={() => getDocShareholding(watch('jamabandhifileUrl'), setLoading)} className="btn btn-sm ">
                                    <Visibility color="info" className="icon" />
                                  </a>
                                )}

                                <ReportProblemIcon
                                  style={{
                                    color: getIconColor(t('JAMABANDHI')),
                                  }}
                                  className="ml-2"
                                  onClick={() => {
                                    setSmShow(true)
                                    setOpennedModal(t('JAMABANDHI'));
                                    setLabelValue(t('JAMABANDHI')),
                                      setFieldValue(watch('jamabandhifileUrl') || null);
                                  }}
                                ></ReportProblemIcon>
                              </td>

                            </tr>
                          </tbody>
                          // </table>
                        )}
                      </div>
                      // </div>
                    )}
                  </div>

                  <div>
                    {watch('selectType') === "PARTIAL" && (
                      // <div className="card">
                      <div className="table table-bordered table-responsive">
                        {/* <caption>List of users</caption> */}
                        <thead>
                          <tr>
                            <th style={{ textAlign: "center" }}>{`${t("SR_NO")}`}</th>
                            <th style={{ textAlign: "center" }}> {`${t("FIELD_NAME")}`}</th>
                            <th style={{ textAlign: "center" }}> {`${t("UPLOAD_DOCUMENTS")}`}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th className="fw-normal">1</th>
                            <td>
                              {" "}
                              {`${t("DECLARATION_IDW_WORKS")}`}<span style={{ color: "red" }}>*</span>
                              {/* {
                watch("declarationIDWWorksfileUrl") &&
                (
                  <div>
                    <small>File Uploaded</small>
                  </div>
                )
              } */}
                            </td>

                            <td className="d-flex justify-content-center">

                              {watch('declarationIDWWorksfileUrl') && (
                                <a onClick={() => getDocShareholding(watch('declarationIDWWorksfileUrl'), setLoading)} className="btn btn-sm ">
                                  <Visibility color="info" className="icon" />
                                </a>
                              )}

                              <ReportProblemIcon
                                style={{
                                  color: getIconColor(t('DECLARATION_IDW_WORKS')),
                                }}
                                className="ml-2"
                                onClick={() => {
                                  setSmShow(true)
                                  setOpennedModal(t('DECLARATION_IDW_WORKS'));
                                  setLabelValue(t('DECLARATION_IDW_WORKS')),
                                    setFieldValue(watch('declarationIDWWorksfileUrl') || null);
                                }}
                              ></ReportProblemIcon>
                            </td>

                          </tr>
                          <tr>
                            <th className="fw-normal">2</th>
                            <td>
                              {" "}
                              {`${t("REVISED_LAYOUT_PLAN")}`}
                              <span style={{ color: "red" }}>*</span>
                              {/* {
                watch("revisedLayoutPlanfileUrl") &&
                (
                  <div>
                    <small>File Uploaded</small>
                  </div>
                )
              } */}
                            </td>

                            <td className="d-flex justify-content-center">

                              {watch('revisedLayoutPlanfileUrl') && (
                                <a onClick={() => getDocShareholding(watch('revisedLayoutPlanfileUrl'), setLoading)} className="btn btn-sm ">
                                  <Visibility color="info" className="icon" />
                                </a>
                              )}

                              <ReportProblemIcon
                                style={{
                                  color: getIconColor(t('REVISED_LAYOUT_PLAN')),
                                }}
                                className="ml-2"
                                onClick={() => {
                                  setSmShow(true)
                                  setOpennedModal(t('REVISED_LAYOUT_PLAN'));
                                  setLabelValue(t('REVISED_LAYOUT_PLAN')),
                                    setFieldValue(watch('revisedLayoutPlanfileUrl') || null);
                                }}
                              ></ReportProblemIcon>
                            </td>

                          </tr>
                          <tr>
                            <th className="fw-normal">3</th>
                            <td>
                              {" "}
                              {`${t("EDC_AVAILED")}`}<span style={{ color: "red" }}>*</span>
                              {/* {
                watch("availedEdcfileUrl") &&
                (
                  <div>
                    <small>File Uploaded</small>
                  </div>
                )
              } */}
                            </td>

                            <td className="d-flex justify-content-center">

                              {watch('availedEdcfileUrl') && (
                                <a onClick={() => getDocShareholding(watch('availedEdcfileUrl'), setLoading)} className="btn btn-sm ">
                                  <Visibility color="info" className="icon" />
                                </a>
                              )}

                              <ReportProblemIcon
                                style={{
                                  color: getIconColor(t('EDC_AVAILED')),
                                }}
                                className="ml-2"
                                onClick={() => {
                                  setSmShow(true)
                                  setOpennedModal(t('EDC_AVAILED'));
                                  setLabelValue(t('EDC_AVAILED')),
                                    setFieldValue(watch('availedEdcfileUrl') || null);
                                }}
                              ></ReportProblemIcon>
                            </td>

                          </tr>
                          <tr>
                            <th className="fw-normal">4</th>
                            <td>
                              {" "}
                              {`${t("AREA_FALLING_UNDER_24M_ROAD_OR_SECTOR_DIVIDING_ROAD")}`} <span style={{ color: "red" }}>*</span>
                              {/* {
                watch("areaFallingUnderfileUrl") &&
                (
                  <div>
                    <small>File Uploaded</small>
                  </div>
                )
              } */}
                            </td>

                            <td className="d-flex justify-content-center">

                              {watch('areaFallingUnderfileUrl') && (
                                <a onClick={() => getDocShareholding(watch('areaFallingUnderfileUrl'), setLoading)} className="btn btn-sm ">
                                  <Visibility color="info" className="icon" />
                                </a>
                              )}

                              <ReportProblemIcon
                                style={{
                                  color: getIconColor(t('AREA_FALLING_UNDER_24M_ROAD_OR_SECTOR_DIVIDING_ROAD')),
                                }}
                                className="ml-2"
                                onClick={() => {
                                  setSmShow(true)
                                  setOpennedModal(t('AREA_FALLING_UNDER_24M_ROAD_OR_SECTOR_DIVIDING_ROAD'));
                                  setLabelValue(t('AREA_FALLING_UNDER_24M_ROAD_OR_SECTOR_DIVIDING_ROAD')),
                                    setFieldValue(watch('areaFallingUnderfileUrl') || null);
                                }}
                              ></ReportProblemIcon>
                            </td>

                          </tr>

                          {
                            (watch('thirdPartyRights') === 'no') && (
                              <tr>
                                <th className="fw-normal">5</th>
                                <td>
                                  {`${t("DECLARATION_OF_THIRD_PARTY_RIGHTS")}`}
                                  <span style={{ color: "red" }}>*</span>
                                  {/* {
                    watch("thirdPartyRightsDeclarationfileUrl") &&
                    (
                      <div>
                        <small>File Uploaded</small>
                      </div>
                    )
                  } */}
                                </td>

                                <td className="d-flex justify-content-center">

                                  {watch('thirdPartyRightsDeclarationfileUrl') && (
                                    <a onClick={() => getDocShareholding(watch('thirdPartyRightsDeclarationfileUrl'), setLoading)} className="btn btn-sm ">
                                      <Visibility color="info" className="icon" />
                                    </a>
                                  )}

                                  <ReportProblemIcon
                                    style={{
                                      color: getIconColor(t('DECLARATION_OF_THIRD_PARTY_RIGHTS')),
                                    }}
                                    className="ml-2"
                                    onClick={() => {
                                      setSmShow(true)
                                      setOpennedModal(t('DECLARATION_OF_THIRD_PARTY_RIGHTS'));
                                      setLabelValue(t('DECLARATION_OF_THIRD_PARTY_RIGHTS')),
                                        setFieldValue(watch('thirdPartyRightsDeclarationfileUrl') || null);
                                    }}
                                  ></ReportProblemIcon>
                                </td>

                              </tr>
                            )
                          }

                          {
                            (watch('thirdPartyRights') === 'yes') && (
                              <tr>
                                <th className="fw-normal">5</th>
                                <td>
                                  {`${t("DETAILED_SCHEME_OF_RELOCATION")}`}
                                  <span style={{ color: "red" }}>*</span>
                                  {/* {
                    watch("detailedRelocationSchemefileUrl") &&
                    (
                      <div>
                        <small>File Uploaded</small>
                      </div>
                    )
                  } */}
                                </td>

                                <td className="d-flex justify-content-center">

                                  {watch('detailedRelocationSchemefileUrl') && (
                                    <a onClick={() => getDocShareholding(watch('detailedRelocationSchemefileUrl'), setLoading)} className="btn btn-sm ">
                                      <Visibility color="info" className="icon" />
                                    </a>
                                  )}

                                  <ReportProblemIcon
                                    style={{
                                      color: getIconColor(t('DETAILED_SCHEME_OF_RELOCATION')),
                                    }}
                                    className="ml-2"
                                    onClick={() => {
                                      setSmShow(true)
                                      setOpennedModal(t('DETAILED_SCHEME_OF_RELOCATION'));
                                      setLabelValue(t('DETAILED_SCHEME_OF_RELOCATION')),
                                        setFieldValue(watch('detailedRelocationSchemefileUrl') || null);
                                    }}
                                  ></ReportProblemIcon>
                                </td>

                              </tr>
                            )
                          }


                          <tr>
                            <th className="fw-normal">{watch('thirdPartyRights') ? '6' : '5'}</th>
                            <td>
                              {" "}
                              {`${t("AREA_FALLING_UNDER_24M_ROAD_OR_SECTOR_DIVIDING_ROAD_AND_GREEN_BELT")}`}{" "}
                              <span style={{ color: "red" }}>*</span>
                            </td>
                            <td>
                              <fieldset>
                                <div className="row-12">
                                  <div className="col col-12 d-flex align-items-center">
                                    <label htmlFor="areaFalling">
                                      <input
                                        type="radio"
                                        label="Yes"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios1"
                                        value="yes"
                                        onChange={(e) => handleselects(e)}
                                        disabled {...register("areaFallingDividing", { required: "Please Select (Yes/No)" })}
                                      />
                                      &nbsp; {`${t("YES")}`} &nbsp;&nbsp;
                                    </label>
                                    <label htmlFor="areaFalling">
                                      <input
                                        type="radio"
                                        label="No"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios2"
                                        value="no"
                                        onChange={(e) => handleselects(e)}
                                        disabled {...register("areaFallingDividing", { required: "Please Select (Yes/No)" })}
                                      />
                                      &nbsp; {`${t("NO")}`} &nbsp;&nbsp;
                                    </label>
                                    <h3 className="error-message" style={{ color: "red" }}>
                                      {errors?.areaFallingDividing && errors?.areaFallingDividing?.message}
                                    </h3>

                                    <ReportProblemIcon
                                      style={{
                                        color: getIconColor(t('AREA_FALLING_UNDER_24M_ROAD_OR_SECTOR_DIVIDING_ROAD_AND_GREEN_BELT')),
                                      }}
                                      className="ml-2"
                                      onClick={() => {
                                        setSmShow(true)
                                        setOpennedModal(t('AREA_FALLING_UNDER_24M_ROAD_OR_SECTOR_DIVIDING_ROAD_AND_GREEN_BELT'));
                                        setLabelValue(t('AREA_FALLING_UNDER_24M_ROAD_OR_SECTOR_DIVIDING_ROAD_AND_GREEN_BELT')),
                                          setFieldValue(watch('areaFallingDividing') || null);
                                      }}
                                    ></ReportProblemIcon>

                                  </div>
                                </div>
                              </fieldset>
                            </td>
                          </tr>
                        </tbody>

                        {watch('areaFallingDividing') === "yes" && (
                          <tbody>
                            <tr>
                              <th className="fw-normal">{watch('thirdPartyRights') ? '7' : '6'}</th>
                              <td>
                                {" "}
                                {`${t("GIFT_DEED")}`}
                                <span style={{ color: "red" }}>*</span>
                                {/* {
                  watch("giftDeedfileUrl") &&
                  (
                    <div>
                      <small>File Uploaded</small>
                    </div>
                  )
                } */}
                              </td>

                              <td className="d-flex justify-content-center">

                                {watch('giftDeedfileUrl') && (
                                  <a onClick={() => getDocShareholding(watch('giftDeedfileUrl'), setLoading)} className="btn btn-sm ">
                                    <Visibility color="info" className="icon" />
                                  </a>
                                )}

                                <ReportProblemIcon
                                  style={{
                                    color: getIconColor(t('GIFT_DEED')),
                                  }}
                                  className="ml-2"
                                  onClick={() => {
                                    setSmShow(true)
                                    setOpennedModal(t('GIFT_DEED'));
                                    setLabelValue(t('GIFT_DEED')),
                                      setFieldValue(watch('giftDeedfileUrl') || null);
                                  }}
                                ></ReportProblemIcon>
                              </td>

                            </tr>
                            <tr>
                              <th className="fw-normal">{watch('thirdPartyRights') ? '8' : '7'}</th>
                              <td>
                                {" "}
                                {`${t("MUTATION")}`}
                                <span style={{ color: "red" }}>*</span>
                                {/* {
                  watch("mutationfileUrl") &&
                  (
                    <div>
                      <small>File Uploaded</small>
                    </div>
                  )
                } */}
                              </td>

                              <td className="d-flex justify-content-center">

                                {watch('mutationfileUrl') && (
                                  <a onClick={() => getDocShareholding(watch('mutationfileUrl'), setLoading)} className="btn btn-sm ">
                                    <Visibility color="info" className="icon" />
                                  </a>
                                )}

                                <ReportProblemIcon
                                  style={{
                                    color: getIconColor(t('MUTATION')),
                                  }}
                                  className="ml-2"
                                  onClick={() => {
                                    setSmShow(true)
                                    setOpennedModal(t('MUTATION'));
                                    setLabelValue(t('MUTATION')),
                                      setFieldValue(watch('mutationfileUrl') || null);
                                  }}
                                ></ReportProblemIcon>
                              </td>

                            </tr>
                            <tr>
                              <th className="fw-normal">{watch('thirdPartyRights') ? '9' : '8'}</th>
                              <td>
                                {" "}
                                {`${t("JAMABANDHI")}`} <span style={{ color: "red" }}>*</span>
                                {/* {
                  watch("jamabandhifileUrl") &&
                  (
                    <div>
                      <small>File Uploaded</small>
                    </div>
                  )
                } */}
                              </td>

                              <td className="d-flex justify-content-center">

                                {watch('jamabandhifileUrl') && (
                                  <a onClick={() => getDocShareholding(watch('jamabandhifileUrl'), setLoading)} className="btn btn-sm ">
                                    <Visibility color="info" className="icon" />
                                  </a>
                                )}

                                <ReportProblemIcon
                                  style={{
                                    color: getIconColor(t('JAMABANDHI')),
                                  }}
                                  className="ml-2"
                                  onClick={() => {
                                    setSmShow(true)
                                    setOpennedModal(t('JAMABANDHI'));
                                    setLabelValue(t('JAMABANDHI')),
                                      setFieldValue(watch('jamabandhifileUrl') || null);
                                  }}
                                ></ReportProblemIcon>
                              </td>

                            </tr>
                          </tbody>
                        )}
                      </div>
                      //   </div>
                      // </div>
                    )}
                  </div>
                </div>

                {/* <div class="row">
  <div class="col-sm-12 text-right">
    <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
      Submit
    </button>
  </div>
  <div class="col-sm-12 text-right">
    <button id="btnSearch" class="btn btn-primary btn-md center-block" style={{ marginTop: "-58px", marginRight: "97px" }}>
      Save as Draft
    </button>
  </div>
</div> */}
              </div>

            </div>

          </Card>
        </div>
      </Collapse>
    </form>
  );
}

export default SurrenderLicScrutiny;
