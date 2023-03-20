import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import { Dialog, stepIconClasses } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const TemplatesPatwar = (props) => {
    const applicantInfoPersonal = props.ApiResponseData;
    console.log("personal info applicant data1", applicantInfoPersonal);



    const [open, setOpen] = useState(false)

    const handleClickOpen = () => {
        setOpen(true);
      };

    const handleClose = () => {
        setOpen(false)
        // window.location.href = `/digit-ui/employee/tl/scrutiny`
      }


    return (
        <Form ref={props.generalInfoRef}>
              <Form.Group className="justify-content-center" controlId="formBasicEmail" style={{ border: "2px solid #e9ecef", margin: 10, padding: 20 }}>
          <div style={{overflow:"scroll"}}>
            <Card> TO BE READ WITH LICENSE NO. 1-5 OF 1981 (LC-9A)</Card>
              <table className="table table-bordered">
                <thead>
                  
                  <tr className="border-bottom-0">
                  <th class="fw-normal pb-0 border-bottom-0 align-top">
                      Sr.No  
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Name of Land Owner 
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                  	Revenue Estate   
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Rectangle No.   
                    </th>
                    
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Rectangle No/Mustil.  
                    </th>
                     <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Khasra No.
                    {/* khewats No */}
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Rectangle No./Mustil(Changed)
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Khasra No(Changed)
                    </th>
                     
                  <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Total Area
                    </th> 
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Share
                    </th>

                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Area Take
                    </th>
                    <th class="fw-normal pb-0 border-bottom-0 align-top">
                    Patwari_HQ Remarks
                    </th>
                     
 </tr>
 <tr>

 </tr>
 
                 
                </thead>
                <tbody>
                {
                    applicantInfoPersonal?.AppliedLandDetails?.map((item,index)=>(
                      
                  <tr key={index}>
                   
                    <td>
                    {index+1}
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.landOwner} placeholder={item?.landOwner} disabled />
                    </td>
                    <td>
                      <input type="text" className="form-control" placeholder={item?.revenueEstate} disabled />
                    </td>
                    
                    <td>
                      <input type="text" className="form-control" placeholder={item?.rectangleNo} disabled />
                    </td>
                    <td>
                      <input type="text" className="form-control" placeholder={item?.khewats} disabled />
                    </td>
                    
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.editRectangleNo} placeholder="N/A" value={item?.editRectangleNo} disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.editKhewats} placeholder={item?.editKhewats} disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.landOwnerRegistry} placeholder={item?.landOwnerRegistry} disabled />
                    </td>
                    {item?.consolidationType == "non-consolidated" && 
                      <td class="text-center">
                      <input type="text" className="form-control" title={item?.nonConsolidatedTotal} placeholder={item?.nonConsolidatedTotal} disabled />
                    </td>
                     }
                     {item?.consolidationType == "consolidated" && 
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.consolidatedTotal} placeholder={item?.consolidatedTotal} disabled />
                    </td>
                     }
                      <td class="text-center">
                      <input type="text" className="form-control" title={item?.landOwnerRegistry} placeholder={item?.landOwnerRegistry} disabled />
                    </td>
                    <td class="text-center">
                      <input type="text" className="form-control" title={item?.landOwnerRegistry} placeholder={item?.landOwnerRegistry} disabled />
                    </td>
                    <td class="text-center">
                    <div className="col-sm-2">
                    <Button style={{ textAlign: "right" }} value="Submit" id="Submit"  name="Submit" onClick={handleClickOpen}>Remarks</Button>
            </div>
                    </td>
                   
  </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </Form.Group>
          <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
    <DialogTitle id="alert-dialog-title">
    Patwari_HQ Remarks
    </DialogTitle>
    <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>Your Service Plan is submitted successfully <span><CheckCircleOutlineIcon style={{color: 'blue', variant: 'filled'}}/></span></p>
            <p>Please Note down your Application Number <span style={{padding: '5px', color: 'blue'}}>Patwari_HQ Remarks</span> for further assistance</p>
          </DialogContentText>
    </DialogContent>
    <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Ok
          </Button>
    </DialogActions>

    </Dialog>
          </Form>
  );
};

export default TemplatesPatwar;