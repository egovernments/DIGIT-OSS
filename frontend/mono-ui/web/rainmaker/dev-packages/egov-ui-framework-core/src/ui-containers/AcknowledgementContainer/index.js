import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { AckHeader, AckBody, AckFooter } from "../../ui-atoms";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import "./index.css";

class AcknowledgementContainer extends React.Component {

	onclickFooter = (path)=>{
		path &&	this.props.setRoute(path);
	}

	render() {
		const { header, body, footer } = this.props;

		return (
			<div className="common-div-css">
				<AckHeader {...header}/>
				<div className="card-container">
					<AckBody {...body}/>
				</div>
				<div className="apply-wizard-footer">
					{
						footer.map((config, index)=>{
							return <AckFooter 	
								key={`act-footer-${index}`}
								onClickFooter={this.onclickFooter}
								labelName={config.labelName}
								labelKey={config.labelKey}
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

const mapDispatchToProps = dispatch => {
	return {
		setRoute: route => dispatch(setRoute(route))
	};
  };

export default connect(
	null,
	mapDispatchToProps
  )(withRouter(AcknowledgementContainer));