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

import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';



  export default function DataGridDemo(props) {

    const applicant = props.dataForIcons;
    console.log("newdataPA" , applicant);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
          field: 'firstName',
          headerName: 'Fields Name',
          width: 150,
          editable: true,
        },
        {
          field: '',
          headerName: 'Patwari(HQ)',
          width: 150,
          editable: true,
        },
        {
          field: 'age',
          headerName: 'JD(HQ)',
          type: 'number',
          width: 110,
          editable: true,
        },
        {
          field: 'fullName',
          headerName: 'Full name',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 160,
          valueGetter: (params) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
        {
          field: 'gruop',
          headerName: 'Gruop',
          type: 'number',
          width: 110,
          editable: true,
        },
        {
            field: 'emp',
            headerName: 'Employee',
            type: 'number',
            width: 110,
            editable: true
        },
        {
            field: 'age',
            headerName: 'SD(HQ)',
            type: 'number',
            width: 110,
            editable: true,
          },
          {
            field: 'age',
            headerName: 'JD(HQ)',
            type: 'number',
            width: 110,
            editable: true,
          },
          {
            field: 'age',
            headerName: 'JD(HQ)',
            type: 'number',
            width: 110,
            editable: true,
          },
          {
            field: 'age',
            headerName: 'JD(HQ)',
            type: 'number',
            width: 110,
            editable: true,
          },
      ];
      
      const rows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 , gruop: 90 , emp : ""},
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 , gruop: 89},
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 , gruop: 92},
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 , gruop: 93},
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null , gruop: null},
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 , gruop: 19},
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 , gruop: 67 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 , gruop: 50 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 , gruop: 67 },
      ];
    //   let query = DetailsofAppliedLand?.dgpsDetails.map((array) => array.map((object) =>
      
      const employee = applicant?.egScrutiny?.map((array) => array.employees?.map((itme , index ) =>
      itme?.employeeName)
      )
    
      console.log("Emplo23" , employee);


      console.log("Emplo" , applicant?.egScrutiny?.[0]?.employees?.[0]?.employeeName);
   

// dataForIcons={iconStates}
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 7,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}




// import * as React from 'react';
// import { DataGridPro } from '@mui/x-data-grid-pro';
// import { useDemoData } from '@mui/x-data-grid-generator';

// const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

// export default function BasicExampleDataGridPro() {
//   const { data } = useDemoData({
//     dataSet: 'Employee',
//     visibleFields: VISIBLE_FIELDS,
//     rowLength: 100,
//   });

//   return (
//     <div style={{ height: 400, width: '100%' }}>
//       <DataGridPro {...data} />
//     </div>
//   );
// }
