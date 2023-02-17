import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

 const MuiRadio = (props) => {

 
  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
      
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        {JSON.stringify(props?.options?.role)}
        {props?.options?.map((option, ind) => {
          <FormControlLabel value={option[props.optionsKey]} control={<Radio />} label={option.i18nKey} />
        })
        }
        
        {/* <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
        <FormControlLabel value="other" control={<Radio />} label="Other" /> */}
        
      </RadioGroup>
    </FormControl>
  );
}
 
export default MuiRadio;