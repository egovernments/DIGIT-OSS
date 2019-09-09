import React, { Component } from "react";
import { connect } from "react-redux";
import formHoc from "hocs/form";
import { Card, List, Icon, Image } from "components";
import Label from "utils/translationNode";
import WriteComment from "../WriteComment";
import Avatar from "material-ui/Avatar";
import emptyFace from "assets/images/download.png";
import { getDateFromEpoch, getPropertyFromObj } from "utils/commons";
import isEqual from "lodash/isEqual";
import "./index.css";
import { transformById } from "utils/commons";

const imageStyles = {
  width: "33px",
  height: "33px",
  marginRight: "8px",
};

const WriteCommentHOC = formHoc({ formKey: "comment" })(WriteComment);

class Comments extends Component {
  render() {
    const { selectedComplaint, userImage, userId, userName, role, isAssignedToEmployee, transformedCommentList } = this.props;

    const items =
      transformedCommentList &&
      transformedCommentList.map((comment, index) => {
        if (comment.role === "Citizen") {
          return {
            leftAvatar: (
              <div>
                <Image style={imageStyles} className="img-circle" size="medium" source={comment.avatar ? comment.avatar : emptyFace} />
              </div>
            ),
            primaryText: (
              <div className="complaint-details-comments-section">
                <Label containerStyle={{ marginBottom: "6px" }} fontSize="10px" label={comment.name ? comment.name : ""} />
                <Label containerStyle={{ marginBottom: "6px" }} labelStyle={{ color: "#767676" }} label={comment.comment} />
                <Label labelClassName="text-right" fontSize="10px" label={getDateFromEpoch(comment.when)} />
              </div>
            ),
          };
        } else {
          return {
            primaryText: (
              <div className="complaint-details-comments-section" style={{ marginRight: "6px" }}>
                <Label containerStyle={{ marginBottom: "6px" }} fontSize="10px" label={comment.name ? comment.name : ""} />
                <Label containerStyle={{ marginBottom: "6px" }} labelStyle={{ color: "#767676" }} label={comment.comment} />
                <Label labelClassName="text-right" fontSize="10px" label={getDateFromEpoch(comment.when)} />
              </div>
            ),

            rightAvatar: (
              <div>
                <Image style={imageStyles} className="img-circle" size="medium" source={comment.avatar ? comment.avatar : emptyFace} />
              </div>
            ),
          };
        }
      });
    let status =
      selectedComplaint &&
      selectedComplaint.actions.filter((action, index) => {
        return action.status;
      });
    let currentstatus = status && status[0].status && status[0].status.toLowerCase();
    return (
      <div>
        {this.props.hasComments || (currentstatus && currentstatus.toLowerCase() !== "closed") ? (
          <Card
            style={{
              paddingBottom: "0px",
            }}
            textChildren={
              <div>
                <div className="rainmaker-displayInline">
                  <Icon action="communication" name="forum" color="#767676" />
                  <Label label="CS_COMMON_COMMENTS" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
                </div>
                <List
                  listContainerStyle={{ marginTop: "24px", background: "transparent" }}
                  listItemStyle={{ marginBottom: "-8.5px" }}
                  items={items}
                />

                {(isAssignedToEmployee && role === "employee") || role === "citizen" || role === "ao"
                  ? currentstatus &&
                    currentstatus.toLowerCase() !== "closed" && <WriteCommentHOC userImage={userImage} currentstatus={currentstatus} />
                  : ""}
              </div>
            }
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { complaints, common } = state;
  const { employeeById, citizenById } = common;
  let selectedComplaint = complaints["byId"][decodeURIComponent(window.location.href.split("/").pop())];
  let commentList =
    selectedComplaint &&
    selectedComplaint.actions.filter((action, index) => {
      return action.comments && !action.status;
    });
  commentList && commentList.reverse();
  const transformedCommentList =
    commentList &&
    commentList.map((comment, commentIndex) => {
      let role = comment.by.split(":")[1];
      let id = comment.by.split(":")[0];
      return {
        role,
        avatar: role === "Citizen" ? getPropertyFromObj(citizenById, id, "photo", "") : getPropertyFromObj(employeeById, id, "photo", ""),
        name: role === "Citizen" ? getPropertyFromObj(citizenById, id, "name", "") : getPropertyFromObj(employeeById, id, "name", ""),
        comment: comment.comments,
        when: comment.when,
      };
    });

  const hasComments = transformedCommentList && transformedCommentList.length ? true : false;
  const userImage = state.auth.userInfo.photo || "";
  const userId = state.auth.userInfo.id || "";
  const userName = state.auth.userInfo.name || "";
  return { selectedComplaint, userImage, userId, userName, transformedCommentList, hasComments };
};

export default connect(mapStateToProps)(Comments);
