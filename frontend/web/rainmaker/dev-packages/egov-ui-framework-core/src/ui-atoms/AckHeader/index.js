import React from "react";
import "./index.css";
import { LabelContainer } from "../../ui-containers";
import { DownloadPrintButton } from "../../ui-molecules";
import { ApplicationNumber } from "../../ui-atoms";
import { Typography } from '@material-ui/core';

const AckHeader = (props) => {
	const { 
		downloadButton = false, 
		printButton = false, 
		labelName, 
		labelKey, 
		applicationNumber, 
		downloadButtonProps, 
		printButtonProps,
		downloadPrintContainerClass 
	} = props;
	return (
		<div className="">
			<div className="flex-container" >
				<Typography variant="headline">
					<LabelContainer labelKey={labelKey} labelName={labelName}></LabelContainer>
				</Typography>
				<ApplicationNumber number={applicationNumber}></ApplicationNumber>
			</div>
			<div className={`${downloadPrintContainerClass} flex-box`}>
				{downloadButton && <DownloadPrintButton data={downloadButtonProps} />}
				{printButton && <DownloadPrintButton data={printButtonProps} />}
			</div>
		</div>
	);
}

export default AckHeader;
