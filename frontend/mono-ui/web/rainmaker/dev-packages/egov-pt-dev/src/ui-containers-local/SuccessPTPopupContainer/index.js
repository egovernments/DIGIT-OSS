import { Dialog, DialogContent } from "@material-ui/core";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { setRoute } from "egov-ui-kit/redux/app/actions";
import get from "lodash/get";
import React from "react";
import { connect } from "react-redux";
import Icon from "@material-ui/core/Icon";

const circlebuttonStyle = {
  width: "80px",
  height: "100px",
  color: "green"
};

class SuccessPTPopupContainer extends React.Component {
  handleClose = () => {
    const { screenKey, handleField, setRoute, redirectUrl } = this.props;
    handleField(
      screenKey,
      `components.adhocDialog`,
      "props.open",
      false
    );
    if (redirectUrl) {
      setRoute(redirectUrl);
    }
  };
  

  render() {
    const { open, maxWidth, children } = this.props;
    return (
      <Dialog open={open} maxWidth={maxWidth} onClose={this.handleClose} DisableBackdropClick={true}>
        <DialogContent children={[
        		<div style= {{ color: "black" }} >
				<h1 style= {{ margin: "0px 0px 25px 0px" }}> 
					<LabelContainer
            					labelName={"Property Created Successfully"}
            					labelKey={"PT_COMMON_PROPERTY_CREATED_SUCCESSFULLY"}
            				/> 
            			</h1>
				<div style= {{ height: "100px" }} >
					<div style={{ height: "100px", float : "left" }}>
						 <Icon style={circlebuttonStyle}><i style={{ fontSize : '75px' }} class="material-icons">check_circle</i></Icon>
					</div>
					<div style= {{ height: "100px", color: "black", paddingTop:'1px'}}>
			    			<h3 style={{ margin : "10px 0px"}}>
			    				<LabelContainer
			    					labelName={"Property Registered Successfully!"}
			    					labelKey={"PT_COMMON_PROPERTY_REGISTERED_SUCCESSFULLY"}
			    				/> 
			    			</h3>
			    			<p style= {{ color: "black"}}>
			    				<LabelContainer
			    					labelName={"Redirecting to Water & Sewerage Application"}
			    					labelKey={"PT_COMMON_REDIRECTING_TO_WATER_&_SEWERAGE_APPLICATION"}
			    				/> 
			    			</p>
			 	 	</div>    
				</div>        
		      </div>        	
        ]}/>
      </Dialog>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const { screenKey } = ownProps;
  const { screenConfig } = screenConfiguration;
  const open = get(
    screenConfig,
    `${screenKey}.components.adhocDialog.props.open`
  );

  return {
    open,
    screenKey,
    screenConfig
  };
};

const mapDispatchToProps = dispatch => {
  return { handleField: (a, b, c, d) => dispatch(handleField(a, b, c, d)), setRoute: (route) => dispatch(setRoute(route)), };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SuccessPTPopupContainer);
