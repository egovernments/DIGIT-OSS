import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { useForm } from "react-hook-form";
import DDJAYForm from "../Step4/DdjayForm";
import ResidentialPlottedForm from "./ResidentialPlotted";
import IndustrialPlottedForm from "./IndustrialPlotted";
// import { tr, thead, TableContainer, td, tbody, Table, Paper } from '@material-ui/core';
// import AddIcon from "@material-ui/icons/Add";
// import DeleteIcon from "@material-ui/icons/Delete";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import CalculateIcon from '@mui/icons-material/Calculate';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';
// import CalculateIcon from '@mui/icons-material/Calculate';
// import DDJAYForm from "./DDJAY";
// import NilpForm from "./Nilp";
// import CommercialPlottedForm from "./CommercialPlotted";
// import IndustrialPlottedForm from "./IndustrialPlotted";
// import ResidentialPlottedForm from "./ResidentialPlotted";
// import { useSelector } from "react-redux";
// import { selectDdjayFormShowDisplay } from "../../Redux/Slicer/Slicer";
// import { selectResidentialFormShowDisplay } from "../../Redux/Slicer/Slicer";
// import { selectIndustrialFormDisplay } from "../../Redux/Slicer/Slicer";
// import { selectCommercialFormDisplay } from "../../Redux/Slicer/Slicer";
// import { selectDeveloper } from "../../Redux/Slicer/Slicer";
// import { selectName } from "../../Redux/Slicer/Slicer";
// import { selectMobile } from "../../Redux/Slicer/Slicer";
// import { selectMobile2 } from "../../Redux/Slicer/Slicer";
// import { selectEmail1 } from "../../Redux/Slicer/Slicer";
// import { selectPan } from "../../Redux/Slicer/Slicer";
// import { selectAddress } from "../../Redux/Slicer/Slicer";
// import { selectVillage1 } from "../../Redux/Slicer/Slicer";
// import { selectPincode } from "../../Redux/Slicer/Slicer";
// import { selectTehsil } from "../../Redux/Slicer/Slicer";
// import { selectDistrict } from "../../Redux/Slicer/Slicer";
// import { selectState } from "../../Redux/Slicer/Slicer";
// import { selectNameOwner } from "../../Redux/Slicer/Slicer";
// import { setLandScheduleFormData } from "../../Redux/Slicer/Slicer";
// import { selectLicenseApplied } from "../../Redux/Slicer/Slicer";
// import { selectMigrationLic } from "../../Redux/Slicer/Slicer";
// import { selectPotential } from "../../Redux/Slicer/Slicer";
// import { selectSiteLoc } from "../../Redux/Slicer/Slicer";
// import { selectApproach } from "../../Redux/Slicer/Slicer";
// import { selectSpecify } from "../../Redux/Slicer/Slicer";
// import { selectexistingCase } from "../../Redux/Slicer/Slicer";
// import { selectTypeLand } from "../../Redux/Slicer/Slicer";
// import { selectThirdParty } from "../../Redux/Slicer/Slicer";
// import { selectRehan } from "../../Redux/Slicer/Slicer";
// import { selectPatta } from "../../Redux/Slicer/Slicer";
// import { selectGair } from "../../Redux/Slicer/Slicer";
// import { selectAny } from "../../Redux/Slicer/Slicer";
// import { selectLitigation } from "../../Redux/Slicer/Slicer";
// import { selectCourt } from "../../Redux/Slicer/Slicer";
// import { selectAppliedLand } from "../../Redux/Slicer/Slicer";
// import { selectRevenuerasta } from "../../Redux/Slicer/Slicer";
// import { selectWatercourse } from "../../Redux/Slicer/Slicer";
// import { selectCompactBlock } from "../../Redux/Slicer/Slicer";
// import { selectSandwiched } from "../../Redux/Slicer/Slicer";
// import { selectAcquistion } from "../../Redux/Slicer/Slicer";
// import { selectExclusion } from "../../Redux/Slicer/Slicer";
// import { selectCompensation } from "../../Redux/Slicer/Slicer";
// import { selectSection4 } from "../../Redux/Slicer/Slicer";
// import { selectSection6 } from "../../Redux/Slicer/Slicer";
// import { selectStatusRelease } from "../../Redux/Slicer/Slicer";
// import { selectaward } from "../../Redux/Slicer/Slicer";
// import { selectDateRelease } from "../../Redux/Slicer/Slicer";
// import { selectSite } from "../../Redux/Slicer/Slicer";
// import { selectApproachable } from "../../Redux/Slicer/Slicer";
// import { selectVacant } from "../../Redux/Slicer/Slicer";
// import { selectConstruction } from "../../Redux/Slicer/Slicer";
// import { selectHt } from "../../Redux/Slicer/Slicer";
// import { selectGas } from "../../Redux/Slicer/Slicer";
// import { selectNallah } from "../../Redux/Slicer/Slicer";
// import { selectRoad } from "../../Redux/Slicer/Slicer";
// import { selectLand } from "../../Redux/Slicer/Slicer";
// import { selectLayoutPlan } from "../../Redux/Slicer/Slicer";
// import {selectDgps}from "../../Redux/Slicer/Slicer";
// import { selectResplotno } from "../../Redux/Slicer/Slicer";
// import { selectReslengthmtr } from "../../Redux/Slicer/Slicer";
// import { selectReswidthmtr } from "../../Redux/Slicer/Slicer";





