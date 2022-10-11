import React,{useState, useEffect} from "react";
import { Container } from "react-bootstrap";
import { Card, Row, Col} from "react-bootstrap";
import Step1 from "../Step1/Step1"
// import { cardcolor, commoncolor, primarycolor } from "../../constants";
// import Step1 from "./Sr/pages/citizen/NewLicense/Step1";
// import ApllicantPuropseForm from "../forms/ApplicationPurpose";
// import AppliedDetailForm from "../forms/AppliedDetail";
// import LandScheduleForm from "../forms/LandSchedule";
// import FeesChargesForm from "../forms/FeesCharges";
// import homeF from "../../Developer/Home";
// import AddInfo from "../../Developer/AddInfo";


const Formcontainer=()=>{
    const [ActiveKey,SetActiveKey] = useState(1);

   
    
    return(
       <div> Step-1
     
       <Row >
           <Col lg="2" >
               <h5  onClick={()=>SetActiveKey(1)}>
                  Step-1
               </h5>
           </Col>
           </Row>
         
           </div> 
      
    );
}

export default Formcontainer;