import React, { useState, useEffect } from "react";
import { Button, Form, Collapse } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Popup from "reactjs-popup";
import InfoIcon from '@mui/icons-material/Info';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "reactstrap";
import ReactMultiSelect from "../../../../../../../react-components/src/atoms/ReactMultiSelect"


const ModalForm = (props) => {
    const[editData,setEditData]=useState(props.editDataIndex);
    const [tehsil, setTehsil] = useState({});
    const [modalLand, setModalLand] = useState("");
    const [revenueName, setRevenueName] = useState({});
    const [mustil, setMustil] = useState({});
    const [modal, setmodal] = useState(false);
    const [tehsilDataLabels, setTehsilDataLabels] = useState([]);
    const [revenueDataLabels, setRevenueDataLabels] = useState([]);
    const [mustilDataLabels, setMustilDataLabels] = useState([]);
    const [khewatDataLabels, setKhewatDataLabels] = useState([]);
    const [showhide1, setShowhide1] = useState("No");
    const [showhide2, setShowhide2] = useState("No");
    const [district2, setDistrict2] = useState('');
    const [khewat, setKhewat] = useState('');
    const handleChange = (e) => {
        this.setState({ isRadioSelected: true });

    }
    const handleshow1 = e => {
        const getshow = e.target.value;
        setShowhide1(getshow);
    }
    const handleshow2 = e => {
        const getshow = e.target.value;
        setShowhide2(getshow);
    }
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
                const Resp = await axios.post("http://10.1.1.18:8094/egov-mdms-service/v1/_tehsil?dCode=" + district2, datatopost, {

                }).then((response) => {
                    return response
                });
                setTehsilData(Resp.data)
                if (Resp.data.length > 0 && Resp.data !== undefined && Resp.data !== null) {
                    Resp.data.map((el, i) => {
                        setTehsilDataLabels((prev) => [...prev, { "label": el.name, "id": el.code, "value": el.code }])
                        
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
                const Resp = await axios.post("http://10.1.1.18:8094/egov-mdms-service/v1/_village?" + "dCode=" + district2 + "&" + "tCode=" + tehsil.data, datatopost, {

                }).then((response) => {
                    return response
                });
                setRevenuStateData(Resp.data)

                if (Resp.data.length > 0 && Resp.data !== undefined && Resp.data !== null) {
                    Resp.data.map((el, i) => {
                        setRevenueDataLabels((prev) => [...prev, { "label": el.name, "id": el.khewats, "value": el.code, "khewats":el.khewats }])


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
                const Resp = await axios.post("http://10.1.1.18:8094/egov-mdms-service/v1/_must?" + "dCode=" + district2 + "&" + "tCode=" + tehsil.data + "&NVCode=" + revenueName.data, datatopost, {

                }).then((response) => {
                    console.log("DD", response.data.must)
                    return response
                });
                setMustilData(Resp.data.must);
                if (Resp.data.must.length > 0 && Resp.data.must !== undefined && Resp.data.must !== null) {
                    Resp.data.must.map((el, i) => {
                        setMustilDataLabels((prev) => [...prev, { "label": el, "id": i, "value": el }])
                    })

                }
            } catch (error) {
                console.log(error.message);
            }
        }
    }

    const getLandOwnerStateData = async () => {

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
            if(revenueName.khewat!==undefined){
           
            
            const Resp = await axios.post("http://10.1.1.18:8094/egov-mdms-service/v1/_owner?" + "dCode=" + district2 + "&" + "tCode=" + tehsil.data + "&NVCode=" + revenueName.data + "&khewat=" + revenueName.khewat, datatopost, {

            }).then((response) => {                                   

                return response
            });
            setKhewatData(Resp.data)
        
            if (Resp.data.length > 0 && Resp.data !== undefined && Resp.data !== null) {
                Resp.data.map((el, i) => {
                    setKhewatDataLabels((prev) => [...prev, { "label": el.name, "id": el.code, "value": el.khewats }])
                })

            }
        } } catch (error) {
            console.log(error.message);
        }

    }

    useEffect(() => {
        getTehslidata();
    }, [district2])

    useEffect(() => {
        getRevenuStateData();
    }, [district2, tehsil])

    useEffect(() => {
        getMustilData();
    }, [district2, tehsil, revenueName, khewat])

    useEffect(() => {
        getLandOwnerStateData();
    }, [district2, tehsil, revenueName.khewat])
  

    return (
        <Form style={{display:props.displayEditModal}}>
            <Card style={{ width: "30%", marginLeft: "10px", paddingRight: "10px" }}>
                <Form.Group  >
                    {/* <Modal
                        size="sm"
                        > */}
                            {/* <ModalHeader
                                toggle={() => setmodal(!modal)}
                            ></ModalHeader> */}
                  
                            <Row className="ml-auto mb-3" >
                                <Col md={4} xxl lg="4">
                                    <div>
                                        <Form.Label><h6><b>Tehsil</b></h6></Form.Label>
                                    </div>
                                    <ReactMultiSelect

                                        listOfData={tehsilDataLabels}
                                        labels="Tehsil"
                                        getSelectedValue={(data) => setTehsil(data)}

                                    ></ReactMultiSelect>
                                </Col>
                                <Col md={4} xxl lg="4">
                                    <div>
                                        <Form.Label><h6><b>Name of Revenue estate</b></h6></Form.Label>
                                    </div>
                                    <ReactMultiSelect

                                        listOfData={revenueDataLabels}
                                        labels="Revenue Estate"
                                        getSelectedValue={(data) => setRevenueName(data)}

                                    ></ReactMultiSelect>

                                </Col>
                                <Col md={4} xxl lg="4">
                                    <div>
                                        <Form.Label><h6><b>Rectangle No./Mustil</b></h6></Form.Label>
                                    </div>
                                    <ReactMultiSelect

                                        listOfData={mustilDataLabels}
                                        labels="Rectangle No."
                                        getSelectedValue={(data) => setMustil(data.data)}

                                    ></ReactMultiSelect>
                                </Col>

                            </Row><br></br>
                            <Row className="ml-auto mb-3" >
                                <Col md={4} xxl lg="12">
                                    <div>
                                        <label ><h6><b>Consolidation Type</b></h6> </label> &nbsp;&nbsp;
                                        <input type="radio"  value="1"
                                            onChange={handleChange}  onClick={handleshow2} />&nbsp;&nbsp;
                                        <label for="Yes"></label>
                                        <label htmlFor="gen">Consolidated</label>&nbsp;&nbsp;

                                        <input type="radio"  value="2"
                                            onChange={handleChange}  onClick={handleshow2} />&nbsp;&nbsp;
                                        <label for="Yes"></label>
                                        <label htmlFor="npnl">Non-Consolidated</label>
                                        {/* </Form.Select> */}
                                    </div> {
                                        showhide2 === "1" && (

                                            <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))" }}>
                                                <thead>

                                                    <tr>
                                                        <th ><b>Kanal</b></th>
                                                        <th><b>Marla</b></th>
                                                        <th><b>Sarsai</b>&nbsp;&nbsp;</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td >
                                                            <input type="text" className="form-control" placeholder="" ></input></td>
                                                        <td ><input type="text" className="form-control" placeholder="" ></input> </td>
                                                        <td > <input type="text" className="form-control" placeholder=""></input></td>

                                                    </tr>
                                                </tbody>
                                            </table>

                                        )}
                                    {
                                        showhide2 === "2" && (

                                            <table className="table table-bordered" style={{ backgroundColor: "rgb(251 251 253))" }}>
                                                <thead>

                                                    <tr>

                                                        <th ><b>Bigha</b></th>
                                                        <th><b>Biswa</b></th>
                                                        <th><b>Biswansi</b>&nbsp;&nbsp;</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td ><input type="text" className="form-control" placeholder="" ></input></td>
                                                        <td ><input type="text" className="form-control" placeholder="" ></input> </td>
                                                        <td > <input type="text" className="form-control" placeholder=""></input></td>

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
                                    <ReactMultiSelect

                                        listOfData={khewatDataLabels}
                                        labels="Owner Name"
                                        getSelectedValue={(data) => setModalLand(data.data)}

                                    ></ReactMultiSelect>
                                </Col>
                            </Row>
                            <Row className="ml-auto mb-3" >

                                <div className="col col-12">
                                    <h6 data-toggle="tooltip" data-placement="top" title="Whether collaboration agreement entered for the Khasra?(yes/no)"><b>Collaboration agreement&nbsp;<InfoIcon style={{ color: "blue" }} />&nbsp; </b>&nbsp;&nbsp;

                                        <input type="radio" value="Yes" 
                                            onChange={handleChange}  onClick={handleshow1} />&nbsp;&nbsp;
                                        <label for="Yes"><h6><b>Yes</b></h6></label>&nbsp;&nbsp;
                                        <input type="radio" value="No" 
                                            onChange={handleChange}  onClick={handleshow1} />&nbsp;&nbsp;
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
                                                        onChange={handleChange}  />&nbsp;&nbsp;
                                                    <label for="Yes"><h6>Yes</h6></label>&nbsp;&nbsp;

                                                    <input type="radio" value="No" id="No1"
                                                        onChange={handleChange}  />&nbsp;&nbsp;
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
                                                    <input type="file" className="form-control"  />
                                                </div>
                                            </div>

                                        )}

                                </div>

                            </Row>
                            <button
                                type="button"
                                style={{ float: "right" }}
                                className="btn btn-primary"
                              
                            >
                                Submit
                            </button>
                       
                        {/* <ModalFooter
                            toggle={() => setmodal(!modal)}
                        ></ModalFooter> */}
                    {/* </Modal> */}
                </Form.Group>

            </Card>
        </Form>

    )
}

export default ModalForm;