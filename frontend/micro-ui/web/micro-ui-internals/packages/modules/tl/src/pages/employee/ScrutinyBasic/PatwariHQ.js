// import React, { useState, useEffect } from "react";
// import { Row, Col, Card, Container, Form, Button } from "react-bootstrap";

// const windowHeight = window !== undefined ? window.innerHeight : null;
// const DisApprovalList = (props) => {

//   return (
//     <Container>
//       <Row>
//     <Card>
//       <Card.Header>
//         <Card.Title style={{ fontFamily: "Roboto", fontSize: 30, fontWeight: "bold" }}>{/* Disapproval List */}</Card.Title>
//       </Card.Header>
//       <Card.Body style={{ overflowY: "auto", height: 350, maxWidth: "100%", backgroundColor: "#C6C6C6" }}>
//         <Form>
//           <h2 style={{ fontFamily: "Roboto", fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Personal Information Disaaproval</h2>

//         </Form>
//       </Card.Body>
//       <Card.Footer>
//       </Card.Footer>
//     </Card>
//       </Row>
//     </Container>
//   );
// };

// export default DisApprovalList;
//////////////////////////Last PAtwari////////////////////////////////////////////

// import React, { useState, useRef, useEffect, useContext } from "react";
// import Box from '@mui/material/Box';
// import { DataGrid } from '@mui/x-data-grid';



//   export default function DataGridDemo(props) {

//     const applicant = props.dataForIcons;
//     console.log("newdataPA" , applicant);

//     // const [displayPersonalCHeckedList, setDisplayCheckedPersonalList] = useState([]);
//     const columns = [
//         { field: 'id', headerName: 'ID', width: 90 },
//         // {
//         //   field: 'firstName',
//         //   headerName: 'Fields Name',
//         //   width: 150,
//         //   editable: true,
//         // },
//         // {
//         //   field: '',
//         //   headerName: 'Patwari(HQ)',
//         //   width: 150,
//         //   editable: true,
//         // },
//         // {
//         //   field: 'age',
//         //   headerName: 'JD(HQ)',
//         //   type: 'number',
//         //   width: 110,
//         //   editable: true,
//         // },
//         // {
//         //   field: 'fullName',
//         //   headerName: 'Full name',
//         //   description: 'This column has a value getter and is not sortable.',
//         //   sortable: false,
//         //   width: 160,
//         //   valueGetter: (params) =>
//         //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
//         // },
//         // {
//         //   field: 'gruop',
//         //   headerName: 'Gruop',
//         //   type: 'number',
//         //   width: 110,
//         //   editable: true,
//         // },
//         // {
//         //     field: 'emp',
//         //     headerName: 'Employee',
//         //     type: 'number',
//         //     width: 110,
//         //     editable: true
//         // },
//         // {
//         //     field: 'age',
//         //     headerName: 'SD(HQ)',
//         //     type: 'number',
//         //     width: 110,
//         //     editable: true,
//         //   },
//         //   {
//         //     field: 'age',
//         //     headerName: 'JD(HQ)',
//         //     type: 'number',
//         //     width: 110,
//         //     editable: true,
//         //   },
//         //   {
//         //     field: 'age',
//         //     headerName: 'AO(HQ)',
//         //     type: 'number',
//         //     width: 110,
//         //     editable: true,
//         //   },
//         //   {
//         //     field: 'age',
//         //     headerName: 'DA(HQ)',
//         //     type: 'number',
//         //     width: 110,
//         //     editable: true,
//         //   },
//         //   {
//         //     field: 'age',
//         //     headerName: 'ADA(HQ)',
//         //     type: 'number',
//         //     width: 110,
//         //     editable: true,
//         //   },
//         //   {
//         //     field: 'age',
//         //     headerName: 'JE(HQ)',
//         //     type: 'number',
//         //     width: 110,
//         //     editable: true,
//         //   },
//         //   {
//         //     field: 'age',
//         //     headerName: 'ATP(HQ)',
//         //     type: 'number',
//         //     width: 110,
//         //     editable: true,
//         //   },
//         //   {
//         //     field: 'age',
//         //     headerName: 'DTP(HQ)',
//         //     type: 'number',
//         //     width: 110,
//         //     editable: true,
//         //   },
//       ];


//       const rows = [
//         { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 , gruop: 90 , emp : ""},
//         { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 , gruop: 89},
//         { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 , gruop: 92},
//         { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 , gruop: 93},
//         { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null , gruop: null},
//         { id: 6, lastName: 'Melisandre', firstName: null, age: 150 , gruop: 19},
//         { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 , gruop: 67 },
//         { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 , gruop: 50 },
//         { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 , gruop: 67 },
//       ];
//     //   let query = DetailsofAppliedLand?.dgpsDetails.map((array) => array.map((object) =>

//       const employee = applicant?.egScrutiny?.map((array) => array.employees?.map((itme , index ) =>
//       itme?.designation)
//       )
//       const id = applicant?.egScrutiny?.map((itme , index) =>
//       {index}
//         )
//       console.log("Emplo23" , employee);


//       console.log("Emplo" , id);

