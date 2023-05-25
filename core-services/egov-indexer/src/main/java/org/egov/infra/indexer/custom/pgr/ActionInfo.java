package org.egov.infra.indexer.custom.pgr;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.validation.Valid;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Capture the details of action on service request.
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.languages.SpringCodegen", date = "2018-03-23T08:00:37.661Z")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ActionInfo   {
	
  @JsonProperty("uuid")
  private String uuid;
  
  @JsonProperty("tenantId")
  private String tenantId = null;

  @JsonProperty("by")
  private String by = null;

  @JsonProperty("isInternal")
  private Boolean isInternal = null;

  @JsonProperty("when")
  private Long when = null;

  @JsonProperty("businessKey")
  private String businessKey = null;

  @JsonProperty("action")
  private String action = null;

  @JsonProperty("status")
  private String status = null;

  @JsonProperty("assignee")
  private String assignee = null;

  @JsonProperty("media")
  @Valid
  private List<String> media = null;

  @JsonProperty("comments")
  private String comment = null;

  public String getUuid() {
	  return uuid;
  }
  
  public void setUuid(String uuid) {
	  this.uuid = uuid;
  }
  
  public ActionInfo tenantId(String tenantId) {
    this.tenantId = tenantId;
    return this;
  }

  /**
   * The unique identifier for Service - this is equivalent to jurisdiction_id in Open311. As the platform intends to be multi tenanted - this is always required
   * @return tenantId
  **/

@Size(min=2,max=50) 
  public String getTenantId() {
    return tenantId;
  }

  public void setTenantId(String tenantId) {
    this.tenantId = tenantId;
  }

  public ActionInfo by(String by) {
    this.by = by;
    return this;
  }

  /**
   * who made the Action Citizen/Employee, it's a combination of userid and role delimited by colon (ex- userid:citizen).
   * @return by
  **/


  public String getBy() {
    return by;
  }

  public void setBy(String by) {
    this.by = by;
  }

  public ActionInfo isInternal(Boolean isInternal) {
    this.isInternal = isInternal;
    return this;
  }

  /**
   * If employee is making an action with isInteral as true then server will not return that action info to citizen search result.
   * @return isInternal
  **/

  public Boolean getIsInternal() {
    return isInternal;
  }

  public void setIsInternal(Boolean isInternal) {
    this.isInternal = isInternal;
  }

  public ActionInfo when(Long when) {
    this.when = when;
    return this;
  }

  /**
   * epoch time of when the action made.
   * @return when
  **/

  public Long getWhen() {
    return when;
  }

  public void setWhen(Long when) {
    this.when = when;
  }

  public ActionInfo businessKey(String businessKey) {
    this.businessKey = businessKey;
    return this;
  }

  /**
   * The server generated unique ID of the service request.
   * @return businessKey
  **/

@Size(min=2,max=64) 
  public String getBusinessKey() {
    return businessKey;
  }

  public void setBusinessKey(String businessKey) {
    this.businessKey = businessKey;
  }

  public ActionInfo action(String action) {
    this.action = action;
    return this;
  }

  /**
   * Action will be Reject, Approve, Reassign, Forward.
   * @return action
  **/

  public String getAction() {
    return action;
  }

  public void setAction(String action) {
    this.action = action;
  }

  public ActionInfo status(String status) {
    this.status = status;
    return this;
  }

  /**
   * Each action will have a mapping with status at server side.
   * @return status
  **/

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public ActionInfo assignee(String assignee) {
    this.assignee = assignee;
    return this;
  }

  /**
   * user id of the employee to whom request id need to be assigne.
   * @return assignee
  **/

  public String getAssignee() {
    return assignee;
  }

  public void setAssignee(String assignee) {
    this.assignee = assignee;
  }

  public ActionInfo media(List<String> media) {
    this.media = media;
    return this;
  }

  public ActionInfo addMediaItem(String mediaItem) {
    if (this.media == null) {
      this.media = new ArrayList<String>();
    }
    this.media.add(mediaItem);
    return this;
  }

  /**
   * Get media
   * @return media
  **/

  public List<String> getMedia() {
    return media;
  }

  public void setMedia(List<String> media) {
    this.media = media;
  }

  public ActionInfo comment(String comment) {
    this.comment = comment;
    return this;
  }

  /**
   * Capture the comments made by Employee/Citizen.
   * @return comment
  **/

  public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ActionInfo actionInfo = (ActionInfo) o;
    return Objects.equals(this.tenantId, actionInfo.tenantId) &&
        Objects.equals(this.by, actionInfo.by) &&
        Objects.equals(this.isInternal, actionInfo.isInternal) &&
        Objects.equals(this.when, actionInfo.when) &&
        Objects.equals(this.businessKey, actionInfo.businessKey) &&
        Objects.equals(this.action, actionInfo.action) &&
        Objects.equals(this.status, actionInfo.status) &&
        Objects.equals(this.assignee, actionInfo.assignee) &&
        Objects.equals(this.media, actionInfo.media) &&
        Objects.equals(this.comment, actionInfo.comment);
  }

  @Override
  public int hashCode() {
    return Objects.hash(tenantId, by, isInternal, when, businessKey, action, status, assignee, media, comment);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ActionInfo {\n");
    
    sb.append("    tenantId: ").append(toIndentedString(tenantId)).append("\n");
    sb.append("    by: ").append(toIndentedString(by)).append("\n");
    sb.append("    isInternal: ").append(toIndentedString(isInternal)).append("\n");
    sb.append("    when: ").append(toIndentedString(when)).append("\n");
    sb.append("    businessKey: ").append(toIndentedString(businessKey)).append("\n");
    sb.append("    action: ").append(toIndentedString(action)).append("\n");
    sb.append("    status: ").append(toIndentedString(status)).append("\n");
    sb.append("    assignee: ").append(toIndentedString(assignee)).append("\n");
    sb.append("    media: ").append(toIndentedString(media)).append("\n");
    sb.append("    comment: ").append(toIndentedString(comment)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(java.lang.Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}

