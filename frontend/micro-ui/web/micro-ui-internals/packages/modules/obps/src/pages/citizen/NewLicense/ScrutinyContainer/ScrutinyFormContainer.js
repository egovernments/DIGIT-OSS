import { size } from "lodash";
import React,{useState, useEffect} from "react";
import { Container } from "react-bootstrap";
import { Card, Row, Col} from "react-bootstrap";
// import { commoncolor, primarycolor } from "../../constants";
import ScrutitnyForms from "../ScrutinyBasic/ScutinyBasic";


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
        <Card >
        
           
        <Row  style={{top:25,padding:5}}>
                  <div className="ml-auto">
                    <h2 className="fw-bold">This Screen is for read only (For Department use only)</h2>
                </div>
                </Row>
            <Row  style={{top:30,padding:10}}>
                <ScrutitnyForms></ScrutitnyForms>
            </Row>
        
        </Card>
    );
}

export default ScrutinyFormcontainer;