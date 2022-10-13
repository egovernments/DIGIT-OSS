import React,{useState} from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col} from "react-bootstrap";
// import {AiFillCheckCircle, AiFillCloseCircle} from "react-icons/ai";
// import CalculateIcon from '@mui/icons-material/Calculate';
// import InfoIcon from '@mui/icons-material/Info';
import * as Icon from "react-bootstrap-icons";
import { XCircleFill } from "react-bootstrap-icons";
import { CheckCircleFill } from "react-bootstrap-icons";



const Developerinfo=(props)=>{
    const[vacant,setVacant]=useState('');
    const[construction,setConstruction]=useState('');
    const[typeCons,setTypeCons]=useState('');
    const[ht,setHt]=useState('');
    const[htRemark,setHtRemark]=useState('');
    const[gas,setGas]=useState('');
    const[gasRemark,setGasRemark]=useState('');
    const[nallah,setNallah]=useState('');
    const[nallahRemark,setNallahremark]=useState('');
    const[road,setRoad]=useState('');
    const[roadWidth,setRoadwidth]=useState('');
    const[land,setLand]=useState('');
    const[landRemark,setLandRemark]=useState('');
    const[layoutPlan,setLayoutPlan]=useState('');
    const handleChange=(e)=>{
        this.setState({ isRadioSelected: true });
       
     }
   
     const [showhide1,setShowhide1]=useState("No");
     const [showhide2,setShowhide2]=useState("No");
     const [showhide3,setShowhide3]=useState("No");
     const [showhide4,setShowhide4]=useState("No");
     const [showhide5,setShowhide5]=useState("No");
     const [showhide6,setShowhide6]=useState("No");
     const [showhide7,setShowhide7]=useState("No");
     const [showhide8,setShowhide8]=useState("No");
     const [showhide9,setShowhide9]=useState("No");
     const [showhide0,setShowhide0]=useState("No");
     const [showhide13,setShowhide13]=useState("No");
     const [showhide18,setShowhide18]=useState("No");
     const [showhide16,setShowhide16]=useState("No");
     const handleshow=e=>{
        const getshow=e.target.value;
        setShowhide1(getshow);
    }
    const handleshow1=e=>{
        const getshow=e.target.value;
        setShowhide2(getshow);
    }
    const handleshow2=e=>{
        const getshow=e.target.value;
        setShowhide3(getshow);
    }
    const handleshow3=e=>{
        const getshow=e.target.value;
        setShowhide4(getshow);
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
    const handleshow0=e=>{
        const getshow=e.target.value;
        setShowhide0(getshow);
    }
    const handleshow13=e=>{
        const getshow=e.target.value;
        setShowhide13(getshow);
    }
    const handleshow18=e=>{
        const getshow=e.target.value;
        setShowhide18(getshow);
    }
    const handleshow16=e=>{
        const getshow=e.target.value;
        setShowhide16(getshow);
    }
    const [uncheckedValue,setUncheckedVlue]=useState([]);
    console.log(uncheckedValue);
    return(
        <Form ref={props.developerInfoRef}>
          
            <Form.Group style={{display:props.displayGeneral}} className="justify-content-center">
                <Row className="ms-auto" style={{marginBottom:20}}>
                    <Col className="ms-auto" md={4} xxl lg="12">
                            <Form.Label><b>(i)Whether licence applied for additional area ?</b></Form.Label>&nbsp;&nbsp;
                        <Form.Check value="Yes" 
                                    type="radio"  onChange1={handleChange} onClick={handleshow}
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />}
                                    name="group41" inline></Form.Check>
                        <Form.Check 
                            onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                            value="No" 
                            type="radio" id = "default-radio"  onChange1={handleChange} onClick={handleshow}
                            label={  <XCircleFill class="text-danger" />}
                           
                            name="group41" inline></Form.Check> <br></br>
                            <input type="radio" value="Yes" id="Yes"  
                            onChange1={handleChange} name="Yes" onClick={handleshow} />
                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                            <input type="radio" value="No" id="No"
                            onChange1={handleChange} name="Yes" onClick={handleshow}/>
                            <label for="No">No</label>
                            {
                        showhide1==="Yes" && (
                            <div className="row" >
                            <div className="col col-3">
                                <label for="parentLicense" className="font-weight-bold"><h6><b>License No. of Parent License</b></h6> </label>
                                <Form.Check value="Yes" 
                                    type="radio"  onChange1={handleChange} onClick={handleshow}
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />}
                                    name="group41" inline></Form.Check>
                        <Form.Check 
                            onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                            value="No" 
                            type="radio" id = "default-radio"  onChange1={handleChange} onClick={handleshow}
                            label={  <XCircleFill class="text-danger" />}
                            name="group41" inline></Form.Check>
                               <input type="number" className="form-control"/>
                            </div>
                    <div className="col col-3">
                        <label htmlFor="potential"><h6><b>Potential Zone:</b></h6></label>
                        <Form.Check value="Potential Zone" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />}
                                    name="group43" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="Potential Zone" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group43" inline></Form.Check>
                        <select className="form-control" id="potential"
                            name="potential"
                        >
                            <option value="" >--Potential Zone--
                            </option>
                            <option value="K.Mishra">Hyper</option>
                            <option value="potential 1">High I</option>
                            <option value="potential 2">High II</option>
                            <option value="potential 2">Medium</option>
                            <option value="potential 2">Low I</option>
                            <option value="potential 2">Low II</option>
                        </select>
                    
                    </div>
                    <div className="col col-3">
                                <label for="parentLicense" className="font-weight-bold"><h6><b>Site Location Purpose</b></h6> </label>
                                <Form.Check value="Site Location Purpose" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />}
                                    name="group44" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="Site Location Purpose" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group44" inline></Form.Check>
                               <input type="text" className="form-control" disabled/>
                     </div>
                     <div className="col col-3">
            <div className="form-group">
                <label htmlFor="approach"><h6><b>Approach Type (Type of Policy)</b></h6></label>
                <Form.Check value="Approach Type " type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group45" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="Approach Type " type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group45" inline></Form.Check>
                <select className="form-control" id="approach"
                    name="approach"
                >
                    <option value="" >
                    </option>
                    <option value="K.Mishra"></option>
                    <option value="potential 1"></option>
                    <option value="potential 2"></option>
                </select>
              
            </div>
        </div>
        <div className="col col-3">
            <div className="form-group ">
                <label htmlFor="roadwidth"><h6><b>Approach Road Width</b>&nbsp;&nbsp;<CalculateIcon color="primary"/></h6> </label>
                <Form.Check value="Approach Road Width " type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group46" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="Approach Road Width" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group46" inline></Form.Check>
                <input
                    type="number"
                    name="roadwidth"
                    className="form-control"></input>
            </div>
        </div>
        <div className="col col-3">
            <div className="form-group ">
                <label htmlFor="specify"><h6><b>Specify Others</b></h6></label>
                <Form.Check value="Specify Others" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group47" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="Specify Others" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group47" inline></Form.Check>
                <input
                    type="number"
                    name="specify"
                    className="form-control "
                   
                />
            </div>
        </div>
        <div className="col col-3">
            <div className="form-group ">
                <label htmlFor="typeland"><h6><b>Type of land</b></h6> </label>
                <Form.Check value="Type of land" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group49" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="Type of land" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group49" inline></Form.Check>
                <select className="form-control" id="typeland"
                    name="typeland" >
                     <option value="" >--Type of Land--
                    </option>
                    <option value="" >chahi/nehri
                    </option>
                    <option >Gair Mumkins</option>
                    <option >others</option>
                    <option ></option>
                </select>
                
            </div>
        </div>
        <div className="col col-3 ">
  
 
  <label htmlFor="typeland"><h6><b>Third-party right created</b> </h6></label><br></br>
 
  <input type="radio" value="Yes" id="Yes"
          onChange1={handleChange} name="Yes"  onClick={handleshow13}/>&nbsp;&nbsp;
          <label for="Yes"><h6>Yes</h6></label>&nbsp;&nbsp;

          <input type="radio" value="No" id="No"
          onChange1={handleChange} name="Yes"onClick={handleshow13}/>&nbsp;&nbsp;
          <label for="No"><h6>No</h6></label>
          <Form.Check value="Third-party right created" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />}
                                    name="group50" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="Third-party right created" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group50" inline></Form.Check>
          {
                showhide13==="Yes" && (
                    <div className="row " >
                            <div className="col col-12">
                                <label for="parentLicense" className="font-weight-bold"> Remark </label>
                                <input type="text" className="form-control"/>
                            </div>
                            <div className="col col-12">
                                <label for="parentLicense" className="font-weight-bold"> Document Upload </label>
                                <input type="file" className="form-control"/>
                            </div>
                        </div> 
                )
            }
             {
                showhide13==="No" && (
                    <div className="row " >
                            <div className="col col">
                                <label for="parentLicense" className="font-weight-bold"> Document Upload </label>
                                <input type="file" className="form-control"/>
                            </div>
                        </div> 
                )
            }
        </div>
                </div>

                        )
                    }
                    </Col>
                    </Row>
                    <Row className="ms-auto">
                    <Col md={4} xxl lg="12">
                      
                            <Form.Label><b>(ii)Whether licence applied under Migration policy?</b></Form.Label>&nbsp;&nbsp;
                       
                        <Form.Check value="Whether licence applied under Migration policy" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />}
                                    name="group42" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="Whether licence applied under Migration policy" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group42" inline></Form.Check><br></br>
                       <input type="radio" value="Yes" id="Yes"  
                            onChange1={handleChange} name="Yes"  />
                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                            <input type="radio" value="No" id="No"
                            onChange1={handleChange} name="Yes"/>
                            <label for="No">No</label>
                    </Col>
                </Row>
                <hr></hr>
                          
                           <h5 className="text-black"><b>2. Any encumbrance with respect to following :</b>&nbsp;&nbsp;
                           <Form.Check value="Rehan" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group43" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="Rehan" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group43" inline></Form.Check></h5><br></br>
                                <label htmlFor="gen">Rehan / Mortgage</label>&nbsp;&nbsp;
                                    <input type="radio"  id="Yes" value="1"
                                        onChange={handleChange} name="Yes"onClick={handleshow18} />&nbsp;&nbsp;
                                    <label for="Yes"></label>&nbsp;&nbsp;&nbsp;&nbsp;
                                    
                                    <label htmlFor="npnl">Patta/Lease</label>&nbsp;&nbsp;
                                    <input type="radio"  id="Yes" value="2"
                                        onChange={handleChange} name="Yes" onClick={handleshow18}/>&nbsp;&nbsp;
                                    <label for="Yes"></label>&nbsp;&nbsp;&nbsp;&nbsp;

                                    <label htmlFor="npnl">Gair/Marusi</label>&nbsp;&nbsp;
                                    <input type="radio"  id="Yes" value="2"
                                        onChange={handleChange} name="Yes" onClick={handleshow18}/>&nbsp;&nbsp;
                                    <label for="Yes"></label>

                                    <div className="row">
                                        <div className="col col-4">
                                    <label htmlFor="npnl"><h6><b>Any other, please specify</b></h6></label>
                                    <input type="text" className="form-control"/></div>
                                    </div>
                                    
             
                    <hr/>
                    <h6 ><b>(ii) Existing litigation, if any, concerning applied land including co-sharers and collaborator</b>&nbsp;&nbsp;
                    <Form.Check value=" Existing litigation" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group47" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value=" Existing litigation" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group47" inline></Form.Check></h6>
                                    
                       <input type="radio" value="Yes" id="Yes"  
                            onChange1={handleChange} name="Yes"  />
                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                            <input type="radio" value="No" id="No"
                            onChange1={handleChange} name="Yes"/>
                            <label for="No">No</label>
                   <hr/>
                    <h6 ><b>(iii) Court orders, if any, affecting applied land</b>&nbsp;&nbsp;
                    <Form.Check value=" Court orders" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />}
                                    name="group48" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value=" Court orders" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group48" inline></Form.Check></h6>
                                      <input type="radio" value="Yes" id="Yes"  
                            onChange1={handleChange} name="Yes"  />
                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                            <input type="radio" value="No" id="No"
                            onChange1={handleChange} name="Yes"/>
                            <label for="No">No</label>
                   <hr/>
                    <h6 ><b>(iv) Any insolvency/liquidation proceedings against the land owner(s)/ collaborating developed :</b>&nbsp;&nbsp;
                    <Form.Check value=" Any insolvency" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group49" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="  Any insolvency" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group49" inline></Form.Check></h6>
                                      <input type="radio" value="Yes" id="Yes"  
                            onChange1={handleChange} name="Yes"  />
                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                            <input type="radio" value="No" id="No"
                            onChange1={handleChange} name="Yes"/>
                            <label for="No">No</label>
                   <hr/>
                   <h5 className="text-black"><b>3.Shajra Plan</b></h5>
                   <div className="row">
                        <div className="col col-3 ">
                                    <h6 ><b>(a)As per applied land (Yes/No)</b> &nbsp;&nbsp;
                                    <Form.Check value=" As per applied land " type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />}
                                    name="group50" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="As per applied land " type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group50" inline></Form.Check></h6>
                                    <input type="radio" value="Yes" id="Yes"  
                            onChange1={handleChange} name="Yes"  />
                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                            <input type="radio" value="No" id="No"
                            onChange1={handleChange} name="Yes"/>
                            <label for="No">No</label>
                        </div>
                        
                        <div className="col col-3 ">
                        <h6  data-toggle="tooltip" data-placement="top" title="If any revenue rasta abuts to the applied site ?"><b>(b)&nbsp;Revenue rasta&nbsp;
                        {/* <InfoIcon style={{color:"blue"}}/>  */}
                        </b>&nbsp;&nbsp;
                                    <Form.Check value=" revenue rasta " type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group51" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="revenue rasta" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group51" inline></Form.Check></h6>
                        
                        <input type="radio" value="Yes" id="Yes"
                                            onChange1={handleChange} name="Yes"onClick={handleshow1}  />
                                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                                            <input type="radio" value="No" id="No"
                                            onChange1={handleChange} name="Yes" onClick={handleshow1}/>
                                            <label for="No">No</label>
                                            {
                                            showhide2==="Yes" && (
                                                <div className="row " >
                                                        <div className="col col">
                                                            <label for="parentLicense" className="font-weight-bold"> Width of revenue rasta </label>
                                                            <input type="number" className="form-control"/>
                                                        </div>
                                                       
                                                    </div> 

                                            )
                                        }
                                        </div>
                      
                        <div className="col col-3 ">
                                    
                        <h6  data-toggle="tooltip" data-placement="top" title="Watercourse running along boundary through the applied site ?"><b>(c)&nbsp;Watercourse running&nbsp;
                        {/* <InfoIcon style={{color:"blue"}}/>  */}
                        </b>&nbsp;&nbsp;
                                    <Form.Check value=" Yes" type="radio" 
                                    id = "default-radio" onChange1={handleChange} onClick={handleshow2}
                                    label={  <CheckCircleFill class="text-success" />}
                                    name="group53" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="No " type="radio" 
                                    id = "default-radio" onChange1={handleChange} onClick={handleshow2}
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group53" inline></Form.Check></h6>
                                     <input type="radio" value="Yes" id="Yes"
                                            onChange1={handleChange} name="Yes" onClick={handleshow2} />
                                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                                            <input type="radio" value="No" id="No"
                                            onChange1={handleChange} name="Yes" onClick={handleshow2}/>
                                            <label for="No">No</label>
                                            {
                                            showhide3==="Yes" && (
                                                <div className="row " >
                                                        <div className="col col">
                                                            <label for="parentLicense" className="font-weight-bold"> Rev. rasta width </label>
                                                            <input type="number" className="form-control"/>
                                                        </div>
                                                       
                                                    </div> 

                                            )
                                        }
                                           
                        </div>
                        <div className="col col-3 ">
                                    
                                    <h6 ><b>(d)Whether in Compact Block (Yes/No)</b> &nbsp;&nbsp;
                                    <Form.Check value=" Compact Block" type="radio" 
                                    id = "default-radio" onChange1={handleChange} onClick={handleshow2}
                                    label={  <CheckCircleFill class="text-success" />}
                                    name="group55" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="Compact Block " type="radio" 
                                    id = "default-radio" onChange1={handleChange} onClick={handleshow2}
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group55" inline></Form.Check></h6>
                                     <input type="radio" value="Yes" id="Yes"  
                            onChange1={handleChange} name="Yes"  />
                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                            <input type="radio" value="No" id="No"
                            onChange1={handleChange} name="Yes"/>
                            <label for="No">No</label>
                        </div>
                   <br></br>
                   <div className="row">
                        <div className="col col-3 ">
                                    
                        <h6 data-toggle="tooltip" data-placement="top" title="If any other owners' land is sandwiched within applied land."><b>(e)&nbsp;Land Sandwiched&nbsp;
                        {/* <InfoIcon style={{color:"blue"}}/>  */}
                        </b>&nbsp;&nbsp;
                                    <Form.Check value=" sandwiched" type="radio" 
                                    id = "default-radio" onChange1={handleChange} onClick={handleshow2}
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group56" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="sandwiched " type="radio" 
                                    id = "default-radio" onChange1={handleChange} onClick={handleshow2}
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group56" inline></Form.Check></h6>
                                     <input type="radio" value="Yes" id="Yes"  
                            onChange1={handleChange} name="Yes"  />
                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                            <input type="radio" value="No" id="No"
                            onChange1={handleChange} name="Yes"/>
                            <label for="No">No</label>
                        </div>
                        <div className="col col-3 ">
                                    
                                    <h6 ><b>(f)Acquisition status (Yes/No)</b> &nbsp;&nbsp;
                                    <Form.Check value=" Yes" type="radio" 
                                    id = "default-radio" onChange1={handleChange} onClick={handleshow2}
                                    label={  <CheckCircleFill class="text-success" />}
                                    name="group57" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="No" type="radio" 
                                    id = "default-radio" onChange1={handleChange} onClick={handleshow2}
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group57" inline></Form.Check></h6>
                               <input type="radio" value="Yes" id="Yes"
                                            onChange1={handleChange} name="Yes" onClick={handleshow3} />
                                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                                            <input type="radio" value="No" id="No"
                                            onChange1={handleChange} name="Yes" onClick={handleshow3}/>
                                            <label for="No">No</label>
                                            {
                                            showhide4==="Yes" && (
                                                <div className="row " >
                                                        <div className="col col">
                                                            <label for="parentLicense" className="font-weight-bold">Remark</label>
                                                            <input type="text" className="form-control"/>
                                                        </div>
                                                       
                                                    </div> 

                                            )
                                        }
                        </div>
                        <div className="col col-3">
                                        <div className="form-group ">
                                            <label ><b>Date of section 4 notification</b> </label>&nbsp;&nbsp;
                                            <Form.Check value=" Date of section 4 notification" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group61" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="Date of section 4 notification" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group61" inline></Form.Check>
                                    <Form.Control style={{maxWidth:200, marginTop:10}} readOnly></Form.Control>
                                        </div>
                         </div>
                         <div className="col col-3">
                                        <div className="form-group ">
                                            <label><b>Date of section 6 notification</b></label>&nbsp;&nbsp;
                                            <Form.Check value=" Date of section 6 notification" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />}
                                    name="group62" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="Date of section 6 notification" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group62" inline></Form.Check>
                                    <Form.Control style={{maxWidth:200, marginTop:10}} readOnly></Form.Control>
                                        </div>
                         </div>
                    </div>
                    </div>
                    <div className="row">
                    <div className="col col-12 ">
                                    
                    <h6  data-toggle="tooltip" data-placement="top" title="Whether details/orders of release/exclusion of land uploaded."><b>(g)&nbsp;Orders Upload &nbsp;
                    {/* <InfoIcon style={{color:"blue"}}/>  */}
                    </b>&nbsp;&nbsp;
                                    <Form.Check value=" release/exclusion" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />}
                                    name="group59" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="release/exclusion" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group59" inline></Form.Check></h6>
                                     <input type="radio" value="Yes" id="Yes"  
                            onChange1={handleChange} name="Yes" onClick={handleshow16} />
                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                            <input type="radio" value="No" id="No"
                            onChange1={handleChange} name="Yes" onClick={handleshow16}/>
                            <label for="No">No</label>
                            {
                                            showhide16==="Yes" && (
                        <div className="row " >
                        <div className="col col-3 ">
                                    
                                    <h6 ><b>(h) Whether land compensation received</b>&nbsp;&nbsp;
                                   
                                    <input type="radio" value="Yes" id="Yes"
                                            onChange1={handleChange} name="Yes"  />&nbsp;&nbsp;

                                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                                            <input type="radio" value="No" id="No"
                                            onChange1={handleChange} name="Yes"/>&nbsp;&nbsp;

                                            <label for="No">No</label></h6>
                                            <Form.Check value=" land compensation" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group60" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="land compensation" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group60" inline></Form.Check>
                        </div>
                        <div className="col col-3">
                                        <div className="form-group">
                                            <label htmlFor="releasestatus"><h6><b>Status of release</b></h6></label>
                                            <Form.Check value="Status of release" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group63" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="Status of release" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group63" inline></Form.Check>
                                            <select className="form-control" id="releasestatus"
                                                name="releasestatus" 
                                            >
                                                <option value="" >
                                                </option>
                                                <option ></option>
                                                <option ></option>
                                                <option ></option>
                                            </select>
                                        </div>
                         </div>
                         <div className="col col-3">
                                        <div className="form-group ">
                                            <label htmlFor="awarddate"><h6><b>Date of Award</b></h6></label>
                                            <Form.Check value="Date of Award" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group64" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="Date of Award" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group64" inline></Form.Check>
                                            <input
                                                type="date"
                                                name="awarddate"
                                                className="form-control"></input> 
                                        </div>
                         </div> 
                         <div className="col col-3">
                                        <div className="form-group ">
                                            <label htmlFor="releasedate"><h6><b>Date of Release</b></h6> </label>
                                            <Form.Check value="Date of Release" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group65" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="Date of Release" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group65" inline></Form.Check>
                                            <input
                                                type="date"
                                                name="releasedate" className="form-control"></input>
                                        </div>
                         </div>
                         <div className="col col-3">
                                        <div className="form-group ">
                                            <label htmlFor="sitedetails"><h6><b>Site Details</b></h6></label>
                                            <Form.Check value="Site Details" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group66" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="Site Details" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group66" inline></Form.Check>
                                            <input
                                                type="number"
                                                name="sitedetails"
                                                className="form-control "/>
                                        </div>
                         </div>
                        </div> 

                                            )
                                        }
                        </div>
                        </div>
                  <br></br>
                     <div className="row">
                        <div className="col col-12 ">
                                    
                                    <h6 ><b>whether the applied site is approachable from the proposed 18/24 m internal sectoral plan road/sector dividing road. (yes/no)</b>&nbsp;&nbsp;
 <Form.Check value="approachable" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group67" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="approachable" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group67" inline></Form.Check></h6>
                                     <input type="radio" value="Yes" id="Yes"  
                            onChange1={handleChange} name="Yes"  />
                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                            <input type="radio" value="No" id="No"
                            onChange1={handleChange} name="Yes"/>
                            <label for="No">No</label>
                                  
                        </div>
                     </div>
                    <hr/>
                    <h5 className="text-black"><b>4.Site condition</b></h5>
                    <div className="row">
                        <div className="col col-3">
                                    
                                    <h6 ><b>(a)vacant: (Yes/No)</b> <Form.Check value="vacant" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />}
                                    name="group68" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="vacant" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group68" inline></Form.Check></h6>
                                    <input type="radio" value="Yes" id="Yes"
                                            onChange1={handleChange} name="Yes"  />
                                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                                            <input type="radio" value="No" id="No"
                                            onChange1={handleChange} name="Yes"/>
                                            <label for="No">No</label>
                        </div>
                        <div className="col col-3">
                                    
                                    <h6 onChange={(e)=>setConstruction(e.target.value)} value={construction}><b>(b)Construction: (Yes/No)</b>
 </h6>      
 <Form.Check value="Construction" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group69" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="Construction" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group69" inline></Form.Check>
                                    <input type="radio" value="Yes" id="Yes"
                                            onChange1={handleChange} name="Yes"  onClick={handleshow4} />
                                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                                            <input type="radio" value="No" id="No"
                                            onChange1={handleChange} name="Yes"  onClick={handleshow4}/>
                                            <label for="No">No</label>
                                            {
                                            showhide4==="Yes" && (
                                                <div className="row " >
                                                        <div className="col col">
                                                            <label for="parentLicense" className="font-weight-bold">Type of Construction</label>
                                                            <input type="text" className="form-control"/>
                                                        </div>
                                                       
                                                    </div> 

                                            )
                                        }
                        </div>
                        <div className="col col-3">
                                    
                                    <h6 onChange={(e)=>setHt(e.target.value)} value={ht}><b>(c)HT line:(Yes/No)</b>
 </h6><Form.Check value="HT" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group70" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="HT" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group70" inline></Form.Check>
                                    <input type="radio" value="Yes" id="Yes"
                                            onChange1={handleChange} name="Yes" onClick={handleshow5}  />
                                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                                            <input type="radio" value="No" id="No"
                                            onChange1={handleChange} name="Yes" onClick={handleshow5}/>
                                            <label for="No">No</label>
                                            {
                                            showhide5==="Yes" && (
                                                <div className="row " >
                                                        <div className="col col">
                                                            <label for="parentLicense" className="font-weight-bold">HT Remarks</label>
                                                            <input type="text" className="form-control"/>
                                                        </div>
                                                       
                                                    </div> 

                                            )
                                        }
                        </div>
                        <div className="col col-3">
                                    
                                    <h6 onChange={(e)=>setGas(e.target.value)} value={gas}><b>(d) IOC Gas Pipeline:(Yes/No)</b>
 </h6><Form.Check value=" IOC" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group71" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value=" IOC" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group71" inline></Form.Check>
                                    <input type="radio" value="Yes" id="Yes"
                                            onChange1={handleChange} name="Yes"onClick={handleshow6}  />
                                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                                            <input type="radio" value="No" id="No"
                                            onChange1={handleChange} name="Yes"onClick={handleshow6}/>
                                            <label for="No">No</label>
                                            {
                                            showhide6==="Yes" && (
                                                <div className="row " >
                                                        <div className="col col">
                                                            <label for="parentLicense" className="font-weight-bold">IOC Remarks</label>
                                                            <input type="text" className="form-control"/>
                                                        </div>
                                                       
                                                    </div> 

                                            )
                                        }
                        </div>
                     </div><br></br>
                     <div className="row ">
                        <div className="col col-3">
                                    
                                    <h6 onChange={(e)=>setNallah(e.target.value)} value={nallah}><b>(e)Nallah:(Yes/No)</b> </h6>
                                    <Form.Check value="Nallah" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group72" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="Nallah" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group72" inline></Form.Check>
                                    <input type="radio" value="Yes" id="Yes"
                                            onChange1={handleChange} name="Yes" onClick={handleshow7} />
                                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                                            <input type="radio" value="No" id="No"
                                            onChange1={handleChange} name="Yes" onClick={handleshow7}/>
                                            <label for="No">No</label>
                                            {
                                            showhide7==="Yes" && (
                                                <div className="row " >
                                                        <div className="col col">
                                                            <label for="parentLicense" className="font-weight-bold">Nallah Remarks</label>
                                                            <input type="text" className="form-control"/>
                                                        </div>
                                                       
                                                    </div> 

                                            )
                                        }
                        </div>
                        <div className="col col-3">
                                    
                                    <h6 onChange={(e)=>setRoad(e.target.value)} value={road}><b>(f)Any revenue rasta/road:(Yes/No)</b>
 </h6>  <Form.Check value="revenue" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />}
                                    name="group73" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="revenue" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group73" inline></Form.Check>
                                    <input type="radio" value="Yes" id="Yes"
                                            onChange1={handleChange} name="Yes"onClick={handleshow8}  />
                                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                                            <input type="radio" value="No" id="No"
                                            onChange1={handleChange} name="Yes"onClick={handleshow8}/>
                                            <label for="No">No</label>
                                            {
                                            showhide8==="Yes" && (
                                                <div className="row " >
                                                        <div className="col col">
                                                            <label for="parentLicense" className="font-weight-bold">Width</label>
                                                            <input type="text" className="form-control"/>
                                                        </div>
                                                       
                                                    </div> 

                                            )
                                        }
                        </div>
                        <div className="col col-3">
                                    
                                    <h6 onChange={(e)=>setLand(e.target.value)} value={land}><b>(g)Any marginal land:(Yes/No)</b>
