// import React from "react";
// import "./styles.css";
// import RadioButton from "./radio-button";
// import { radiobutton_appearances } from "./radio-button";

// export default function RadioButtonsGroup() {
//   const groupItems = [
//     {
//       name: "NO",
//       label: "No",
//       information: "Please select if you are male",
//       disabled: false
//     },
//     {
//       name: "YES",
//       label: "Yes",
//       information: "Please select if you are male",
//       disabled: false
//     },
//   ];
//   return (
//     <RadioButton
//       groupItems={groupItems}
//       group="Scrutiny fee deposited is in order or not."
//       checkedDefault="No"
//       appearance={radiobutton_appearances.primary}
//     />
//   );
// }





import React, { useState, useRef, useEffect, useContext } from "react";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';



  export default function RadioButtonsGroup(props) {


     const [displayPersonalCHeckedList, setDisplayCheckedPersonalList] = useState([]);
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
         {
         field: 'filedName',
          headerName: 'Description',
          width: "100%",
          editable: true,
        },
        {
          field: 'proforma',
          headerName: 'proforma',
          width: 150,
          editable: true,
        },
        // {
        //   field: 'age',
        //   headerName: 'JD(HQ)',
        //   type: 'number',
        //   width: 110,
        //   editable: true,
        // },
        {
          field: 'fullName',
          headerName: 'Full name',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: "100%",
          valueGetter: (params) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
      ];


      const rows = [
        { id: 1, filedName: 'Scrutiny fee deposited is in order or not.' ,proforma : "Y" || "N" },
        { id: 2, filedName: '25% of the licence fee deposited is in order or not.' ,proforma : "Y" || "N" },
        { id: 3, filedName: 'Documents submitted regarding the Financial position of the applicant/developer is in order or not.',proforma : "Y" || "N" },
        { id: 4, filedName: 'If the license application is under part migration/ migration, the parent license renewed/requisite renewal fee + applicable interest deposited is in order or not.',proforma : "Y" || "N" },
        { id: 5, filedName: 'If Case for Additional License, Outstanding Dues of parent license.',proforma : "Y" || "N" },
        { id: 6, filedName: 'Fee & Charges for LOI generation is in order or not',proforma : "Y" || "N" },
        { id: 7, filedName: 'Outstanding dues in other licenses of the Developer Company and its Board to Directors.',proforma : "Y" || "N" },
      ];
   
  return (
    <Box sx={{ height: 500, width: '100%' }}>
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
        pageSizeOptions={[7]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
