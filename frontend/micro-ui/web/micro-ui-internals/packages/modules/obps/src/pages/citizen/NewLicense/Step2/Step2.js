import React, { useState, useEffect } from "react";
import { Button, Form, Collapse } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Popup from "reactjs-popup";
import CalculateIcon from '@mui/icons-material/Calculate';
import InfoIcon from '@mui/icons-material/Info';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import axios from 'axios';

import ReactMultiSelect from "../../../../../../../react-components/src/atoms/ReactMultiSelect"
const optionsPurposeList = [
    {
        label: "Plotted Commercial",
        value: "01",
        id: "1"
      
    },
    {
        label: "Group Housing Commercial",
        value: "02",
        id: "2"
    },
    {
        label: "AGH",
        value: "03",
        id: "3"
    },
    {
        label: "Commercial Integrated",
        value: "04",
        id: "3"
    },
    {
        label: "Commercial Plotted",
        value: "05",
        id: "3"
    },
    {
        label: "Industrial Colony Commercial",
        value: "06",
        id: "3"
    },
    {
        label: "IT Colony Commercial",
        value: "07",
        id: "3"
    },
    {
        label: "DDJAY",
        value: "08",
        id: "3"
    },
    {
        label: "NILP",
        value: "09",
        id: "3"
    },
    {
        label: "Low Density Ecofriendly",
        value: "10",
        id: "3"
    },
    {
        label: "TOD Commercial",
        value: "11",
        id: "3"
    },
    {
        label: "TOD Group housing",
        value: "12",
        id: "3"
    },

]
const optionsPotentialList = [
    {
        label: "Hyper",
        value: "01",
        id: "1"
      
    },
    {
        label: "High I",
        value: "02",
        id: "2"
    },
    {
        label: "High II",
        value: "03",
        id: "3"
    },
    {
        label: "Medium",
        value: "04",
        id: "3"
    },
    {
        label: "Low I",
        value: "05",
        id: "3"
    },
    {
        label: "Low II",
        value: "06",
        id: "3"
    }

]

