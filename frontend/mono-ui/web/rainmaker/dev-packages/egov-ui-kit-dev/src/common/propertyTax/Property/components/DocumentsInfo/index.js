import React, { Component } from "react";
import { Card } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import DownloadFileContainer from "../../../../common/DownloadFileContainer";

class DocumentsInfo extends Component {
  render() {
    const { documentsUploaded, editIcon } = this.props;

    const header = "PT_COMMON_DOCS";
    return (
      <Card
        style={{ backgroundColor: "rgb(242, 242, 242)", boxShadow: "none" }}
        textChildren={
          <div>
            <div className="pt-rf-title rainmaker-displayInline" style={{ justifyContent: "space-between", margin: "5px 0px 5px 0px" }}>
              <div className="rainmaker-displayInline" style={{ alignItems: "center", marginLeft: "13px" }}>
                {header && (
                  <Label
                    labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.87)", fontWeight: "400", lineHeight: "19px" }}
                    label={header}
                    fontSize="18px"
                  />
                )}
              </div>
              {{ editIcon } && <span style={{ alignItems: "right" }}>{editIcon}</span>}
            </div>
            <div style={{ margin: "15px" }}>
              <DownloadFileContainer data={documentsUploaded}></DownloadFileContainer>
            </div>
          </div>
        }
      />
    );
  }
}

export default DocumentsInfo;
