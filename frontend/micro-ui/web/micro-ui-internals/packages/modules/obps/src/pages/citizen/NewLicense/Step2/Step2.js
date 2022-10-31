import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { VALIDATION_SCHEMA } from "../../../../utils/schema/step2";
import InfoIcon from "@mui/icons-material/Info";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import WorkingTable from "../../../../components/Table";

import ReactMultiSelect from "../../../../../../../react-components/src/atoms/ReactMultiSelect";

const tableData = [
  {
    key: "1",
    tehsil: "Mike",
    revenueEstate: 32,
    rectangleNo: "10 Downing Street",
    killa: "10 Downing Street",
    landOwner: "10 Downing Street",
    consolidationType: "10 Downing Street",
    kanal: "10 Downing Street",
    marla: "10 Downing Street",
  },
];

const optionsPurposeList = [
  {
    label: "plotted Commercial",
    value: "P",
    id: "1",
  },
  {
    label: "Group Housing Commercial",
    value: "G",
    id: "2",
  },
  {
    label: "AGH",
    value: "03",
    id: "3",
  },
  {
    label: "Commercial Integrated",
    value: "04",
    id: "3",
  },
  {
    label: "Commercial Plotted",
    value: "C",
    id: "3",
  },
  {
    label: "Industrial Colony Commercial",
    value: "06",
    id: "3",
  },
  {
    label: "IT Colony Commercial",
    value: "I",
    id: "3",
  },
  {
    label: "DDJAY",
    value: "D",
    id: "3",
  },
  {
    label: "NILP",
    value: "N",
    id: "3",
  },
  {
    label: "Low Density Ecofriendly",
    value: "10",
    id: "3",
  },
  {
    label: "TOD Commercial",
    value: "TC",
    id: "3",
  },
  {
    label: "TOD Group housing",
    value: "TG",
    id: "3",
  },
];
const optionsPotentialList = [
  {
    label: "Hyper",
    value: "Hyper",
    id: "1",
  },
  {
    label: "High I",
    value: "High I",
    id: "2",
  },
  {
    label: "High II",
    value: "High II",
    id: "3",
  },
  {
    label: "Medium",
    value: "Medium",
    id: "3",
  },
  {
    label: "Low I",
    value: "Low I",
    id: "3",
  },
  {
    label: "Low II",
    value: "Low II",
    id: "3",
  },
];

const columns = [
  {
    key: "tehsil",
    title: "Tehsil",
    dataIndex: "tehsil",
  },
  {
    key: "revenueEstate",
    title: "Revenue Estate",
    dataIndex: "revenueEstate",
  },
  {
    key: "rectangleNo",
    title: "Rectangle No.",
    dataIndex: "rectangleNo",
  },
  {
    key: "killa",
    title: "Killa",
    dataIndex: "killa",
  },
  {
    key: "landOwner",
    title: "Land Owner",
    dataIndex: "landOwner",
  },
  {
    key: "consolidationType",
    title: "Consolidation Type",
    dataIndex: "consolidationType",
  },
  {
    key: "kanal",
    title: "Kanal/Bigha",
    dataIndex: "kanal",
  },
  {
    key: "marla",
    title: "Marla/Biswa",
    dataIndex: "marla",
  },
  {
    key: "action",
    title: "Action",
    dataIndex: "action",
  },
];

