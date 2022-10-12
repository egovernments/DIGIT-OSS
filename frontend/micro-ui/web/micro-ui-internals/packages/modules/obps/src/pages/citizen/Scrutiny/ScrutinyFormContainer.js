import React,{useState, useEffect} from "react";
import { Container } from "react-bootstrap";
import { Card, Row, Col} from "react-bootstrap";
// import { commoncolor, primarycolor } from "../../constants";
// import ScrutitnyForms from "../forms/scrutinyForms/scrutinyBasicForms";


const ScrutinyFormcontainer=(props)=>{
    const [ApplicantFormshow,SetApplicantForm] = useState(true);
    const [PurposeFormshow,SetPurposeForm] = useState(false);
    const [LandScheduleFormshow,SetLandScheduleForm] = useState(false);
    const [AppliedDetailsFormshow,SetAppliedDetailsForm] = useState(false);
    const [FeesChargesFormshow,SetFeesChargesForm] = useState(false);

    const PuposeformHandler=(data)=>{

        SetLandScheduleForm(data);
        SetPurposeForm(false);
    };

    const ApllicantFormHandler=(data)=>{
        
        SetPurposeForm(data);
        SetApplicantForm(false);
    }
    const LandFormHandler=(data)=>{
        
        SetAppliedDetailsForm(data);
        SetLandScheduleForm(false);
    }
    const AppliedDetailFormHandler=(data)=>{
        
        SetFeesChargesForm(data);
        SetAppliedDetailsForm(false);
    }
    const FeesChargesFormHandler=(data)=>{
        
        
        SetFeesChargesForm(false);
    }
    
    
    return(
       
        <Container className="justify-content-center" style={{display:props.isFormshow,minHeight:"100%",width:"100%",position:"relative", marginBottom:50,marginTop:50}}>
            <Row >
                <div className="ml-auto">
                    <h2>This Screen is for read only (For Department use only)</h2>
                </div>
            </Row>
            <Row className="ms-auto" style={{top:30,padding:10,borderWidth:10,borderStyle:"solid"}}>
                <ScrutitnyForms></ScrutitnyForms>
            </Row>
        </Container>
       
    );
}

export default ScrutinyFormcontainer;