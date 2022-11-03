import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { useForm } from "react-hook-form";
import DDJAYForm from "../Step4/DdjayForm";
import ResidentialPlottedForm from "./ResidentialPlotted";
import IndustrialPlottedForm from "./IndustrialPlotted";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import CalculateIcon from '@mui/icons-material/Calculate';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';
const AppliedDetailForm = (props) => {
  const [finalSubmitData, setFinalSubmitData] = useState([])
  const [form, setForm] = useState([]);
  const [dgps, setDgps] = useState('');
  const [resplotno, setResPlotno] = useState('');
  const [reslengthmtr, setResLengthmtr] = useState('');
  const [reswidthmtr, setResWidthmtr] = useState('');
  const [resareasq, setResAreasq] = useState('');
  const [genplotno, setGenPlotno] = useState('');
  const [genlengthmtr, setGenLengthmtr] = useState('');
  const [genwidthmtr, setGenWidthmtr] = useState('');
  const [genareasq, setGenAreasq] = useState('');
  const [complotno, setComPlotno] = useState('');
  const [comlengthmtr, setComLengthmtr] = useState('');
  const [comwidthmtr, setComWidthmtr] = useState('');
  const [comareasq, setComAreasq] = useState('');
  const [siteplotno, setSitePlotno] = useState('');
  const [sitelengthmtr, setSiteLengthmtr] = useState('');
  const [sitewidthmtr, setSiteWidthmtr] = useState('');
  const [siteareasq, setSiteAreasq] = useState('');
  const [parkplotno, setParkPlotno] = useState('');
  const [parklengthmtr, setParkLengthmtr] = useState('');
  const [parkwidthmtr, setParkWidthmtr] = useState('');
  const [parkareasq, setParkAreasq] = useState('');
  const [publicplotno, setPublicPlotno] = useState('');
  const [publiclengthmtr, setPublicLengthmtr] = useState('');
  const [publicwidthmtr, setPublicWidthmtr] = useState('');
  const [publicareasq, setPublicAreasq] = useState('');
  const [irPlotDimen, setIrPlotDimen] = useState('');
  const [npnlplotno, setNpnlPlotNo] = useState('');
  const [irSizeDimen, setIrSizeDimen] = useState('');
  const [npnllengthmtr, setNpnlLengthMtr] = useState('');
  const [npnlwidthmtr, setNpnlWidthMtr] = useState('');
  const [npnlareasq, setNpnlareasq] = useState('');
  const [ewsplotno, setEwsplotno] = useState('');
  const [ewslengthmtr, setEwslengthmtr] = useState('');
  const [npnlNo, setNpnlNo] = useState('');
  const [npnlArea, setNpnlArea] = useState('');
  const [ewsNo, setEwsNo] = useState('');
  const [ewsArea, setEwsArea] = useState('');
  const [frozenNo, setFrozenNo] = useState('');
  const [frozenArea, setFrozenArea] = useState('');
  const [ewswidthmtr, setEwswidthmtr] = useState('');
  const [ewsareasq, setEwsareasq] = useState('');
  const [stpplotno, setStpplotno] = useState('');
  const [stplengthmtr, setStplengthmtr] = useState('');
  const [stpwidthmtr, setStpwidthmtr] = useState('');
  const [stpareasq, setStpareasq] = useState('');
  const [etpplotno, setEtpplotno] = useState('');
  const [etplengthmtr, setEtplengthmtr] = useState('');
  const [resiNo, setResiNo] = useState('');
  const [resiArea, setResiArea] = useState('');
  const [commerNo, setCommerNo] = useState('');
  const [commerArea, setCommerArea] = useState('');
  const [labourNo, setLabourNo] = useState('');
  const [labourArea, setLabourArea] = useState('');
  const [etpwidthmtr, setEtpwidthmtr] = useState('');
  const [etpareasq, setEtpareasq] = useState('');
  const [wtpplotno, setWtpplotno] = useState('');
  const [wtplengthmtr, setWtplengthmtr] = useState('');
  const [wtpwidthmtr, setWtpwidthmtr] = useState('');
  const [wtpareasq, setWtpareasq] = useState('');
  const [ugtplotno, setUgtplotno] = useState('');
  const [ugtlengthmtr, setUgtlengthmtr] = useState('');
  const [ugtwidthmtr, setUgtwidthmtr] = useState('');
  const [ugtareasq, setUgtareasq] = useState('');
  const [milkboothplotno, setMilkboothplotno] = useState('');
  const [milkboothlengthmtr, setMilkboothlengthmtr] = useState('');
  const [milkboothwidthmtr, setMilkboothwidthmtr] = useState('');
  const [milkboothareasq, setMilkboothareasq] = useState('');
  const [gssplotno, setGssplotno] = useState('');
  const [gsslengthmtr, setGsslengthmtr] = useState('');
  const [gsswidthmtr, setGsswidthmtr] = useState('');
  const [gssareasq, setGssareasq] = useState('');
  const [resDimension, setResDimension] = useState('');
  const [resEnteredArea, setResEnteredArea] = useState('');
  const [comDimension, setComDimension] = useState('');
  const [comEnteredArea, setComEnteredArea] = useState('');
  const [secPlanPlot, setSecPlanPlot] = useState('');
  const [secPlanDim, setSecPlanDim] = useState('');
  const [secPlanLength, setSecPlanLength] = useState('');
  const [secPlanEntered, setSecPlanEntered] = useState('');
  const [greenBeltPlot, setGreenBeltPlot] = useState('');
  const [greenBeltLength, setGreenBeltLength] = useState('');
  const [greenBeltDim, setgGreenBeltDim] = useState('');
  const [greenBeltEntered, setGreenBeltEntered] = useState('');
  const [internalPlot, setInternalPlot] = useState('');
  const [internalLength, setInternalLength] = useState('');
  const [internalDim, setInternalDim] = useState('');
  const [internalEntered, setInternalEntered] = useState('');
  const [otherPlot, setOtherPlot] = useState('');
  const [otherDim, setOtherDim] = useState('');
  const [otherLength, setOtherLength] = useState('');
  const [otherEntered, setOtherEntered] = useState('');
  const [undeterminedPlot, setUndeterminedPlot] = useState('');
  const [undeterminedLength, setUndeterminedLength] = useState('');
  const [undeterminedDim, setUndeterminedDim] = useState('');
  const [undeterminedEntered, setUndeterminedEntered] = useState('');
  const [organize, setOrganize] = useState('');
  const [colonyfiftyNo, setColonyfiftyNo] = useState('');
  const [colonyfiftyArea, setColonyfiftyArea] = useState('');
  const [fiftyToTwoNo, setFiftyToTwoNo] = useState('');
  const [fiftyToTwoArea, setFiftyToTwoArea] = useState('');
  const [twoHundredNo, setTwoHundredNo] = useState("");
  const [twoHundredArea, setTwoHundredArea] = useState("");
  const [surrender, setSurrender] = useState("");
  const [pocketProposed, setPocketProposed] = useState("");
  const [surrendered, setSurrendered] = useState("");
  const [deposit, setDeposit] = useState("");
  const [sitePlan, setSitePlan] = useState("");
  const [democraticPlan, setDemocraticPlan] = useState("");
  const [developmentPlan, setDevelopmentPlan] = useState("");
  const [sectoralPlan, setSectoralPlan] = useState("");
  const [uploadLayoutPlan, setUploadLayoutPlan] = useState("");
  const Purpose = localStorage.getItem('purpose')
  console.log("adf", Purpose)
  const [file, setFile] = useState(null);
  const [docUpload, setDocuploadData] = useState([])
  const { register, handleSubmit, formState: { errors } } = useForm([{ XLongitude: '', YLatitude: '' }]);
  const formSubmit = (data) => {
    console.log("data", data);
  };
  const [AppliedDetailFormSubmitted, SetAppliedDetailFormSubmitted] = useState(false);
  const AppliedDetailFormSubmitHandler = (e) => {
    e.preventDefault();
    SetAppliedDetailFormSubmitted(true);
    props.Step4Continue({ "data": true })
    let forms = {
      dgps: dgps,
      "DetailsAppliedLandData1":
      {
        resplotno: resplotno,
        reslengthmtr: reslengthmtr,
        reswidthmtr: reswidthmtr,
        resareasq: resareasq,
        genplotno: genplotno,
        genlengthmtr: genlengthmtr,
        genwidthmtr: genwidthmtr,
        genareasq: genareasq,
        npnlplotno: npnlplotno,
        npnllengthmtr: npnllengthmtr,
        npnlwidthmtr: npnlwidthmtr,
        npnlareasq: npnlareasq,
        ewsplotno: ewsplotno,
        ewslengthmtr: ewslengthmtr,
        ewswidthmtr: ewswidthmtr,
        ewsareasq: ewsareasq,
        complotno: complotno,
        comlengthmtr: comlengthmtr,
        comwidthmtr: comwidthmtr,
        comareasq: comareasq,
        siteplotno: siteplotno,
        sitelengthmtr: sitelengthmtr,
        sitewidthmtr: sitewidthmtr,
        siteareasq: siteareasq,
        parkplotno: parkplotno,
        parklengthmtr: parklengthmtr,
        parkwidthmtr: parkwidthmtr,
        parkareasq: parkareasq,
        publicplotno: publicplotno,
        publiclengthmtr: publiclengthmtr,
        publicwidthmtr: publicwidthmtr,
        publicareasq: publicareasq,
        stpplotno: stpplotno,
        stplengthmtr: stplengthmtr,
        stpwidthmtr: stpwidthmtr,
        stpareasq: stpareasq,
        etpplotno: etpplotno,
        etplengthmtr: etplengthmtr,
        etpwidthmtr: etpwidthmtr,
        etpareasq: etpareasq,
        wtpplotno: wtpplotno,
        wtplengthmtr: wtplengthmtr,
        wtpwidthmtr: wtpwidthmtr,
        wtpareasq: wtpareasq,
        ugtplotno: ugtplotno,
        ugtlengthmtr: ugtlengthmtr,
        ugtwidthmtr: ugtwidthmtr,
        ugtareasq: ugtareasq,
        milkboothplotno: milkboothplotno,
        milkboothlengthmtr: milkboothlengthmtr,
        milkboothwidthmtr: milkboothwidthmtr,
        milkboothareasq: milkboothareasq,
        gssplotno: gssplotno,
        gsslengthmtr: gsslengthmtr,
        gsswidthmtr: gsswidthmtr,
        gssareasq: gssareasq,
        resDimension: resDimension,
        resEnteredArea: resEnteredArea,
        comDimension: comDimension,
        comEnteredArea: comEnteredArea,
        secPlanPlot: secPlanPlot,
        secPlanLength: secPlanLength,
        secPlanDim: secPlanDim,
        secPlanEntered: secPlanEntered,
        greenBeltPlot: greenBeltPlot,
        greenBeltLength: greenBeltLength,
        greenBeltDim: greenBeltDim,
        greenBeltEntered: greenBeltEntered,
        internalPlot: internalPlot,
        internalLength: internalLength,
        internalDim: internalDim,
        internalEntered: internalEntered,
        otherPlot: otherPlot,
        otherLength: otherLength,
        otherDim: otherDim,
        otherEntered: otherEntered,
        undeterminedPlot: undeterminedPlot,
        undeterminedLength: undeterminedLength,
        undeterminedDim: undeterminedDim,
        undeterminedEntered: undeterminedEntered,


      },
      "DetailsAppliedLandDdjay2":
      {
        frozenNo: frozenNo,
        frozenArea: frozenArea,
        organize: organize
      },
      "DetailsAppliedLandIndustrial3":
      {
        colonyfiftyNo: colonyfiftyNo,
        colonyfiftyArea: colonyfiftyArea,
        fiftyToTwoNo: fiftyToTwoNo,
        fiftyToTwoArea: fiftyToTwoArea,
        twoHundredNo: twoHundredNo,
        twoHundredArea: twoHundredArea,
        resiNo: resiNo,
        resiArea: resiArea,
        commerNo: commerNo,
        commerArea: commerArea,
        labourNo: labourNo,
        labourArea: labourArea,
      },
      "DetailsAppliedLandResidential4":
      {
        npnlNo: npnlNo,
        npnlArea: npnlArea,
        ewsNo: ewsNo,
        ewsArea: ewsArea,
      },
      "DetailsAppliedLandNpnl5":
      {
        surrender: surrender,
        pocketProposed: pocketProposed,
        deposit: deposit,
        surrendered: surrendered,
      },
      "DetailsAppliedLand6":
      {
        sitePlan: sitePlan,
        democraticPlan: democraticPlan,
        sectoralPlan: sectoralPlan,
        developmentPlan: developmentPlan,
        uploadLayoutPlan: uploadLayoutPlan
      },

    }
    localStorage.setItem('Details of Applied Land', JSON.stringify(forms))

  };
  const [showhide, setShowhide] = useState("No");
  const [showhide1, setShowhide1] = useState("No");
  const [showhide0, setShowhide0] = useState("No");
  const [showhide2, setShowhide2] = useState("No");
  const [showhide3, setShowhide3] = useState("No");
  const [showhide4, setShowhide4] = useState("No");
  const [showhide5, setShowhide5] = useState("No");
  const [showhide6, setShowhide6] = useState("No");
  const [showhide7, setShowhide7] = useState("No");
  const [showhide8, setShowhide8] = useState("No");
  const [showhide9, setShowhide9] = useState("No");
  const [showhide10, setShowhide10] = useState("No");
  const [showhide11, setShowhide11] = useState("No");
  const [showhide12, setShowhide12] = useState("No");
  const [showhide13, setShowhide13] = useState("No");
  const [showhide14, setShowhide14] = useState("No");
  const [showhide18, setShowhide18] = useState("2");

  const handleshow = e => {
    const getshow = e.target.value;
    setShowhide(getshow);
  }
  const handleshow0 = e => {
    const getshow = e.target.value;
    setShowhide0(getshow);
  }
  const handleshow1 = e => {
    const getshow = e.target.value;
    setShowhide1(getshow);
  }
  const handleshow2 = e => {
    const getshow = e.target.value;
    setShowhide2(getshow);
  }
  const handleshow3 = e => {
    const getshow = e.target.value;
    setShowhide3(getshow);
  }
  const handleshow4 = e => {
    const getshow = e.target.value;
    setShowhide4(getshow);
  }
  const handleshow5 = e => {
    const getshow = e.target.value;
    setShowhide5(getshow);
  }
  const handleshow6 = e => {
    const getshow = e.target.value;
    setShowhide6(getshow);
  }
  const handleshow7 = e => {
    const getshow = e.target.value;
    setShowhide7(getshow);
  }
  const handleshow8 = e => {
    const getshow = e.target.value;
    setShowhide8(getshow);
  }
  const handleshow9 = e => {
    const getshow = e.target.value;
    setShowhide9(getshow);
  }
  const handleshow10 = e => {
    const getshow = e.target.value;
    setShowhide10(getshow);
  }
  const handleshow11 = e => {
    const getshow = e.target.value;
    setShowhide11(getshow);
  }
  const handleshow12 = e => {
    const getshow = e.target.value;
    setShowhide12(getshow);
  }
  const handleshow13 = e => {
    const getshow = e.target.value;
    setShowhide13(getshow);
  }
  const handleshow14 = e => {
    const getshow = e.target.value;
    setShowhide14(getshow);
  }
  const handleshow18 = e => {
    const getshow = e.target.value;
    setShowhide18(getshow);
  }
  onchange = e => {
    this.setState({ value: e.target.value });

  }


  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });

  }
  const [noOfRows, setNoOfRows] = useState(1);
  const [noOfRow, setNoOfRow] = useState(1);
  const [noOfRow1, setNoOfRow1] = useState(1);
  const getDocumentData = async () => {
    if (file === null) {
      return
    }
    const formData = new FormData();
    formData.append(
      "file", file.file);
    formData.append(
      "tenantId", "hr");
    formData.append(
      "module", "property-upload");
    formData.append(
      "tag", "tag-property");
    try {
      const Resp = await axios.post("http://10.1.1.18:8083/filestore/v1/files", formData,
        {
          headers: {
            "content-type": "multipart/form-data"
          }
        }).then((response) => {
          return response
        });
      setDocuploadData(Resp.data)

    } catch (error) {
      console.log(error.message);
    }

  }
  useEffect(() => {
    getDocumentData();
  }, [file]);

  const FinalSubmitApiCall = async () => {
    try {
        const postDistrict = {

            "NewServiceInfo": {
                "newServiceInfoData": [
                    {
                        "ApplicantInfo": {
                            "authorizedDeveloper": "sdsd",
                            "authorizedPerson": "sd",
                            "authorizedmobile": "sds",
                            "alternatemobile": "1e",
                            "authorizedEmail": "eeds",
                            "authorizedPan": "fsd",
                            "authorizedAddress": "",
                            "village": "village",
                            "authorizedPinCode": "",
                            "tehsil": "dsf",
                            "district": "sdf",
                            "state": "dsf",
                            "status": "fgr",
                            "LC": "ertfger",
                            "address": "ertf",
                            "permanentAddress": "fgd",
                            "notSigned": "fgver",
                            "email": "gfg",
                            "authorized": "rgsf"
                        },
                        "ApplicantPurpose": {
                            "purposeDd": "",
                            "potential": "",
                            "district": "",
                            "state": "",
                            "ApplicationPurposeData1": {
                                "tehsil": "tahsil",
                                "revenueEstate": "",
                                "mustil": "",
                                "consolidation": "",
                                "sarsai": "",
                                "kanal": "",
                                "marla": "",
                                "bigha": "",
                                "biswansi": "",
                                "biswa": "",
                                "landOwner": "",
                                "developerCompany": "",
                                "registeringdate": "",
                                "validitydate": "",
                                "colirrevocialble": "",
                                "authSignature": "",
                                "nameAuthSign": "",
                                "registeringAuthority": "",
                                "registeringAuthorityDoc": ""
                            }
                        },
                        "LandSchedule": {
                            "licenseApplied": "lic",
                            "LicNo": "",
                            "potential": "",
                            "siteLoc": "",
                            "approach": "",
                            "approachRoadWidth": "",
                            "specify": "",
                            "typeLand": "",
                            "thirdParty": "",
                            "migrationLic": "",
                            "encumburance": "",
                            "litigation": "",
                            "court": "",
                            "insolvency": "",
                            "appliedLand": "",
                            "revenuerasta": "",
                            "watercourse": "",
                            "compactBlock": "",
                            "sandwiched": "",
                            "acquistion": "",
                            "section4": "",
                            "section6": "",
                            "orderUpload": "",
                            "approachable": "",
                            "vacant": "",
                            "construction": "",
                            "ht": "",
                            "gas": "",
                            "nallah": "",
                            "road": "",
                            "land": "",
                            "utilityLine": "",
                            "landSchedule": "",
                            "mutation": "",
                            "jambandhi": "",
                            "LayoutPlan": "",
                            "proposedLayoutPlan": "",
                            "revisedLansSchedule": ""
                        },
                        "DetailsofAppliedLand": {
                            "dgps": "dsg",
                            "DetailsAppliedLandData1": {
                                "resplotno": "asa",
                                "reslengthmtr": "",
                                "reswidthmtr": "",
                                "resareasq": "",
                                "npnlplotno": "",
                                "npnllengthmtr": "",
                                "npnlwidthmtr": "",
                                "npnlareasq": "",
                                "ewsplotno": "",
                                "ewslengthmtr": "",
                                "ewswidthmtr": "",
                                "ewsareasq": "",
                                "complotno": "",
                                "comlengthmtr": "",
                                "comwidthmtr": "",
                                "comareasq": "",
                                "siteplotno": "",
                                "sitelengthmtr": "",
                                "sitewidthmtr": "",
                                "siteareasq": "",
                                "parkplotno": "",
                                "parklengthmtr": "",
                                "parkwidthmtr": "",
                                "parkareasq": "",
                                "publicplotno": "",
                                "publiclengthmtr": "",
                                "publicwidthmtr": "",
                                "publicareasq": "",
                                "stpplotno": "",
                                "stplengthmtr": "",
                                "stpwidthmtr": "",
                                "stpareasq": "",
                                "etpplotno": "",
                                "etplengthmtr": "",
                                "etpwidthmtr": "",
                                "etpareasq": "",
                                "wtpplotno": "",
                                "wtplengthmtr": "",
                                "wtpwidthmtr": "",
                                "wtpareasq": "",
                                "ugtplotno": "",
                                "ugtlengthmtr": "",
                                "ugtwidthmtr": "",
                                "ugtareasq": "",
                                "milkboothplotno": "",
                                "milkboothlengthmtr": "",
                                "milkboothwidthmtr": "",
                                "milkboothareasq": "",
                                "gssplotno": "",
                                "gsslengthmtr": "",
                                "gssareasq": "",
                                "resDimension": "",
                                "resEnteredArea": "",
                                "comDimension": "",
                                "comEnteredArea": "",
                                "secPlanPlot": "",
                                "secPlanLength": "",
                                "secPlanDim": "",
                                "secPlanEntered": "",
                                "greenBeltPlot": "",
                                "greenBeltLength": "",
                                "greenBeltDim": "",
                                "greenBeltEntered": "",
                                "internalPlot": "",
                                "internalLength": "",
                                "internalDim": "",
                                "internalEntered": "",
                                "otherPlot": "",
                                "otherLength": "",
                                "otherDim": "",
                                "otherEntered": "",
                                "undeterminedPlot": "",
                                "undeterminedLength": "",
                                "undeterminedDim": "",
                                "undeterminedEntered": ""
                            },
                            "DetailsAppliedLandDdjay2": {
                                "frozenNo": "qw",
                                "frozenArea": "",
                                "organize": ""
                            },
                            "DetailsAppliedLandIndustrial3": {
                                "colonyfiftyNo": "qwq",
                                "colonyfiftyArea": "",
                                "fiftyToTwoNo": "",
                                "fiftyToTwoArea": "",
                                "twoHundredNo": "",
                                "twoHundredArea": "",
                                "resiNo": "",
                                "resiArea": "",
                                "commerNo": "",
                                "commerArea": "",
                                "labourNo": "",
                                "labourArea": ""
                            },
                            "DetailsAppliedLandResidential4": {
                                "npnlNo": "wew",
                                "npnlArea": "",
                                "ewsNo": "",
                                "ewsArea": ""
                            },
                            "DetailsAppliedLandNpnl5": {
                                "surrender": "sds",
                                "pocketProposed": "",
                                "deposit": "",
                                "surrendered": ""
                            },
                            "DetailsAppliedLand6": {
                                "sitePlan": "sdsd",
                                "democraticPlan": "",
                                "sectoralPlan": "",
                                "developmentPlan": "",
                                "uploadLayoutPlan": ""
                            }
                        },
                        "FeesAndCharges": {
                            "totalArea": "sdsd",
                            "purpose": "",
                            "devPlan": "",
                            "scrutinyFee": "",
                            "licenseFee": "",
                            "conversionCharges": "",
                            "payableNow": "",
                            "remark": "",
                            "adjustFee": ""
                        }
                    }
                ]
            }

        }

        const Resp = await axios.post("/land-services/new/_create",
            postDistrict,
        )
            .then((Resp) => {
                console.log("Submit", Resp)
                return Resp;
            })
        setFinalSubmitData(Resp.data);

    } catch (error) {
        console.log(error.message);
    }
}
useEffect(() => {
    FinalSubmitApiCall();
}, [])

  return (
    <Form >
      <Card style={{ width: "126%", border: "5px solid #1266af" }}>
        <h1>New License</h1>
        <Card style={{ width: "126%", marginLeft: "-2px", paddingRight: "10px", marginTop: "40px", marginBottom: "52px" }}>
          <Form.Group className="justify-content-center" controlId="formBasicEmail">
            <Row className="ml-auto" style={{ marginBottom: 5 }}>
              <Col col-12>

                <h4 onChange={(e) => setDgps(e.target.value)} value={dgps}>1. DGPS points <span className="text-primary"> (Click here for instructions to capture DGPS points)</span></h4><br></br>

                <div className="px-2">
                  <div >(i)Add point 1 &nbsp;
                    <div className="row ">
                      <div className="col col-4">
                        <label >X:Longitude</label>
                        <input type="number" name="XLongitude" className="form-control" />

                      </div>
                      <div className="col col-4">
                        <label >Y:Latitude</label>
                        <input type="number" name="YLatitude" className="form-control" />

                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-2">
                  <div >(ii)Add point 2 &nbsp;
                    <div className="row ">
                      <div className="col col-4">
                        <label >X:Longitude</label>
                        <input type="number" name="XLongitude" className="form-control" />

                      </div>
                      <div className="col col-4">
                        <label >Y:Latitude</label>
                        <input type="number" name="YLatitude" className="form-control" />

                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-2">
                  <div >(iii)Add point 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="row ">
                      <div className="col col-4">
                        <label>X:Longitude</label>
                        <input type="number" name="XLongitude" className="form-control" />

                      </div>
                      <div className="col col-4">
                        <label >Y:Latitude</label>
                        <input type="number" name="YLatitude" className="form-control" />

                      </div>


                    </div>
                  </div>
                </div>
                <div className="px-2">
                  <div >(iv)Add point 4 &nbsp;
                    <div className="row ">
                      <div className="col col-4">
                        <label >X:Longitude</label>
                        <input type="number" name="XLongitude" className="form-control" />

                      </div>
                      <div className="col col-4">
                        <label >Y:Latitude</label>
                        <input type="number" name="YLatitude" className="form-control" />

                      </div>
                    </div>
                    <button type="button" style={{ float: 'right' }} className="btn btn-primary" onClick={() => setNoOfRows(noOfRows - 1)}>Delete</button>&nbsp;&nbsp;&nbsp;
                    <button type="button" style={{ float: 'right', marginRight: 15 }} className="btn btn-primary" onClick={() => setNoOfRows(noOfRows + 1)}>Add</button>


                  </div>
                  {[...Array(noOfRows)].map((elementInArray, index) => {
                    return (
                      <div className="row ">
                         <div className="col col-4">
                          <label >{index+1}</label>

                        </div>
                        <div className="col col-4">
                          <label >X:Longiude</label>
                          <input type="number" name="XLongitude" className="form-control" />

                        </div>
                        <div className="col col-4">
                          <label>Y:Latitude</label>
                          <input type="number" name="YLatitude" className="form-control" />

                        </div>


                      </div>);
                  })}

                </div><br></br>

                <hr /><br></br>
                <h5 >2.Details of Plots&nbsp;&nbsp;

                  <input type="radio" id="Yes" value="1"
                    onChange={handleChange} name="Yes" onClick={handleshow18} />&nbsp;&nbsp;
                  <label for="Yes"></label>
                  <label htmlFor="gen">Regular</label>&nbsp;&nbsp;

                  <input type="radio" id="Yes" value="2"
                    onChange={handleChange} name="Yes" onClick={handleshow18} />&nbsp;&nbsp;
                  <label for="Yes"></label>
                  <label htmlFor="npnl">Irregular</label></h5>  {
                  showhide18 === "1" && (
                    <div className="table table-bordered table-responsive">
                      <thead>
                        <tr>
                          <td>Type of plots</td>
                          <td >Plot No.</td>
                          <td >Length in mtr <CalculateIcon color="primary" /></td>
                          <td >Width in mtr <CalculateIcon color="primary" /></td>
                          <td >Area in sqmtr <CalculateIcon color="primary" /></td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td >
                            <div className="px-2">
                              <p className="mb-2" >Residential
                              </p>
                            </div>
                          </td>
                        </tr>
                        <tr>

                          <td >
                            <div className="px-2">
                              <p className="mb-2" >Gen
                              </p>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" onChange={(e) => setGenPlotno(e.target.value)} value={genplotno} />
                          </td>

                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setGenLengthmtr(e.target.value)} value={genlengthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setGenWidthmtr(e.target.value)} value={genwidthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setGenAreasq(e.target.value)} value={genareasq} /></td>

                        </tr>
                        <tr>
                          <td >
                            <div className="px-2">
                              <p className="mb-2" >NPNL
                              </p>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" onChange={(e) => setNpnlPlotNo(e.target.value)} value={npnlplotno} />
                          </td>

                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setNpnlLengthMtr(e.target.value)} value={npnllengthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setNpnlWidthMtr(e.target.value)} value={npnlwidthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setNpnlareasq(e.target.value)} value={npnlareasq} /></td>

                        </tr>
                        <tr>
                          <td >
                            <div className="px-2">
                              <p className="mb-2" >EWS
                              </p>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" onChange={(e) => setEwsplotno(e.target.value)} value={ewsplotno} />
                          </td>

                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setEwslengthmtr(e.target.value)} value={ewslengthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setEwswidthmtr(e.target.value)} value={ewswidthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setEwsareasq(e.target.value)} value={ewsareasq} /></td>

                        </tr>
                        <tr>
                          <td >
                            <div className="px-2">
                              <p className="mb-2">Commercial
                              </p>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" onChange={(e) => setComPlotno(e.target.value)} value={complotno} />
                          </td>

                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setComLengthmtr(e.target.value)} value={comlengthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setComWidthmtr(e.target.value)} value={comwidthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setComAreasq(e.target.value)} value={comareasq} /></td>

                        </tr>
                        <tr>
                          <td >
                            <div className="px-2">
                              <p className="mb-2" >Community Sites

                              </p>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" onChange={(e) => setSitePlotno(e.target.value)} value={siteplotno} />
                          </td>

                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setSiteLengthmtr(e.target.value)} value={sitelengthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setSiteWidthmtr(e.target.value)} value={sitewidthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setSiteAreasq(e.target.value)} value={siteareasq} /></td>

                        </tr>
                        <tr>
                          <td >
                            <div className="px-2">
                              <p className="mb-2" >Parks

                              </p>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" onChange={(e) => setParkPlotno(e.target.value)} value={parkplotno} />
                          </td>

                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setParkLengthmtr(e.target.value)} value={parklengthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setParkWidthmtr(e.target.value)} value={parkwidthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setParkAreasq(e.target.value)} value={parkareasq} /></td>

                        </tr>
                        <tr>
                          <td >
                            <div className="px-2">
                              <p className="mb-2" x>Public Utilities
                              </p>

                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td >
                            <div className="px-2">
                              <p className="mb-2" >STP
                              </p>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" onChange={(e) => setStpplotno(e.target.value)} value={stpplotno} />
                          </td>

                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setStplengthmtr(e.target.value)} value={stplengthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setStpwidthmtr(e.target.value)} value={stpwidthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setStpareasq(e.target.value)} value={stpareasq} /></td>

                        </tr>
                        <tr>
                          <td >
                            <div className="px-2">
                              <p className="mb-2" >ETP
                              </p>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" onChange={(e) => setEtpplotno(e.target.value)} value={etpplotno} />
                          </td>

                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setEtplengthmtr(e.target.value)} value={etplengthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setEtpwidthmtr(e.target.value)} value={etpwidthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setEtpareasq(e.target.value)} value={etpareasq} /></td>

                        </tr>
                        <tr>
                          <td >
                            <div className="px-2">
                              <p className="mb-2" >WTP
                              </p>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" onChange={(e) => setWtpplotno(e.target.value)} value={wtpplotno} />
                          </td>

                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setWtplengthmtr(e.target.value)} value={wtplengthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setWtpwidthmtr(e.target.value)} value={wtpwidthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setWtpareasq(e.target.value)} value={wtpareasq} /></td>

                        </tr>
                        <tr>
                          <td >
                            <div className="px-2">
                              <p className="mb-2" >UGT
                              </p>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" onChange={(e) => setUgtplotno(e.target.value)} value={ugtplotno} />
                          </td>

                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setUgtlengthmtr(e.target.value)} value={ugtlengthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setUgtwidthmtr(e.target.value)} value={ugtwidthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setUgtareasq(e.target.value)} value={ugtareasq} /></td>

                        </tr>
                        <tr>
                          <td >
                            <div className="px-2">
                              <p className="mb-2" >Milk Booth
                              </p>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" onChange={(e) => setMilkboothplotno(e.target.value)} value={milkboothplotno} />
                          </td>

                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setMilkboothlengthmtr(e.target.value)} value={milkboothlengthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setMilkboothwidthmtr(e.target.value)} value={milkboothwidthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setMilkboothareasq(e.target.value)} value={milkboothareasq} /></td>

                        </tr>
                        <tr>
                          <td >
                            <div className="px-2">
                              <p className="mb-2" >GSS
                              </p>
                            </div>
                          </td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" onChange={(e) => setGssplotno(e.target.value)} value={gssplotno} />
                          </td>

                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setGsslengthmtr(e.target.value)} value={gsslengthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setGsswidthmtr(e.target.value)} value={gsswidthmtr} /></td>
                          <td align="right">  <input type="number" className="form-control" onChange={(e) => setGssareasq(e.target.value)} value={gssareasq} /></td>

                        </tr>
                      </tbody>
                    </div>
                  )}
                {
                  showhide18 === "2" && (
                    <div>
                      <div className="table table-bordered table-responsive ">
                        <thead>
                          <tr>
                            <td>Details of Plot</td>
                            <td>Dimensions (in mtr) <CalculateIcon color="primary" /></td>
                            <td >Enter Area</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td >
                              <div className="px-2">
                                <p className="mb-2">Residential
                                </p>
                              </div>
                            </td>
                            <td align="right">  <input type="number" className="form-control" onChange={(e) => setResDimension(e.target.value)} value={resDimension} /></td>
                            <td align="right">  <input type="number" className="form-control" onChange={(e) => setResEnteredArea(e.target.value)} value={resEnteredArea} /></td>
                          </tr>
                          <tr>
                            <td >
                              <div className="px-2">
                                <p className="mb-2" >Commercial
                                </p>
                              </div>
                            </td>
                            <td align="right">  <input type="number" className="form-control" onChange={(e) => setComDimension(e.target.value)} value={comDimension} /></td>
                            <td align="right">  <input type="number" className="form-control" onChange={(e) => setComEnteredArea(e.target.value)} value={comEnteredArea} /></td>
                          </tr>

                        </tbody>
                      </div>
                      <h5 >Area Under</h5>
                      <div className="table table-bordered table-responsive">
                        <thead>
                          <tr>
                            <td>Detail of plots</td>
                            <td > Plot No.</td>
                            <td >Length (in mtr) <CalculateIcon color="primary" /></td>
                            <td >Dimension (in mtr) <CalculateIcon color="primary" /></td>
                            <td >Enter Area</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td >
                              <div className="px-2">
                                <p className="mb-2" >Sectoral Plan Road
                                </p>
                              </div>
                            </td>
                            <td align="right">  <input type="number" className="form-control" onChange={(e) => setSecPlanPlot(e.target.value)} value={secPlanPlot} /></td>
                            <td align="right">  <input type="number" className="form-control" onChange={(e) => setSecPlanLength(e.target.value)} value={secPlanLength} /></td>
                            <td align="right">  <input type="number" className="form-control" onChange={(e) => setSecPlanDim(e.target.value)} value={secPlanDim} /></td>
                            <td component="th" scope="row">
                              <input type="text" className="form-control" onChange={(e) => setSecPlanEntered(e.target.value)} value={secPlanEntered} />
                            </td>
                          </tr>
                          <tr>
                            <td >
                              <div className="px-2">
                                <p className="mb-2" >Green Belt

                                </p>
                              </div>
                            </td>
                            <td align="right">  <input type="number" className="form-control" onChange={(e) => setGreenBeltPlot(e.target.value)} value={greenBeltPlot} /></td>
                            <td component="th" scope="row">
                              <input type="text" className="form-control" onChange={(e) => setGreenBeltLength(e.target.value)} value={greenBeltLength} />
                            </td>
                            <td align="right">  <input type="number" className="form-control" onChange={(e) => setgGreenBeltDim(e.target.value)} value={greenBeltDim} /></td>
                            <td align="right">  <input type="number" className="form-control" onChange={(e) => setGreenBeltEntered(e.target.value)} value={greenBeltEntered} /></td>
                          </tr>
                          <tr>
                            <td >
                              <div className="px-2">
                                <p className="mb-2" >24/18 mtr wide internal circulation Plan road
</p>
                              </div>
                            </td>
                            <td align="right">  <input type="number" className="form-control" onChange={(e) => setInternalPlot(e.target.value)} value={internalPlot} /></td>
                            <td component="th" scope="row">
                              <input type="text" className="form-control" onChange={(e) => setInternalLength(e.target.value)} value={internalLength} />
                            </td>
                            <td align="right">  <input type="number" className="form-control" onChange={(e) => setInternalDim(e.target.value)} value={internalDim} /></td>
                            <td align="right">  <input type="number" className="form-control" onChange={(e) => setInternalEntered(e.target.value)} value={internalEntered} /></td>
                          </tr>
                          <tr>
                            <td >
                              <div className="px-2">
                                <p className="mb-2" >Other Roads
</p>
                              </div>
                            </td>
                            <td align="right">  <input type="number" className="form-control" onChange={(e) => setOtherPlot(e.target.value)} value={otherPlot} /></td>
                            <td component="th" scope="row">
                              <input type="text" className="form-control" onChange={(e) => setOtherLength(e.target.value)} value={otherLength} />
                            </td>
                            <td align="right">  <input type="number" className="form-control" onChange={(e) => setOtherDim(e.target.value)} value={otherDim} /></td>
                            <td align="right">  <input type="number" className="form-control" onChange={(e) => setOtherEntered(e.target.value)} value={otherEntered} /></td>
                          </tr>
                          <tr>
                            <td >
                              <div className="px-2">
                                <p className="mb-2" >Undetermined use(UD)</p>
                              </div>
                            </td>
                            <td align="right">  <input type="number" className="form-control" onChange={(e) => setUndeterminedPlot(e.target.value)} value={undeterminedPlot} /></td>
                            <td component="th" scope="row">
                              <input type="text" className="form-control" onChange={(e) => setUndeterminedLength(e.target.value)} value={undeterminedLength} />
                            </td>
                            <td align="right">  <input type="number" className="form-control" onChange={(e) => setUndeterminedDim(e.target.value)} value={undeterminedDim} /></td>
                            <td align="right">  <input type="number" className="form-control" onChange={(e) => setUndeterminedEntered(e.target.value)} value={undeterminedEntered} /></td>
                          </tr>
                        </tbody>
                      </div>
                    </div>)}
                <div>

                  {Purpose === "DDJAY" && (

                    <DDJAYForm ></DDJAYForm>
                  )}
                </div>
                <div>
                  {Purpose === "03" && (

                    <ResidentialPlottedForm></ResidentialPlottedForm>
                  )}
                </div>
                <div>
                  {Purpose === "06" && (
                    <IndustrialPlottedForm ></IndustrialPlottedForm>
                  )}
                </div>


                <h5 className="text-black">NILP </h5><br></br>


                <div className="table table-bordered table-responsive">
                  <thead>
                    <tr>
                      <td>S.No.</td>
                      <td >NLP Details</td>
                      <td >Yes/No</td>

                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td >1. </td>
                      <td > Whether you want to surrender the 10% area of license colony to Govt. the instead of providing 10% under EWS and NPNL plots  </td>
                      <td component="th" scope="row">
                        <input type="radio" value="Yes" id="Yes"
                          onChange={handleChange} name="Yes" onClick={handleshow0} />
                        <label for="Yes">Yes</label>

                        <input type="radio" value="No" id="No"
                          onChange={handleChange} name="Yes" onClick={handleshow0} />
                        <label for="No">No</label>
                        {
                          showhide0 === "Yes" && (
                            <div className="row " >
                              <div className="col col-12">
                                <label >Area in Acres </label>

                                <input type="text" className="form-control" onChange={(e) => setSurrender(e.target.value)} value={surrender} />
                              </div>
                            </div>
                          )
                        }

                      </td>
                    </tr>
                    <tr>
                      <td >2. </td>
                      <td >Whether any pocket proposed to be transferred less than 1 acre </td>
                      <td component="th" scope="row">
                        <input type="radio" value="Yes" id="Yes"
                          onChange={handleChange} name="Yes" onClick={handleshow13} />
                        <label for="Yes">Yes</label>

                        <input type="radio" value="No" id="No"
                          onChange={handleChange} name="Yes" onClick={handleshow13} />
                        <label for="No">No</label>
                        {
                          showhide13 === "Yes" && (
                            <div className="row " >
                              <div className="col col-6">
                                <label > Dimension (in mtr)&nbsp;&nbsp;<CalculateIcon color="primary" /></label>

                                <input type="text" className="form-control" onChange={(e) => setPocketProposed(e.target.value)} value={pocketProposed} />
                              </div>
                              <div className="col col-6">
                                <label > Enter Area </label>

                                <input type="text" className="form-control" />
                              </div>
                            </div>
                          )
                        }

                      </td>
                    </tr>
                    <tr>
                      <td >3. </td>
                      <td >Whether you want to deposit an amount @ of 3 times of collector rate instead of the surrender 10% land to Govt. </td>
                      <td component="th" scope="row">
                        <input type="radio" value="Yes" id="Yes"
                          onChange={handleChange} name="Yes" onClick={handleshow1} />
                        <label for="Yes">Yes</label>

                        <input type="radio" value="No" id="No"
                          onChange={handleChange} name="Yes" onClick={handleshow1} />
                        <label for="No">No</label>
                        {
                          showhide1 === "Yes" && (
                            <div className="row " >
                              <div className="col col-12">
                                <label >Area in Acres &nbsp;&nbsp;<CalculateIcon color="primary" /></label>

                                <input type="text" className="form-control" onChange={(e) => setDeposit(e.target.value)} value={deposit} />
                              </div>
                            </div>
                          )
                        }

                      </td>
                    </tr>
                    <tr>
                      <td >4. </td>
                      <td >Whether the surrendered area is having a minimum of 18 mtr independent access   </td>
                      <td component="th" scope="row">
                        <input type="radio" value="Yes" id="Yes"
                          onChange={handleChange} name="Yes" onClick={handleshow14} />
                        <label for="Yes">Yes</label>

                        <input type="radio" value="No" id="No"
                          onChange={handleChange} name="Yes" onClick={handleshow14} />
                        <label for="No">No</label>
                        {
                          showhide14 === "Yes" && (
                            <div className="row " >
                              <div className="col col-12">
                                <label >Dimension(in mtr) &nbsp;&nbsp;<CalculateIcon color="primary" /></label>

                                <input type="text" className="form-control" onChange={(e) => setSurrendered(e.target.value)} value={surrendered} />
                              </div>
                              <div className="col col-12">
                                <label >Enter Area</label>

                                <input type="text" className="form-control" />
                              </div>
                            </div>
                          )
                        }

                      </td>
                    </tr>

                  </tbody>
                </div>

                <hr /><br></br>
                <h5 >Mandatory Documents</h5><br></br>
                <div className="row">
                  <div className="col col-3">
                    <h6 data-toggle="tooltip" data-placement="top" title="Upload Document">Demarcation plan. &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon></h6>

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })} onChange={(e) => setSitePlan(e.target.value)} value={sitePlan}>
                    </input>
                  </div>
                  <div className="col col-3">
                    <h6 data-toggle="tooltip" data-placement="top" title="Upload Document">Democratic Plan. &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon></h6>

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })} onChange={(e) => setDemocraticPlan(e.target.value)} value={democraticPlan}></input>
                  </div>
                  <div className="col col-3">
                    <h6 data-toggle="tooltip" data-placement="top" title="Upload Document">Sectoral Plan &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon></h6>

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })} onChange={(e) => setSectoralPlan(e.target.value)} value={sectoralPlan}></input>
                  </div>
                  <div className="col col-3">
                    <h6 data-toggle="tooltip" data-placement="top" title="Upload Document">Upload Layout Plan &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon></h6>

                    <input type="file" className="form-control" onChange1={(e) => setFile({ file: e.target.files[0] })} onChange={(e) => setDevelopmentPlan(e.target.value)} value={developmentPlan}></input>
                  </div>

                </div>
                <div class="row">
                  <div class="col-sm-12 text-left">
                    <button id="btnClear" class="btn btn-primary btn-md center-block" style={{ marginBottom: "-44px" }} >Back</button>
                  </div>
                  <div class="row">
                    <div class="col-sm-12 text-right">
                      <button id="btnSearch" class="btn btn-primary btn-md center-block" onClick={AppliedDetailFormSubmitHandler} >Save and Continue</button>
                    </div></div>
                </div>
              </Col>
            </Row>
          </Form.Group>
        </Card>
      </Card>
    </Form>)
};
export default AppliedDetailForm;