</h6> <Form.Check value="marginal" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group74" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="marginal" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group74" inline></Form.Check>
                                    <input type="radio" value="Yes" id="Yes"
                                            onChange1={handleChange} name="Yes" onClick={handleshow9} />
                                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                                            <input type="radio" value="No" id="No"
                                            onChange1={handleChange} name="Yes"onClick={handleshow9}/>
                                            <label for="No">No</label>
                                            {
                                            showhide9==="Yes" && (
                                                <div className="row " >
                                                        <div className="col col">
                                                            <label for="parentLicense" className="font-weight-bold">Remark</label>
                                                            <input type="text" className="form-control"/>
                                                        </div>
                                                       
                                                    </div> 

                                            )
                                        }
                        </div>
                        <div className="col col-3">
                                    
                        <h6  data-toggle="tooltip" data-placement="top" title="Whether any utility line passing through the site is incorporated/adjusted in the layout plan (Yes/No)
"><b>(h)&nbsp;Utility Line &nbsp;
{/* <InfoIcon style={{color:"blue"}}/>  */}
</b>

 </h6><Form.Check value="utility" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />}
                                    name="group75" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="utility" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group75" inline></Form.Check>
                                    <input type="radio" value="Yes" id="Yes"
                                            onChange1={handleChange} name="Yes" onClick={handleshow0} />
                                            <label for="Yes">Yes</label>&nbsp;&nbsp;

                                            <input type="radio" value="No" id="No"
                                            onChange1={handleChange} name="Yes" onClick={handleshow0}/>
                                            <label for="No">No</label>
                                            {
                                            showhide0==="Yes" && (
                                                <div className="row " >
                                                        <div className="col col">
                                                            <label for="parentLicense" className="font-weight-bold">Width of row</label>
                                                            <input type="text" className="form-control"/>
                                                        </div>
                                                       
                                                    </div> 

                                            )
                                        }
                        </div>
                     </div>
                     <hr/>
                     <h5 className="text-black"><b>5. Enclose the following documents as Annexures</b>&nbsp;&nbsp;
                     <Form.Check value="utility" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group76" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="utility" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group76" inline></Form.Check></h5>
                    <div className="row">
                        <div className="col col-3">
                                    <h6 ><b>Land schedule</b></h6>&nbsp;&nbsp;
                                    <Form.Check value="utility" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group75" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="utility" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group75" inline></Form.Check>
                                  <input type="file" className="form-control">
                                    </input>
                        </div>
                        <div className="col col-3">
                                    <h6 ><b>Copy of Mutation</b></h6>&nbsp;&nbsp;
                                    <Form.Check value="utility" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />}
                                    name="group75" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="utility" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group75" inline></Form.Check>
                                  <input type="file" className="form-control"></input>
                        </div>
                        <div className="col col-3">
                                    <h6 ><b>Copy of Jamabandi</b></h6>&nbsp;&nbsp;
                                    <Form.Check value="utility" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />}
                                    name="group75" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="utility" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group75" inline></Form.Check>
                                  <input type="file" className="form-control"></input>
                        </div>
                        <div className="col col-3">
                                    <h6 ><b>Details of lease / patta, if any</b></h6>&nbsp;&nbsp;
                                    <Form.Check value="utility" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group75" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="utility" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group75" inline></Form.Check>
                                  <input type="file" className="form-control"></input>
                        </div>
                      
                     </div><br></br>
                     <div className="row">
                        <div className="col col-3">&nbsp;&nbsp;
                                    <h6 ><b>Approved Layout of Plan/ Site plan for(GH)Showing Area(s)/Proposed migration </b></h6>&nbsp;&nbsp;
                                    <Form.Check value="utility" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />}
                                    name="group75" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="utility" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group75" inline></Form.Check>
                                  <input type="file" className="form-control">
                                    </input>
                        </div>
                        <div className="col col-3">
                                    <h6 ><b>Proposed Layout of Plan /site plan for area applied for migration.</b></h6>&nbsp;&nbsp;
                                    <Form.Check value="utility" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />}
                                    name="group75" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="utility" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group75" inline></Form.Check>
                                  <input type="file" className="form-control"></input>
                        </div>
                        <div className="col col-3">
                                    <h6 ><b>Revised Land Schedule</b></h6>&nbsp;&nbsp;
                                    <Form.Check value="utility" type="radio" 
                                    id = "default-radio" 
                                    label={  <CheckCircleFill class="text-success" />} 
                                    name="group75" inline></Form.Check>
                        <Form.Check onChange={(e)=>setUncheckedVlue((prev)=>[...prev,e.target.value])} 
                                    value="utility" type="radio" 
                                    id = "default-radio" 
                                    label={  <XCircleFill class="text-danger" />} 
                                    name="group75" inline></Form.Check>
                                  <input type="file" className="form-control"></input>
                        </div>
                     </div>
                     <br></br>
                      
            </Form.Group>
            <div style={{position:"relative", marginBottom:40}}>
             <Button onClick={()=>props.passUncheckedList({"data":uncheckedValue})}>
                 Submit
             </Button>
         </div>
         <hr></hr>
        </Form>
    )
}

export default Developerinfo;