const ApllicantPuropseForm = (props) => {
  const [form, setForm] = useState([]);
  const [purposeDd, setSelectPurpose] = useState("");
  const [potential, setPotentialDev] = useState("");
  const [district, setDistrict] = useState("");
 
  const [revenueEstate, setRevenueEstate] = useState("");
  const [consolidation, setConsolidation] = useState("");
  const [show, setShow] = useState(false);
  const [PurposeformSubmitted, SetPurposeformSubmitted] = useState(false);
  const [tehsil, setTehsil] = useState({});
  const [landOwner, setLandOwner] = useState({});
  
  const [revenueName, setRevenueName] = useState({});
  const [mustil, setMustil] = useState({});
  const [khewat, setKhewat] = useState("");
 
  const [developerCompany, setDeveloperCompany] = useState("");
  const [sector, setSector] = useState("");
  const [Rectangle, setRectangle] = useState("");
  const [sarsai, setSarsai] = useState("");
  const [registeringAuthorityDoc, setRegisteringAuthorityDoc] = useState("");
  const [colKhasra, setColKhasra] = useState("");
  const [kanalBigha, setkanalBigha] = useState("");
  const [registeringdate, setRegisteingDate] = useState("");
  const [validitydate, setValiditydate] = useState("");
  const [colirrevocialble, setColirrevocialble] = useState("");
  const [authSignature, setAuthSignature] = useState("");
  const [nameAuthSign, setNameAuthSign] = useState("");
  const [registeringAuthority, setRegisteringAuthority] = useState("");
  const [marlaBiswa, setMarlaBiswa] = useState("");
  const handleShow = () => setShow(true);
  const [district2, setDistrict2] = useState("");
  const [modalValuesArray, setModalValuesArray] = useState([]);
  const [modalTehsil, setModalTehsil] = useState("");
  const [ModalRevenueEstate, setModalRevenueEstate] = useState("");
  const [modalRectangleNo, setModalRectangleNo] = useState("");
  const [modalSector, setModalSector] = useState("");
  const [modalConsolidation, setModalConsolidation] = useState("");
  const [modalKilla, setModalKilla] = useState("");
  const [modalKhewat, setModalKhewat] = useState("");
  const [modalKanal, setModalKanal] = useState("");
  const [modalMarla, setModalMarla] = useState("");
  const [modalLand, setModalLand] = useState("");
  const [districtData, setDistrictData] = useState([]);
  const [tehsilData, setTehsilData] = useState([]);
  const [revenueStateData, setRevenuStateData] = useState([]);
  const [mustilData, setMustilData] = useState([]);
  const [khewatData, setKhewatData] = useState([]);
  const [killaData, setKillaData] = useState([]);
  const [khasraData, setKhasraData] = useState([]);
  const [districtDataLbels, setDistrictDataLabels] = useState([]);
  const [tehsilDataLabels, setTehsilDataLabels] = useState([]);
  const [revenueDataLabels, setRevenueDataLabels] = useState([]);
  const [mustilDataLabels, setMustilDataLabels] = useState([]);
  const [khewatDataLabels, setKhewatDataLabels] = useState([]);
  const [editValues, setEditValues] = useState({});
  const [docUpload, setDocuploadData] = useState([]);
  const [file, setFile] = useState(null);
  const [modal, setmodal] = useState(false);
  const [showhide1, setShowhide1] = useState("No");
  const [showhide2, setShowhide2] = useState("No");
  const [tehsilCode, setTehsilCode] = useState(null);
  
  const [displayEditModal, setDisplayEditModal] = useState("none");
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    // resolver: yupResolver(VALIDATION_SCHEMA),
    shouldFocusError: true,
  });
  const handleshow1 = (e) => {
    const getshow = e.target.value;
    setShowhide1(getshow);
  };
  const handleshow2 = (e) => {
    const getshow = e.target.value;
    setShowhide2(getshow);
  };

  // const handleArrayValues = () => {
  //   if (tehsil.name !== "" && revenueName !== "" && mustil != "") {
  //     const values = {
  //       tehsil: tehsil.name,
  //       revenueEstate: revenueName.name,
  //       rectangleNo: mustil,
  //       land: owmerName,
  //     };
  //     setModalValuesArray((prev) => [...prev, values]);
  //     setmodal(!modal);
  //   }
  // };

  const DistrictApiCall = async () => {
    try {
      const postDistrict = {
        RequestInfo: {
          apiId: "Rainmaker",
          ver: "v1",
          ts: 0,
          action: "_search",
          did: "",
          key: "",
          msgId: "090909",
          requesterId: "",
          authToken: "",
        },
      };

      console.log("SS", process.env.REACT_APP_PROXY_MDMS);
      const Resp = await axios.post("http://10.1.1.18:8094/egov-mdms-service/v1/_district", postDistrict).then((Resp) => {
        console.log("DISTRICTLIST", Resp);
        return Resp;
      });
      setDistrictData(Resp.data);
      if (Resp.data.length > 0 && Resp.data !== undefined && Resp.data !== null) {
        Resp.data.map((el, i) => {
          setDistrictDataLabels((prev) => [...prev, { label: el.districtName, id: el.districtCode, value: el.districtCode }]);
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const getTehslidata = async (data) => {
    const datapost = {
      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        requesterId: "",
        authToken: "",
      },
    };

    try {
      const Resp = await axios.post("http://10.1.1.18:8094/egov-mdms-service/v1/_tehsil?dCode=" + data, datapost, {}).then((response) => {
        return response;
      });
      setTehsilData(Resp.data);
      if (Resp.data.length > 0 && Resp.data !== undefined && Resp.data !== null) {
        Resp.data.map((el, i) => {
          setTehsilDataLabels((prev) => [...prev, { label: el.name, id: el.code, value: el.code }]);
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const getRevenuStateData = async (code) => {
    const datatopost = {
      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        requesterId: "",
        authToken: "",
      },
    };

    try {
      const Resp = await axios
        .post("http://10.1.1.18:8094/egov-mdms-service/v1/_village?" + "dCode=" + district + "&" + "tCode=" + code, datatopost, {})
        .then((response) => {
          return response;
        });
      setRevenuStateData(Resp.data);

      if (Resp.data.length > 0 && Resp.data !== undefined && Resp.data !== null) {
        Resp.data.map((el, i) => {
          setRevenueDataLabels((prev) => [...prev, { label: el.name, id: el.khewats, value: el.code, khewats: el.khewats, code: el.code }]);
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getMustilData = async (code) => {
    const datpost = {
      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        requesterId: "",
        authToken: "",
      },
    };

    try {
      const Resp = await axios
        .post(
          "http://10.1.1.18:8094/egov-mdms-service/v1/_must?" + "dCode=" + district + "&" + "tCode=" + tehsilCode + "&NVCode=" + code,
          datpost,
          {}
        )
        .then((response) => {
          console.log("DD", response.data.must);
          return response;
        });
      setMustilData(Resp.data.must);
      if (Resp.data.must.length > 0 && Resp.data.must !== undefined && Resp.data.must !== null) {
        Resp.data.must.map((el, i) => {
          setMustilDataLabels((prev) => [...prev, { label: el, id: i, value: el }]);
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getLandOwnerStateData = async (code) => {
    const datatopos = {
      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        requesterId: "",
        authToken: "",
      },
    };

    try {
      const Resp = await axios
        .post(
          "http://10.1.1.18:8094/egov-mdms-service/v1/_owner?" +
            "dCode=" +
            district +
            "&" +
            "tCode=" +
            tehsilCode +
            "&NVCode=" +
            code +
            "&khewat=" +
            code.khewat,
          datatopos,
          {}
        )
        .then((response) => {
          return response;
        });
      setKhewatData(Resp.data);

      if (Resp.data.length > 0 && Resp.data !== undefined && Resp.data !== null) {
        Resp.data.map((el, i) => {
          setKhewatDataLabels((prev) => [...prev, { label: el.name, id: el.code, value: el.khewats }]);
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    DistrictApiCall();
  }, []);
  // useEffect(() => {
  //   getTehslidata();
  // }, [district2]);

  // useEffect(() => {
  //   getRevenuStateData();
  // }, [district2, tehsil]);

  // useEffect(() => {
  //   getMustilData();
  // }, [district2, tehsil, revenueName, khewat]);

  // useEffect(() => {
  //   getLandOwnerStateData();
  // }, [district2, tehsil, revenueName.khewat]);

  useEffect(() => {
    console.log("district2", district2);
  }, [district2]);

  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };
  const [displayDdjayForm, setDisplayDdjayForm] = useState({ display: "none" });
  const [displayResidential, setDisplayResidential] = useState({ display: "none" });

  const setSelectPurposeDd = (e) => {
    const purposeSelected = e.target.value;
    console.log("purpose", purposeSelected);
    localStorage.setItem("purpose", purposeSelected);
  };
  const setSelectDevPlan = (e) => {
    const potentialSelected = e.target.value;
    console.log("potential", potentialSelected);
    localStorage.setItem("potential", potentialSelected);
  };

  const setSelect = (e) => {
    const purposeSelected = e.target.value;
    console.log("purpose", purposeSelected);
    localStorage.setItem("purpose", purposeSelected);
  };

  const ApplicantPurposeModalData =(data)=>{
    
    const values ={
      "tehsil":tehsilCode,
      "kanal":modalKanal,
      
    }
    console.log("data++++++", data);
    // setModalValuesArray((prev)=>[...prev,values]);
   
  };
  
  

  const PurposeFormSubmitHandler = async (data) => {
    console.log("data===", data);
    props.Step2Continue({ data });
    try {
      const postDistrict = {
        NewServiceInfo: {
          newServiceInfoData: [
            {
              ApplicantInfo: {
                authorizedDeveloper: "",
                authorizedPerson: "sd",
                authorizedmobile: "sds",
                alternatemobile: "1e",
                authorizedEmail: "eeds",
                authorizedPan: "fsd",
                authorizedAddress: "",
                village: "village",
                authorizedPinCode: "",
                tehsil: "dsf",
                district: "sdf",
                state: "dsf",
                status: "fgr",
                LC: LC,
                address: address,
                permanentAddress: "fgd",
                notSigned: "fgver",
                email: "gfg",
                authorized: "rgsf",
              },
              ApplicantPurpose: {
                purposeDd: "",
                potential: "",
                district: "",
                state: "",
                ApplicationPurposeData1: {
                  tehsil: "tahsil",
                  revenueEstate: "",
                  mustil: "",
                  consolidation: "",
                  sarsai: "",
                  kanal: "",
                  marla: "",
                  bigha: "",
                  biswansi: "",
                  biswa: "",
                  landOwner: "",
                  developerCompany: "",
                  registeringdate: "",
                  validitydate: "",
                  colirrevocialble: "",
                  authSignature: "",
                  nameAuthSign: "",
                  registeringAuthority: "",
                  registeringAuthorityDoc: "",
                },
              },
              LandSchedule: {
                licenseApplied: "lic",
                LicNo: "",
                potential: "",
                siteLoc: "",
                approach: "",
                approachRoadWidth: "",
                specify: "",
                typeLand: "",
                thirdParty: "",
                migrationLic: "",
                encumburance: "",
                litigation: "",
                court: "",
                insolvency: "",
                appliedLand: "",
                revenuerasta: "",
                watercourse: "",
                compactBlock: "",
                sandwiched: "",
                acquistion: "",
                section4: "",
                section6: "",
                orderUpload: "",
                approachable: "",
                vacant: "",
                construction: "",
                ht: "",
                gas: "",
                nallah: "",
                road: "",
                land: "",
                utilityLine: "",
                landSchedule: "",
                mutation: "",
                jambandhi: "",
                LayoutPlan: "",
                proposedLayoutPlan: "",
                revisedLansSchedule: "",
              },
              DetailsofAppliedLand: {
                dgps: "dsg",
                DetailsAppliedLandData1: {
                  resplotno: "asa",
                  reslengthmtr: "",
                  reswidthmtr: "",
                  resareasq: "",
                  npnlplotno: "",
                  npnllengthmtr: "",
                  npnlwidthmtr: "",
                  npnlareasq: "",
                  ewsplotno: "",
                  ewslengthmtr: "",
                  ewswidthmtr: "",
                  ewsareasq: "",
                  complotno: "",
                  comlengthmtr: "",
                  comwidthmtr: "",
                  comareasq: "",
                  siteplotno: "",
                  sitelengthmtr: "",
                  sitewidthmtr: "",
                  siteareasq: "",
                  parkplotno: "",
                  parklengthmtr: "",
                  parkwidthmtr: "",
                  parkareasq: "",
                  publicplotno: "",
                  publiclengthmtr: "",
                  publicwidthmtr: "",
                  publicareasq: "",
                  stpplotno: "",
                  stplengthmtr: "",
                  stpwidthmtr: "",
                  stpareasq: "",
                  etpplotno: "",
                  etplengthmtr: "",
                  etpwidthmtr: "",
                  etpareasq: "",
                  wtpplotno: "",
                  wtplengthmtr: "",
                  wtpwidthmtr: "",
                  wtpareasq: "",
                  ugtplotno: "",
                  ugtlengthmtr: "",
                  ugtwidthmtr: "",
                  ugtareasq: "",
                  milkboothplotno: "",
                  milkboothlengthmtr: "",
                  milkboothwidthmtr: "",
                  milkboothareasq: "",
                  gssplotno: "",
                  gsslengthmtr: "",
                  gssareasq: "",
                  resDimension: "",
                  resEnteredArea: "",
                  comDimension: "",
                  comEnteredArea: "",
                  secPlanPlot: "",
                  secPlanLength: "",
                  secPlanDim: "",
                  secPlanEntered: "",
                  greenBeltPlot: "",
                  greenBeltLength: "",
                  greenBeltDim: "",
                  greenBeltEntered: "",
                  internalPlot: "",
                  internalLength: "",
                  internalDim: "",
                  internalEntered: "",
                  otherPlot: "",
                  otherLength: "",
                  otherDim: "",
                  otherEntered: "",
                  undeterminedPlot: "",
                  undeterminedLength: "",
                  undeterminedDim: "",
                  undeterminedEntered: "",
                },
                DetailsAppliedLandDdjay2: {
                  frozenNo: "qw",
                  frozenArea: "",
                  organize: "",
                },
                DetailsAppliedLandIndustrial3: {
                  colonyfiftyNo: "qwq",
                  colonyfiftyArea: "",
                  fiftyToTwoNo: "",
                  fiftyToTwoArea: "",
                  twoHundredNo: "",
                  twoHundredArea: "",
                  resiNo: "",
                  resiArea: "",
                  commerNo: "",
                  commerArea: "",
                  labourNo: "",
                  labourArea: "",
                },
                DetailsAppliedLandResidential4: {
                  npnlNo: "wew",
                  npnlArea: "",
                  ewsNo: "",
                  ewsArea: "",
                },
                DetailsAppliedLandNpnl5: {
                  surrender: "sds",
                  pocketProposed: "",
                  deposit: "",
                  surrendered: "",
                },
                DetailsAppliedLand6: {
                  sitePlan: "sdsd",
                  democraticPlan: "",
                  sectoralPlan: "",
                  developmentPlan: "",
                  uploadLayoutPlan: "",
                },
              },
              FeesAndCharges: {
                totalArea: "sdsd",
                purpose: "",
                devPlan: "",
                scrutinyFee: "",
                licenseFee: "",
                conversionCharges: "",
                payableNow: "",
                remark: "",
                adjustFee: "",
              },
            },
          ],
        },
      };

      const Resp = await axios.post("/land-services/new/_create", postDistrict).then((Resp) => {
        console.log("Submit", Resp);
        return Resp;
      });
      setFinalSubmitData(Resp.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  // let forms = {
  //   purposeDd: purposeDd,
  //   potential: potential,
  //   district: district,
    
  //   ApplicationPurposeData1: {
  //     tehsil: tehsil,
  //     revenueEstate: revenueEstate,
  //     mustil: mustil,
  //     consolidation: consolidation,
  //     sarsai: sarsai,
   
  //     landOwner: landOwner,
  //     developerCompany: developerCompany,
  //     registeringdate: registeringdate,
  //     validitydate: validitydate,
  //     colirrevocialble: colirrevocialble,
  //     authSignature: authSignature,
  //     nameAuthSign: nameAuthSign,
  //     registeringAuthority: registeringAuthority,
  //     registeringAuthorityDoc: registeringAuthorityDoc,
  //   },
  // };
  // localStorage.setItem("Application Purpose", JSON.stringify(forms));

  const handleChangePurpose = (data) => {
    console.log("purpose", data?.label);
    const purposeSelected = data?.label;
    setSelectPurpose(purposeSelected);
    localStorage.setItem("purpose", JSON.stringify(purposeSelected));
  };
  const handleChangePotential = (data) => {
    console.log("potential", data);
    const potentialSelected = data?.label;
    setPotentialDev(potentialSelected);
    console.log("potential", potentialSelected);
    localStorage.setItem("potential", JSON.stringify(potentialSelected));
  };
 

  const getDocumentData = async () => {
    if (file === null) {
      return;
    }
    const formData = new FormData();
    formData.append("file", file.file);
    formData.append("tenantId", "hr");
    formData.append("module", "property-upload");
    formData.append("tag", "tag-property");

    console.log("File", formData);

    try {
      const Resp = await axios
        .post("http://10.1.1.18:8083/filestore/v1/files", formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((response) => {
          return response;
        });
      setDocuploadData(Resp.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getDocumentData();
  }, [file]);

  return (
    <div>
    <form onSubmit={handleSubmit(PurposeFormSubmitHandler)}>
      <Card style={{ width: "126%" }}>
        <h2>New License</h2>
        <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px" }}>
          <Form.Group>
            <Row className="ml-auto" style={{ marginBottom: 5 }}>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>Puropse Of License</b> <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                </div>

                <ReactMultiSelect
                  control={control}
                  name="purposeDd"
                  onChange={handleChangePurpose}
                  placeholder="Purpose"
                  data={optionsPurposeList}
                  labels="Purpose"
                />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.purposeDd && errors?.purposeDd?.message}
                </h3>
              </Col>
              {/* <Form.Select type="text" defaultValue={purposeDd} placeholder="Puropse"  onChange={handleChangePurpose} value={purposeDd}  ></Form.Select> */}
              {/* <ReactMultiSelect
                            listOfData={optionsPurposeList}
                            labels="Purpose"
                            getSelectedValue={handleChangePurpose}
                        /> */}

              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>Potential Zone:</b> <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                </div>
                <ReactMultiSelect
                  control={control}
                  name="potential"
                  placeholder="Potential"
                  data={optionsPotentialList}
                  labels="Potential"
                  onChange={handleChangePotential}
                />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.potential && errors?.potential?.message}
                </h3>
              </Col>

              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>District</b> <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                </div>
                <ReactMultiSelect
                  control={control}
                  name="district"
                  placeholder="District"
                  data={districtDataLbels}
                  labels="District"
                  onChange={(e) => {
                    getTehslidata(e.value);
                    setDistrict(e.value);
                  }}
                />

                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.district && errors?.district?.message}
                </h3>
              </Col>
              <Col md={4} xxl lg="3">
                <div>
                  <Form.Label>
                    <b>State </b>
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                </div>

                <input type="text" className="form-control" placeholder="N/A" {...register("state")} disabled defaultValue="Haryana" />
                <h3 className="error-message" style={{ color: "red" }}>
                  {errors?.state && errors?.state?.message}
                </h3>
              </Col>
            </Row>

            <div className="ml-auto" style={{ marginTop: 20 }}>
              <h2 style={{ fontSize: 24 }}>
                <b>2. Details of applied land:</b>
              </h2>
              <br></br>
              <p>
                Note: The term “Collaboration agreement" shall include all Development agreements/ Joint Venture agreements/ Joint Development
                agreements/ Memorandum of Understanding etc. and similar agreements registered with competent authority.
              </p>
              <br></br>
              <p>
                <b>(i) Khasra-wise information to be provided in the following format:</b>
              </p>
              <br></br>
            </div>
            <div className="ml-auto">
              <Button type="button" variant="primary" onClick={() => setmodal(true)}>
                Enter Details
              </Button>
           
            </div>
            <br></br>

            <div className="applt" style={{ overflow: "auto" }}>
              <WorkingTable columns={columns} data={tableData} />
              {/* <Table className="table table-bordered" columns={columns} pagination={false} /> */}
            </div>
          </Form.Group>
          <div class="row">
            <div class="col-sm-12 text-left">
              <button id="btnClear" class="btn btn-primary btn-md center-block" style={{ marginBottom: "-44px" }}>
                Back
              </button>
            </div>
            <div class="row">
              <div class="col-sm-12 text-right">
                <button type="submit" id="btnSearch" class="btn btn-primary btn-md center-block">
                  Continue
                </button>
              </div>
            </div>
          </div>
        </Card>
      </Card>
    </form>
    <Modal size="xl" isOpen={modal} toggle={() => setmodal(!modal)}>
    <ModalHeader toggle={() => setmodal(!modal)}></ModalHeader>
    <ModalBody>
      <form onSubmit={handleSubmit(ApplicantPurposeModalData)}>
      <Row className="ml-auto mb-3">
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              <h6>
                <b>Tehsil</b>
              </h6>
            </Form.Label>
          </div>
          {/* <Controller
                  control={control}
                  name="authorizedPerson"
                  render={({ field: { onChange, value } }) => (
                    <input type="text" value={value} className="form-control" placeholder="N/A" disabled name="authorizedPerson" />
                  )}
                /> */}
          <ReactMultiSelect
            control={control}
            name="tehsil"
            data={tehsilDataLabels}
            labels="Tehsil" 
            
            onChange={(e) => {
              getRevenuStateData(e.value);
              setTehsilCode(e.value);
            }}
          />
          <h3 className="error-message" style={{ color: "red" }}>
            {errors?.tehsil && errors?.tehsil?.message}
          </h3>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              <h6>
                <b>Name of Revenue estate</b>
              </h6>
            </Form.Label>
          </div>
          <ReactMultiSelect
            control={control}
            name="revenueEstate"
            placeholder="N/A"
            data={revenueDataLabels}
            labels="Revenue Estate"
            onChange={(e) => getMustilData(e.code)}
          />

          <h3 className="error-message" style={{ color: "red" }}>
            {errors?.revenueEstate && errors?.revenueEstate?.message}
          </h3>
        </Col>
        <Col md={4} xxl lg="4">
          <div>
            <Form.Label>
              <h6>
                <b>Rectangle No./Mustil</b>
              </h6>
            </Form.Label>
          </div>
          <ReactMultiSelect control={control} name="mustil" placeholder="N/A" data={mustilDataLabels} labels="Rectangle No." />
          <h3 className="error-message" style={{ color: "red" }}>
            {errors?.mustil && errors?.mustil?.message}
          </h3>
        </Col>
      </Row>
      <br></br>
      <Row className="ml-auto mb-3">
        <Col md={4} xxl lg="12">
          <div>
            <label>
              <h6>
                <b>Consolidation Type</b>
              </h6>{" "}
            </label>{" "}
            &nbsp;&nbsp;
            {/* <Form.Select type="select" defaultValue="Select" placeholder="" className="form-control"
                  onChange={(e)=>setModalConsolidation(e.target.value)} >
                      */}
            <input type="radio" id="Yes" value="1" onChange={handleChange} name="Yes" onClick={handleshow2} />
            &nbsp;&nbsp;
            <label for="Yes"></label>
            <label htmlFor="gen">Consolidated</label>&nbsp;&nbsp;
            <input type="radio" id="Yes" value="2" onChange={handleChange} name="Yes" onClick={handleshow2} />
            &nbsp;&nbsp;
            <label for="Yes"></label>
            <label htmlFor="npnl">Non-Consolidated</label>
            {/* </Form.Select> */}
          </div>{" "}
          {showhide2 === "1" && (
            <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))" }}>
              <thead>
                <tr>
                  {/* {(khasraData !== undefined && khasraData.length > 0)?(khasraData.)} */}
                  <th>
                    <b>Kanal</b>
                  </th>
                  <th>
                    <b>Marla</b>
                  </th>
                  <th>
                    <b>Sarsai</b>&nbsp;&nbsp;
                  </th>
                  {/* <th><b>Area in Marla</b>&nbsp;&nbsp;</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                  <Form.Control type="text" className="form-control" placeholder="N/A" {...register("kanal")} disabled />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      onChange={(e) => setMarla(e.target.value)}
                     
                    ></input>{" "}
                  </td>
                  <td>
                    {" "}
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      onChange={(e) => setSarsai(e.target.value)}
                    
                    ></input>
                  </td>
                  {/* <td > <input type="text" className="form-control" placeholder=""  onChange={(e)=>setModalMarla(e.target.value)}></input></td> */}
                </tr>
              </tbody>
            </table>
          )}
          {showhide2 === "2" && (
            <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))" }}>
              <thead>
                <tr>
                  {/* {(khasraData !== undefined && khasraData.length > 0)?(khasraData.)} */}
                  <th>
                    <b>Bigha</b>
                  </th>
                  <th>
                    <b>Biswa</b>
                  </th>
                  <th>
                    <b>Biswansi</b>&nbsp;&nbsp;
                  </th>
                  {/* <th><b>Area in Marla</b>&nbsp;&nbsp;</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      onChange={(e) => setBigha(e.target.value)}
                     
                    ></input>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      onChange={(e) => setBiswa(e.target.value)}
                     
                    ></input>{" "}
                  </td>
                  <td>
                    {" "}
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      onChange={(e) => setBiswansi(e.target.value)}
                     
                    ></input>
                  </td>
                  {/* <td > <input type="text" className="form-control" placeholder=""  onChange={(e)=>setModalMarla(e.target.value)}></input></td> */}
                </tr>
              </tbody>
            </table>
          )}
        </Col>
      </Row>

      <Row className="ml-auto mb-3">
        <Col md={4} xxl lg="6">
          <div>
            <label>
              <h6>
                <b>Name of Land Owner</b>
              </h6>{" "}
            </label>
          </div>
          <input type="text" className="form-control" placeholder="N/A" {...register("landOwner")} onChange={(e) => console.log(e)} />
          <h3 className="error-message" style={{ color: "red" }}>
            {errors?.landOwner && errors?.landOwner?.message}
          </h3>
        </Col>

        <Col md={4} xxl lg="6">
          {/* <ReactMultiSelect

                              listOfData={khewatDataLabels}
                              labels="Owner Name"
                              getSelectedValue={(data) => setModalLand(data.data)}

                          ></ReactMultiSelect> */}
          {/* <input type="text"  placeholder="Owner Name" className="form-control" 
                  onChange={(e)=>setModalLand(e.target.value)}
              /> */}
        </Col>
      </Row>
      <Row className="ml-auto mb-3">
        <div className="col col-12">
          <h6 data-toggle="tooltip" data-placement="top" title="Whether collaboration agreement entered for the Khasra?(yes/no)">
            <b>
              Collaboration agreement&nbsp;
              <InfoIcon style={{ color: "blue" }} />
              &nbsp;{" "}
            </b>
            &nbsp;&nbsp;
            <input type="radio" value="Yes" id="Yes" onChange={handleChange} name="Yes" onClick={handleshow1} />
            &nbsp;&nbsp;
            <label for="Yes">
              <h6>
                <b>Yes</b>
              </h6>
            </label>
            &nbsp;&nbsp;
            <input type="radio" value="No" id="No" onChange={handleChange} name="Yes" onClick={handleshow1} />
            &nbsp;&nbsp;
            <label for="No">
              <h6>
                <b>No</b>
              </h6>
            </label>
          </h6>
          {showhide1 === "Yes" && (
            <div className="row ">
              <div className="col col-4">
                <label for="parentLicense" className="font-weight-bold">
                  <h6>
                    <b>Name of the developer company / Firm/ LLP etc. with whom collaboration agreement entered</b>
                  </h6>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="N/A"
                  {...register("devCompany")}
                
                />
              </div>
              <div className="col col-4" style={{ marginTop: 15 }}>
                <label for="parentLicense" className="font-weight-bold">
                  <h6>
                    <b>Date of registering collaboration agreement</b>
                  </h6>
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="N/A"
                  {...register("registering")}
                />
              </div>
              <div className="col col-4" style={{ marginTop: 15 }}>
                <label for="parentLicense" className="font-weight-bold">
                  <h6>
                    <b>Date of validity of collaboration agreement</b>
                  </h6>
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="N/A"
                  {...register("dateValidity")}
                
                />
              </div>
              <div className="col col-4" style={{ marginTop: 35 }}>
                <label for="parentLicense" className="font-weight-bold">
                  <h6>
                    <b>Whether collaboration agreement irrevocable (Yes/No)</b>
                  </h6>
                </label>
                <br></br>
                <input type="radio" value="Yes" id="Yes1" onChange={handleChange} name="Yes" />
                &nbsp;&nbsp;
                <label for="Yes">
                  <h6>Yes</h6>
                </label>
                &nbsp;&nbsp;
                <input type="radio" value="No" id="No1" onChange={handleChange} name="Yes" />
                &nbsp;&nbsp;
                <label for="No">
                  <h6>No</h6>
                </label>
              </div>

              <div className="col col-4" style={{ marginTop: 35 }}>
                <label for="parentLicense" className="font-weight-bold">
                  <h6>
                    <b>Name of authorized signatory on behalf of land owner(s)</b>
                  </h6>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="N/A"
                  {...register("authorizedSign")}
                
                />
              </div>
              <div className="col col-4" style={{ marginTop: 15 }}>
                <label for="parentLicense" className="font-weight-bold">
                  <h6>
                    <b>Name of authorized signatory on behalf of developer to sign Collaboration agreement</b>
                  </h6>
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="N/A"
                  {...register("authorizedDev")}
                  onChange={(e) => setNameAuthSign(e.target.value)}
                  value={nameAuthSign}
                />
              </div>
              <div className="col col-4" style={{ marginTop: 20 }}>
                <label for="parentLicense" className="font-weight-bold">
                  <h6>
                    <b>Registring Authority</b>
                  </h6>
                </label>
                <br></br>
                <input
                  type="text"
                  className="form-control"
                  placeholder="N/A"
                  {...register("registeringAuth")}
                 
                />
              </div>
              <div className="col col-4" style={{ marginTop: 15 }}>
                <label for="parentLicense" className="font-weight-bold">
                  <h6 data-toggle="tooltip" data-placement="top" title="Upload Document">
                    <b>
                      Registring Authority document&nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon>
                    </b>
                  </h6>
                </label>
                <br></br>
                <input
                  type="file"
                  className="form-control"
                  onChange1={(e) => setFile({ file: e.target.files[0] })}
                 
                />
              </div>
            </div>
          )}
        </div>
      </Row>
   
      <button type="submit" style={{ float: "right" }} className="btn btn-priary" >
        Submit
      </button>
      </form>
    </ModalBody>
    <ModalFooter toggle={() => setmodal(!modal)}></ModalFooter>
  </Modal>
  </div>
  );
};

export default ApllicantPuropseForm;
