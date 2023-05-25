import React from "react";
import Avatar from "material-ui/Avatar";
import { Typography } from '@material-ui/core';
import { LabelContainer } from "../../ui-containers";
import "./index.css";
import { Icon } from "../../ui-atoms";

const styles = {
	tailText: {
		color: "rgba(0, 0, 0, 0.6000000238418579)",
		fontSize: 16,
		fontWeight: 400
	},
	tailNumber: {
		fontSize: 24,
		fontWeight: 500
	},
	tailBox: {
		textAlign: "right",
		justifyContent: "center",
		flex: 1
	}
}

const AckBody = (props) => {
	const {
		iconStyle,
		iconName,
		iconSize,
		headerLabelName,
		headerLabelKey,
		paragragraphStyle,
		paragraphLableName,
		paragraphLabelKey,
		tailText,
		tailNumber,
	} = props;
	return (
		<div className="ack-header">
			<div> 
				<Avatar className={iconName === 'done' ? "ack-icon" : "ack-icon-failure" }>
				<Icon style={iconStyle} iconName={iconName} iconSize={iconSize}>

				</Icon>
			</Avatar>
			</div>
		
			<div className="ack-body">
				<Typography variant="headline">
					<LabelContainer labelName={headerLabelName} labelKey={headerLabelKey}></LabelContainer>
				</Typography>
				<div style={paragragraphStyle}>
					<LabelContainer labelName={paragraphLableName} labelKey={paragraphLabelKey}></LabelContainer>
				</div>
			</div>	
			{tailText && (
				<div className="ack-text">
					<Typography variant="headline" style={styles.tailText}>
						<LabelContainer labelName={tailText.labelName} labelKey={tailText.labelKey}></LabelContainer>
					</Typography>
					<Typography variant="headline" style={styles.tailNumber}>
						<LabelContainer labelName={tailNumber} labelKey={tailNumber}></LabelContainer>
					</Typography>
				</div>
			)}
		</div>
	);
}
export default AckBody;