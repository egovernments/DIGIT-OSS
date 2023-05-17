
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useStyles } from "./css/personalInfoChild.style";
import BackspaceIcon from '@mui/icons-material/Backspace';
import { IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import {
    Box,
    Collapse,
} from "@mui/material";


const DataGridDemo = (props) => {
    const applicant = props.dataForIcons;
    console.log("newdataPA", applicant);
    const [chatSheet, setChatSheet] = useState([])
    const [expanded, setExpanded] = useState({})

    // const [open, setOpen] = useState(false);
    // const [handleshow19, sethandleshow19] = useState(false);
    // const [showhide19, setShowhide19] = useState("true");
    // const handleChange = (e) => {
    //     this.setState({ isRadioSelected: true });
    //   };
    const handleExpend = (role, label, value) => {
        let tempArray = expanded;
        tempArray[role] = { ...tempArray[role], [label]: value }
        // tempArray = {...tempArray,{...tempArray,{}}}
        console.log("expanded", tempArray, expanded);
        setExpanded({ ...tempArray })
    }

    useEffect(() => {
        console.log("expanded123", expanded);
    }, [expanded])





    const [isOpen, setIsOpen] = useState(false);
    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    useEffect(() => {
        console.log("abcd123", props.dataForIcons, props.dataForIcons?.egScrutiny);
        setChatSheet(props.dataForIcons?.egScrutiny)

    }, [props.dataForIcons])

    const [data, setData] = useState([]);
    const toggleshown1 = name => {
        const showState = data.slice();
        const index = showState.indexOf(name);
        if (index >= 0) {
            showState.splice(index, 1);
            setData(showState);
        }
        else {
            showState.push(name);
            setData(showState);
        }
    }

    const getDataGri = (element, item) => {
        return (
            <React.Fragment>
                {
                    element?.isApproved === "Not In Order" && (
                        <div style={{ backgroundColor: "#ff0000" }}>

                            <p onClick={() => handleExpend(element.role, item.name, !expanded?.[element?.role]?.[item?.name])}>
                                {element?.isApproved}
                            </p>

                            {expanded?.[element?.role]?.[item?.name] && (
                                <Card style={{ border: "black", backgroundColor: "#ff0000" }}>
                                    <div>

                                        {element?.remarks}
                                    </div>
                                    <button style={{ textAlign: "left" }} onClick={() => handleExpend(element.role, item.name, !expanded?.[element?.role]?.[item?.name])}>
                                        <BackspaceIcon></BackspaceIcon>
                                    </button>
                                </Card>
                            )}
                        </div>
                    )


                }
                {
                    element?.isApproved === "Conditional" && (
                        <div style={{ backgroundColor: "#2874A6" }}>
                            <p onClick={() => handleExpend(element.role, item.name, !expanded?.[element?.role]?.[item?.name])}>
                                {element?.isApproved}
                            </p>

                            {expanded?.[element?.role]?.[item?.name] && (
                                <Card style={{ border: "black", backgroundColor: "#2874A6" }}>
                                    <div>

                                        {element?.remarks}
                                    </div>
                                    <button style={{ textAlign: "left" }} onClick={() => handleExpend(element.role, item.name, !expanded?.[element?.role]?.[item?.name])}>
                                        <BackspaceIcon></BackspaceIcon>
                                    </button>
                                </Card>
                            )}
                        </div>
                    )


                }
                {
                    element?.isApproved === "In Order" && (
                        <div style={{ backgroundColor: "#09cb3d" }}>
                            <p onClick={() => handleExpend(element.role, item.name, !expanded?.[element?.role]?.[item?.name])}>
                                {element?.isApproved}
                            </p>

                            {expanded?.[element?.role]?.[item?.name] && (
                                <Card style={{ border: "black", backgroundColor: "#09cb3d" }}>
                                    <div>

                                        {element?.remarks}
                                    </div>
                                    <button style={{ textAlign: "left" }} onClick={() => handleExpend(element.role, item.name, !expanded?.[element?.role]?.[item?.name])}>
                                        <BackspaceIcon></BackspaceIcon>
                                    </button>
                                </Card>
                            )}
                        </div>
                    )


                }
            </React.Fragment>
        )
    }








    return (
        <Form ref={props.generalInfoRef}>

            <Form.Group className="justify-content-center" controlId="formBasicEmail" style={{ border: "2px solid #e9ecef", margin: 10, padding: 20 }}>





                <div style={{ overflow: "scroll" }}>
                    <Card style={{ textAlign: "center" }}>ONLINE LICENSE APPLICATION SCRUTINY PROFORMA</Card>
                    <table className="table table-bordered">
                        <thead>

                            <tr className="border-bottom-0">
                                <th class="fw-normal py-0 border-top-0">
                                    Sr.NO
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    File Name
                                </th>

                               
                                <th class="fw-normal py-0 border-top-0">
                                    Patwari_HQ
                                </th>

                                <th class="fw-normal py-0 border-top-0">
                                    JE_HQ
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    AD_HQ
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    JD_HQ
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    DA_HQ/ADA_HQ
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    AO_HQ
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    ATP_HQ
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    Patwari
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    JE_Filed
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    AD_Filed
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    DA_Filed/ADA_Filed
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    AO_Filed
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    ATP_Filed
                                </th>


                            </tr>


                        </thead>
                        <tbody>
                            {
                                applicant?.egScrutiny?.map((item, index) => (

                                    <tr key={index}>
                                        <td>

                                            {index + 1}

                                        </td>
                                        <td>

                                            {item?.name}

                                        </td>
                                         <td>
                                            {item.employees?.find((item, index) => (item.role === "Patwari"))?.isApproved || ""}

                                            {getDataGri(item.employees?.find((item, index) => (item.role === "Patwari")),item)}
                                        </td>
                                        <td>
                                            {/* {item.employees?.find((item, index) => (item.role === "JE_HQ"))?.isApproved || ""} */}

                                            {getDataGri(item.employees?.find((item, index) => (item.role === "JE_HQ")),item)}

                                        </td>
                                        <td>
                                            {item.employees?.find((item, index) => (item.role === "AD_HQ"))?.isApproved || ""}

                                        </td>
                                        <td>
                                            {item.employees?.find((item, index) => (item.role === "JD_HQ"))?.isApproved || ""}

                                        </td>
                                        <td>
                                            {item.employees?.find((item, index) => (item.role === ("DA_HQ" || "ADA_HQ")))?.isApproved || ""}

                                        </td>
                                        <td>
                                            {item.employees?.find((item, index) => (item.role === "AO_HQ"))?.isApproved || ""}

                                        </td>
                                        <td>
                                            {item.employees?.find((item, index) => (item.role === "ATP_HQ"))?.isApproved || ""}

                                        </td>
                                        <td>
                                            {item.employees?.find((item, index) => (item.role === "Patwari_Filed"))?.isApproved || ""}

                                        </td>
                                        <td>
                                            {item.employees?.find((item, index) => (item.role === "JE_Filed"))?.isApproved || ""}

                                        </td>
                                        <td>
                                            {item.employees?.find((item, index) => (item.role === "AD_Filed"))?.isApproved || ""}

                                        </td>
                                        <td>
                                            {item.employees?.find((item, index) => (item.role === ("DA_Filed" || "ADA_Filed")))?.isApproved || ""}

                                        </td>
                                        <td>
                                            {item.employees?.find((item, index) => (item.role === "AO_Filed"))?.isApproved || ""}

                                        </td>
                                        <td>
                                            {item.employees?.find((item, index) => (item.role === "ATP_Filed"))?.isApproved || ""}

                                        </td>
                                        <td> <p>
                                            <IconButton
                                                onClick={() => toggleshown1(item.name)}
                                            >
                                                {data.includes(index) ? (
                                                    <KeyboardArrowUpIcon />
                                                ) : (
                                                    <p><KeyboardArrowUpIcon /><b>{item.employees.role}</b></p>

                                                )}

                                            </IconButton>

                                        </p>
                                            <div className="additional-info">
                                                {data.includes(item.name) && (
                                                    <Box >
                                                        <Card style={{ border: "black", backgroundColor: "lightblue" }}>
                                                            <div>
                                                                {item?.remarks}
                                                            </div>
                                                            <button style={{ textAlign: "left" }} onClick={() => setIsOpen(false)}>
                                                                <BackspaceIcon></BackspaceIcon>
                                                            </button>
                                                        </Card>
                                                    </Box>
                                                )}
                                            </div>
                                        </td>
                                        {/* <td>
                                            {item.employees?.find((item, index) => (item.role === "Patwari_HQ"))?.isApproved || ""}

                                        </td> */}
                                        {/* Work single Card Functionalty */}
                                        {/* <td>
                                            <p onClick={() => {
                                                try {
                                                    console.log("clicked", item, item?.employees, chatSheet)
                                                    let tempArray = chatSheet;
                                                    let employeeIndex = item?.employees?.findIndex((item, index) => item?.role === "ATP_HQ")
                                                    console.log("clicked1", employeeIndex, tempArray[index], tempArray[index]);
                                                    tempArray[index].employees = [ ...item.employees,{ ...item?.employees?.[employeeIndex], isOpen: true } ]
                                                    console.log("clicked2", tempArray, employeeIndex);
                                                    setChatSheet(tempArray)
                                                } catch (Err) {
                                                    console.log("clicked error ===> ", Err)
                                                }
                                            }}>
                                                {item.employees?.find((item, index) => (item.role === "ATP_HQ"))?.isApproved || ""} reregregerg
                                                {item.employees?.findIndex((item, index) => item.role === "ATP_HQ")}
                                                {
                                                    chatSheet?.[index]?.employees?.[item?.employees?.findIndex((item, index) => item.role === "ATP_HQ")]?.isOpen 
                                                }
                                                {JSON.stringify(chatSheet?.[index]?.employees?.[item?.employees?.findIndex((item, index) => item.role === "ATP_HQ")]?.isOpen )}
                                            </p>

                                            {
                                            chatSheet?.[index]?.employees?.[item?.employees?.findIndex((item, index) => item?.role === "ATP_HQ")]?.isOpen && (
                                                <Card style={{ border: "black", backgroundColor: "lightblue" }}>
                                                    <div>
                                                        {item?.remarks}
                                                    </div>
                                                    <button style={{ textAlign: "left" }} onClick={() => {
                                                        try {
                                                            console.log("clicked", item, item?.employees, chatSheet)
                                                            let tempArray = chatSheet;
                                                            let employeeIndex = item?.employees?.findIndex((item, index) => item?.role === "ATP_HQ")
                                                            console.log("clicked1", employeeIndex, tempArray[index], tempArray[index]);
                                                            tempArray[index].employees = [ ...item.employees,{ ...item?.employees?.[employeeIndex], isOpen: true } ]
                                                            console.log("clicked2", tempArray, employeeIndex);
                                                            setChatSheet(tempArray)
                                                        } catch (Err) {
                                                            console.log("clicked error ===> ", Err)
                                                        }
                                                    }}>
                                                        <BackspaceIcon></BackspaceIcon>
                                                    </button>
                                                </Card>
                                            )}
                                        </td> */}
                                        {/* changes other comment */}

                                        {/* <p onClick={() => setIsOpen(true)}>
                                            {item?.isApproved}
                                            </p>
                                            {isOpen && (
                                                <Card style={{border: "black" , backgroundColor: "lightblue"}}>
                                                    <div>
                                                   {item?.remarks}
                                                    </div>
                                                    <button style={{textAlign:"left"}}onClick={() => setIsOpen(false)}>
                                                        <BackspaceIcon></BackspaceIcon>
                                                    </button>
                                                </Card>
                                            )} */}


                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

            </Form.Group>
            <br></br>

            {/* <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
    <DialogTitle id="alert-dialog-title">
        Service Plan Submission
    </DialogTitle>
    <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>Your Service Plan is submitted successfully <span><CheckCircleOutlineIcon style={{color: 'blue', variant: 'filled'}}/></span></p>
            <p>Please Note down your Application Number <span style={{padding: '5px', color: 'blue'}}>{applicationNumber}</span> for further assistance</p>
          </DialogContentText>
    </DialogContent>
    <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Ok
          </Button>
    </DialogActions>

    </Dialog> */}


        </Form>
    );
};

export default DataGridDemo;
