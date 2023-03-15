import React, { useState, useEffect } from "react";
import { Row, Col, Card, Container, Form } from "react-bootstrap";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useForm } from "react-hook-form";
import axios from "axios";
import OutlinedInput from "@mui/material/OutlinedInput"; 

const windowHeight = window !== undefined ? window.innerHeight : null;
const Records = (props) => {
  const [LOINumber, setLOINumber] = useState("");
  const [loiPatternErr, setLoiPatternErr] = useState(false)
  const authToken = Digit.UserService.getUser()?.access_token || null;
  const userInfo = Digit.UserService.getUser()?.info || {};
  const [businessService, setBusinessService] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValue,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",

    shouldFocusError: true,
  });
  

  const getLoiPattern = (loiNumber) => {
    const pattern = /^(?=\D*\d)(?=.*[/])(?=.*[-])[a-zA-Z0-9\/-]{15,30}$/;
    return pattern.test(loiNumber);
  }
  const checkValid = (data) => {
    let isvalid = false
    if(getLoiPattern(data?.loiNumber)){
        isvalid = true
    }
    else{
      isvalid = false
      setLoiPatternErr(true)
      return isvalid
    }
    
    // if(
    //   data.hasOwnProperty('selfCertifiedDrawingFromEmpaneledDoc') && 
    //   data.hasOwnProperty('environmentalClearance') &&
    //   data.hasOwnProperty('shapeFileAsPerTemplate') &&
    //   data.hasOwnProperty('autoCadFile') &&
    //   data.hasOwnProperty('certifieadCopyOfThePlan')
    //   ){
    //     isvalid = true
    // }
    // else{
    //   checkUploadedImages(data)
    //   isvalid = false
    //   return isvalid
    // } 
    return isvalid
  }


const Records = async (data) => {
    delete data?.LOINumber;
  }

  const handleLoiNumber = async (e) => {
    e.preventDefault()
    const isValidPattern = getLoiPattern(LOINumber)
    // if(!isValidPattern){
    //   setLoiPatternErr(true)
    //   return null
    // }

    setLoiPatternErr(false)
   try {
    const loiRequest = {
      requestInfo: {
        api_id: "Rainmaker",
        ver: "1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msg_id: "090909",
        requesterId: "",
        authToken: authToken,
        userInfo: userInfo
      },
    }
    const Resp = await axios.post(`/tl-services/v1/_search?${watch("selectService")}=${LOINumber}`, loiRequest);
    console.log(Resp, "RRRRRRRRRRR");
    setBusinessService(Resp?.data?.Licenses?.[0]?.businessService)
    // setDevelopmentPlan(Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantPurpose?.AppliedLandDetails?.[0]?.developmentPlan)
    // setPurpose(Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantPurpose?.purpose)
    // setTotalArea(Resp?.data?.Licenses?.[0]?.tradeLicenseDetail?.additionalDetail?.[0]?.ApplicantPurpose?.totalArea)
    console.log("verfication", businessService)
    
     
  // console.log({ devName, developmentPlan, purpose, totalArea, purpose});

   } catch (error) {
    console.log(error)
   }
   console.log("loiloiloi343");

  }
  console.log("loiloiloi",watch("selectService"))


  // const Records = (data) => console.log(data);
  // console.log("loiloiloi", loiPatternErr)
  // const handleshowhide = (event) => {
  //   const getuser = event.target.value;
  //   onChange={(e) => handleshowhide(e)}
  //   setShowhide(getuser);
  // };
  
  




  return (
    <form 
    onSubmit={handleSubmit(Records)}
    >
    <Container
      className="justify-content-center"
      style={{
        // top: windowHeight * 0.3,
        // minWidth: "90%",
        maxWidth: "100%",
        maxheight: "100%",
        // maxHeight: "100%",
        padding:0 ,
      }}
    >
      {/* <Row> */}
      


<Card>
  
          <Card.Body style={{ overflowY: "auto", height: 200 , maxWidth: "98%", marginBottom:5}}>
            <Row>
            <Col className="col-3">
            
              <h4 class="h4">
                    Select By User Details <span style={{ color: "red" }}>*</span>
                  </h4>

                <select className="Inputcontrol"  class="form-control" {...register("selectService")} >
                  <option value="">----Select value-----</option>
                  <option value="applicationNumber">Application Number</option>
                  <option value="loiNumber">LOI Number</option>
                  <option value="tcpApplicationNumber">TCP Application Number</option>
                  <option value="tcpCaseNumber">TCP Case Number</option>
                  <option value="tcpDairyNumber">TCP Dairy Number</option>
                  
                 
                </select>
         
              
            </Col>
            <Col className="col-4">
              <div>
                <label>
                  <h4 class="h4">
                    LOI Number <span style={{ color: "red" }}>*</span>
                  </h4>
                </label>
              </div>
              <OutlinedInput
                type="string"
                className="Inputcontrol"
                {...register("loiNumber")}
                onChange={(e) => setLOINumber(e.target.value)}
                value={LOINumber}
              />
              {loiPatternErr ? <p style={{color: 'red'}}>Please enter the valid LOI Number*</p> : " "}
            </Col>
            <Col className="col-4">
                <button style={{transform: "translateY(35px)" , color:"#ffff"}} type="submit" onClick={handleLoiNumber} id="btnSearch" class="submit-bar submit-bar-take-action submit-bar-search">
               <b>Search </b> 
                </button>
            </Col>
            </Row>

            </Card.Body>
</Card>
{businessService === "TL" &&
        <Card>
          <Card.Body style={{ overflowY: "auto", height: 200 , maxWidth: "98%", backgroundColor: "#C6C6C6" ,   padding:2 }}>
            <Form>
            <div >
        <table id="datatables-basics" class="table table-striped table-bordered table-responsive" >
            <thead>
                <tr>
                    <th>Sr. No.</th>
                    <th>Application Number</th>
                    <th>Application Date</th>
                    <th>Diary No.</th>
                    <th>Status</th>
                    <th>Aging</th>
                    <th>User</th>
                    <th>Aging with User</th>
                    <th>Subject</th>
                     <th>Last User</th>
                   <th>Time Consumed(%)</th>
                </tr>
            </thead>
            <tbody>

                <tr>
                    <td>1</td>
                    <td class="text-center"><span class="badge badge-warning">TCP</span></td>
                    <td>LC-4108A</td>
                    <td>TCP-OFA/2510/2020</td>
                    <td>New Licence Application For Area 4046.86 SqMtrs, Purpose: Commercial, Activity: Dhaba </td>
                    <td class="text-center"><button class="btn btn-info" ><i class="fa fa-eye"><VisibilityIcon color="info" className="icon" /></i></button></td>
                    <td>28/08/2020</td>
                    <td>22</td>
                    <td>22</td>
                    <td class="text-center"><span class="badge badge-secondary"><b>8%</b></span></td>
                    <td class="text-center"><span class="badge badge-warning"><i class="fa fa-file"></i>&nbsp; Mark File</span></td>
                </tr>
                
                
            </tbody>
        </table>
    </div>
            </Form>
          </Card.Body>
       
        </Card>
     
    }
    </Container>
    </form>
  );
};

export default Records;
