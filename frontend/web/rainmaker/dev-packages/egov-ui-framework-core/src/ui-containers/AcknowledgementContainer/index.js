import React from "react";
import { AckHeader, AckBody, AckFooter } from "../../ui-atoms";
import "./index.css";

class AcknowledgementContainer extends React.Component {

	onclickFooter = (path)=>{
		window.location.href = `${document.location.origin}${path}`;
	}

	render() {
		const { ackHeader, ackBody, ackFooter } = this.props;

		return (
			<div className="common-div-css">
				<AckHeader {...ackHeader}/>
				<div className="card-container">
					<AckBody {...ackBody}/>
				</div>
				<div className="apply-wizard-footer">
					{
						ackFooter.map((config, index)=>{
							return <AckFooter 	
								key={`act-footer-${index}`}
								onClickFooter={this.onclickFooter}
								labelName={config.labelName}
								labeKey={config.labeKey}
								style={config.style}
								path={config.url}
							/>
						})
					}	
					
				</div>
			</div>
		);
	}
}
export default AcknowledgementContainer;