// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import { useHistory, useParams } from "react-router-dom";
// // import Spinner from "../../../components/Loader";

// // function createData(name, calories, fat, carbs, protein) {
// //   return { name, calories, fat, carbs, protein };
// // }

// // const rows = [
// //   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
// //   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
// //   createData('Eclair', 262, 16.0, 24, 6.0),
// //   createData('Cupcake', 305, 3.7, 67, 4.3),
// //   createData('Gingerbread', 356, 16.0, 49, 3.9),
// // ];

// const BasicTable = (props) => {

//   const { id } = useParams();
//   const authToken = Digit.UserService.getUser()?.access_token || null;
//   const [remarksDataUser, setRemarksDataUser] = useState({});

//   const roleCodes = props.roleCode
//   const applicationNumber = props.applicationNo
//   console.log("loggerroleCode",roleCodes)
  
  
//   const handleAccountClick = async () =>{
//     // setLoader(true);
//     // if(open5===true){
//       console.log("logger1234...",id)
      
    
//     const dataToSend = {
//         RequestInfo: {
//             apiId: "Rainmaker",
//             action: "_create",
//             did: 1,
//             key: "",
//             msgId: "20170310130900|en_IN",
//             ts: 0,
//             ver: ".01",
//             authToken: authToken,
           
//         },
//     };
   
//     try {
//         const Resp = await axios.post(`/land-services/egscrutiny/_search4?applicationNumber=${id}&roles=${roleCodes}`, dataToSend).then((response) => {
//             return response.data;
//         });
  
//         console.log("RemarksRoleCode", Resp);
//         // setLoader(false);
//         setRemarksDataUser(Resp);
        
//     } catch (error) {
//       // setLoader(false);
//         console.log(error);
//     }
//   // }
//   // else{
//   //   console.log(error);
//   // }
//   };
  
   
//   useEffect(() => {
//     handleAccountClick();
//   }, [])

//   return (
//     <TableContainer component={Paper}>
//       <Table sx={{ minWidth: 650 }} aria-label="simple table">
//         <TableHead>
//           <TableRow>
//             <TableCell>Dessert (100g serving)</TableCell>
//             <TableCell align="right">Calories</TableCell>
//             <TableCell align="right">Fat&nbsp;(g)</TableCell>
//             <TableCell align="right">Carbs&nbsp;(g)</TableCell>
//             <TableCell align="right">Protein&nbsp;(g)</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {/* {rows.map((row) => (
//             <TableRow
//               key={row.name}
//               sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//             >
//               <TableCell component="th" scope="row">
//                 {row.name}
//               </TableCell>
//               <TableCell align="right">{row.calories}</TableCell>
//               <TableCell align="right">{row.fat}</TableCell>
//               <TableCell align="right">{row.carbs}</TableCell>
//               <TableCell align="right">{row.protein}</TableCell>
//             </TableRow>
//           ))} */}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }
// export default BasicTable;



