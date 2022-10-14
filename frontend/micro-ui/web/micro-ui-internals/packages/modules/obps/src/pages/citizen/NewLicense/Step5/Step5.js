import React, { useState,useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { useForm } from "react-hook-form";
// import Box from '@material-ui/core//Box';
import { Button, Form } from "react-bootstrap";
// import Typography from '@material-ui/core/Typography'
import Modal from 'react-bootstrap/Modal';
import { Card, Row, Col} from "react-bootstrap";
import VisibilityIcon from '@mui/icons-material/Visibility';
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
            // props.FeesChrgesFormSubmit(true);
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
                
                             </div><br></br>
                             <hr/><br></br>
                             <h5 className="text-black"><b>1.Undertakings:-</b></h5>
                             <div className="px-2">
                                    <p className="text-black">The following is undertaken: </p>
                                    <ul className="Undertakings">
                                        <li>I hereby declare that the details furnished above are true and correct to the best of my knowledge</li>
                                      .<button  className="btn btn-primary" onClick={handleShow}>Read More</button>
                                           
                                                </ul>
                                                </div> 
                                           
                                              
                                                <Modal
                                                        show={show}
                                                        onHide={() => setShow(false)}
                                                        dialogClassName="modal-90w"
                                                        aria-labelledby="example-custom-modal-styling-title"
                                                       
                                                    >
                                                        <Modal.Header closeButton>
                                                      
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                        <p>
                                                        I hereby declare that the details furnished above are true and correct to the best of my 
                                                        knowledge and belief and I undertake to inform you of any changes therein, immediately.
                                                            In case any of the above information is found to be false or untrue or misleading or misrepresenting, 
                                                            I am aware that I may be held liable for it.
                                                        </p>
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
                                                 .<button  className="btn btn-primary" onClick={setPayShow}>Pay Now</button>
                                                    {/* <button className="btn btn-success" onClick={()=>setPayShow(true)}
                                                        data-toggle="modal" data-target="#payemtModal">Pay Now</button> */}
                                                </div>
                                                      
                                              
                                                <Modal
                                                        show={show}
                                                        onHide={() => setShow(false)}
                                                        dialogClassName="modal-90w"
                                                        aria-labelledby="example-custom-modal-styling-title"
                                                       
                                                    >
                                                        <Modal.Header closeButton>
                                                      
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                        <p>
                                                        I hereby declare that the details furnished above are true and correct to the best of my 
                                                        knowledge and belief and I undertake to inform you of any changes therein, immediately.
                                                            In case any of the above information is found to be false or untrue or misleading or misrepresenting, 
                                                            I am aware that I may be held liable for it.
                                                        </p>
                                                        </Modal.Body>
      </Modal>
                                              
                                           </div>

                                   
                                      

                                        {/* <div class="modal" tabindex="-1" id="payemtModal" role="modal">
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
                                    
                                  
                                   </div>  */}
                             </div>
                             <Button style={{ alignSelf: "center", marginTop: "-32px",marginLeft:"1061px" }} 
                             variant="primary" type="submit"  onClick={()=>props.Step5Continue({"data":true})}>
              View as PDF &nbsp;&nbsp; <VisibilityIcon color="white"/>
            </Button> &nbsp;&nbsp;&nbsp;
            <Button style={{ alignSelf: "center", marginTop:"-32px"}}
             variant="primary" type="submit" onClick={FeesChrgesFormSubmitHandler} >
              Submit
            </Button>
             
        </Col>
        </Row>
        </Form.Group>
        </Card>
        </Form>)
};
 export default FeesChargesForm;