// import * as React from 'react';
// import Box from '@mui/material/Box';
// import { Card } from '@mui/material';
// import Checkbox from '@mui/material/Checkbox';
// import FormControlLabel from '@mui/material/FormControlLabel';

// export default function IndeterminateCheckbox() {
//   const [checked, setChecked] = React.useState([true, false]);

//   const handleChange1 = (event) => {
//     setChecked([event.target.checked, event.target.checked]);
//   };

//   const handleChange2 = (event) => {
//     setChecked([event.target.checked, checked[1]]);
//   };

//   const handleChange3 = (event) => {
//     setChecked([checked[0], event.target.checked[2]]);
//   };
//   const handleChange4 = (event) => {
//     setChecked([checked[1], event.target.checked[3]]);
//   };
//   const handleChange5 = (event) => {
//     setChecked([checked[2], event.target.checked[4]]);
//   };
//   const handleChange6 = (event) => {
//     setChecked([checked[3], event.target.checked[5]]);
//   };
//   const handleChange7 = (event) => {
//     setChecked([checked[4], event.target.checked]);
//   };
  

//   const children = (
//     <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
//       <FormControlLabel
//         label="Scrutiny fee deposited is in order or not."
//         control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
//       />
//       <FormControlLabel
//         label="25% of the licence fee deposited is in order or not."
//         control={<Checkbox checked={checked[1]} onChange={handleChange3} />}
//       />
//       <FormControlLabel
//         label="Documents submitted regarding the Financial position of the applicant/developer is in order or not."
//         control={<Checkbox checked={checked[2]} onChange={handleChange4} />}
//       />
//       <FormControlLabel
//         label="If the license application is under part migration/ migration, the parent license renewed/requisite renewal fee + applicable interest deposited is in order or not."
//         control={<Checkbox checked={checked[3]} onChange={handleChange5} />}
//       />
//       <FormControlLabel
//         label="25% of the licence fee deposited is in order or not."
//         control={<Checkbox checked={checked[4]} onChange={handleChange6} />}
//       />
//       <FormControlLabel
//         label="25% of the licence fee deposited is in order or not."
//         control={<Checkbox checked={checked[5]} onChange={handleChange7} />}
//       />
//     </Box>
//   );

//   return (
//     <Card>
//     <div>
//       <FormControlLabel
//         label="Parent"
//         control={
//           <Checkbox
//             checked={checked[0] && checked[1] && checked[2] && checked[3] && checked[4] && checked[5]}
//             indeterminate={checked[0] !== checked[1] !== checked[2] !== checked[3] !== checked[4]  !== checked[5]}
//             onChange={handleChange1}
//           />
//         }
//       />
//       {children}
//     </div>
//     </Card>
//   );
// }

import * as React from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';

export default function IndeterminateCheckbox() {
  const [state, setState] = React.useState({
    gilad: true,
    jason: false,
    antoine: false,
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const { gilad, jason, antoine } = state;
  const error = [gilad, jason, antoine].filter((v) => v).length !== 2;

  return (
    <Box sx={{ display: 'flex' }}>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend">Assign responsibility</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox checked={gilad} onChange={handleChange} name="gilad" />
            }
            label="Scrutiny fee deposited is in order or not."
          />
          <FormControlLabel
            control={
              <Checkbox checked={jason} onChange={handleChange} name="jason" />
            }
            label="25% of the licence fee deposited is in order or not."
          />
          <FormControlLabel
            control={
              <Checkbox checked={antoine} onChange={handleChange} name="antoine" />
            }
            label="Documents submitted regarding the Financial position of the applicant/developer is in order or not."
          />
        </FormGroup>
        <FormHelperText>Be careful</FormHelperText>
      </FormControl>
      {/* <FormControl
        required
        error={error}
        component="fieldset"
        sx={{ m: 3 }}
        variant="standard"
      >
        <FormLabel component="legend">Pick two</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox checked={gilad} onChange={handleChange} name="gilad" />
            }
            label="Gilad Gray"
          />
          <FormControlLabel
            control={
              <Checkbox checked={jason} onChange={handleChange} name="jason" />
            }
            label="Jason Killian"
          />
          <FormControlLabel
            control={
              <Checkbox checked={antoine} onChange={handleChange} name="antoine" />
            }
            label="Antoine Llorca"
          />
        </FormGroup>
        <FormHelperText>You can display an error</FormHelperText>
      </FormControl> */}
    </Box>
  );
}
