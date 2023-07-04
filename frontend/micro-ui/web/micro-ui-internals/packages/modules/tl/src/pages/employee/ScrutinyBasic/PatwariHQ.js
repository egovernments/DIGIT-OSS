
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useStyles } from "./css/personalInfoChild.style";
import BackspaceIcon from '@mui/icons-material/Backspace';
import { IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useTranslation } from "react-i18next";
import { Label } from "@egovernments/digit-ui-react-components";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

import {
    Box,
    Collapse,
} from "@mui/material";
import TableDialog from "./TableDataModal";


const DataGridDemo = (props) => {
    const applicant = props.dataForIcons;
    const applicants = props.remarksData;

    console.log("newdataPAdsfdf", applicants);
    console.log("newdatahappdsfdf", applicant);

    const [chatSheet, setChatSheet] = useState([])
    const [expanded, setExpanded] = useState({})
    const { t } = useTranslation();

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


    const [open, setOpen] = useState(false);
    const [smShow, setSmShow] = useState(false);
    const [docModal, setDocModal] = useState(false);
    const handlemodaldData = () => {
        setSmShow(false);
    };
    const [fieldValue, setFieldValue] = useState("");

    const getDataGri = (element, item) => {
        return (
            <React.Fragment>
                {
                    element?.isApproved === "Not In Order" && (
                        <td
                            style={{ backgroundColor: "#ff0000" }}
                        >

                            <p onClick={() => handleExpend(element.role, item.name, !expanded?.[element?.role]?.[item?.name])}>
                                {element?.isApproved}
                            </p>
                            {/* <Card style={{ border: "black", backgroundColor: "#ff0000" }}>
                                    <div>

                                        {element?.remarks}
                                    </div>
                                    <button style={{ textAlign: "left" }} onClick={() => handleExpend(element.role, item.name, !expanded?.[element?.role]?.[item?.name])}>
                                        <BackspaceIcon></BackspaceIcon>
                                    </button>
                                </Card> */}
                            {expanded?.[element?.role]?.[item?.name] && (

                                <TextSnippetIcon

                                    onClick={() => {

                                        setSmShow(true);

                                        setFieldValue(element?.remarks !== null ? element?.remarks : null);
                                        // setFieldValue2(el.designation !== null ? el.designation : null);
                                        // setFieldValue3(el.role !== null ? el.role : null);
                                    }}
                                >

                                </TextSnippetIcon>
                            )}
                        </td>
                    )


                }
                {
                    element?.isApproved === "Conditional" && (
                        <td
                            style={{ backgroundColor: "#2874A6" }}
                        >
                            <p onClick={() => handleExpend(element.role, item.name, !expanded?.[element?.role]?.[item?.name])}>
                                {element?.isApproved}
                            </p>
                            {/* <Card style={{ border: "black", backgroundColor: "#2874A6" }}>
                                    <div>

                                        {element?.remarks}
                                    </div>
                                    <button style={{ textAlign: "left" }} onClick={() => handleExpend(element.role, item.name, !expanded?.[element?.role]?.[item?.name])}>
                                        <BackspaceIcon></BackspaceIcon>
                                    </button>
                                </Card> */}
                            {expanded?.[element?.role]?.[item?.name] && (

                                <TextSnippetIcon

                                    onClick={() => {

                                        setSmShow(true);

                                        setFieldValue(element?.remarks !== null ? element?.remarks : null);
                                        // setFieldValue2(el.designation !== null ? el.designation : null);
                                        // setFieldValue3(el.role !== null ? el.role : null);
                                    }}
                                >

                                </TextSnippetIcon>
                            )}
                        </td>
                    )


                }
                {
                    element?.isApproved === "In Order" && (
                        <td
                            style={{ backgroundColor: "#09cb3d" }}
                        >
                            <p onClick={() => handleExpend(element.role, item.name, !expanded?.[element?.role]?.[item?.name])}>
                                {element?.isApproved}
                            </p>
                            {/* <Card style={{ border: "black", backgroundColor: "#09cb3d" }}>
                                    <div>

                                        {element?.remarks}
                                    </div>
                                    <button style={{ textAlign: "left" }} onClick={() => handleExpend(element.role, item.name, !expanded?.[element?.role]?.[item?.name])}>
                                        <BackspaceIcon></BackspaceIcon>
                                    </button>
                                </Card> */}
                            {expanded?.[element?.role]?.[item?.name] && (
                                <TextSnippetIcon

                                    onClick={() => {

                                        setSmShow(true);

                                        setFieldValue(element?.remarks !== null ? element?.remarks : null);
                                        // setFieldValue2(el.designation !== null ? el.designation : null);
                                        // setFieldValue3(el.role !== null ? el.role : null);
                                    }}
                                >

                                </TextSnippetIcon>
                            )}
                        </td>
                    )


                }
            </React.Fragment>
        )
    }








    return (
        <Form ref={props.generalInfoRef}>

            <TableDialog

                passmodalData={handlemodaldData}
                displaymodal={smShow}

                onClose={() => { setSmShow(false); setDocModal(false) }}
                fieldValue={fieldValue}

            ></TableDialog>

            <Form.Group className="justify-content-center" controlId="formBasicEmail" style={{ border: "2px solid #e9ecef", margin: 10, padding: 20, display: "grid" }}>

                <div style={{ overflow: "scroll", height: "680px" }}>
                    {/* <Card style={{ textAlign: "center" ,backgroundColor: "#FFD954" ,maxHeight:680 }}>ONLINE LICENSE APPLICATION SCRUTINY PROFORMA</Card> */}
                    <table className="table table-bordered">
                        <thead>

                            <tr className="border-bottom-0">
                                <th class="fw-normal py-0 border-top-0">
                                    Sr.NO
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    Field Name
                                </th>


                                <th class="fw-normal py-0 border-top-0">
                                    Patwari Head Quarter
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                Naib Tehsildar Head Quarter
                                </th>

                                <th class="fw-normal py-0 border-top-0">
                                    JE Head Quarter
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    AD Head Quarter
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    JD Head Quarter
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    SD Head Quarter
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    DA Head Quarter
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    ADA Head Quarter
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    AO Head Quarter
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    CAO Head Quarter
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    SO Head Quarter
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    ATP Head Quarter
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    Patwari Filed
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    JE Filed
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    AD Filed
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    DA Filed
                                </th>
                                <th class="fw-normal py-0 border-top-0">
                                    ADA Filed
                                </th>
                                {/* <th class="fw-normal py-0 border-top-0">
                                    AO Filed
                                </th> */}
                                <th class="fw-normal py-0 border-top-0">
                                    ATP Filed
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


                                            <Label style={{ fontSize: 14 }}>{t(item?.name)}</Label>

                                        </td>


                                        {
                                            item.employees?.find((item, index) => (item?.role === "Patwari") || (item?.role === "Patwari_HQ") || (item.role === "PATWARI") ) ? getDataGri(item.employees?.find((item, index) => (item?.role === "Patwari") || (item?.role === "Patwari_HQ") || (item.role === "PATWARI")), item) : <td></td>

                                        }
                                        {
                                            item.employees?.find((item, index) => (item.role === "Naib Tehsildar")) ? getDataGri(item.employees?.find((item, index) =>  (item.role === "Naib Tehsildar")), item) : <td></td>

                                        }

                                              {
                                            item.employees?.find((item, index) => (item?.role === "JE_HQ") || (item?.role === "Junior Engineer") || (item.role === "Jr Engineer") || (item.role === "Junier Engineer") || (item.role === "JE")) ? getDataGri(item.employees?.find((item, index) => (item?.role === "JE_HQ") || (item?.role === "Junior Engineer") || (item.role === "Jr Engineer") || (item.role === "Junier Engineer")||(item.role === "JE")), item) : <td></td>

                                        }
                                       
                                        {
                                            item.employees?.find((item, index) => (item?.role === "Assistant Draftsman") || (item.role === "AD_HQ") ) ? getDataGri(item.employees?.find((item, index) => (item?.role === "JD_HQ") || (item?.role === "Assistant Draftsman") || (item.role === "AD_HQ") || (item.role === "Senior Draftmans") || (item.role === "JD") || (item.role === "SD_HQ") ||(item?.role === "Junior Draftsman")), item) : <td></td>

                                        }
                                        {
                                            item.employees?.find((item, index) => (item?.role === "JD_HQ") ||  (item.role === "JD") || (item?.role === "Junior Draftsman")) ? getDataGri(item.employees?.find((item, index) => (item?.role === "JD_HQ") || (item.role === "Senior Draftmans") || (item.role === "JD") || (item?.role === "Junior Draftsman")), item) : <td></td>

                                        }
                                        {
                                            item.employees?.find((item, index) => (item.role === "Senior Draftmans") || (item.role === "SD_HQ") ) ? getDataGri(item.employees?.find((item, index) => (item.role === "Senior Draftmans") ||  (item.role === "SD_HQ")), item) : <td></td>

                                        }

                                        {
                                            item.employees?.find((item, index) =>  (item?.role === "DA_HQ") || (item?.role === "District Attorney") || (item.role === "DDA_HQ")) ? getDataGri(item.employees?.find((item, index) => (item?.role === "DA_HQ") || (item?.role === "District Attorney") || (item.role === "DDA_HQ")), item) : <td></td>

                                        }
                                        {
                                            item.employees?.find((item, index) =>  (item.role === "ADA_HQ") || (item.role === "Assistant District Atorney")) ? getDataGri(item.employees?.find((item, index) => (item.role === "ADA_HQ") || (item.role === "Assistant District Atorney")), item) : <td></td>

                                        }
                                        {
                                            item.employees?.find((item, index) =>  (item.role === "AO_HQ") || (item.role === "AO") || (item.role === "SO")) ? getDataGri(item.employees?.find((item, index) =>  (item.role === "AO_HQ") || (item.role === "AO") ), item) : <td></td>

                                        }
                                        {
                                            item.employees?.find((item, index) => (item?.role === "CAO") || (item?.role === "CAO_HQ")) ? getDataGri(item.employees?.find((item, index) => (item?.role === "CAO") || (item?.role === "CAO_HQ") ), item) : <td></td>

                                        }
                                        {
                                            item.employees?.find((item, index) => (item.role === "SO")) ? getDataGri(item.employees?.find((item, index) =>  (item.role === "SO")), item) : <td></td>

                                        }

                                        {
                                            item.employees?.find((item, index) => (item.role === "ATP_HQ") || (item?.role === "ATP") || (item.role === "ATP HQ")) ? getDataGri(item.employees?.find((item, index) => (item.role === "ATP_HQ") || (item?.role === "ATP") || (item.role === "ATP HQ")), item) : <td></td>

                                        }
                                        {/* {
                                            item.employees?.find((item, index) => (item.role === "ATP_HQ")) ? getDataGri(item.employees?.find((item, index) => (item.role === "ATP_HQ")), item) : <td></td>

                                        } */}
                                        {
                                            item.employees?.find((item, index) => (item.role === "Patwari_Filed")) ? getDataGri(item.employees?.find((item, index) => (item.role === "Patwari_Filed")), item) : <td></td>

                                        }
                                        {/* {
                                            item.employees?.find((item, index) => (item.role === "Patwari_Filed"))?getDataGri(item.employees?.find((item, index) => (item.role === "Patwari_Filed")),item): <td></td>

                                                } */}
                                        {
                                            item.employees?.find((item, index) => (item.role === "JE_Filed")) ? getDataGri(item.employees?.find((item, index) => (item.role === "JE_Filed")), item) : <td></td>

                                        }
                                        {
                                            item.employees?.find((item, index) => (item.role ===  "DA_Filed") ) ? getDataGri(item.employees?.find((item, index) => (item.role === "DA_Filed")), item) : <td></td>

                                        }
                                        {
                                            item.employees?.find((item, index) =>  (item.role === "ADA_Filed")) ? getDataGri(item.employees?.find((item, index) => 
                                            (item.role === "ADA_Filed")), item) : <td></td>

                                        }
                                        {/* {
                                            item.employees?.find((item, index) => (item.role === "AO_Filed")) ? getDataGri(item.employees?.find((item, index) => (item.role === "AO_Filed")), item) : <td></td>

                                        } */}
                                        {
                                            item.employees?.find((item, index) => (item.role === "ATP_Filed")) ? getDataGri(item.employees?.find((item, index) => (item.role === "ATP_Filed")), item) : <td></td>

                                        }


                                        {/* <td>
                                            {item.employees?.find((item, index) => (item.role === "AO_Filed"))?.isApproved || ""}
                                            {getDataGri(item.employees?.find((item, index) => (item.role === "AO_Filed")),item)}
                                        </td>
                                        <td>
                                            {item.employees?.find((item, index) => (item.role === "ATP_Filed"))?.isApproved || ""}
                                            {getDataGri(item.employees?.find((item, index) => (item.role === "ATP_Filed")),item)}
                                        </td> */}
                                        {/* <td> <p>
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
                                        </td> */}
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
