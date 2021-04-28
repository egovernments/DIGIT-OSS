import React, { Component } from "react";
import Label from "egov-ui-kit/utils/translationNode";
import Card from "egov-ui-kit/components/Card";

import BreadCrumbs from "egov-ui-kit/components/BreadCrumbs";
import Divider from "egov-ui-kit/components/Divider";
import { connect } from "react-redux";
import { addBreadCrumbs } from "egov-ui-kit/redux/app/actions";
import "./index.css";
class PTExample extends Component {
  componentDidMount() {
    const { addBreadCrumbs, title } = this.props;
    title && addBreadCrumbs({ title: title, path: window.location.pathname });
  }
  render() {
    const { urls, history } = this.props;
    return (
      <div className="col-sm-12 blockBox">
        <BreadCrumbs url={urls} history={history} />
        <Card
          id="home-complaint-card"
          className="clearfix"
          textChildren={
            <div className="example-main-cont clearfix">
              <div className="col-sm-12 descriptionStyle">
                <Label label="PT_EXAMPLES_DESCRIPTION" />
                <div style={{ display: "flex" }}>
                  <a
                    // href={require("./PT_Corporation_Notification.pdf")}
                    target="_blank"
                  >
                    <Label label="PT_HERE_LABEL" color="#fe7a51" />
                  </a>
                  <Label
                    label="PT_CORPORATION_LABEL"
                    className="example-label-style"
                  />

                  <a
                    // href={require("./PT_Council_Notification.pdf")}
                    target="_blank"
                  >
                    <Label label="PT_HERE_LABEL" color="#fe7a51" />
                  </a>
                  <Label label="PT_COUNCIL_LABEL" />
                </div>
              </div>
              <div className="col-sm-12 dividerPTExample">
                <Divider />
              </div>
              <div className="col-sm-12 descriptionPTExample">
                <Label fontSize={16} label="CS_EXAMPLES_DESCRIPTION" />
              </div>
              <div className="col-sm-12 detailPart">
                <div className="col-12 detailTitlePTExample">
                  <Label label="CS_EXAMPLE_AREA" />
                </div>
                <div className="col-12 detailContentPTExample">
                  <div className="col-sm-12 blockBox">
                    <div className="col-sm-4 detailLeft">
                      <Label label="CS_EXAMPLES_SIZE" />
                    </div>
                    <div className="col-sm-8">
                      <Label label="CS_EXAMPLES_SIZE_VALUE" />
                    </div>
                  </div>
                  <div className="col-sm-12 blockBox">
                    <div className="col-sm-4 detailLeft">
                      <Label label="CS_EXAMPLES_FLOOR" />
                    </div>
                    <div className="col-sm-8">
                      <Label label="CS_EXAMPLES_FLOOR_VALUE" />
                    </div>
                  </div>
                  <div className="col-sm-12 blockBox">
                    <div className="col-sm-4 detailLeft">
                      <Label label="CS_EXAMPLES_LAND" />
                    </div>
                    <div className="col-sm-8">
                      <Label label="CS_EXAMPLES_LAND_VALUE" />
                    </div>
                  </div>
                  <div className="col-sm-12 block">
                    <div className="col-sm-4 detailLeft">
                      <Label label="CS_EXAMPLES_1ST_FLOOR" />
                    </div>
                    <div className="col-sm-8">
                      <Label label="CS_EXAMPLES_1ST_FLOOR_VALUE" />
                    </div>
                  </div>
                  <div className="col-sm-12 block">
                    <div className="col-sm-4 detailLeft">
                      <Label label="CS_EXAMPLES_PROPERTY_TAX" />
                    </div>
                    <div className="col-sm-8">
                      <Label label="CS_EXAMPLES_PROPERTY_TAX_VALUE1" />

                      <br />
                      <Label label="CS_EXAMPLES_PROPERTY_TAX_VALUE2" />
                      <br />
                      <Label label="CS_EXAMPLES_PROPERTY_TAX_VALUE3" />
                    </div>
                  </div>
                  <div className="col-sm-12 block">
                    <div className="col-sm-4 detailLeft">
                      <Label label="CS_EXAMPLES_NET_PROPERTY_TEX" />
                    </div>
                    <div className="col-sm-8">
                      <Label label="CS_EXAMPLES_NET_PROPERTY_TEX_VALUE" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 dividerPTExample">
                <Divider />
              </div>
              <div className="col-sm-12 detailPart">
                <div className="col-12 detailTitlePTExample">
                  <Label label="CS_EXAMPLES_FLAT" />
                </div>
                <div className="col-12 detailContentPTExample">
                  <div className="col-sm-12 block">
                    <div className="col-sm-4 detailLeft">
                      <Label label="CS_EXAMPLES_BUILTUP" />
                    </div>
                    <div className="col-sm-8">
                      <Label label="CS_EXAMPLES_BUILTUP_VALUE" />
                    </div>
                  </div>
                  <div className="col-sm-12 block">
                    <div className="col-sm-4 detailLeft">
                      {" "}
                      <Label label="CS_EXAMPLES_CALCUL" />
                    </div>
                    <div className="col-sm-8">
                      {" "}
                      <Label label="CS_EXAMPLES_CALCUL_VALUE" />
                    </div>
                  </div>
                  <div className="col-sm-12 block">
                    <div className="col-sm-4 detailLeft">
                      <Label label="CS_EXAMPLES_NET_PROPERTY_TEX1" />
                    </div>
                    <div className="col-sm-8">
                      <Label label="CS_EXAMPLES_NET_PROPERTY_TEX1_VALUE" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { app } = state;
  const { urls } = app;
  return { urls };
};

const mapDispatchToProps = dispatch => {
  return {
    addBreadCrumbs: url => dispatch(addBreadCrumbs(url))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PTExample);
