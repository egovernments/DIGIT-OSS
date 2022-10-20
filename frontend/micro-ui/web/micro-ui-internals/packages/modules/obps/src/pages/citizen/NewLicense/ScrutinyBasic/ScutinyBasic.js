import React,{useState,useRef} from "react";
import Personalinfo from "./Personalinfo";
import Genarelinfo from "./Generalinfo";
import Developerinfo from "./Developerinfo";
import AppliedLandinfo from "./AppliedLand";
import Feeandcharges from "./Feeandcharges";
// import JeLandinfo from "./Scrutiny LOI/JE/JE";
import DisApprovalList from "./DisApprovalList";
import HistoryList from "./History";
import { Button } from "react-bootstrap";



const ScrutitnyForms=()=>{
    const personalInfoRef = useRef();
    const generalInfoRef = useRef();
    const developerInfoRef = useRef();
    const appliedInfoRef = useRef();
    const feeandchargesInfoRef = useRef();
    const jeLandInfoRef = useRef();


    const [displayPersonal,setDisplayPersonalInfo] = useState([]);
    const [displayPurpose,setDisplayPurposeInfo] = useState([]);
    const [displayGeneral,setDisplayGeneralInfo] = useState([]);
    const [displayAppliedLand,setDisplayAppliedLandInfo] = useState([]);
    const[displayFeeandCharges,setDisplayFeeandChargesInfo]=useState([]);
    const[displayJeLand,setDisplayJeLand]=useState([]);


    const [uncheckedValue,setUncheckedVlue]=useState([]);

    
    const getUncheckedPersonalinfos=(data)=>{

        setDisplayPersonalInfo(data.data)
        console.log(data);
    };

    const getUncheckedPurposeinfos=(data)=>{
        setDisplayPurposeInfo(data.data)
        console.log(data);
    };
    const getUncheckedGeneralinfos=(data)=>{
        setDisplayGeneralInfo(data.data)
        console.log(data);
    };
    const getUncheckedDeveloperinfos=(data)=>{
        setDisplayAppliedLandInfo(data.data)
        console.log(data);
    };
    const getUncheckedFeeandChargesInfo=(data)=>{
        setDisplayFeeandChargesInfo(data.data)
        console.log(data);
    };
    const getUncheckedJeLandInfo=(data)=>{
        setDisplayJeLand(data.data)
        console.log(data);
    };

 
    console.log(uncheckedValue);

    const handleScrolltoPersonal=()=>{
        personalInfoRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const handleScrolltOGeneral=()=>{
        generalInfoRef.current.scrollIntoView({behavior: 'smooth'});
    };
    const handleScrolltoDeveloper=()=>{
        developerInfoRef.current.scrollIntoView({behavior:"smooth"});
    };

    const handleScrolltoAppliedLandInfo=()=>{
        appliedInfoRef.current.scrollIntoView({behavior:"smooth"});
    };
    const handleScrolltoFeeandChargesInfo=()=>{
        feeandchargesInfoRef.current.scrollIntoView({behavior:"smooth"});
    };
    // const handleScrolltoJeLandInfo=()=>{
    //     jeLandInfoRef.current.scrollIntoView({behavior:"smooth"});
    // };

    console.log(displayPersonal)
    return(
       <div>
           <div style={{position:"absolute",maxWidth:"100%", height:400,display:"flex"}}>
                <div style={{position:"relative",minWidth:"10%",height:380, padding:10, display:"inline-grid"}}>
                    <Button onClick={handleScrolltoPersonal} style={{height:50, marginBottom:10}}>Step 1</Button>
                    <Button onClick={handleScrolltOGeneral} style={{height:50, marginBottom:10}}>Step 2</Button>
                    <Button onClick={handleScrolltoDeveloper} style={{height:50, marginBottom:10}}>Step 3</Button>
                    <Button onClick={handleScrolltoAppliedLandInfo} style={{height:50, marginBottom:10}}>Step 4</Button>
                    <Button onClick={handleScrolltoFeeandChargesInfo} style={{height:50, marginBottom:10}}>Step 5</Button>
                  
                </div>
                <div style={{position:"relative",width:"80%",padding:5,height:"100%",overflowY:"auto", borderStyle:"solid",borderWidth:1,borderColor:"black"}}>
                    <Personalinfo personalInfoRef={personalInfoRef} passUncheckedList={getUncheckedPersonalinfos}></Personalinfo>
                    <Genarelinfo generalInfoRef={generalInfoRef} passUncheckedList={getUncheckedGeneralinfos}></Genarelinfo>
                    <Developerinfo developerInfoRef={developerInfoRef} passUncheckedList={getUncheckedPurposeinfos}></Developerinfo>
                    <AppliedLandinfo appliedInfoRef={appliedInfoRef} passUncheckedList={getUncheckedDeveloperinfos}></AppliedLandinfo>
                    <Feeandcharges feeandchargesInfoRef={feeandchargesInfoRef} passUncheckedList={getUncheckedFeeandChargesInfo}></Feeandcharges>
                    {/* <JeLandinfo jeLandInfoRef={jeLandInfoRef} passUncheckedList={getUncheckedJeLandInfo}></JeLandinfo> */}
                </div>
           </div>
            <div style={{position:"relative",marginTop:400,width:"100%", height:"30%",display:"flex"}}>
                <DisApprovalList 
                        disapprovallistDeveloper = {displayPurpose}
                        disapprovallistGeneral={displayGeneral}
                        disapprovallistAppliedLand={displayAppliedLand}
                        disapprovallistPersonal={displayPersonal}
                        DisApprovalListFeeandCharges={displayFeeandCharges}></DisApprovalList>
                <HistoryList></HistoryList>
            </div>
       </div>
    )
}



export default ScrutitnyForms;