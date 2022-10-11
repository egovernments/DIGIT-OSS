import { FormStep } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { useLocation } from "react-router-dom";
// import "../Developer/AddInfo.css";
// import DashboardScreen from "../../src/Screens/DashboardScreen/DashboardScreen";
import { useForm } from "react-hook-form";
import Timeline from "../components/Timeline";
import Popup from "reactjs-popup";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  ModalFooter,
} from "reactstrap";


// import AddIcon from "@material-ui/icons/Add";
// import DeleteIcon from "@mui/icons-material/Delete";


//for Redux use only
// import { setAurthorizedUserData } from "../Redux/Slicer/Slicer";
// import { useDispatch } from "react-redux";

const  AddAuthorizeduser = ({t, config, onSelect,formData, data}) => {

    const { pathname: url } = useLocation();
    const userInfo = Digit.UserService.getUser();
    let validation = {};
    let isOpenLinkFlow = window.location.href.includes("openlink");
    const [modal, setmodal] = useState(false);
    const [aurthorizedUserName,setAurtorizedUserName] = useState(formData?.AddAuthorizeduser?.aurthorizedUserName || formData?.AddAuthorizeduser?.aurthorizedUserName || "");
    const [aurthorizedMobileNumber,setAurthorizedMobileNumber] = useState(formData?.AddAuthorizeduser?.aurthorizedMobileNumber || formData?.AddAuthorizeduser?.aurthorizedMobileNumber || "");
    const [aurthorizedEmail,setAurthorizedEmail] = useState(formData?.AddAuthorizeduser?.aurthorizedEmail || formData?.AddAuthorizeduser?.aurthorizedEmail || "");
    const [aurthorizedPan,setAurthorizedPan] = useState(formData?.AddAuthorizeduser?.aurthorizedPan || formData?.AddAuthorizeduser?.aurthorizedPan || "");
    const [aurthorizedUserInfoArray,setAurthorizedUserInfoArray]=useState([]);
  //   const dispatch=useDispatch();
    // const Modal = () => (
    //   <Popup trigger={<button className="button"> Open Modal </button>} modal>
    //     <span> Modal content </span>
    //   </Popup>
    // );
  
    // function UploadDocuments() {
    //   const [inputFields, setInputFields] = useState([{
    //     fullName:'',
  
    // } ]);
  
    // const addInputField = ()=>{
  
    //     setInputFields([...inputFields, {
    //         fullName:'',
    //     } ])
  
    // }
    // const removeInputFields = (index)=>{
    //     const rows = [...inputFields];
    //     rows.splice(index, 1);
    //     setInputFields(rows);
    // }
    // const handleChange = (index, evnt)=>{
  
    // const { name, value } = evnt.target;
    // const list = [...inputFields];
    // list[index][name] = value;
    // setInputFields(list);
    const {
      register,
      handleSumit,
      formState: { error },
    } = useForm([
      { Sr: "", Name: "", Mobile: "", Email: "", PAN: "", Aadhar: "" },
    ]);
    const formSubmit = (data) => {
      console.log("data", data);
    };
    const [showhide, setShowhide] = useState("No");
    const handleshow = (e) => {
      const getshow = e.target.value;
      setShowhide(getshow);
    };
  
    const [noofRows, setNoOfRows] = useState(1);
    const handleSubmitFormdata=()=>{
      setmodal(false);
      console.log("submitted");
      const aurthorizedUserData={
        name:aurthorizedUserName,
        mobile:aurthorizedMobileNumber,
        email:aurthorizedEmail,
        pan:aurthorizedPan,
      }
  
      setAurthorizedUserInfoArray((prev)=>[...prev,aurthorizedUserData]);
    };
  
    const handleAurthorizedUserFormSubmit=async(e)=>{
    //   e.preventDefault();
      
      const formData ={
        aurthorizedUserInfoArray
      }
      onSelect(config.key, formData);
      console.log(formData);
      localStorage.setItem("data_user",JSON.stringify(formData))
      console.log("form submitted")
    }
    const onSkip = () => onSelect();
  return (
     
    <div className={isOpenLinkFlow ? "OpenlinkContainer" : ""}>
        <Timeline currentStep={3} flow="STAKEHOLDER" />
        <FormStep 
            className="card" 
            // onSubmit={handleAurthorizedUserFormSubmit}
            config={config}
            onSelect={handleAurthorizedUserFormSubmit}
            onSkip={onSkip}
            t={t}
        >
            {/* <div>
                <h5 className="card-h"> Developer</h5>
            </div> */}
            {/* <div className="card shadow"> */}

            <div className="card-body">
                {/* <h5 className="card-h">Add/Remove Authorized Users</h5> */}
                <div className="table-bd">
                {/* { inputFields.map((data, index)=>{
                    const {}
                    })
                    } */}
                <Table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>Sr. No</th>
                        <th>Name</th>
                        <th>Mobile Number</th>
                        <th>Email</th>
                        <th>PAN No.</th>
                        <th>Upload Aadhar PDF</th>
                        <th>Upload Digital Signature PDF</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        (aurthorizedUserInfoArray.length>0)?
                        aurthorizedUserInfoArray.map((elementInArray, input) => {
                        return (
                            <tr>
                            <td>{input+1}</td>
                            <td>
                                <input
                                type="text"
                                name="name[]"
                                placeholder={elementInArray.name}
                                value={elementInArray.name}
                                class="employee-card-input"
                                />
                            </td>
                            <td>
                                <input
                                type="text"
                                name="mobile[]"
                                placeholder={elementInArray.mobile}
                                value={elementInArray.mobile}
                                class="employee-card-input"
                                />
                            </td>
                            <td>
                                <input
                                type="email"
                                name="email[]"
                                placeholder={elementInArray.email}
                                value={elementInArray.email}
                                class="employee-card-input"
                                />
                            </td>
                            <td>
                                <input
                                type="text"
                                name="pan[]"
                                placeholder="{elementInArray.pan}"
                                value={elementInArray.pan}
                                class="employee-card-input"
                                />
                            </td>
                            <td>
                                <input
                                type="file"
                                name="upload"
                                placeholder=""
                                class="employee-card-input"
                                />
                            </td>
                            <td>
                                <input
                                type="file"
                                name="upload"
                                placeholder=""
                                class="employee-card-input"
                                />
                            </td>
                            </tr>
                        );
                        })
                        :<div className="justify-content-center">
                        Click on Add to add a aurthorized user
                        </div>
                    }
                    </tbody>
                </Table>
                <div>
                    <button
                    type="button"
                    style={{
                        float: "left",
                        backgroundColor: "#0b3629",
                        color: "white",
                    }}
                    className="btn mt-3"
                    // onClick={() => setNoOfRows(noofRows + 1)}
                    onClick={() => setmodal(true)}
                    >
                    Add More
                    </button>

                    <div>
                    <Modal
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
                            {/* <h5 className="card-h">Add/Remove Authorized Users</h5> */}
                            {/* <div className="table-bd">
            <Table className="table table-bordered">
            <thead>
                <tr>
                <th>Add More</th>
                
                
                <th> Licence No / year and date of grant of licence </th>
                <th>Name of developer *</th>
                <th>Purpose of colony </th>
                <th>Sector and development plan </th>
                <th>Validity of licence including renewals if any</th>
                <th>Remove</th>
                </tr>
            </thead>
            <tbody>
                {[...Array(noofRows)].map((elementInArray, input) => {
                return (
                    <tr>
                    <td>
                        <button
                        type="button"
                        style={{ float: "left" }}
                        className="btn btn-primary"
                        onClick={() => setNoOfRows(noofRows + 1)}
                        >
                        <AddIcon />
                        </button>
                    </td>
                    
                    <td>
                        <input
                        type="text"
                        name="name[]"
                        placeholder=""
                        class="employee-card-input"
                        />
                    </td>
                    <td>
                        <input
                        type="text"
                        name="mobile[]"
                        placeholder=""
                        class="employee-card-input"
                        />
                    </td>
                    <td>
                        <input
                        type="email"
                        name="email[]"
                        placeholder=""
                        class="employee-card-input"
                        />
                    </td>
                    <td>
                        <input
                        type="file"
                        name="upload"
                        placeholder=""
                        class="employee-card-input"
                        />
                    </td>
                    <td>
                        <input
                        type="file"
                        name="upload"
                        placeholder=""
                        class="employee-card-input"
                        />
                    </td>

                    <td>
                        <button
                        type="button"
                        style={{ float: "right" }}
                        className="btn btn-danger"
                        onClick={() => setNoOfRows(noofRows - 1)}
                        >
                        <DeleteIcon />
                        </button>
                    </td>
                    </tr>
                );
                })}
            </tbody>
            </Table>
        </div> */}

                            <form className="text1">
                                <Row>
                                    <Col md={4} xxl lg="4">
                                    <label htmlFor="name" className="text">Name</label>
                                    <input
                                        type="text"
                                        name="name[]"
                                        placeholder=""
                                        class="employee-card-input"
                                        onChange={(e)=>setAurtorizedUserName(e.target.value)}
                                    />
                                    </Col>
                                    <Col md={4} xxl lg="4">
                                    <label htmlFor="name" className="text">Mobile Number</label>
                                    <input
                                        type="number"
                                        name="name[]"
                                        placeholder=""
                                        class="employee-card-input"
                                        onChange={(e)=>setAurthorizedMobileNumber(e.target.value)}
                                    />
                                    </Col>
                                    <Col md={4} xxl lg="4">
                                    <label htmlFor="name" className="text">Email</label>
                                    <input
                                        type="email"
                                        name="name[]"
                                        placeholder=""
                                        class="employee-card-input"
                                        onChange={(e)=>setAurthorizedEmail(e.target.value)}
                                    />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4} xxl lg="4">
                                    <label htmlFor="name" className="text">PAN No.</label>
                                    <input
                                        type="text"
                                        name="name[]"
                                        placeholder=""
                                        class="employee-card-input"
                                        onChange={(e)=>setAurthorizedPan(e.target.value)}
                                    />
                                    </Col>
                                    <Col md={4} xxl lg="4">
                                    <label htmlFor="name" className="text">Upload Aadhar PDF</label>
                                    <input
                                        type="file"
                                        name="name[]"
                                        placeholder=""
                                        class="employee-card-input"
                                    />
                                    </Col>
                                    <Col md={4} xxl lg="4">
                                    <label htmlFor="name" className="text">Upload Digital Signature PDF</label>
                                    <input
                                        type="file"
                                        name="name[]"
                                        placeholder=""
                                        class="employee-card-input"
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
                onClick={handleSubmitFormdata}
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
                    </Modal>
                    </div>
                </div>
                </div>
                {/* <button
                type="button"
                style={{ float: "left" }}
                className="btn btn-primary"
                onClick={() => setNoOfRows(noofRows + 1)}
                >
                Add More
                </button> */}
                {/* <button
                type="button"
                style={{ float: "right" }}
                className="btn btn-danger"
                onClick={() => setNoOfRows(noofRows - 1)}
                >
                Remove
                </button> */}
            </div>
            {/* <div className="form-group col-md6 mt-6">
                <button
                type="submit"
                style={{ float: "right" }}
                className="btn btn-success"
                
                
                >
                Submit
                </button>
            </div> */}
        </FormStep>
    </div>
  );
}

export default AddAuthorizeduser;