const AppliedDetailForm = (props) => {

  // const developer = useSelector(selectDeveloper)
  // const name = useSelector(selectName)
  // const mobile = useSelector(selectMobile)
  // const mobile2 = useSelector(selectMobile2)
  // const email = useSelector(selectEmail1)
  // const pan = useSelector(selectPan)
  // const address = useSelector(selectAddress)
  // const village1 = useSelector(selectVillage1)
  // const pincode = useSelector(selectPincode)
  // const tehsil = useSelector(selectTehsil)
  // const district = useSelector(selectDistrict)
  // const state = useSelector(selectState)
  // const nameOwner = useSelector(selectNameOwner)

  // const licenseApplied=useSelector(selectLicenseApplied)
  // const migrationLic=useSelector(selectMigrationLic)
  // const potential=useSelector(selectPotential)
  // const siteLoc=useSelector(selectSiteLoc)
  // const approach=useSelector(selectApproach)
  // const specify=useSelector(selectSpecify)
  // const existingCase=useSelector(selectexistingCase)
  // const typeLand=useSelector(selectTypeLand)
  // const thirdParty=useSelector(selectThirdParty)
  // const rehan=useSelector(selectRehan)
  // const patta=useSelector(selectPatta)
  // const gair=useSelector(selectGair)
  // const any=useSelector(selectAny)
  // const litigation=useSelector(selectLitigation)
  // const court=useSelector(selectCourt)
  // const appliedLand=useSelector(selectAppliedLand)
  // const  revenuerasta=useSelector(selectRevenuerasta)
  // const watercourse=useSelector(selectWatercourse)
  // const compactBlock=useSelector(selectCompactBlock)
  // const sandwiched=useSelector(selectSandwiched)
  // const acquistion=useSelector(selectAcquistion)
  // const exclusion=useSelector(selectExclusion)
  // const compensation=useSelector(selectCompensation)
  // const section4=useSelector(selectSection4)
  // const section6=useSelector(selectSection6)
  // const statusRelease=useSelector(selectStatusRelease)
  // const  award=useSelector(selectaward)
  // const dateRelease=useSelector(selectDateRelease)
  // const site=useSelector(selectSite)
  // const  approachable=useSelector(selectApproachable)
  // const vacant=useSelector(selectVacant)
  // const construction=useSelector(selectConstruction)
  // const ht=useSelector(selectHt)
  // const  gas=useSelector(selectGas)
  // const nallah=useSelector(selectNallah)
  // const road=useSelector(selectRoad)
  // const land=useSelector(selectLand)
  // const  layoutPlan =useSelector(selectLayoutPlan)

  const [form, setForm] = useState([]);
  const [dgps, setDgps] = useState('');
  const [resplotno, setResPlotno] = useState('');
  const [reslengthmtr, setResLengthmtr] = useState('');
  const [reswidthmtr, setResWidthmtr] = useState('');
  const [resareasq, setResAreasq] = useState('');
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
  const [irPlotArea, setIrPlotArea] = useState('');
  const [irSizeDimen, setIrSizeDimen] = useState('');
  const [irSizeArea, setIrSizeArea] = useState('');
  const [pocketDimen, setPocketDimen] = useState('');
  const [pocketArea, setPocketArea] = useState('');
  const [surrenderDimen, setSurrenderDimen] = useState('');
  const [surrenderArea, setSurrenderArea] = useState('');
  const [npnlNo, setNpnlNo] = useState('');
  const [npnlArea, setNpnlArea] = useState('');
  const [ewsNo, setEwsNo] = useState('');
  const [ewsArea, setEwsArea] = useState('');
  const [frozenNo, setFrozenNo] = useState('');
  const [frozenArea, setFrozenArea] = useState('');
  const [organizeNo, setorganizeNo] = useState('');
  const [organizeArea, setorganizeArea] = useState('');
  const [colonyNo, setColonyNo] = useState('');
  const [colonyArea, setColonyArea] = useState('');
  const [fiftyNo, setFiftyNo] = useState('');
  const [fiftyArea, setFiftyArea] = useState('');
  const [twoNo, setTwoNo] = useState('');
  const [twoArea, setTwoArea] = useState('');
  const [resiNo, setResiNo] = useState('');
  const [resiArea, setResiArea] = useState('');
  const [commerNo, setCommerNo] = useState('');
  const [commerArea, setCommerArea] = useState('');
  const [labourNo, setLabourNo] = useState('');
  const [labourArea, setLabourArea] = useState('');
  const [permissible, setPermissible] = useState('');
  const [perPlot, setPerPlot] = useState('');
  const [perLength, setPerLength] = useState('');
  const [perWidth, setPerWidth] = useState('');
  const [perArea, setPerArea] = useState('');
  const [commPlotted, setCommPlotted] = useState('');
  const [far, setFar] = useState('');
  const [scono, setScono] = useState('');
  const [scolengthmtr, setScoLengthmtr] = useState('');
  const [scowidthmtr, setScoWidthmtr] = useState('');
  const [scoareasq, setScoAreasq] = useState('');
  const [boothplotno, setBoothPlotno] = useState('');
  const [boothlengthmtr, setBoothLengthmtr] = useState('');
  const [boothwidthmtr, setBoothWidthmtr] = useState('');
  const [boothareasq, setBoothAreasq] = useState('');
  const [ewsnpnlPlot, setEwsNpnlPlot] = useState('');
  const [areaewsnpnlPlot, setAreaEwsNpnlPlot] = useState('');
  const [collectorRate, setCollectorRate] = useState('');
  const [areaCollectorRate, setAreaCollectorRate] = useState('');
  const [anyotherroad, setAnyOtherRoad] = useState('');
  const [widthanyotherroad, setWidthAnyOtherRoad] = useState('');
  const [licValid, setLicValid] = useState('');
  const [licvalidity, setLicvalidity] = useState('');
  const [appliedrenewal, setAplliedRenewal] = useState('');
  const [scrutinyFee, setscrutinyFee] = useState('');
  const [transactionScrutiny, setTransactionscrutiny] = useState('');
  const [reasonRevision, setReasonRevision] = useState('');
  const [uploadapprovedLayout, setUploadApprovedLayout] = useState('');
  const [proposedLayout, setProposedLayout] = useState('');
  const [undertakingChange, setUndertakingChange] = useState('');
  const [phasingSite, setPhasingsite] = useState('');
  const [reraUpload, setReraUpload] = useState('');
  const [newspaperpublic, setNewspaperPublic] = useState('');
  const [dateNews, setDateNews] = useState('');
  const [namenewspaper, setNameNewspaper] = useState('');
  const [intimatedAllotes, setIntimatedAllotes] = useState('');
  const [attachintimate, setAttachIntimate] = useState('');
  const [hostedapprovedWebsite, setHostedApprovedwebsite] = useState('');
  const [objectionUpload, setObjectionUpload] = useState('');
  const [replySubmittedUpload, setReplySubmittedUpload] = useState('');
  const [bookingPlotUpload, setBookingPlotUpload] = useState('');
  const [anyFeature, setAnyFeature] = useState('');
  const [sitenczdevelop, setSiteNczDevelop] = useState('');
  const [sitenczregional, setSiteNczRegional] = useState('');
  const [nczTruthingReport, setNczTruthingReport] = useState('');
  const [dlscRecommend, setDlscRecommend] = useState('');
  const [exemption, setExemption] = useState('');
  const [DdjayFormDisplay, setDdjayFormDisplay] = useState("")
  const [ResidentialFormDisplay, setResidentialFormDisplay] = useState("")
  const [IndustrialPlottedFormDisplay, setIndustrialPlottedFormDisplay] = useState("")
  // const DdjayFormDisplay=useSelector(selectDdjayFormShowDisplay);
  //   const ResidentialFormDisplay=useSelector(selectResidentialFormShowDisplay);
  //   const IndustrialPlottedFormDisplay=useSelector(selectIndustrialFormDisplay);
  //   const CommercialPlottedFormDisplay=useSelector(selectCommercialFormDisplay)
  const Purpose = localStorage.getItem('purpose')
  console.log("adf", Purpose)
  const [file,setFile]=useState(null);
  const[docUpload,setDocuploadData]=useState([])
  const { register, handleSubmit, formState: { errors } } = useForm([{ XLongitude: '', YLatitude: '' }]);
  const formSubmit = (data) => {
    console.log("data", data);
  };
  // useEffect(()=>{
  //   console.log("dff",DdjayFormDisplay)

  // },[DdjayFormDisplay])
  // useEffect(()=>{
  //   console.log("dff",ResidentialFormDisplay)

  // },[ResidentialFormDisplay])
  // useEffect(()=>{
  //   console.log("dff",IndustrialPlottedFormDisplay)

  // },[IndustrialPlottedFormDisplay])
  // useEffect(()=>{
  //   console.log("dff",ResidentialFormDisplay)

  // },[ResidentialFormDisplay])
  // useEffect(()=>{
  //   console.log("dff",IndustrialPlottedFormDisplay)

  // },[IndustrialPlottedFormDisplay])
  // useEffect(()=>{
  //   console.log("dff",CommercialPlottedFormDisplay)

  // },[CommercialPlottedFormDisplay])

  const [AppliedDetailFormSubmitted, SetAppliedDetailFormSubmitted] = useState(false);
  const AppliedDetailFormSubmitHandler = (e) => {
    e.preventDefault();
    SetAppliedDetailFormSubmitted(true);
    props.Step4Continue({ "data": true })
    let forms = {
      dgps: dgps,
      "step4Data1":
      {
        resplotno: resplotno,
        reslengthmtr: reslengthmtr,
        reswidthmtr: reswidthmtr,
        resareasq: resareasq,
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
      },
      "step4Data2":
      {
        irPlotDimen: irPlotDimen,
        irPlotArea: irPlotArea,
        irSizeDimen: irSizeDimen,
        irSizeArea: irSizeArea,
        pocketDimen: pocketDimen,
        pocketArea: pocketArea,
        surrenderDimen: surrenderDimen,
        surrenderArea: surrenderArea,
      },
      "step4Data3":
      {
        npnlNo: npnlNo,
        npnlArea: npnlArea,
        ewsNo: ewsNo,
        ewsArea: ewsArea,
      },
      "step4Data4":
      {
        frozenNo: frozenNo,
        frozenArea: frozenArea,
        organizeNo: organizeNo,
        organizeArea: organizeArea,
      },
      "step4Data5":
      {
        colonyNo: colonyNo,
        colonyArea: colonyArea,
        fiftyNo: fiftyNo,
        fiftyArea: fiftyArea,
        twoNo: twoNo,
        twoArea: twoArea,
        resiNo: resiNo,
        resiArea: resiArea,
        commerNo: commerNo,
        commerArea: commerArea,
        labourNo: labourNo,
        labourArea: labourArea,
      },
      "step4Data6":
      {
        permissible: permissible,
        perPlot: perPlot,
        perLength: perLength,
        perWidth: perWidth,
        perArea: perArea,
        commPlotted: commPlotted,
        far: far,
      },
      "step4Data7":
      {
        scono: scono,
        scolengthmtr: scolengthmtr,
        scowidthmtr: scowidthmtr,
        scoareasq: scoareasq,
        boothplotno: boothplotno,
        boothlengthmtr: boothlengthmtr,
        boothwidthmtr: boothwidthmtr,
        boothareasq: boothareasq,
      },
      "step4Data8":
      {
        ewsnpnlPlot: ewsnpnlPlot,
        areaewsnpnlPlot: areaewsnpnlPlot,
        collectorRate: collectorRate,
        areaCollectorRate: areaCollectorRate,
        anyotherroad: anyotherroad,
        widthanyotherroad: widthanyotherroad,
        licValid: licValid,
        licvalidity: licvalidity,
        appliedrenewal: appliedrenewal,
        scrutinyFee: scrutinyFee,
        transactionScrutiny: transactionScrutiny,
        reasonRevision: reasonRevision,
        uploadapprovedLayout: uploadapprovedLayout,
        proposedLayout: proposedLayout,
        undertakingChange: undertakingChange,
        phasingSite: phasingSite,
        reraUpload: reraUpload,
        newspaperpublic: newspaperpublic,
        dateNews: dateNews,
        namenewspaper: namenewspaper,
        intimatedAllotes: intimatedAllotes,
        attachintimate: attachintimate,
        hostedapprovedWebsite: hostedapprovedWebsite,
        objectionUpload: objectionUpload,
        replySubmittedUpload: replySubmittedUpload,
        bookingPlotUpload: bookingPlotUpload,
        anyFeature: anyFeature,
        sitenczdevelop: sitenczdevelop,
        sitenczregional: sitenczregional,
        nczTruthingReport: nczTruthingReport,
        dlscRecommend: dlscRecommend,
        exemption: exemption
      },

    }
    localStorage.setItem('step4', JSON.stringify(forms))

  };
  // useEffect(()=>{
  //     if (AppliedDetailFormSubmitted) {
  //         props.AppliedDetailsFormSubmit(true);
  //     }
  // },[AppliedDetailFormSubmitted]);
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
    if(file===null){
       return
    }
       const formData = new FormData();
       formData.append(
           "file",file.file      );
       formData.append(
           "tenantId","hr"      );  
       formData.append(
           "module","property-upload"      );
        formData.append(
            "tag","tag-property"      );
   
        console.log("File",formData)

       try {
           const Resp = await axios.post("http://10.1.1.18:8083/filestore/v1/files",formData,
           {headers:{
               "content-type":"multipart/form-data"
           }}).then((response) => {
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

  return (
    <Form >
      <Card style={{ width: "126%", marginLeft: "12px", paddingRight: "10px" }}>
        <Form.Group className="justify-content-center" controlId="formBasicEmail">
          <Row className="ml-auto" style={{ marginBottom: 5 }}>
            <Col col-12>

              <h5 className="text-black" onChange={(e) => setDgps(e.target.value)} value={dgps}>1. DGPS points <span className="text-primary"> (Click here for instructions to capture DGPS points)</span></h5><br></br>
              {/*                            
                                    <div className="col col-4">
                                        <label for="pitentialZone" className="font-weight-bold"><b>Number of DGPS point</b></label>
                                        <input type="number" className="form-control"
                                        onChange={(e)=>setDgps(e.target.value)} value={dgps} />
                                    </div> */}
              <div className="px-2">
                <div className="text-black">(i)Add point 1 &nbsp;
                  <div className="row ">
                    <div className="col col-4">
                      <label htmlFor="pitentialZone" className="font-weight-bold">X:Longitude</label>
                      <input type="number" name="XLongitude" className="form-control" />

                    </div>
                    <div className="col col-4">
                      <label htmlFor="pitentialZone" className="font-weight-bold">Y:Latitude</label>
                      <input type="number" name="YLatitude" className="form-control" />

                    </div>


                  </div>
                  {/* <button type="button" style={{ float: 'right'}} className="btn btn-primary" onClick={()=>setNoOfRows(noOfRows-1)}> <DeleteIcon/></button>&nbsp;&nbsp;&nbsp;
                                             <button type="button" style={{ float: 'right'}} className="btn btn-primary" onClick={()=>setNoOfRows(noOfRows+1)}> <AddIcon/></button> */}


                </div>
                {/* {[...Array(noOfRows)].map((elementInArray,index)=>{
                                       return(
                                        <div className="row ">
                                            <div className="col col-4">
                                                <label htmlFor="pitentialZone" className="font-weight-bold">X:Longiude</label>
                                                <input type="number" name="XLongitude"className="form-control" />

                                            </div>
                                            <div className="col col-4">
                                                <label htmlFor="pitentialZone" className="font-weight-bold">Y:Latitude</label>
                                                <input type="number" name="YLatitude" className="form-control"/>

                                            </div>
                                            

                                        </div>);
                                    })}
                                         */}
              </div>
              <div className="px-2">
                <div className="text-black">(ii)Add point 2 &nbsp;
                  <div className="row ">
                    <div className="col col-4">
                      <label htmlFor="pitentialZone" className="font-weight-bold">X:Longitude</label>
                      <input type="number" name="XLongitude" className="form-control" />

                    </div>
                    <div className="col col-4">
                      <label htmlFor="pitentialZone" className="font-weight-bold">Y:Latitude</label>
                      <input type="number" name="YLatitude" className="form-control" />

                    </div>


                  </div>
                  {/* {[...Array(noOfRow)].map((elementInArray,index)=>{
                                       return(
                                        <div className="row">
                                            <div className="col col-4">
                                                <label htmlFor="pitentialZone" className="font-weight-bold">X:Longiude</label>
                                                <input type="number" name="Xlongitude" className="form-control"/>

                                            </div>
                                            <div className="col col-4">
                                                <label htmlFor="pitentialZone" className="font-weight-bold">Y:Latitude</label>
                                                <input type="number" name="Ylatitude" className="form-control"/>

                                            </div>

                                        </div>);
                                })}
                                         */}
                </div>
              </div>

              <div className="px-2">
                <div className="text-black">(iii)Add point 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <div className="row ">
                    <div className="col col-4">
                      <label htmlFor="pitentialZone" className="font-weight-bold">X:Longitude</label>
                      <input type="number" name="XLongitude" className="form-control" />

                    </div>
                    <div className="col col-4">
                      <label htmlFor="pitentialZone" className="font-weight-bold">Y:Latitude</label>
                      <input type="number" name="YLatitude" className="form-control" />

                    </div>


                  </div>
                </div>
              </div>
              <div className="px-2">
                <div className="text-black">(iv)Add point 4 &nbsp;
                  <div className="row ">
                    <div className="col col-4">
                      <label htmlFor="pitentialZone" className="font-weight-bold">X:Longitude</label>
                      <input type="number" name="XLongitude" className="form-control" />

                    </div>
                    <div className="col col-4">
                      <label htmlFor="pitentialZone" className="font-weight-bold">Y:Latitude</label>
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
                        <label htmlFor="pitentialZone" className="font-weight-bold">X:Longiude</label>
                        <input type="number" name="XLongitude" className="form-control" />

                      </div>
                      <div className="col col-4">
                        <label htmlFor="pitentialZone" className="font-weight-bold">Y:Latitude</label>
                        <input type="number" name="YLatitude" className="form-control" />

                      </div>


                    </div>);
                })}

              </div><br></br>

              <hr /><br></br>
              <h5 className="text-black"><b>2.Details of Plots</b>&nbsp;&nbsp;

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
                        <td><b>Type of plots</b></td>
                        <td ><b>Plot No.</b></td>
                        <td ><b>Length in mtr <CalculateIcon color="primary" /></b></td>
                        <td ><b>Width in mtr <CalculateIcon color="primary" /></b></td>
                        <td ><b>Area in sqmtr <CalculateIcon color="primary" /></b></td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td >
                          <div className="px-2">
                            <p className="mb-2" onChange={(e) => setResPlotno(e.target.value)} value={resplotno}><b>Residential
                            </b></p>
                            {/* <div className="row">
                                                                <div className="col col-3">
                                                                <input type="radio" value="Yes" id="Yes"
                                                                    onChange={handleChange} name="Yes" />
                                                                <label for="Yes"></label>
                                                                <label htmlFor="gen">Gen</label>
                                                            </div>
                                                            <div className="col col-3">
                                                                <input type="radio" value="Yes" id="Yes"
                                                                    onChange={handleChange} name="Yes" />
                                                                <label for="Yes"></label>
                                                                <label htmlFor="npnl">NPNL</label>
                                                            </div>
                                                            
                                                            <div className="col col-3">
                                                                <input type="radio" value="Yes" id="Yes"
                                                                    onChange={handleChange} name="Yes" />
                                                                <label for="Yes"></label>
                                                                <label htmlFor="gen">EWS</label>
                                                            </div>
                                                            </div> */}
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" />
                        </td>

                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>

                      </tr>
                      <tr>

                        <td >
                          <div className="px-2">
                            <p className="mb-2" ><b>Gen
                            </b></p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" />
                        </td>

                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>

                      </tr>
                      <tr>
                        <td >
                          <div className="px-2">
                            <p className="mb-2" ><b>NPNL
                            </b></p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" />
                        </td>

                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>

                      </tr>
                      <tr>
                        <td >
                          <div className="px-2">
                            <p className="mb-2" ><b>EWS
                            </b></p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" />
                        </td>

                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>

                      </tr>
                      <tr>
                        <td >
                          <div className="px-2">
                            <p className="mb-2" onChange={(e) => setComPlotno(e.target.value)} value={complotno}><b>Commercial
                            </b></p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" />
                        </td>

                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>

                      </tr>
                      <tr>
                        <td >
                          <div className="px-2">
                            <p className="mb-2" onChange={(e) => setSitePlotno(e.target.value)} value={siteplotno}><b>Community Sites

                            </b></p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" />
                        </td>

                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>

                      </tr>
                      <tr>
                        <td >
                          <div className="px-2">
                            <p className="mb-2" onChange={(e) => setParkPlotno(e.target.value)} value={parkplotno}><b>Parks

                            </b></p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" />
                        </td>

                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>

                      </tr>
                      <tr>
                        <td >
                          <div className="px-2">
                            <p className="mb-2" onChange={(e) => setPublicPlotno(e.target.value)} value={publicplotno}><b>Public Utilities
                            </b></p>


                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" />
                        </td>

                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>

                      </tr>
                      <tr>
                        <td >
                          <div className="px-2">
                            <p className="mb-2" ><b>STP
                            </b></p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" />
                        </td>

                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>

                      </tr>
                      <tr>
                        <td >
                          <div className="px-2">
                            <p className="mb-2" ><b>ETP
                            </b></p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" />
                        </td>

                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>

                      </tr>
                      <tr>
                        <td >
                          <div className="px-2">
                            <p className="mb-2" ><b>WTP
                            </b></p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" />
                        </td>

                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>

                      </tr>
                      <tr>
                        <td >
                          <div className="px-2">
                            <p className="mb-2" ><b>UGT
                            </b></p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" />
                        </td>

                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>

                      </tr>
                      <tr>
                        <td >
                          <div className="px-2">
                            <p className="mb-2" ><b>Milk Booth
                            </b></p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" />
                        </td>

                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>

                      </tr>
                      <tr>
                        <td >
                          <div className="px-2">
                            <p className="mb-2" ><b>GSS
                            </b></p>
                          </div>
                        </td>
                        <td component="th" scope="row">
                          <input type="text" className="form-control" />
                        </td>

                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>
                        <td align="right">  <input type="number" className="form-control" /></td>

                      </tr>
                    </tbody>
                  </div>
                )}
              {
                showhide18 === "2" && (
                  // <div></div><h5 className="text-black"><b>Irregular Plots</b></h5>

                  <div>
                    <div className="table table-bordered table-responsive ">
                      <thead>
                        <tr>
                          <td><b>Details of Plot</b></td>
                          <td><b>Dimensions (in mtr) <CalculateIcon color="primary" /></b></td>
                          <td ><b>Entered Area</b></td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td >
                            <div className="px-2">
                              <p className="mb-2" onChange={(e) => setIrPlotDimen(e.target.value)} value={irPlotDimen}><b>Residential
                              </b></p>
                            </div>
                          </td>
                          <td align="right">  <input type="number" className="form-control" /></td>
                          <td align="right">  <input type="number" className="form-control" /></td>
                        </tr>
                        <tr>
                          <td >
                            <div className="px-2">
                              <p className="mb-2" onChange={(e) => setIrSizeDimen(e.target.value)} value={irSizeDimen}><b>Commercial
                              </b></p>
                            </div>
                          </td>
                          <td align="right">  <input type="number" className="form-control" /></td>
                          <td align="right">  <input type="number" className="form-control" /></td>
                        </tr>

                      </tbody>
                    </div>
                    <h5 className="text-black"><b>Area Under</b></h5>
                    <div className="table table-bordered table-responsive">
                      <thead>
                        <tr>
                          <td><b>Detail of plots</b></td>
                          <td ><b> Plot No.</b></td>
                          <td ><b>Length (in mtr) <CalculateIcon color="primary" /></b></td>
                          <td ><b>Dimension (in mtr) <CalculateIcon color="primary" /></b></td>
                          <td ><b>Entered Area</b></td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td >
                            <div className="px-2">
                              <p className="mb-2" onChange={(e) => setNpnlNo(e.target.value)} value={npnlNo}><b>Sectoral Plan Road
                              </b></p>
                            </div>
                          </td>
                          <td align="right">  <input type="number" className="form-control" /></td>
                          <td align="right">  <input type="number" className="form-control" /></td>
                          <td align="right">  <input type="number" className="form-control" /></td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" />
                          </td>
                        </tr>
                        <tr>
                          <td >
                            <div className="px-2">
                              <p className="mb-2" onChange={(e) => setEwsNo(e.target.value)} value={ewsNo}><b>Green Belt

                              </b></p>
                            </div>
                          </td>
                          <td align="right">  <input type="number" className="form-control" /></td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" />
                          </td>
                          <td align="right">  <input type="number" className="form-control" /></td>
                          <td align="right">  <input type="number" className="form-control" /></td>
                        </tr>
                        <tr>
                          <td >
                            <div className="px-2">
                              <p className="mb-2" onChange={(e) => setEwsNo(e.target.value)} value={ewsNo}><b>24/18 mtr wide internal circulation Plan road

                              </b></p>
                            </div>
                          </td>
                          <td align="right">  <input type="number" className="form-control" /></td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" />
                          </td>
                          <td align="right">  <input type="number" className="form-control" /></td>
                          <td align="right">  <input type="number" className="form-control" /></td>
                        </tr>
                        <tr>
                          <td >
                            <div className="px-2">
                              <p className="mb-2" onChange={(e) => setEwsNo(e.target.value)} value={ewsNo}><b>Other Roads

                              </b></p>
                            </div>
                          </td>
                          <td align="right">  <input type="number" className="form-control" /></td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" />
                          </td>
                          <td align="right">  <input type="number" className="form-control" /></td>
                          <td align="right">  <input type="number" className="form-control" /></td>
                        </tr>
                        <tr>
                          <td >
                            <div className="px-2">
                              <p className="mb-2" onChange={(e) => setEwsNo(e.target.value)} value={ewsNo}><b>Undetermined use(UD)

                              </b></p>
                            </div>
                          </td>
                          <td align="right">  <input type="number" className="form-control" /></td>
                          <td component="th" scope="row">
                            <input type="text" className="form-control" />
                          </td>
                          <td align="right">  <input type="number" className="form-control" /></td>
                          <td align="right">  <input type="number" className="form-control" /></td>
                        </tr>
                      </tbody>
                    </div>
                  </div>)}
              <div>
                {Purpose === "D" && (

                  <DDJAYForm ></DDJAYForm>
                )}
              </div>
              <div>
                {Purpose === "03" && (

                  <ResidentialPlottedForm ></ResidentialPlottedForm>
                )}
              </div>
              <div>
                {Purpose === "06" && (
                  <IndustrialPlottedForm ></IndustrialPlottedForm>
                )}
              </div>


              <h5 className="text-black"><b>NILP :-</b></h5><br></br>


              <div className="table table-bordered table-responsive">
                <thead>
                  <tr>
                    <td><b>S.No.</b></td>
                    <td ><b>NLP Details</b></td>
                    <td ><b>Yes/No</b></td>

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
                              <label for="areaAcre" className="font-weight-bold">Area in Acres </label>

                              <input type="text" className="form-control" />
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
                              <label for="areaAcre" className="font-weight-bold"> Dimension (in mtr)&nbsp;&nbsp;<CalculateIcon color="primary" /></label>

                              <input type="text" className="form-control" />
                            </div>
                            <div className="col col-6">
                              <label for="areaAcre" className="font-weight-bold"> Entered Area </label>

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
                              <label for="areaAcre" className="font-weight-bold">Area in Acres &nbsp;&nbsp;<CalculateIcon color="primary" /></label>

                              <input type="text" className="form-control" />
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
                              <label for="areaAcre" className="font-weight-bold">Dimension(in mtr) &nbsp;&nbsp;<CalculateIcon color="primary" /></label>

                              <input type="text" className="form-control" />
                            </div>
                            <div className="col col-12">
                              <label for="areaAcre" className="font-weight-bold">Entered Area</label>

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
              <h5 className="text-black"><b>Mandatory Documents</b></h5><br></br>
              <div className="row">
                <div className="col col-3">
                  <h6 data-toggle="tooltip" data-placement="top" title="Upload Document"><b>Site plan. &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon></b></h6>

                  <input type="file" className="form-control" onChange={(e)=>setFile({file:e.target.files[0]})}>
                  </input>
                </div>
                <div className="col col-3">
                  <h6 data-toggle="tooltip" data-placement="top" title="Upload Document"><b>Democratic Plan. &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon></b></h6>

                  <input type="file" className="form-control" onChange={(e)=>setFile({file:e.target.files[0]})}></input>
                </div>
                <div className="col col-3">
                  <h6 data-toggle="tooltip" data-placement="top" title="Upload Document"><b>Sectoral Plan/Layout Plan &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon></b></h6>

                  <input type="file" className="form-control" onChange={(e)=>setFile({file:e.target.files[0]})}></input>
                </div>
                <div className="col col-3">
                  <h6 data-toggle="tooltip" data-placement="top" title="Upload Document"><b>Development Plan. &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon></b></h6>

                  <input type="file" className="form-control" onChange={(e)=>setFile({file:e.target.files[0]})}></input>
                </div>

              </div><br></br>
              <div className="row">
                <div className="col col-4">
                  <div className="form-group" >
                    <h6 data-toggle="tooltip" data-placement="top" title="Upload Document" ><b>Upload Layout Plan  &nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon> <span className="text-primary"> (Click here for instructions to capture DGPS points)</span></b>&nbsp;&nbsp;
                      <input type="file" className="form-control" onChange={(e)=>setFile({file:e.target.files[0]})}/><b /></h6>
                  </div>
                </div>
              </div>
              <div class="row">
                    <div class="col-sm-12 text-left">
                        <button id="btnClear" class="btn btn-primary btn-md center-block" style={{marginBottom:"-44px"}} >Back</button>
                    </div>
                    <div class="row">
                <div class="col-sm-12 text-right">
                  <button id="btnSearch" class="btn btn-primary btn-md center-block" onClick={AppliedDetailFormSubmitHandler} >Continue</button>
                </div></div>
              </div>
            </Col>
          </Row>
        </Form.Group>
      </Card>
    </Form>)
};
export default AppliedDetailForm;