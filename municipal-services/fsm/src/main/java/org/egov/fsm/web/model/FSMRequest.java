package org.egov.fsm.web.model;

import java.util.Objects;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.egov.common.contract.request.RequestInfo;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

/**
 * Request object for FSM
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-12-23T12:08:13.326Z[GMT]")

@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FSMRequest   {
  @JsonProperty("RequestInfo")
  private RequestInfo RequestInfo = null;

  @Valid
  @JsonProperty("fsm")
  private FSM fsm = null;

  @JsonProperty("workflow")
  private Workflow workflow = null;

  public FSMRequest requestInfo(RequestInfo requestInfo) {
    this.RequestInfo = requestInfo;
    return this;
  }

  /**
   * Get requestInfo
   * @return requestInfo
   **/
      @NotNull

    @Valid
    public RequestInfo getRequestInfo() {
    return RequestInfo;
  }

  public void setRequestInfo(RequestInfo requestInfo) {
    this.RequestInfo = requestInfo;
  }

  public FSMRequest fsm(FSM fsm) {
    this.fsm = fsm;
    return this;
  }

  /**
   * Get fsm
   * @return fsm
   **/
      @NotNull

    @Valid
    public FSM getFsm() {
    return fsm;
  }

  public void setFsm(FSM fsm) {
    this.fsm = fsm;
  }

  public FSMRequest workflow(Workflow workflow) {
    this.workflow = workflow;
    return this;
  }

  /**
   * Get workflow
   * @return workflow
   **/
  
    @Valid
    public Workflow getWorkflow() {
    return workflow;
  }

  public void setWorkflow(Workflow workflow) {
    this.workflow = workflow;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    FSMRequest fsMRequest = (FSMRequest) o;
    return Objects.equals(this.RequestInfo, fsMRequest.RequestInfo) &&
        Objects.equals(this.fsm, fsMRequest.fsm) &&
        Objects.equals(this.workflow, fsMRequest.workflow);
  }

  @Override
  public int hashCode() {
    return Objects.hash(RequestInfo, fsm, workflow);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class FSMRequest {\n");
    
    sb.append("    requestInfo: ").append(toIndentedString(RequestInfo)).append("\n");
    sb.append("    fsm: ").append(toIndentedString(fsm)).append("\n");
    sb.append("    workflow: ").append(toIndentedString(workflow)).append("\n");
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
