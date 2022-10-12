import React, { useEffect, useState } from "react";

function AddInfo() {
    const [modal, setmodal] = useState(false);
    const [data, setData] = useState([])
    const [devDetail, setdevDetail] = useState([])
  
    // useEffect(() => {
    //   fetch("https://apisetu.gov.in/mca/v1/companies/U72200CH1998PTC022006").then((result) => {
    //     result.json().then((resp) => {
    //       setData(resp)
    //     })
    //   })
    // }, [])
    // console.warn(data)
    const {
      register,
      handleSumit,
      formState: { error },
    } = useForm([
      { Sr: "", name: "", mobileNumber: "", email: "", PAN: "", Aadhar: "" },
    ]);
    const formSubmit = (data) => {
      console.log("data", data);
    };
  
    // onchange = (e) => {
    //   this.setState({ value: e.target.value });
    // };
    const handleChange = (e) => {
      this.setState({ isRadioSelected: true });
    };
    const [showhide0, setShowhide0] = useState("No");
    const [FormSubmitted, setFormSubmitted] = useState(false);
    const [showhide, setShowhide] = useState("No");
    const [cin_Number, setCinNo] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [dateOfCorporation, setIncorporation] = useState("");
    const [registeredAddress, setRegistered] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobile] = useState("");
    const [gst_Number, setGST] = useState("");
    const [sharName, setTbName] = useState("");
    const [designition, setDesignition] = useState("");
    const [percentage, setPercetage] = useState("");
    const [uploadPdf, setUploadPDF] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [DirectorData,setDirectorData]=useState([]);
    const [modalNAme,setModalNAme]=useState("");
    const [modaldesignition,setModaldesignition]=useState("");
    const [modalPercentage,setModalPercentage]=useState("");
    // const dispatch = useDispatch();
    
    const [modalValuesArray,setModalValuesArray]= useState([]);
    const [financialCapacity,setFinancialCapacity]= useState([]);
    const handleshow = (e) => {
      const getshow = e.target.value;
      setShowhide(getshow);
    };
  
    const handleshow0 = (e) => {
      const getshow = e.target.value;
      setShowhide0(getshow);
    };
  
    const HandleGetMCNdata=async()=>{
      try{
        if (cin_Number.length===21) {
          const Resp = await axios.get("/mca/v1/companies/U72200CH1998PTC022006", {headers:{
            'Content-Type': 'application/json',
            'X-APISETU-APIKEY':'PDSHazinoV47E18bhNuBVCSEm90pYjEF',
            'X-APISETU-CLIENTID':'in.gov.tcpharyana',
            'Access-Control-Allow-Origin':"*",
          }})
  
          const Directory = await axios.get("/mca-directors/v1/companies/U72200CH1998PTC022006", {headers:{
            'Content-Type': 'application/json',
            'X-APISETU-APIKEY':'PDSHazinoV47E18bhNuBVCSEm90pYjEF',
            'X-APISETU-CLIENTID':'in.gov.tcpharyana',
            'Access-Control-Allow-Origin':"*",
          }})
  
          console.log(Resp.data)
          console.log(Directory.data);
          setDirectorData(Directory.data);
          setCompanyName(Resp.data.companyName)
          setIncorporation(Resp.data.dateOfCorporation)
          setEmail(Resp.data.email)
          //console.log(Resp.data.Email)
       setRegistered(Resp.data.registeredAddress)
       setMobile(Resp.data.registeredContactNo)
     //  setGST(Resp.data.GST)
  
        }
      }catch(error){
  
        console.log(error.message);
  
      }
  }
  const handleArrayValues=()=>{
    
    if (modalNAme!=="" && modaldesignition!=="" && modalPercentage!=="") {
      
      const values ={
        "name":modalNAme,
        "designition":modaldesignition,
        "percentage":modalPercentage,
        "uploadPdf": null,
        "serialNumber": null
      }
      setModalValuesArray((prev)=>[...prev,values]);
      setmodal(!modal)
    }
  }
  console.log("FORMARRAYVAL",modalValuesArray);
  useEffect(()=>{
    HandleGetMCNdata();
  },[cin_Number])
  
  // const postAddInfo=async()=>{
  
  //   try{
  //     const Resp =  await axios.post("http://localhost:8081/user/developer/_registration",
  //     {headers:{
  //         'Content-Type': 'application/json',
  //         'Access-Control-Allow-origin':"*",
  //     }})
  //     .then((Resp)=>{
  //         console.log("FORMDATA",Resp.devDetail)
  //         return Resp;
  //     })
  
  //   }catch(error){
  //     console.log(error)
  //   }
  // }
  
    const [noofRows, setNoOfRows] = useState(1);
    const [aoofRows, setAoOfRows] = useState(1);
    const AddInfoForm = async (e) => {
      e.preventDefault();
      setFormSubmitted(true);
      let barArray = []
      const formTab = {
        
        // "developerDetail": [
  
        //     {
              // "addInfo":{
                cin_Number: cin_Number,
                companyName: companyName,
                dateOfCorporation: dateOfCorporation,
                registeredAddress: registeredAddress,
                email: email,
                mobileNumber: mobileNumber,
                gst_Number: gst_Number,
                directorsInformation: DirectorData,
                shareHoldingPatterens:modalValuesArray,
                financialCapacity:financialCapacity
                
              // }
        //     }
        // ]
          
      };
  
    //   dispatch(setAddinfoData(
    //     formTab
    //   ))
      console.log("FORMARRAL",formTab);
      // try {
      //   let res = await axios.post("http://localhost:8081/user/developer/_registration",formTab,{
      //     headers:{
      //       'Content-Type': 'application/json',
      //       'Access-Control-Allow-origin':"*",
      //   }
      //   }).then((response)=>{
      //     return response
      //   });
        
        
      // } catch (err) {
      //   console.log(err);
      // }
      // console.log("FORMARRAL",formTab);
      // console.log("director data",DirectorData);
      // const formData = ("formTab",JSON.stringify(formTab));
      // console.log("sdsdsds",formData);
      // localStorage.setItem("devDetail", JSON.stringify(devDetail));
      // devDetail.push();
      // let frmData = JSON.parse(localStorage.getItem("step1a") || "[]");
  
  
  
  
      // useEffect(()=>{
      //   postAddInfo();
      // },[]);
    };
  
    return (
  
      <div>
  
  
        <Form onSubmit={AddInfoForm}>
          {/* <div className="container my-5">
          <div className="row mt-4">
            <div className=" col-12 m-auto"> */}
  
          <div className="happy">
            <div className="bigCard">
              <div className="card">
                <div>
                  <h4 className="card-h">
                    {" "}
                    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;Developer
                  </h4>
                  <div className="card">
                    <div className="card-body">
                      {/* <h5 className="card-title">
                        (i) Details of following documents
                      </h5> */}
                      <div className="row">
                        <div className="col-sm-12">
                          {/* <h4 className='mt-3 text-center mb-3'>Output  </h4> */}
  
                          {/* <div className="form-group row">
                                    <label className="col-sm-3 col-form-label">Name</label>
                                    <div className="col-sm-6">
                                        <input type="text" className="form-control" id="inputPassword" placeholder="Enter Name" />
                                    </div>
                                </div> */}
  
                          <div className="form-group row">
                            {/* <label className="col-sm-3 col-form-label">Full Address</label> */}
                            <div className="col-sm-3">
                              Individual
                              <input
                                type="radio"
                                className="mx-2"
                                name="isyes"
                                value="1"
                                onChange={handleChange}
                                onClick={handleshow0}
                              />
                            </div>
                            <div className="col-sm-3">
                              Company
                              <input
                                type="radio"
                                className="mx-2 mt-1"
                                name="isyes"
                                value="0"
                                onChange={handleChange}
                                onClick={handleshow0}
                              />
                            </div>
                            <div className="col-sm-3">
                              LLP
                              <input
                                type="radio"
                                className="mx-2 mt-1"
                                name="isyes"
                                value="2"
                                onChange={handleChange}
                                onClick={handleshow0}
                              />
                            </div>
                          </div>
  
                          {showhide0 === "1" && (
                            <div className="form-group row mb-12">
                              {/* <label className="col-sm-3 col-form-label">Individual</label> */}
                              <div className="col-sm-12">
                                {/* <textarea type="text" className="form-control" id="details" placeholder="Enter Details" /> */}
                                <Table className="table table-bordered" size="sm">
                                  <thead>
                                    <tr>
                                      <th>S.No.</th>
                                      <th>Particulars of document</th>
                                      <th>Details </th>
                                      <th>Annexure </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td> 1 </td>
                                      <td>
                                        Net Worth in case of individual certified by
                                        CA
                                      </td>
                                      <td>
                                        <input
                                          type="file"
                                          name="upload"
                                          placeholder=""
                                          class="form-control"
                                        />
                                      </td>
                                      <td align="center" size="large">
                                        {/* <FileUploadIcon /> */}
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </div>
                            </div>
                          )}
  
                          {showhide0 === "0" && (
                            <div className="form-group row">
                              {/* <label className="col-sm-3 col-form-label">Company</label> */}
                              <div className="col-sm-12">
                                {/* <input type="text" className="form-control" id="Email" placeholder="Enter Email" /> */}
                                <Table className="table table-bordered" size="sm">
                                  <thead>
                                    <tr>
                                      <th>S.No.</th>
                                      <th>Particulars of document</th>
                                      <th>Details </th>
                                      <th>Annexure </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td> 1 </td>
                                      <td>Balance sheet of last 3 years </td>
                                      <td>
                                        <input
                                          type="file"
                                          name="upload"
                                          placeholder=""
                                          class="form-control"
                                        />
                                      </td>
                                      <td align="center" size="large">
                                        {/* <FileUploadIcon /> */}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td> 2 </td>
                                      <td>Ps-3(Representing Paid-UP capital)</td>
                                      <td>
                                        <input
                                          type="file"
                                          name="upload"
                                          placeholder=""
                                          class="form-control"
                                        />
                                      </td>
                                      <td align="center" size="large">
                                        {/* <FileUploadIcon /> */}
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </div>
                            </div>
                          )}
                          {showhide0 === "2" && (
                            <div className="form-group row">
                              {/* <label className="col-sm-3 col-form-label">LLP</label> */}
                              <div className="col-sm-12">
                                {/* <input type="text" className="form-control" id="llp" placeholder="Enter Email" /> */}
                                <Table className="table table-bordered" size="sm">
                                  <thead>
                                    <tr>
                                      <th>S.No.</th>
                                      <th>Particulars of document</th>
                                      <th>Details </th>
                                      <th>Annexure </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td> 1 </td>
                                      <td>Networth of partners </td>
                                      <td>
                                        <input
                                          type="file"
                                          name="upload"
                                          placeholder=""
                                          class="form-control"
                                        />
                                      </td>
                                      <td align="center" size="large">
                                        {/* <FileUploadIcon /> */}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td> 2 </td>
                                      <td>Net worth of firm</td>
                                      <td>
                                        <input
                                          type="file"
                                          name="upload"
                                          placeholder=""
                                          class="form-control"
                                        />
                                      </td>
                                      <td align="center" size="large">
                                        {/* <FileUploadIcon /> */}
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <h4 className="card-h">
                    {" "}
                    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;1. Developer Details:
                  </h4>
                </div>
                <div className="card shadow">
                  {/* <div className="card-header">
                  <h5 className="card-title"> Developer</h5>
                </div> */}
  
                  <div className="card-body">
                    <div className="row">
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="name">CIN Number/LLP Pin</label>
                          <input
                            type="text"
                            onChange={(e) => setCinNo(e.target.value)}
                            value={cin_Number}
                            className="form-control"
                          // placeholder=""
                          // {...register("name", {
                          //   required: "Name is required",
                          //   pattern: {
                          //     value: /^[a-zA-Z]+$/,
                          //     message: "Name must be a valid string",
                          //   },
                          //   minLength: {
                          //     value: 3,
                          //     message:
                          //       "Name should be greater than 3 characters",
                          //   },
                          //   maxLength: {
                          //     value: 20,
                          //     message:
                          //       "Name shouldn't be greater than 20 characters",
                          //   },
                          // })}
                          />
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">
  
                          <label htmlFor="name">Company Name/LLP Pin</label>
  
                          <input
                            type="text"
                            value={companyName}
                            placeholder={companyName}
                            className="form-control"
                          // placeholder=""
                          // {...register("name", {
                          //   required: "Name is required",
                          //   pattern: {
                          //     value: /^[a-zA-Z]+$/,
                          //     message: "Name must be a valid string",
                          //   },
                          //   minLength: {
                          //     value: 3,
                          //     message:
                          //       "Name should be greater than 3 characters",
                          //   },
                          //   maxLength: {
                          //     value: 20,
                          //     message:
                          //       "Name shouldn't be greater than 20 characters",
                          //   },
                          // })}
                          />
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="name">Date of Incorporation</label>
                          <input
                            type="text"
                            value={dateOfCorporation}
                            placeholder={dateOfCorporation}
                            className="form-control"
                          // placeholder=""
                          // {...register("name", {
                          //   required: "Name is required",
                          //   pattern: {
                          //     value: /^[a-zA-Z]+$/,
                          //     message: "Name must be a valid string",
                          //   },
                          //   minLength: {
                          //     value: 3,
                          //     message:
                          //       "Name should be greater than 3 characters",
                          //   },
                          //   maxLength: {
                          //     value: 20,
                          //     message:
                          //       "Name shouldn't be greater than 20 characters",
                          //   },
                          // })}
                          />
                        </div>
                      </div>
  
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="name">Registered Address</label>
                          <input
                            type="text"
                            value={registeredAddress}
                           placeholder={registeredAddress}
                            className="form-control"
                          // name="name"
                          // className={`form-control`}
                          // placeholder=""
                          // {...register("name", {
                          //   required: "Name is required",
                          //   pattern: {
                          //     value: /^[a-zA-Z]+$/,
                          //     message: "Name must be a valid string",
                          //   },
                          //   minLength: {
                          //     value: 3,
                          //     message:
                          //       "Name should be greater than 3 characters",
                          //   },
                          //   maxLength: {
                          //     value: 20,
                          //     message:
                          //       "Name shouldn't be greater than 20 characters",
                          //   },
                          // })}
                          />
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group ">
                          <label htmlFor="email"> Email </label>
                          <input
                            type="text"
                            value={email}
                           placeholder={email}
                            className="form-control"
                          // name="email"
                          // className={`form-control`}
                          // placeholder=""
                          // {...register("email", {
                          //   required: "Email is required",
                          //   pattern: {
                          //     value: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
                          //     message: "Email must be a valid email address",
                          //   },
                          // })}
                          />
                          {/* <div className="invalid-feedback">
                            {errors?.email?.message}
                          </div> */}
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="name">Mobile No.</label>
                          <input
                            type="text"
                            value={mobileNumber}
                            placeholder={mobileNumber}
                            className="form-control"
                          // name="name"
                          // className={`form-control`}
                          // placeholder=""
                          // {...register("name", {
                          //   required: "Name is required",
                          //   pattern: {
                          //     value: /^[a-zA-Z]+$/,
                          //     message: "Name must be a valid string",
                          //   },
                          //   minLength: {
                          //     value: 3,
                          //     message:
                          //       "Name should be greater than 3 characters",
                          //   },
                          //   maxLength: {
                          //     value: 20,
                          //     message:
                          //       "Name shouldn't be greater than 20 characters",
                          //   },
                          // })}
                          />
                          {/* <div className="invalid-feedback">
                            {errors?.name?.message}
                          </div> */}
                        </div>
                      </div>
                      <div className="col col-4">
                        <div className="form-group">
                          <label htmlFor="name">GST No.</label>
                          <input
                            type="text"
                            value={gst_Number}
                           placeholder={gst_Number}
                            className="form-control"
                          // className={`form-control`}
                          // placeholder=""
                          // {...register("name", {
                          //   required: "Name is required",
                          //   pattern: {
                          //     value: /^[a-zA-Z]+$/,
                          //     message: "Name must be a valid string",
                          //   },
                          //   minLength: {
                          //     value: 3,
                          //     message:
                          //       "Name should be greater than 3 characters",
                          //   },
                          //   maxLength: {
                          //     value: 20,
                          //     message:
                          //       "Name shouldn't be greater than 20 characters",
                          //   },
                          // })}
                          />
                          {/* <div className="invalid-feedback">
                            {errors?.name?.message}
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h5 className="card-h">
                  {" "}
                  &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;2. Shareholding Patterns
                </h5>
                <div className="card shadow">
                  <div className="card-body">
                    <div className="table-bd">
                      <Table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Sr. No</th>
                            <th>Name</th>
                            <th>Designition</th>
                            <th>Percentage</th>
                            <th>View PDF</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            (modalValuesArray.length>0)?
                            modalValuesArray.map((elementInArray, input) => {
                              return (
                                <tr>
                                  <td>{input+ 1}</td>
                                  <td>
                                    <input
                                      type="text"
                                      value={elementInArray.name}
                                      placeholder={elementInArray.name}
                                      readOnly
                                      class="form-control"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      value={elementInArray.designition}
                                      placeholder={elementInArray.designition}
                                      readOnly
                                      class="form-control"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      value={elementInArray.percentage}
                                      placeholder={elementInArray.percentage}
                                      readOnly
                                      class="form-control"
                                    />
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      <button className="btn btn-success btn-sm">View</button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                            :
                            <p>Click on the Add More Button</p>
                          }
                        </tbody>
                      </Table>
                    </div>
                    {/* <div className="form-group col-md2 mt-4">
                          <button  className="btn btn-success" >Add More
                            
                          </button>
                        </div> */}
  
                    {/* <button
                        type="button"
                        style={{ float: "left" }}
                        className="btn btn-primary"
                        onClick={() => setNoOfRows(noofRows + 1)}
                      >
                        Add More
                      </button> */}
                    <div>
                      <button
                        type="button"
                        style={{
                          color: "white",
                        }}
                        className="btn btn-primary mt-3"
                        // onClick={() => setNoOfRows(noofRows + 1)}
                        onClick={() => setmodal(true)}
                      >
                        Add More
                      </button>
  
                      <div>
                        {/* <Modal
                          size="lg"
                          isOpen={modal}
                          toggle={() => setmodal(!modal)}
                        >
                          <ModalHeader
                            toggle={() => setmodal(!modal)}
                          ></ModalHeader>
  
                          <ModalBody>
                            <div className="card2">
                              <div className="popupcard">
                                
                                <form className="text1">
                                  <Row>
                                    <Col md={3} xxl lg="4">
                                      <label htmlFor="name" className="text">Name</label>
                                      <input
                                        type="text"
                                        
                                        onChange={(e)=>setModalNAme(e.target.value)}
                                        placeholder=""
                                        class="form-control"
                                      />
                                    </Col>
                                    <Col md={3} xxl lg="4">
                                      <label htmlFor="name" className="text">	Designition</label>
                                      <input
                                        type="text"
                                        
                                        onChange={(e)=>setModaldesignition(e.target.value)}
                                        placeholder=""
                                        class="form-control"
                                      />
                                    </Col>
  
                                    <Col md={3} xxl lg="4">
                                      <label htmlFor="name" className="text">Percentage</label>
                                      <input
                                        type="flot"
                                        
                                        onChange={(e)=>setModalPercentage(e.target.value)}
                                        placeholder=""
                                        class="form-control"
                                      />
                                    </Col>
                                    <Col md={3} xxl lg="4">
                                      <label htmlFor="name" className="text">Upload PDF</label>
                                      <input
                                        type="file"
                                        value={uploadPdf}
                                        placeholder=""
                                        class="form-control"
                                      />
                                    </Col>
  
                                  </Row>
                                </form>
  
                              </div>
                              <div className="submit-btn">
                                <div className="form-group col-md6 mt-6">
                                  <button
                                    type="button"
                                    style={{ float: "right" }}
                                    className="btn btn-success"
                                    onClick={handleArrayValues}
                                  >
                                    Submit
                                  </button>
                                </div>
                              </div>
                            </div>
                          </ModalBody>
                          <ModalFooter
                            toggle={() => setmodal(!modal)}
                          ></ModalFooter>
                        </Modal> */}
                      </div>
                    </div>
                    {/* <button
                        type="button"
                        style={{ float: "right" }}
                        className="btn btn-danger"
                        onClick={() => setNoOfRows(noofRows - 1)}
                      >
                        Remove
                      </button> */}
  
                    {/* <div className="form-group">
                          <button type="submit" className="btn btn-success">
                            {" "}
                            Save{" "}
                          </button>
                        </div> */}
                  </div>
                </div>
                <h5 className="card-h">
                  {" "}
                  &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;3. Directors Information
                </h5>
                <div className="card shadow">
                  <div className="card-body">
                    <div className="table-bd">
                      <Table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Sr. No</th>
                            <th>DIN Number</th>
                            <th>Name</th>
                            <th>PAN Number</th>
                            <th>Upload PDF</th>
                          </tr>
                        </thead>
                        <tbody>
                          {DirectorData.map((elementInArray, input) => {
                            return (
                              <tr key={input}>
                                <td>{input}</td>
                                <td>
                                  <input
                                    type="text"
                                    value={elementInArray.din}
                                    placeholder={elementInArray.din}
                                    class="form-control"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={elementInArray.name}
                                    placeholder={elementInArray.name}
                                    class="form-control"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={elementInArray.contactNumber}
                                    placeholder={elementInArray.contactNumber}
                                    class="form-control"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="file"
                                    value={uploadPdf}
                                    placeholder=""
                                    class="form-control"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                    
                  </div>
                </div>
                <div className="form-group col-md2 mt-4">
                  <button
                    className="btn btn-success"
                    style={{ float: "right" }}
                    
                  >
                    Save and Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* </div>
          </div>
        </div> */}
  
        </Form>
  
      </div>
  
    );
}

export default AddInfo;