const ApllicantPuropseForm = (props) => {
    const [form, setForm] = useState([]);
    const [purposeDd,setSelectPurpose] = useState("");
    const [show, setShow] = useState(false);
    const[potential,setPotential]=useState("")
    const [PurposeformSubmitted, SetPurposeformSubmitted] = useState(false);
    const [tehsil, setTehsil] = useState('');
    const [revenueName, setRevenueName] = useState('');
    const [mustil, setMustil] = useState('');
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [district2, setDistrict2] = useState('');
    const [modalValuesArray,setModalValuesArray]= useState([]);
    const [modalTehsil,setModalTehsil]=useState("");
    const [ModalRevenueEstate,setModalRevenueEstate]=useState("");
    const [modalRectangleNo,setModalRectangleNo]=useState("");
    const [modalSector,setModalSector]=useState("");
    const [modalConsolidation,setModalConsolidation]=useState("");
    const [modalKilla,setModalKilla]=useState("");
    const [modalKhewat,setModalKhewat]=useState("");
    const [modalKanal,setModalKanal]=useState("");
    const [modalMarla,setModalMarla]=useState("");
    const [modalLand,setModalLand]=useState("");
    const [districtData, setDistrictData] = useState([]);
    const[tehsilData,setTehsilData]=useState([]);
    const[revenueStateData,setRevenuStateData]=useState([]);
    const[mustilData,setMustilData]=useState([]);
    const[killaData,setKillaData]=useState([]);
    const[khasraData,setKhasraData]=useState([]);
    const [districtDataLbels,setDistrictDataLabels]=useState([]);
    const[tehsilDataLabels,setTehsilDataLabels]=useState([]);
    const[revenueDataLabels,setRevenueDataLabels]=useState([]);
    const[mustilDataLabels,setMustilDataLabels]=useState([])


    const [modal, setmodal] = useState(false);
    const [showhide1, setShowhide1] = useState("No");
    const [showhide2, setShowhide2] = useState("No");
    const handleshow1 = e => {
        const getshow = e.target.value;
        setShowhide1(getshow);
    }
    const handleshow2 = e => {
        const getshow = e.target.value;
        setShowhide2(getshow);
    }
 
    const handleArrayValues=()=>{
    
        if (tehsil!=="" 
     ) {
          
          const values ={
            "tehsil":tehsil,
            "revenueEstate":ModalRevenueEstate,
            "rectangleNo":modalRectangleNo,
            // "sector":modalSector,
            // "consolidation":modalConsolidation,
            // "killa":modalKilla,
            // "khewat":modalKhewat,
            // "kanal":modalKanal,
            // "marla":modalMarla,
            "land":modalLand
        
          }
          setModalValuesArray((prev)=>[...prev,values]);
          setmodal(!modal)
        }
      }
 
      const DistrictApiCall = async () => {
        try {
            const postDistrict = {
                "RequestInfo": {
                    "apiId": "Rainmaker",
                    "ver": "v1",
                    "ts": 0,
                    "action": "_search",
                    "did": "",
                    "key": "",
                    "msgId": "090909",
                    "requesterId": "",
                    "authToken": ""
                }
            }
            // const Resp = await axios.post(URL_MDMS+"/egov-mdms-service/v1/_search",
            console.log("SS",process.env.REACT_APP_PROXY_MDMS)
            const Resp = await axios.post("http://localhost:8094/egov-mdms-service/v1/_district",
                postDistrict,
                )
                .then((Resp) => {
                    console.log("DISTRICTLIST", Resp)
                    return Resp;
                })
            setDistrictData(Resp.data);
            if (Resp.data.length>0 && Resp.data!==undefined && Resp.data!==null) {
                Resp.data.map((el,i)=>{
                    setDistrictDataLabels((prev)=>[...prev,{"label":el.districtName,"id":el.districtCode,"value":el.districtCode}])
                })
                
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    console.log("state data", districtData)
    const getTehslidata = async () => {
        if (district2 !== "") {
            const datatopost = {
                "RequestInfo": {
                    "apiId": "Rainmaker",
                    "ver": "v1",
                    "ts": 0,
                    "action": "_search",
                    "did": "",
                    "key": "",
                    "msgId": "090909",
                    "requesterId": "",
                    "authToken": ""
                }

            }

            try {
                const Resp = await axios.post("http://localhost:8094/egov-mdms-service/v1/_tehsil?dCode=" + district2, datatopost, {
                 
                }).then((response) => {
                    return response
                });
                setTehsilData(Resp.data)
                if (Resp.data.length>0 && Resp.data!==undefined && Resp.data!==null) {
                    Resp.data.map((el,i)=>{
                        setTehsilDataLabels((prev)=>[...prev,{"label":el.name,"id":el.code,"value":el.name}])
                    })
                    
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    }

    const getRevenuStateData = async () => {
        if (tehsil !== "") {
            const datatopost = {
                "RequestInfo": {
                    "apiId": "Rainmaker",
                    "ver": "v1",
                    "ts": 0,
                    "action": "_search",
                    "did": "",
                    "key": "",
                    "msgId": "090909",
                    "requesterId": "",
                    "authToken": ""
                }

            }

            try {
                const Resp = await axios.post("http://localhost:8094/egov-mdms-service/v1/_village?" + "dCode=" + district2 + "&" + "tCode=" + tehsil, datatopost, {
                  
                }).then((response) => {
                    return response
                });
                setRevenuStateData(Resp.data)
                if (Resp.data.length>0 && Resp.data!==undefined && Resp.data!==null) {
                    Resp.data.map((el,i)=>{
                        setRevenueDataLabels((prev)=>[...prev,{"label":el.name,"id":el.code,"value":el.code}])
                    })
                    
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    }

    const getMustilData = async () => {
        if (revenueName !== "") {
            const datatopost = {
                "RequestInfo": {
                    "apiId": "Rainmaker",
                    "ver": "v1",
                    "ts": 0,
                    "action": "_search",
                    "did": "",
                    "key": "",
                    "msgId": "090909",
                    "requesterId": "",
                    "authToken": ""
                }

            }

            try {
                const Resp = await axios.post("http://localhost:8094/egov-mdms-service/v1/_must?" + "dCode=" + district2 + "&" + "tCode=" + tehsil + "&NVCode=" + revenueName, datatopost, {
                
                }).then((response) => {
                    console.log("DD",response.data.must)
                    return response
                });
                setMustilData(Resp.data.must);
                if (Resp.data.must.length>0 && Resp.data.must!==undefined && Resp.data.must!==null) {
                    Resp.data.must.map((el,i)=>{
                        setMustilDataLabels((prev)=>[...prev,{"label":el,"id":i,"value":el}])
                    })
                    
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    }
    // const getKillaData = async () => {
    //     if (mustil !== "") {
    //         const datatopost = {
    //             "RequestInfo": {
    //                 "apiId": "Rainmaker",
    //                 "ver": "v1",
    //                 "ts": 0,
    //                 "action": "_search",
    //                 "did": "",
    //                 "key": "",
    //                 "msgId": "090909",
    //                 "requesterId": "",
    //                 "authToken": ""
    //             }

    //         }

    //         try {
    //             const Resp = await axios.post("/egov-mdms-service/v1/_khasra?" + "dCode=" + district2 + "&" + "tCode=" + tehsil + "&NVCode=" + revenueName + "&murba=" + mustil, datatopost, {
                    
    //             }).then((response) => {
    //                 return response
    //             });
    //             setKillaData(Resp.data);
    //             console.log("KILLADATA", Resp.data)
    //         } catch (error) {
    //             console.log(error.message);
    //         }
    //     }
    // }
    // const getKhasraData = async () => {
    //     if (Khasra !== "") {
    //         const datatopost = {
    //             "RequestInfo": {
    //                 "apiId": "Rainmaker",
    //                 "ver": "v1",
    //                 "ts": 0,
    //                 "action": "_search",
    //                 "did": "",
    //                 "key": "",
    //                 "msgId": "090909",
    //                 "requesterId": "",
    //                 "authToken": ""
    //             }

    //         }

    //         try {
    //             const Resp = await axios.post("/egov-mdms-service/v1/_owner?dCode=01&tCode=001&NVCode=02786&khewat=161", datatopost, {
                    
    //             }).then((response) => {
    //                 return response
    //             });
    //             setKhasraData(Resp.data);
    //             console.log("KILLADATA", Resp.data)
    //         } catch (error) {
    //             console.log(error.message);
    //         }
    //     }
    // }

    useEffect(() => {
        DistrictApiCall();
    }, []);
    useEffect(() => {
        getTehslidata();
    }, [district2])

    useEffect(() => {
        getRevenuStateData();
    }, [district2, tehsil])

    useEffect(() => {
        getMustilData();
    }, [district2, tehsil, revenueName])


    // useEffect(() => {
    //     getKillaData();
    // }, [district2, tehsil, revenueName])
    // useEffect(() => {
    //     getKhasraData();
    // }, [district2, tehsil, revenueName,mustil])

    const handleChange = (e) => {
        this.setState({ isRadioSelected: true });

    }
    const[displayDdjayForm,setDisplayDdjayForm]=useState(
        {display:"none"}
    )
    const [displayResidential,setDisplayResidential]=useState(
        {display:"none"}
    )
  
    const setSelectPurposeDd = (e) => {
        const purposeSelected = e.target.value;
        console.log("purpose", purposeSelected)
        localStorage.setItem("purpose", purposeSelected)
    }
    const PurposeFormSubmitHandler = (e) => {
        e.preventDefault();
        SetPurposeformSubmitted(true);
        props.Step2Continue({"data":true})
    }
        let forms = {
        //  purposeDd:purposeDd,
        //    tehsil1:tehsil1,

                        
                      }
        localStorage.setItem('step2', JSON.stringify(forms))
       

        const handleChangePurpose=(data)=>{
            const purposeSelected = data.data;
            setSelectPurpose(purposeSelected)
            console.log("purpose", purposeSelected)
            localStorage.setItem("purpose", purposeSelected)
        
        }
        console.log("data",tehsil)
 

        return (
            <Form >
                <Card style={{width:"126%",marginLeft:"20px",paddingRight:"10px"}}>
                <Form.Group  >
                <Row className="ml-auto" style={{ marginBottom: 5 }}>
                <Col md={4} xxl lg="3">
                <div>
                    <Form.Label><b>Puropse Of License</b> <span style={{ color: "red" }}>*</span></Form.Label>
                </div>
            {/* <Form.Select type="text" defaultValue={purposeDd} placeholder="Puropse"  onChange={handleChangePurpose} value={purposeDd}  ></Form.Select> */}
                <ReactMultiSelect 
                listOfData={optionsPurposeList}
                labels="Purpose"
                getSelectedValue={handleChangePurpose}
                />
                
            </Col>
            <div className="col col-3">
                    <label htmlFor="potential"><h6><b>Potential Zone:</b></h6></label>
                    <ReactMultiSelect 
                listOfData={optionsPotentialList}
                labels="text" 
                getSelectedValue={setPotential}
                />
                </div>
            <Col md={4} xxl lg="3">
                <div>
                    <Form.Label><b>District</b> <span style={{ color: "red" }}>*</span></Form.Label>
                </div>
                <ReactMultiSelect

                    listOfData={districtDataLbels}
                    labels="district"
                    getSelectedValue={(data)=>setDistrict2(data.data)}
                    
                ></ReactMultiSelect>
            </Col>
            <Col md={4} xxl lg="3">
                <div>
                    <Form.Label><b>State </b><span style={{ color: "red" }}>*</span></Form.Label>
                </div>
                <Form.Control type="text" defaultValue="Haryana" disabled  >
                </Form.Control>
            </Col>
        </Row>
        
        <div className="ml-auto" style={{ marginTop: 20 }}>
            <h2 style={{ fontSize: 24 }}><b>2. Details of applied land:</b></h2><br></br>
            <p>Note: The term “Collaboration agreement" shall include all Development agreements/ Joint Venture agreements/ Joint Development agreements/ Memorandum of Understanding etc. and similar agreements registered with competent authority.</p><br></br>
            <p><b>(i) Khasra-wise information to be provided in the following format:</b></p><br></br>
        </div>
        <div className="ml-auto">
            <Button type="button" variant="primary" onClick={() => setmodal(true)}>
                Enter Details
            </Button>
            <div >
                
            <Modal
                    size="xl"
                    isOpen={modal}
                    toggle={() => setmodal(!modal)}
                >
                    <ModalHeader
                    toggle={() => setmodal(!modal)}
                    ></ModalHeader>
                        <ModalBody>

                        <Row className="ml-auto mb-3" >
                            <Col md={4} xxl lg="4">
                                <div>
                                    <Form.Label><h6><b>Tehsil</b></h6></Form.Label>
                                </div>


                                <ReactMultiSelect

                                listOfData={tehsilDataLabels}
                                labels="Tehsil"
                                getSelectedValue={(data)=>setTehsil(data.data)}

                                ></ReactMultiSelect>
                            </Col>
                            <Col md={4} xxl lg="4">
                                <div>
                                    <Form.Label><h6><b>Name of Revenue estate</b></h6></Form.Label>
                                </div>
                                <ReactMultiSelect

                                    listOfData={revenueDataLabels}
                                    labels="Revenue Estate"
                                    getSelectedValue={(data)=>setRevenueName(data.data)}

                                    ></ReactMultiSelect>
                               
                            </Col>
                            <Col md={4} xxl lg="4">
                                <div>
                                    <Form.Label><h6><b>Rectangle No./Mustil</b></h6></Form.Label>
                                </div>
                                <ReactMultiSelect

                                listOfData={mustilDataLabels}
                                labels="Rectangle No."
                                getSelectedValue={(data)=>setMustil(data.data)}

                                ></ReactMultiSelect>
                            </Col>

                        </Row><br></br>
                        <Row className="ml-auto mb-3" >
                            {/* <Col md={4} xxl lg="4">
                                <div>
                                    <label ><h6><b>Sector</b></h6> </label>
                                    <input type="text"  placeholder="" className="form-control"
                                    onChange={(e)=>setModalSector(e.target.value)}/>
                                </div>
                            </Col> */}

                            <Col md={4} xxl lg="12">
                                <div>
                                    <label ><h6><b>Consolidation Type</b></h6> </label> &nbsp;&nbsp;
                                    {/* <Form.Select type="select" defaultValue="Select" placeholder="" className="form-control"
                                    onChange={(e)=>setModalConsolidation(e.target.value)} >
                                        */}
                                        <input type="radio"  id="Yes" value="1"
                                                            onChange={handleChange} name="Yes"onClick={handleshow2} />&nbsp;&nbsp;
                                                        <label for="Yes"></label>
                                                        <label htmlFor="gen">Consolidated</label>&nbsp;&nbsp;
                                                    
                                                        <input type="radio"  id="Yes" value="2"
                                                            onChange={handleChange} name="Yes" onClick={handleshow2}/>&nbsp;&nbsp;
                                                        <label for="Yes"></label>
                                                        <label htmlFor="npnl">Non-Consolidated</label>
                                    {/* </Form.Select> */}
                                </div> {
                                    showhide2==="1" && (
                                        
                                                <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))" }}>
                            <thead>
                                
                                <tr>
                                {/* {(khasraData !== undefined && khasraData.length > 0)?(khasraData.)} */}
                                    <th ><b>Kanal</b></th>
                                    <th><b>Marla</b></th>
                                    <th><b>Sarsai</b>&nbsp;&nbsp;</th>
                                    {/* <th><b>Area in Marla</b>&nbsp;&nbsp;</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td ><input type="text" className="form-control"  placeholder="" onChange={(e)=>setModalKilla(e.target.value)}></input></td>
                                    <td ><input type="text" className="form-control" placeholder=""  onChange={(e)=>setModalKhewat(e.target.value)}></input> </td>
                                    <td > <input type="text" className="form-control" placeholder=""  onChange={(e)=>setModalKanal(e.target.value)}></input></td>
                                    {/* <td > <input type="text" className="form-control" placeholder=""  onChange={(e)=>setModalMarla(e.target.value)}></input></td> */}
                                </tr>
                            </tbody>
                        </table>
                                        
                                    )}
                                    {
                                    showhide2==="2" && (
                                        
                                                <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))" }}>
                            <thead>
                                
                                <tr>
                                {/* {(khasraData !== undefined && khasraData.length > 0)?(khasraData.)} */}
                                    <th ><b>Bigha</b></th>
                                    <th><b>Biswa</b></th>
                                    <th><b>Biswansi</b>&nbsp;&nbsp;</th>
                                    {/* <th><b>Area in Marla</b>&nbsp;&nbsp;</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td ><input type="text" className="form-control"  placeholder="" onChange={(e)=>setModalKilla(e.target.value)}></input></td>
                                    <td ><input type="text" className="form-control" placeholder=""  onChange={(e)=>setModalKhewat(e.target.value)}></input> </td>
                                    <td > <input type="text" className="form-control" placeholder=""  onChange={(e)=>setModalKanal(e.target.value)}></input></td>
                                    {/* <td > <input type="text" className="form-control" placeholder=""  onChange={(e)=>setModalMarla(e.target.value)}></input></td> */}
                                </tr>
                            </tbody>
                        </table>
                                        
                                    )}

                            </Col>

                        </Row>
                        

                        <Row className="ml-auto mb-3" >
                            <Col md={4} xxl lg="6">
                                <div>
                                    <label ><h6><b>Name of Land Owner</b></h6> </label>

                                </div>
                            </Col>
                            <Col md={4} xxl lg="6">
                            <input type="text"  placeholder="" className="form-control"
                                    onChange={(e)=>setModalLand(e.target.value)}/>

                            </Col>
                        </Row>
                        <Row className="ml-auto mb-3" >

                        <div className="col col-12">
                                <h6 data-toggle="tooltip" data-placement="top" title="Whether collaboration agreement entered for the Khasra?(yes/no)"><b>Collaboration agreement&nbsp;<InfoIcon style={{color:"blue"}}/>&nbsp; </b>&nbsp;&nbsp;
                                
                                                        <input type="radio" value="Yes" id="Yes"
                                                            onChange={handleChange} name="Yes" onClick={handleshow1} />&nbsp;&nbsp;
                                                        <label for="Yes"><h6><b>Yes</b></h6></label>&nbsp;&nbsp;
                                                        <input type="radio" value="No" id="No"
                                                            onChange={handleChange} name="Yes" onClick={handleshow1} />&nbsp;&nbsp;
                                                        <label for="No"><h6><b>No</b></h6></label></h6>
                                {
                                    showhide1 === "Yes" && (
                                        <div className="row "  >
                                            <div className="col col-4">
                                                <label for="parentLicense" className="font-weight-bold"><h6><b>Name of the developer company / Firm/ LLP etc. with whom collaboration agreement entered</b></h6></label>
                                                <input type="text" className="form-control" />
                                            </div>
                                            <div className="col col-4" style={{ marginTop: 15 }}>
                                                <label for="parentLicense" className="font-weight-bold"><h6><b>Date of registering collaboration agreement</b></h6></label>
                                                <input type="date" className="form-control" />

                                            </div>
                                            <div className="col col-4" style={{ marginTop: 15 }}>
                                                <label for="parentLicense" className="font-weight-bold"><h6><b>Date of validity of collaboration agreement</b></h6></label>
                                                <input type="date" className="form-control" />

                                            </div>
                                            <div className="col col-4" style={{ marginTop: 35 }}>
                                                <label for="parentLicense" className="font-weight-bold"><h6><b>Whether collaboration agreement irrevocable (Yes/No)</b></h6></label><br></br>
                                                <input type="radio" value="Yes" id="Yes1"
                                                    onChange={handleChange} name="Yes" />&nbsp;&nbsp;
                                                <label for="Yes"><h6>Yes</h6></label>&nbsp;&nbsp;

                                                <input type="radio" value="No" id="No1"
                                                    onChange={handleChange} name="Yes" />&nbsp;&nbsp;
                                                <label for="No"><h6>No</h6></label>
                                            </div>

                                            <div className="col col-4" style={{ marginTop: 35 }}>
                                                <label for="parentLicense" className="font-weight-bold"><h6><b>Name of authorized signatory on behalf of land owner(s)</b></h6></label>
                                                <input type="text" className="form-control" />
                                            </div>
                                            <div className="col col-4" style={{ marginTop: 15 }}>
                                                <label for="parentLicense" className="font-weight-bold"><h6><b>Name of authorized signatory on behalf of developer to sign Collaboration agreement</b></h6></label>
                                                <input type="date" className="form-control" />

                                            </div>
                                            <div className="col col-4" style={{ marginTop: 20 }}>
                                                <label for="parentLicense" className="font-weight-bold"><h6><b>Registring Authority</b></h6></label><br></br>
                                                <input type="text" className="form-control" />
                                            </div>
                                            <div className="col col-4" style={{ marginTop: 15 }}>
                                                <label for="parentLicense" className="font-weight-bold"><h6 data-toggle="tooltip" data-placement="top" title="Upload Document"><b>Registring Authority document&nbsp;&nbsp;<ArrowCircleUpIcon color="primary"></ArrowCircleUpIcon></b></h6></label><br></br>
                                                <input type="file" className="form-control" />
                                            </div>
                                        </div>

                                    )}

                            </div>
                            
                        </Row>
                        <button
                            type="button"
                            style={{ float: "right" }}
                            className="btn btn-primary"
                            onClick={handleArrayValues}
                            >
                            Submit
                            </button>
                    </ModalBody>
                    <ModalFooter
                    toggle={() => setmodal(!modal)}
                    ></ModalFooter>
                </Modal>
            </div>
            </div>
            <br></br>
        
        <div className="applt" style={{ overflow: "auto" }}>
            <table className="table table-bordered" style={{ overflow: "auto" }}>
                <thead>
                    <tr>
                        <th>Tehsil</th>
                        <th>Revenue estate</th>
                        <th>Rectangle No.</th>
                        <th>Killa</th>
                        <th>Land owner</th>
                        <th>Consolidation Type</th>
                        <th>Kanal/Bigha</th>
                        <th>Marla/Biswa</th>
                        <th>Khewat</th>
                        
                        
                    </tr>
                </thead>
                {/* <tbody>
                    <tr>
                        <td><input type="text" className="form-control" disabled></input></td>
                        <td><input type="text" className="form-control" disabled></input></td>
                        <td><input type="text" className="form-control" disabled></input></td>
                        <td><input type="text" className="form-control" disabled></input></td>
                        <td><input type="text" className="form-control" disabled></input></td>
                        <td><input type="text" className="form-control" disabled></input></td>
                        <td><input type="text" className="form-control" disabled></input></td>
                        <td><input type="text" className="form-control" disabled></input></td>
                        <td><input type="text" className="form-control" disabled></input></td>
                        <td><input type="text" className="form-control" disabled></input></td>
                        <td><input type="text" className="form-control" disabled></input></td>
                        <td><input type="text" className="form-control" disabled></input></td>
                    </tr>
                </tbody> */}
                <tbody>
                {
                    (modalValuesArray.length>0)?
                    modalValuesArray.map((elementInArray, input) => {
                    return (
                    <tr >
                        <td ><input type="text"  value={elementInArray.tehsil}
                            placeholder={elementInArray.tehsil} className="form-control" disabled/></td>
                        <td ><input type="text"  value={elementInArray.revenueEstate}
                            placeholder={elementInArray.revenueEstate} className="form-control"disabled /></td>
                        <td ><input type="text"  value={elementInArray.rectangleNo}
                            placeholder={elementInArray.rectangleNo} className="form-control"disabled /></td>
                        <td class="text-center"><input type="text" value={elementInArray.killa}
                            placeholder={elementInArray.killa}  className="form-control"disabled /></td>
                        <td class="text-center"><input type="text"value={elementInArray.land}
                            placeholder={elementInArray.land} className="form-control" disabled/></td>
                        <td class="text-center"> <input type="text" value={elementInArray.consolidation}
                            placeholder={elementInArray.consolidation} className="form-control"disabled /> </td>
                        <td class="text-center"><input type="text" value={elementInArray.kanal}
                            placeholder={elementInArray.kanal} className="form-control" disabled/></td>
                        <td class="text-center"><input type="text"value={elementInArray.marla}
                            placeholder={elementInArray.marla} className="form-control" disabled/></td>
                        <td class="text-center"><input type="text" value={elementInArray.khewat}
                            placeholder={elementInArray.khewat} className="form-control" disabled/></td>
                        {/* <td class="text-center"><input type="text" value={elementInArray.bigha}
                            placeholder={elementInArray.bigha} className="form-control" disabled/></td> */}
                        {/* <td class="text-center"><input type="text" value={elementInArray.biswa}
                            placeholder={elementInArray.biswa} className="form-control" disabled/></td>
                        <td class="text-center"><input type="text"value={elementInArray.biswansi}
                            placeholder={elementInArray.biswansi} className="form-control" disabled/></td> */}
                        {/* <td class="text-center"><input type="text" value={elementInArray.area}
                            placeholder={elementInArray.area}className="form-control"disabled /></td>
                        <td class="text-center"> <input type="text"value={elementInArray.collaboration}
                            placeholder={elementInArray.collaboration} className="form-control"disabled /></td> */}
                        
                    </tr>
                        );
                    })
                    :
                    <p>Click on the Add More Button</p>
                    }
                </tbody>
            </table>
        </div> 
            </Form.Group>
                
            <Button 
                    style={{ alignSelf: "center", marginTop: "25px",marginLeft:"-1249px" }} 
                    variant="primary" type="submit" 
                    >
              Back
            </Button>
            <Button 
            style={{ alignSelf: "center", marginTop: "-35px", marginLeft: "1163px" }} 
            variant="primary"  
            onClick= {PurposeFormSubmitHandler 
            }>
                Continue
            </Button>
                </Card>
            </Form>
    
        )
    } 
            
            export default ApllicantPuropseForm;