//          {/* {JSON.stringify(userRoles)}
//       {JSON.stringify(showRemarksSection)} */}



// // dataForIcons={iconStates}
//   return (
//     <Box sx={{ height: 400, width: '100%' }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         initialState={{
//           pagination: {
//             paginationModel: {
//               pageSize: 7,
//             },
//           },
//         }}
//         pageSizeOptions={[5]}
//         checkboxSelection
//         disableRowSelectionOnClick
//       />
//     </Box>
//   );
// }


/////////////////////////////////////////////////New Data Tableq////////////////////////////////////////////




import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useStyles } from "./css/personalInfoChild.style";
import BackspaceIcon from '@mui/icons-material/Backspace';

const DataGridDemo = (props) => {
    const applicant = props.dataForIcons;
    console.log("newdataPA", applicant);
    const [chatSheet, setChatSheet] = useState([])
    const [arrayData, setArrayData] = useState([])
    // const [open, setOpen] = useState(false);
    // const [handleshow19, sethandleshow19] = useState(false);
    // const [showhide19, setShowhide19] = useState("true");
    // const handleChange = (e) => {
    //     this.setState({ isRadioSelected: true });
    //   };
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        console.log("abcd123", props.dataForIcons, props.dataForIcons?.egScrutiny);
        setChatSheet(props.dataForIcons?.egScrutiny)

    }, [props.dataForIcons])


    // let user = Digit.UserService.getUser();
    // const userRoles = user?.info?.roles?.map((e) => e.code) || [];
    // const hideRemarks = userRoles.some((item) => item === "CTP_HR" || item === "CTP_HQ" || item === "DTP_HR" || item === "DTP_HQ")
    // const employee = applicant?.egScrutiny?.map((array) => array.employees?.map((itme , index ) =>
    //       itme?.designation)
    //       )
    //   const id = applicant?.egScrutiny?.map((itme , index) =>
    //   {index}
    //     )
    //   console.log("Emplo23" , employee);


    //   console.log("Emplo" , id);

    // setOpen(true)
    // const columns = [
    //     name: "Filed Name",
    //     selector : (row) => row.name,
    //    ]
    // const filedName = applicant?.egScrutiny?.map((array) =>  
    // array

    // )
    // setArrayData(filedName)

    // console.log("AcessName" , filedName);
    // array.employees?.map((itme , index ) =>

    //   )
    // function getUnique(array, key) {
    //     if (typeof key !== 'function') {
    //       const property = key;
    //       key = function(item) { return item[property]; };
    //     }
    //     return Array.from(array.reduce(function(map, item) {
    //       const k = key(item);
    //       if (!map.has(k)) map.set(k, item);
    //       return map;
    //     }, new Map()).values());
    //   }


    // const res = Object.values(filedName.reduce((acc, curr) => {
    //     const total = filedName.filter(({ name }) => name === curr.name).length;

    //     if(!acc[curr.name]) {
    //       acc[curr.name] = [
    //        {...curr}
    //       ]
    //     } else {
    //       const currentSize = acc[curr.name].length;

    //       if(currentSize === 1) {
    //         acc[curr.name][0].name = `${acc[curr.name][0].name} (1 of ${total})`
    //       }

    //       acc[curr.name].push({
    //         ...curr,
    //         name: `${curr.name} (${currentSize + 1} of ${total})`
    //       })    
    //     }

    //     return acc;
    //   }, {})).flat();

    //   console.log("Newdata" ,res);
    //   const averageScore = getAverageScores(data)

    // const namesArr = names.filter((val, id) => {
    //     names.indexOf(val) == id;  // this just returns true
    // });

    // function removeDuplicates(filedName) {
    //     return filedName.filter((item, 
    //         index) => filedName.indexOf(item) === index);
    // }
    // console.log(removeDuplicates("duplicates" ,filedName));

    return (
        <Form ref={props.generalInfoRef}>

            <Form.Group className="justify-content-center" controlId="formBasicEmail" style={{ border: "2px solid #e9ecef", margin: 10, padding: 20 }}>





                <div style={{ overflow:"scroll" }}>
                <Card style={{textAlign:"center"}}>ONLINE LICENSE APPLICATION SCRUTINY PROFORMA</Card>
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
                            {/* <tr>
                            {filedName}
                            </tr> */}
                            {
                                applicant?.egScrutiny?.map((item, index) => (

                                    <tr key={index}>
                                        <td>

                                            {index + 1}

                                        </td>
                                        <td>

                                            {item?.name}

                                        </td>
                                        {/* {
                                            item?.employees?.map((item, index) => (
                                                

                                                        
                                                            <td >
                                                           
                                            
                                            <p onClick={() => setIsOpen(true)}>
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
                                            )}

                                        </td>
                                        
                                                   

                                            ))} */}
                                        <td>
                                            {item.employees?.find((item, index) => (item.role === "Patwari_HQ"))?.isApproved || ""}
                                            

                                        </td>
                                        <td>
                                            {item.employees?.find((item, index) => (item.role === "JE_HQ"))?.isApproved || ""}

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
