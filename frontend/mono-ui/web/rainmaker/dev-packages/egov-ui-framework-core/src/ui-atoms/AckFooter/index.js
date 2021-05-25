import React from "react";
import { LabelContainer } from "../../ui-containers";
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
const AckFooter = (props) => {
	const {
		style, labelName, labelKey, onClickFooter, path
	} = props;
	return (
		<Button className="apply-wizard-footer1" variant="outlined" color="primary" style={style} onClick={() => onClickFooter(path)}>
			<LabelContainer labelKey={labelKey} labelName={labelKey}/>
      	</Button>
	);
}
export default AckFooter;