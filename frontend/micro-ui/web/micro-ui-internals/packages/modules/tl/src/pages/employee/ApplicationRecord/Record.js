import React, { useState, useEffect } from "react";
import { Row, Col, Card, Container, Form ,Button } from "react-bootstrap";
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
  const [tableDate, setTableDate] = useState("");
  const [iDApplication, setIDApplication] = useState("");
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
    setTableDate(Resp?.data?.Licenses?.[0])
    setIDApplication(Resp?.data?.Licenses?.[0].applicationNumber)
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
  const handleshow19 = async (e) => {
    const payload = {

      "RequestInfo": {

        "apiId": "Rainmaker",

        "ver": ".01",

        "ts": null,

        "action": "_update",

        "did": "1",

        "key": "",

        "msgId": "20170310130900|en_IN",

        "authToken": ""

      }
    }
    const Resp = await axios.post(`/tl-services/new/license/pdf?applicationNumber=${iDApplication}`, payload, { responseType: "arraybuffer" })

    console.log("logger12345...", Resp.data, userInfo)

    const pdfBlob = new Blob([Resp.data], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);

    console.log("logger123456...", pdfBlob, pdfUrl);

  };
  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };
  
  




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
  
          <Card.Body style={{ overflowY: "auto", height: 200 , maxWidth: "98%", marginBottom:5 , paddingLeft: 5, marginLeft : 15}}>
            <Row>
            <Col className="col-3">
            
              <h4 class="h4" style={{marginBottom : 16}}>
                    Select By User Details <span style={{ color: "red" }}>*</span>
                  </h4>

                <select style={{height:45}}className="Inputcontrol"  class="form-control" {...register("selectService")} >
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
                    Application <span style={{ color: "red" }}>*</span>
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
                <button style={{ color:"#ffff" }} type="submit" onClick={handleLoiNumber} id="btnSearch" class="submit-bar submit-bar-take-action submit-bar-search">
               <b>Search </b> 
                </button>
            </Col>
            </Row>

            </Card.Body>
</Card>
{businessService === "TL" &&
        <Card>
          <Card.Body style={{ overflowY: "auto", height: 300 , maxWidth: "98%", backgroundColor: "#C6C6C6" ,   padding:2 }}>
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
                  <th>Last User</th>
                   <th>View PDF</th>
                </tr>
            </thead>
            <tbody>

                <tr>
                    <td>1</td>
                    {/* <td class="text-center"><span class="badge badge-warning">TCP</span></td> */}
                    <td>{tableDate?.applicationNumber}</td>
                    <td>{new Date(tableDate?.applicationDate).toLocaleDateString("en-GB")} 
                    {/* {new Date(tableDate?.applicationDate).toLocaleTimeString("en-US")} */}
                    </td>
                    <td>{tableDate?.tcpDairyNumber}</td>
                    <td>{tableDate?.status}</td>
                    <td>{new Date(tableDate?.tradeLicenseDetail?.auditDetails?.createdTime).toLocaleTimeString("en-US")}</td>
                    <td>{tableDate?.status}</td>
                    <td>{tableDate?.lastModifiedTime}</td>
                    {/* <td>{tableDate?.applicationNumber}</td> */}
                    <td></td>
               
                    {/* <td class="text-center"><button class="btn btn-info" ><i class="fa fa-eye"><VisibilityIcon color="info" className="icon"  onChange1={handleChange} name="Submit" onClick={handleshow19}/></i></button></td> */}
                    <td><div className="col-sm-2">
          <Button style={{ textAlign: "right" }} value="Submit" id="Submit" onChange1={handleChange} name="Submit" onClick={handleshow19}>Views PDF</Button>
            </div></td>
                   
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
