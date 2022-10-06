import React, { useState,useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { useForm } from "react-hook-form";
// import { TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Paper } from '@material-ui/core';
// import AddIcon from "@material-ui/icons/Add";
// import DeleteIcon from "@material-ui/icons/Delete";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col} from "react-bootstrap";
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





const AppliedDetailForm =(props)=> {

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

  const[form,setForm]=useState([]);
  const [dgps,setDgps]=useState('');
  const [resplotno,setResPlotno]=useState('');
  const[reslengthmtr,setResLengthmtr]=useState('');
  const[reswidthmtr,setResWidthmtr]=useState('');
  const[resareasq,setResAreasq]=useState('');
  const [complotno,setComPlotno]=useState('');
  const[comlengthmtr,setComLengthmtr]=useState('');
  const[comwidthmtr,setComWidthmtr]=useState('');
  const[comareasq,setComAreasq]=useState('');
  const [siteplotno,setSitePlotno]=useState('');
  const[sitelengthmtr,setSiteLengthmtr]=useState('');
  const[sitewidthmtr,setSiteWidthmtr]=useState('');
  const[siteareasq,setSiteAreasq]=useState('');
  const [parkplotno,setParkPlotno]=useState('');
  const[parklengthmtr,setParkLengthmtr]=useState('');
  const[parkwidthmtr,setParkWidthmtr]=useState('');
  const[parkareasq,setParkAreasq]=useState('');
  const [publicplotno,setPublicPlotno]=useState('');
  const[publiclengthmtr,setPublicLengthmtr]=useState('');
  const[publicwidthmtr,setPublicWidthmtr]=useState('');
  const[publicareasq,setPublicAreasq]=useState('');
  const[irPlotDimen,setIrPlotDimen]=useState('');
  const[irPlotArea,setIrPlotArea]=useState('');
  const[irSizeDimen,setIrSizeDimen]=useState('');
  const[irSizeArea,setIrSizeArea]=useState('');
  const[pocketDimen,setPocketDimen]=useState('');
  const[pocketArea,setPocketArea]=useState('');
  const[surrenderDimen,setSurrenderDimen]=useState('');
  const[surrenderArea,setSurrenderArea]=useState('');
  const[npnlNo,setNpnlNo]=useState('');
  const[npnlArea,setNpnlArea]=useState('');
  const[ewsNo,setEwsNo]=useState('');
  const[ewsArea,setEwsArea]=useState('');
  const[frozenNo,setFrozenNo]=useState('');
  const[frozenArea,setFrozenArea]=useState('');
  const[organizeNo,setorganizeNo]=useState('');
  const[organizeArea,setorganizeArea]=useState('');
  const[colonyNo,setColonyNo]=useState('');
  const[colonyArea,setColonyArea]=useState('');
  const[fiftyNo,setFiftyNo]=useState('');
  const[fiftyArea,setFiftyArea]=useState('');
  const[twoNo,setTwoNo]=useState('');
  const[twoArea,setTwoArea]=useState('');
  const[resiNo,setResiNo]=useState('');
  const[resiArea,setResiArea]=useState('');
  const[commerNo,setCommerNo]=useState('');
  const[commerArea,setCommerArea]=useState('');
  const[labourNo,setLabourNo]=useState('');
  const[labourArea,setLabourArea]=useState('');
  const[permissible,setPermissible]=useState('');
  const[perPlot,setPerPlot]=useState('');
  const[perLength,setPerLength]=useState('');
  const[perWidth,setPerWidth]=useState('');
  const[perArea,setPerArea]=useState('');
  const[commPlotted,setCommPlotted]=useState('');
  const[far,setFar]=useState('');
  const [scono,setScono]=useState('');
  const[scolengthmtr,setScoLengthmtr]=useState('');
  const[scowidthmtr,setScoWidthmtr]=useState('');
  const[scoareasq,setScoAreasq]=useState('');
  const [boothplotno,setBoothPlotno]=useState('');
  const[boothlengthmtr,setBoothLengthmtr]=useState('');
  const[boothwidthmtr,setBoothWidthmtr]=useState('');
  const[boothareasq,setBoothAreasq]=useState('');
  const[ewsnpnlPlot,setEwsNpnlPlot]=useState('');
  const[areaewsnpnlPlot,setAreaEwsNpnlPlot]=useState('');
  const[collectorRate,setCollectorRate]=useState('');
  const[areaCollectorRate,setAreaCollectorRate]=useState('');
  const[anyotherroad,setAnyOtherRoad]=useState('');
  const[widthanyotherroad,setWidthAnyOtherRoad]=useState('');
  const[licValid,setLicValid]=useState('');
  const[licvalidity,setLicvalidity]=useState('');
  const[appliedrenewal,setAplliedRenewal]=useState('');
  const[scrutinyFee,setscrutinyFee]=useState('');
  const[transactionScrutiny,setTransactionscrutiny]=useState('');
  const[reasonRevision,setReasonRevision]=useState('');
  const[uploadapprovedLayout,setUploadApprovedLayout]=useState('');
  const[proposedLayout,setProposedLayout]=useState('');
  const[undertakingChange,setUndertakingChange]=useState('');
  const[phasingSite,setPhasingsite]=useState('');
  const[reraUpload,setReraUpload]=useState('');
  const[newspaperpublic,setNewspaperPublic]=useState('');
  const[dateNews,setDateNews]=useState('');
  const[namenewspaper,setNameNewspaper]=useState('');
  const[intimatedAllotes,setIntimatedAllotes]=useState('');
  const[attachintimate,setAttachIntimate]=useState('');
  const[hostedapprovedWebsite,setHostedApprovedwebsite]=useState('');
  const[objectionUpload,setObjectionUpload]=useState('');
  const[replySubmittedUpload,setReplySubmittedUpload]=useState('');
  const[bookingPlotUpload,setBookingPlotUpload]=useState('');
  const[anyFeature,setAnyFeature]=useState('');
  const[sitenczdevelop,setSiteNczDevelop]=useState('');
  const[sitenczregional,setSiteNczRegional]=useState('');
  const[nczTruthingReport,setNczTruthingReport]=useState('');
  const[dlscRecommend,setDlscRecommend]=useState('');
  const[exemption,setExemption]=useState('');
//   const DdjayFormDisplay=useSelector(selectDdjayFormShowDisplay);
//   const ResidentialFormDisplay=useSelector(selectResidentialFormShowDisplay);
//   const IndustrialPlottedFormDisplay=useSelector(selectIndustrialFormDisplay);
//   const CommercialPlottedFormDisplay=useSelector(selectCommercialFormDisplay)


    
    const { register, handleSubmit, formState: { errors } } = useForm([{XLongitude:'',YLatitude:''}]);
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
    //   console.log("dff",CommercialPlottedFormDisplay)

    // },[CommercialPlottedFormDisplay])
    
    const [AppliedDetailFormSubmitted,SetAppliedDetailFormSubmitted] = useState(false);
    const AppliedDetailFormSubmitHandler=(e)=>{
        e.preventDefault();
        SetAppliedDetailFormSubmitted(true);
        let forms={
               dgps:dgps,
               "step4Data1":
                      {
                      resplotno:resplotno,
                      reslengthmtr:reslengthmtr,
                      reswidthmtr:reswidthmtr,
                      resareasq:resareasq,
                      complotno:complotno,
                      comlengthmtr:comlengthmtr,
                      comwidthmtr:comwidthmtr,
                      comareasq:comareasq,
                      siteplotno:siteplotno,
                      sitelengthmtr:sitelengthmtr,
                      sitewidthmtr:sitewidthmtr,
                      siteareasq:siteareasq,
                      parkplotno:parkplotno,
                      parklengthmtr:parklengthmtr,
                      parkwidthmtr:parkwidthmtr,
                      parkareasq:parkareasq,
                      publicplotno:publicplotno,
                      publiclengthmtr:publiclengthmtr,
                      publicwidthmtr:publicwidthmtr,
                      publicareasq:publicareasq,},
                 "step4Data2":
                      {
                        irPlotDimen:irPlotDimen,
                        irPlotArea:irPlotArea,
                        irSizeDimen:irSizeDimen,
                        irSizeArea:irSizeArea,
                        pocketDimen:pocketDimen,
                        pocketArea:pocketArea,
                        surrenderDimen:surrenderDimen,
                        surrenderArea:surrenderArea,},
                 "step4Data3":
                          {
                        npnlNo:npnlNo,
                        npnlArea:npnlArea,
                        ewsNo:ewsNo,
                        ewsArea:ewsArea,},
                 "step4Data4":
                          {
                        frozenNo:frozenNo,
                        frozenArea:frozenArea,
                        organizeNo:organizeNo,
                        organizeArea:organizeArea,},
                  "step4Data5":
                            {
                        colonyNo:colonyNo,
                        colonyArea:colonyArea,
                        fiftyNo:fiftyNo,
                        fiftyArea:fiftyArea,
                        twoNo:twoNo,
                        twoArea:twoArea,
                        resiNo:resiNo,
                        resiArea:resiArea,
                        commerNo:commerNo,
                        commerArea:commerArea,
                        labourNo:labourNo,
                        labourArea:labourArea,},
                  "step4Data6":
                          {
                      permissible:permissible,
                      perPlot:perPlot,
                      perLength:perLength,
                      perWidth:perWidth,
                      perArea:perArea,
                      commPlotted:commPlotted,
                      far:far,},
               "step4Data7":
                        {
                        scono:scono,
                        scolengthmtr:scolengthmtr,
                        scowidthmtr:scowidthmtr,
                        scoareasq:scoareasq,
                        boothplotno:boothplotno,
                        boothlengthmtr:boothlengthmtr,
                        boothwidthmtr:boothwidthmtr,
                        boothareasq:boothareasq,},
               "step4Data8":
                          {
                          ewsnpnlPlot:ewsnpnlPlot,
                          areaewsnpnlPlot:areaewsnpnlPlot,
                          collectorRate:collectorRate,
                          areaCollectorRate:areaCollectorRate,
                          anyotherroad:anyotherroad,
                          widthanyotherroad:widthanyotherroad,
                          licValid:licValid,
                          licvalidity:licvalidity,
                          appliedrenewal:appliedrenewal,
                          scrutinyFee:scrutinyFee,
                          transactionScrutiny:transactionScrutiny,
                          reasonRevision:reasonRevision,
                          uploadapprovedLayout:uploadapprovedLayout,
                          proposedLayout:proposedLayout,
                          undertakingChange:undertakingChange,
                          phasingSite:phasingSite,
                          reraUpload:reraUpload,
                          newspaperpublic:newspaperpublic,
                          dateNews:dateNews,
                          namenewspaper:namenewspaper,
                          intimatedAllotes:intimatedAllotes,
                          attachintimate:attachintimate,
                          hostedapprovedWebsite:hostedapprovedWebsite,
                          objectionUpload:objectionUpload,
                          replySubmittedUpload:replySubmittedUpload,
                          bookingPlotUpload:bookingPlotUpload,
                          anyFeature:anyFeature,
                          sitenczdevelop:sitenczdevelop,
                          sitenczregional:sitenczregional,
                          nczTruthingReport:nczTruthingReport,
                          dlscRecommend:dlscRecommend,
                          exemption:exemption},

        } 
         console.log("FRMDATA",forms);
        localStorage.setItem('step4',JSON.stringify(forms))
        form.push(forms)
        let frmData = JSON.parse(localStorage.getItem('step4') || "[]")
    
    };
    useEffect(()=>{
        if (AppliedDetailFormSubmitted) {
            props.AppliedDetailsFormSubmit(true);
        }
    },[AppliedDetailFormSubmitted]);
    const [showhide,setShowhide]=useState("No");
    const [showhide1,setShowhide1]=useState("No");
    const [showhide0,setShowhide0]=useState("No");
    const [showhide2,setShowhide2]=useState("No");
    const [showhide3,setShowhide3]=useState("No");
    const [showhide4,setShowhide4]=useState("No");
    const [showhide5,setShowhide5]=useState("No");
    const [showhide6,setShowhide6]=useState("No");
    const [showhide7,setShowhide7]=useState("No");
    const [showhide8,setShowhide8]=useState("No");
    const [showhide9,setShowhide9]=useState("No");
    const [showhide10,setShowhide10]=useState("No");
    const [showhide11,setShowhide11]=useState("No");
    const [showhide12,setShowhide12]=useState("No");
    const [showhide13,setShowhide13]=useState("No");
    const [showhide14,setShowhide14]=useState("No");
    const [showhide18,setShowhide18]=useState("2");

    const handleshow=e=>{
        const getshow=e.target.value;
        setShowhide(getshow);
    }
    const handleshow0=e=>{
      const getshow=e.target.value;
      setShowhide0(getshow);
  }
  const handleshow1=e=>{
    const getshow=e.target.value;
    setShowhide1(getshow);
}
const handleshow2=e=>{
  const getshow=e.target.value;
  setShowhide2(getshow);
}
const handleshow3=e=>{
  const getshow=e.target.value;
  setShowhide3(getshow);
}
const handleshow4=e=>{
  const getshow=e.target.value;
  setShowhide4(getshow);
}
const handleshow5=e=>{
  const getshow=e.target.value;
  setShowhide5(getshow);
}
const handleshow6=e=>{
  const getshow=e.target.value;
  setShowhide6(getshow);
}
const handleshow7=e=>{
  const getshow=e.target.value;
  setShowhide7(getshow);
}
const handleshow8=e=>{
  const getshow=e.target.value;
  setShowhide8(getshow);
}
const handleshow9=e=>{
  const getshow=e.target.value;
  setShowhide9(getshow);
}
const handleshow10=e=>{
  const getshow=e.target.value;
  setShowhide10(getshow);
}
const handleshow11=e=>{
  const getshow=e.target.value;
  setShowhide11(getshow);
}
const handleshow12=e=>{
  const getshow=e.target.value;
  setShowhide12(getshow);
}
const handleshow13=e=>{
  const getshow=e.target.value;
  setShowhide13(getshow);
}
const handleshow14=e=>{
  const getshow=e.target.value;
  setShowhide14(getshow);
}
const handleshow18=e=>{
  const getshow=e.target.value;
  setShowhide18(getshow);
}
onchange = e => {
  this.setState({ value: e.target.value });

}
    
   
    const handleChange=(e)=>{
        this.setState({ isRadioSelected: true });
       
     }
     const[noOfRows,setNoOfRows]=useState(1);
     const[noOfRow,setNoOfRow]=useState(1);
     const[noOfRow1,setNoOfRow1]=useState(1);
     
     
     return (
        <Form onSubmit={AppliedDetailFormSubmitHandler}>
                <Card style={{width:"126%",marginLeft:"-88px",paddingRight:"10px"}}>
         <Form.Group className="justify-content-center" controlId="formBasicEmail">
                <Row className="ml-auto" style={{marginBottom:5}}>
                <Col col-12>
                   
                            <h5 className="text-black" onChange={(e)=>setDgps(e.target.value)} value={dgps}>1. DGPS points <span className="text-primary"> (Click here for instructions to capture DGPS points)</span></h5>
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
                                                <input type="number" name="XLongitude"className="form-control" />

                                            </div>
                                            <div className="col col-4">
                                                <label htmlFor="pitentialZone" className="font-weight-bold">Y:Latitude</label>
                                                <input type="number" name="YLatitude" className="form-control"/>

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
                                                <input type="number" name="XLongitude"className="form-control" />

                                            </div>
                                            <div className="col col-4">
                                                <label htmlFor="pitentialZone" className="font-weight-bold">Y:Latitude</label>
                                                <input type="number" name="YLatitude" className="form-control"/>

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
                                                <input type="number" name="XLongitude"className="form-control" />

                                            </div>
                                            <div className="col col-4">
                                                <label htmlFor="pitentialZone" className="font-weight-bold">Y:Latitude</label>
                                                <input type="number" name="YLatitude" className="form-control"/>

                                            </div>
                                            

                                        </div>
                                    </div>
                                    </div>
                                    <div className="px-2">
                                        <div className="text-black">(iv)Add point 4 &nbsp;
                                        <div className="row ">
                                            <div className="col col-4">
                                                <label htmlFor="pitentialZone" className="font-weight-bold">X:Longitude</label>
                                                <input type="number" name="XLongitude"className="form-control" />

                                            </div>
                                            <div className="col col-4">
                                                <label htmlFor="pitentialZone" className="font-weight-bold">Y:Latitude</label>
                                                <input type="number" name="YLatitude" className="form-control"/>

                                            </div>
                                            

                                        </div>
                                         <button type="button" style={{ float: 'right'}} className="btn btn-primary" onClick={()=>setNoOfRows(noOfRows-1)}> </button>&nbsp;&nbsp;&nbsp;
                                             <button type="button" style={{ float: 'right',marginRight:15}} className="btn btn-primary" onClick={()=>setNoOfRows(noOfRows+1)}></button> 
                                            
                                            
                                        </div>
                                        {[...Array(noOfRows)].map((elementInArray,index)=>{
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
                                        
                                    </div>

                                    <hr/>
                                    <h5 className="text-black"><b>2.Details of Plots</b>&nbsp;&nbsp;
                                   
                                                                <input type="radio"  id="Yes" value="1"
                                                                    onChange={handleChange} name="Yes"onClick={handleshow18} />&nbsp;&nbsp;
                                                                <label for="Yes"></label>
                                                                <label htmlFor="gen">Regular</label>&nbsp;&nbsp;
                                                           
                                                                <input type="radio"  id="Yes" value="2"
                                                                    onChange={handleChange} name="Yes" onClick={handleshow18}/>&nbsp;&nbsp;
                                                                <label for="Yes"></label>
                                                                <label htmlFor="npnl">Irregular</label></h5>
                                           
                                  
                                 
                                     
                                 
                                    
                                     <Button style={{alignSelf:"center", marginTop:20, marginright:867}} variant="primary" type="submit">
                Save as Draft
            </Button>
            <Button style={{alignSelf:"center", marginTop:8,marginLeft:1025}} variant="primary" type="submit">
               Continue
            </Button>
                         
                </Col>
            </Row>
         </Form.Group>
         </Card>
         </Form>)
};
export default AppliedDetailForm;