import React, { useState,useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { useForm } from "react-hook-form";
// import Box from '@material-ui/core//Box';
import { Button, Form } from "react-bootstrap";
// import Typography from '@material-ui/core/Typography'
import Modal from 'react-bootstrap/Modal';
import { Card, Row, Col} from "react-bootstrap";
// import InfoIcon from '@mui/icons-material/Info';
// import TextField from '@mui/material/TextField';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
 


const FeesChargesForm=(props)=> {
    // const [show, setShow] = useState(false);

   
    // const handleShow = () => setShow(true);

    const[form,setForm]=useState([]);
    const [feeDetail,setFeeDetail]=useState('');
    const [licenseFee,setLicenseFee]=useState('');
    const[ScrutinyFee,setScrutinyFee]=useState('');
    const[totalFee,setTotalFee]=useState('');
    const[remark,setRemark]=useState('');
    const [aggregator,setAggregator]=useState('');
    const[previousLic,setPreviousLic]=useState('');
    const[amount,setAmount]=useState('');

    const [FeesChargesFormSubmitted,SetFeesChargesFormSubmitted] = useState(false);
    const FeesChrgesFormSubmitHandler=(e)=>{
        e.preventDefault();
        SetFeesChargesFormSubmitted(true);
       
        let forms={
            feeDetail:feeDetail,
            licenseFee:licenseFee,
            ScrutinyFee:ScrutinyFee,
            totalFee:totalFee,
            remark:remark,
            aggregator:aggregator,
            previousLic:previousLic,
            amount:amount
        }
        console.log("FRMDATA",forms);
        localStorage.setItem('step5',JSON.stringify(forms))
        form.push(forms)
        let frmData = JSON.parse(localStorage.getItem('step5') || "[]")
    };
    useEffect(()=>{
        if (FeesChargesFormSubmitted) {
            props.FeesChrgesFormSubmit(true);
        }
    },[FeesChargesFormSubmitted]);
    const { register, handleSubmit, formState: { errors } } = useForm([{XLongitude:'',YLatitude:''}]);
    const formSubmit = (data) => {
        console.log("data", data);
    };
    const [showhide0,setShowhide0]=useState("No");
    const handleshow0=e=>{
        const getshow=e.target.value;
        setShowhide0(getshow);
    }
//     const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
 
    const [showhide,setShowhide]=useState("No");
    const handleshow=e=>{
        const getshow=e.target.value;
        setShowhide(getshow);
    }
    const handleFeesChange = event => {

        setFeeDetail(event.target.value);
    };
    const handleLicFeesChange = event => {

        setLicenseFee(event.target.value);
    };
    const handleScrutinyFeesChange = event => {

        setScrutinyFee(event.target.value);
    };
    const handleTotalFeesChange = event => {

        setTotalFee(event.target.value);
    };
    const handleRemarkChange = event => {

        setRemark(event.target.value);
    };
    const handleAggregatorChange = event => {

        setAggregator(event.target.value);
    };
    const handlePrevLicChange = event => {

        setPreviousLic(event.target.value);
    };
    const handleAmountChange = event => {

        setAmount(event.target.value);
    };

   
    const handleChange=(e)=>{
        this.setState({ isRadioSelected: true });
       
     }
     const[noOfRows,setNoOfRows]=useState(1);
     const[noOfRow,setNoOfRow]=useState(1);
     const[noOfRow1,setNoOfRow1]=useState(1);
     const [show, setShow] = useState(false);
     const [payShow,setPayShow]=useState(false);
     const handleClose = () => setShow(false);
     const handleShow = () => setShow(true);
     
     
     return (
        <Form onSubmit={FeesChrgesFormSubmitHandler}>
  <Card style={{width:"126%",marginLeft:"-88px",paddingRight:"10px"}}>
<Form.Group className="justify-content-center" controlId="formBasicEmail">
                <Row className="ml-auto" style={{marginBottom:5}}>
                <Col col-12>
                <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))" }}>
                                    <thead>
                                        <tr>
                                            <th><b>Total Area</b></th>
                                            {/* <td > <TextField id="standard-basic" variant="standard" /></td> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                        <th ><b>Purpose</b></th>
                                            {/* <td > <TextField id="standard-basic" variant="standard" /></td> */}
                                        </tr>
                                        <tr>
                                        <th><b>Dev Plan</b></th>
                                            {/* <td > <TextField id="standard-basic" variant="standard" /></td> */}
                                        </tr>
                                        <tr>
                                        <th><b>Scrutiny Fee</b></th>
                                            {/* <td > <TextField id="standard-basic" variant="standard" /></td> */}
                                        </tr>
                                        <tr>
                                        <th><b>License Fee</b></th>
                                            {/* <td > <TextField id="standard-basic" variant="standard" /></td> */}
                                        </tr>
                                        <tr>
                                        <th><b>Conversion Chrges</b></th>
                                            {/* <td > <TextField id="standard-basic" variant="standard" /></td> */}
                                        </tr>
                                    </tbody>
                                </table>
                 
                            {/* <div className="row">
                            <div className="col col-4">
                              
                                        <h6><b>(i)Fees/Charges details Total area</b></h6>
                                        <input type="text" className="form-control"  minLength={1} maxLength={20} pattern="[0-9]*"
                                         onChange={(e)=>setFeeDetail(e.target.value)} value={feeDetail} onChange1={handleFeesChange} />
                                         {errors.feeDetail && <p>Please check the First Name</p>}
                             </div>
                             <div className="col col-4">
                              
                                        <h6><b>(ii)Licence Fees (25%)</b></h6>
                                        <input type="text" className="form-control"   minLength={1} maxLength={20} pattern="[0-9]*"
                                         onChange={(e)=>setLicenseFee(e.target.value)} value={licenseFee} onChange1={handleLicFeesChange} />
                                         {errors.licenseFee && <p>Please check the First Name</p>}
                             </div>
                             <div className="col col-4">
                              
                              <h6><b>(iii)Scrutiny Fees</b></h6>
                              <input type="text" className="form-control"   minLength={1} maxLength={20} pattern="[0-9]*"
                               onChange={(e)=>setScrutinyFee(e.target.value)} value={ScrutinyFee} onChange1={handleScrutinyFeesChange} />
                               {errors.ScrutinyFee && <p></p>}
                   </div>
                   </div><br></br> */}
                   
                   <div className="row">
                   <div className="col col-4">
                   <h6 data-toggle="tooltip" data-placement="top" title="Total Fees (License fee 25% + Scrutiny Fees)"><b>(i)&nbsp;Total Fees&nbsp; </b>&nbsp;&nbsp;</h6>
                   
                              <input type="text" className="form-control"   minLength={1} maxLength={20} pattern="[0-9]*"
                               onChange={(e)=>setTotalFee(e.target.value)} value={totalFee}onChange1={handleTotalFeesChange} />
                               {errors.totalFee && <p></p>}
                   </div>
                            
                            <div className="col col-4" >
                              
                                        <h6><b>(ii)Remark (If any)</b></h6>
                                        <input type="text" className="form-control" minLength={2} maxLength={100}
                                         onChange={(e)=>setRemark(e.target.value)} value={remark} onChange1={handleRemarkChange} />
                                         {errors.remark && <p></p>}
                             </div>
                             {/* <div className="col col-3">
                              
                                        <h6 ><b>(vi)Select Aggregator</b></h6>
                                        <select className="form-control" id="developer"
                                                        name="developer"  onChange={(e)=>setAggregator(e.target.value)} value={aggregator}
                                                        onChange1={handleAggregatorChange} >
                               {errors.aggregator && <p></p>}
                                                    
                                                        <option value="" >
                                                        </option>
                                                        <option ></option>
                                                        <option ></option>
                                                      
                                                    </select>
                             </div> */}
                             <div className="col col-4">
                             <h6  onChange={(e)=>setPreviousLic(e.target.value)} value={previousLic} data-toggle="tooltip" data-placement="top" title="Do you want to adjust the fee from any previous license (Yes/No)"><b>(iii)&nbsp;Adjust Fees&nbsp;</b>&nbsp;&nbsp;</h6>
                             
                              <input type="radio" value="Yes" id="Yes"
                                                onChange1={handleChange} name="Yes" onClick={handleshow0}
                                              />
                                                <label for="Yes">Yes</label>&nbsp;&nbsp;

                                                <input type="radio" value="No" id="No"
                                                onChange={handleChange} name="Yes"onClick={handleshow0}/>
                                                <label for="No">No</label>
                                                {
                                            showhide0==="Yes" && (
                                                <div className="row "  >
                                                        <div className="col col-12">
                                                            <label for="parentLicense" className="font-weight-bold">Enter License Number/LOI number</label>
                                                            <input type="text" className="form-control"/>
                                                            <label for="parentLicense" className="font-weight-bold">Amount (previous)</label>
                                                            <input type="text" className="form-control" disabled/>
                                                            
                                                        </div>
                                                       
                                                    </div> 

                                            )
                                        }
                   </div>
                   {/* <div className="col col-3">
                              
                              <h6><b>(viii)Amount (previous)</b></h6>
                              <input type="number" className="form-control"  required  minLength={1} maxLength={20} pattern="[0-9]*"
                               onChange={(e)=>setAmount(e.target.value)} value={amount}
                               onChange1={handleAmountChange  } />
                               {errors.amount && <p></p>}
                   </div> */}
                             </div>
                             <hr/>
                             <h5 className="text-black"><b>1.Undertakings:-</b></h5>
                             <div className="px-2">
                                    <p className="text-black">The following is undertaken: </p>
                                    <ul className="Undertakings">
                                        <li>I, alongwith the expert team have gone through the applicable Acts/ Rules/
                                            Policies/statutory provisions related to development of colony and the
                                            application is being submitted after going through the same.</li>
                                        <li>I/We have not applied for any other licence/ CLU permission for this land
                                            anywhere else.</li>
                                        <li>I understand that execution of External Development Works involves long
                                            gestation period as the same are town level facilities and I / we shall not,
                                            at any point of time, claim any damages against the Department
                                            for non completion of the external development works. </li>
                                        <li>I/We solemnly affirm and declare that the contents of the above application
                                            are correct to the best of my/ our knowledge and belief and no information
                                            has been concealed therein.  <button  className="btn btn-primary"onClick={()=>setShow(true)}>Read More</button>
                                            {/* <span class="readMoreLink" data-toggle="modal"
                                                data-target="#licenceAgreement" >Read more</span> */}
                                                </li></ul>
                                                </div>
                                                    
                            <Modal show={show} onHide={handleClose} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title id="example-modal-sizes-title-show"></Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                            <ul>
                                                                                <li>Morbi in sem quis dui placerat ornare. Pellentesque odio
                                                                                    nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.
                                                                                    Cras consequat.</li>
                                                                                <li>Praesent dapibus, neque id cursus faucibus, tortor neque
                                                                                    egestas augue, eu vulputate magna eros eu erat. Aliquam erat
                                                                                    volutpat. Nam dui mi, tincidunt quis, accumsan porttitor,
                                                                                    facilisis luctus, metus.</li>
                                                                                <li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec
                                                                                    consectetuer ligula vulputate sem tristique cursus. Nam
                                                                                    nulla quam, gravida non, commodo a, sodales sit amet, nisi.
                                                                                </li>
                                                                                <li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis
                                                                                    auctor, ultrices ut, elementum vulputate, nunc.</li>
                                                                                <li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec
                                                                                    consectetuer ligula vulputate sem tristique cursus. Nam
                                                                                    nulla quam, gravida non, commodo a, sodales sit amet, nisi.
                                                                                </li>
                                                                                <li>Morbi in sem quis dui placerat ornare. Pellentesque odio
                                                                                    nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.
                                                                                    Cras consequat.</li>
                                                                                <li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis
                                                                                    auctor, ultrices ut, elementum vulputate, nunc.</li>
                                                                                <li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec
                                                                                    consectetuer ligula vulputate sem tristique cursus. Nam
                                                                                    nulla quam, gravida non, commodo a, sodales sit amet, nisi.
                                                                                </li>
                                                                                <li>Praesent dapibus, neque id cursus faucibus, tortor neque
                                                                                    egestas augue, eu vulputate magna eros eu erat. Aliquam erat
                                                                                    volutpat. Nam dui mi, tincidunt quis, accumsan porttitor,
                                                                                    facilisis luctus, metus.</li>
                                                                                <li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis
                                                                                    auctor, ultrices ut, elementum vulputate, nunc.</li>
                                                                                <li>Morbi in sem quis dui placerat ornare. Pellentesque odio
                                                                                    nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.
                                                                                    Cras consequat.</li>
                                                                                <li>Praesent dapibus, neque id cursus faucibus, tortor neque
                                                                                    egestas augue, eu vulputate magna eros eu erat. Aliquam erat
                                                                                    volutpat. Nam dui mi, tincidunt quis, accumsan porttitor,
                                                                                    facilisis luctus, metus.</li>
                            </ul>
                            </Modal.Body> 
                            </Modal>
                                         <div className="">
                                        
                                            <div className="form-group">
                                                <div className="form-check">
                                                    <input className="form-check-input" formControlName="agreeCheck"
                                                        type="checkbox" value="" 
                                                        id="flexCheckDefault"/>
                                                    <label className="checkbox" for="flexCheckDefault">
                                                        I agree and accept the terms and conditions.<span
                                                            className="text-danger"><b>*</b></span>
                                                    </label>
                                                </div>
                                                <div class="my-2">
                                                    <button className="btn btn-success" onClick={()=>setPayShow(true)}
                                                        data-toggle="modal" data-target="#payemtModal">Pay Now</button>
                                                </div>
                                                {/* <Modal show={Payshow} onHide={handleClose} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title id="example-modal-sizes-title-Payshow"></Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                            <ul>
                                                                                <li>Morbi in sem quis dui placerat ornare. Pellentesque odio
                                                                                    nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.
                                                                                    Cras consequat.</li>
                                                                                <li>Praesent dapibus, neque id cursus faucibus, tortor neque
                                                                                    egestas augue, eu vulputate magna eros eu erat. Aliquam erat
                                                                                    volutpat. Nam dui mi, tincidunt quis, accumsan porttitor,
                                                                                    facilisis luctus, metus.</li>
                                                                                <li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec
                                                                                    consectetuer ligula vulputate sem tristique cursus. Nam
                                                                                    nulla quam, gravida non, commodo a, sodales sit amet, nisi.
                                                                                </li>
                                                                                <li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis
                                                                                    auctor, ultrices ut, elementum vulputate, nunc.</li>
                                                                                <li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec
                                                                                    consectetuer ligula vulputate sem tristique cursus. Nam
                                                                                    nulla quam, gravida non, commodo a, sodales sit amet, nisi.
                                                                                </li>
                                                                                <li>Morbi in sem quis dui placerat ornare. Pellentesque odio
                                                                                    nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.
                                                                                    Cras consequat.</li>
                                                                                <li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis
                                                                                    auctor, ultrices ut, elementum vulputate, nunc.</li>
                                                                                <li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec
                                                                                    consectetuer ligula vulputate sem tristique cursus. Nam
                                                                                    nulla quam, gravida non, commodo a, sodales sit amet, nisi.
                                                                                </li>
                                                                                <li>Praesent dapibus, neque id cursus faucibus, tortor neque
                                                                                    egestas augue, eu vulputate magna eros eu erat. Aliquam erat
                                                                                    volutpat. Nam dui mi, tincidunt quis, accumsan porttitor,
                                                                                    facilisis luctus, metus.</li>
                                                                                <li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis
                                                                                    auctor, ultrices ut, elementum vulputate, nunc.</li>
                                                                                <li>Morbi in sem quis dui placerat ornare. Pellentesque odio
                                                                                    nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.
                                                                                    Cras consequat.</li>
                                                                                <li>Praesent dapibus, neque id cursus faucibus, tortor neque
                                                                                    egestas augue, eu vulputate magna eros eu erat. Aliquam erat
                                                                                    volutpat. Nam dui mi, tincidunt quis, accumsan porttitor,
                                                                                    facilisis luctus, metus.</li>
                            </ul>
                            </Modal.Body> 
                            </Modal> */}
                                           </div>
                                    {/* <div class="modal" tabindex="-1" id="licenceAgreement" role="modal">
                                        <div class="modal-dialog modal-lg">
                                            <div class="modal-content">
                                                <div class="modal-header text-right">
                                                    <h5 class="modal-title">Modal title</h5> 
                                                    <i class="fa fa-close"
                                                        style="font-size: 24px; cursor:pointer;font-weight: 800;"
                                                        data-dismiss="modal" aria-label="Close">&times;</i>
                                                </div>
                                                <div class="modal-body ">
                                                    <ul>
                                                        <li>Morbi in sem quis dui placerat ornare. Pellentesque odio
                                                            nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.
                                                            Cras consequat.</li>
                                                        <li>Praesent dapibus, neque id cursus faucibus, tortor neque
                                                            egestas augue, eu vulputate magna eros eu erat. Aliquam erat
                                                            volutpat. Nam dui mi, tincidunt quis, accumsan porttitor,
                                                            facilisis luctus, metus.</li>
                                                        <li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec
                                                            consectetuer ligula vulputate sem tristique cursus. Nam
                                                            nulla quam, gravida non, commodo a, sodales sit amet, nisi.
                                                        </li>
                                                        <li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis
                                                            auctor, ultrices ut, elementum vulputate, nunc.</li>
                                                        <li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec
                                                            consectetuer ligula vulputate sem tristique cursus. Nam
                                                            nulla quam, gravida non, commodo a, sodales sit amet, nisi.
                                                        </li>
                                                        <li>Morbi in sem quis dui placerat ornare. Pellentesque odio
                                                            nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.
                                                            Cras consequat.</li>
                                                        <li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis
                                                            auctor, ultrices ut, elementum vulputate, nunc.</li>
                                                        <li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec
                                                            consectetuer ligula vulputate sem tristique cursus. Nam
                                                            nulla quam, gravida non, commodo a, sodales sit amet, nisi.
                                                        </li>
                                                        <li>Praesent dapibus, neque id cursus faucibus, tortor neque
                                                            egestas augue, eu vulputate magna eros eu erat. Aliquam erat
                                                            volutpat. Nam dui mi, tincidunt quis, accumsan porttitor,
                                                            facilisis luctus, metus.</li>
                                                        <li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis
                                                            auctor, ultrices ut, elementum vulputate, nunc.</li>
                                                        <li>Morbi in sem quis dui placerat ornare. Pellentesque odio
                                                            nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.
                                                            Cras consequat.</li>
                                                        <li>Praesent dapibus, neque id cursus faucibus, tortor neque
                                                            egestas augue, eu vulputate magna eros eu erat. Aliquam erat
                                                            volutpat. Nam dui mi, tincidunt quis, accumsan porttitor,
                                                            facilisis luctus, metus.</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                    {/* <div class="">
                                        <form ></form>
                                            <div class="form-group">
                                                <div class="form-check">
                                                    <input class="form-check-input" formControlName="agreeCheck"
                                                        type="checkbox" value="" 
                                                        id="flexCheckDefault"/>
                                                    <label class="form-check-label" for="flexCheckDefault">
                                                        I agree and accept the terms and conditions.<span
                                                            class="text-danger"><b>*</b></span>
                                                    </label>
                                                </div>
                                                <div class="my-2">
                                                    <button class="btn btn-success" 
                                                        data-toggle="modal" data-target="#payemtModal">Pay Now</button>
                                                </div>
                                            </div>
                                      

                                        <div class="modal" tabindex="-1" id="payemtModal" role="modal">
                                            <div class="modal-dialog">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                     <h5 class="modal-title">Modal title</h5> 
                                                        <i class="fa fa-close"
                                                            style="font-size: 24px; cursor:pointer;font-weight: 800;"
                                                            data-dismiss="modal" aria-label="Close">&times;</i>
                                                    </div>
                                                    <div class="modal-body text-center p-3">
                                                        <img src="assets/img/Razorpay-logo.png" width="45%"/>
                                                        <div class="icon-success"><i class="fa fa-check-circle"></i>
                                                        </div>
                                                        <p class="text-success font-weight-bold"
                                                            style="font-size: 20px;">Congratulations, Payment
                                                            Successful!!</p>
                                                        <p class="font-weight-bold" style="font-size: 18px;">Your
                                                            Application No. : <strong>2547893</strong></p>
                                                        <p class="font-weight-bold" style="font-size: 18px;">Your Diary
                                                            No. : <strong>5984785</strong></p>
                                                        <p class="font-weight-bold" style="font-size: 18px;">The same
                                                            has been sent to your mobile and email as well.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    
                                  
                                   </div> */}
                             </div>
                             <Button style={{alignSelf:"center", marginTop:20, marginright:867}} variant="primary" type="submit">
                Save 
            </Button>
            <Button style={{alignSelf:"center", marginTop:20,marginLeft:1115}} variant="primary" type="submit">
               Submit
            </Button>
             
        </Col>
        </Row>
        </Form.Group>
        </Card>
        </Form>)
};
 export default FeesChargesForm;