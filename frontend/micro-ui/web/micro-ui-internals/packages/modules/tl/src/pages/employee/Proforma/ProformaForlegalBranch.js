import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';





function createData(sno,name, color, capacity, fuel, price) {
	return { sno,name, color, capacity, fuel, price };
}

const rows = [
	createData(1, 'Scrutiny fee deposited is in order or not.', ),
	createData(2, '25% of the licence fee deposited is in order or not.',),
	createData(3, 'Documents submitted regarding the Financial position of the applicant/developer is in order or not.', ),
	createData(4, 'If the license application is under part migration/ migration, the parent license renewed/requisite renewal fee + applicable interest deposited is in order or not.', ),
	createData(5, 'If Case for Additional License, Outstanding Dues of parent license.', ),
	createData(6, 'Fee & Charges for LOI generation is in order or not', ),
	createData(7, 'Outstanding dues in other licenses of the Developer Company and its Board to Directors.', ),
];

export default function SimpleTable() {
	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>
							Sr.No
						</TableCell>
						<TableCell align="center">
                        Description
						</TableCell>
						<TableCell align="right">
						Action
						</TableCell>
						{/* <TableCell align="right">
							Remarks
						</TableCell> */}
						{/* <TableCell align="right">
							PRICE(Rs)
						</TableCell> */}
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<TableRow
							key={row.name}
							sx={{ '&:last-child td, &:last-child th':
								{ border: 0 } }}
						>
                            <TableCell component="th" scope="row">
								{row.sno}
							</TableCell>
							<TableCell component="th" scope="row">
								{row.name}
							</TableCell>
							<TableCell align="center">
                            <FormControl>
      {/* <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel> */}
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="Y" control={<Radio />} label="Yes" />
        <FormControlLabel value="N" control={<Radio />} label="No" />
        {/* <FormControlLabel value="other" control={<Radio />} label="Other" /> */}
        {/* <FormControlLabel
          value="disabled"
          disabled
          control={<Radio />}
          label="other"
        /> */}
      </RadioGroup>
    </FormControl>
							</TableCell>
                            
							<TableCell align="center">
                       
							</TableCell>
							{/* <TableCell align="right">
								{row.fuel}
							</TableCell>
							<TableCell align="right">
								{row.price}
							</TableCell> */}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
