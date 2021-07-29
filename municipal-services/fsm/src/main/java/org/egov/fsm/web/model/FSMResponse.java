package org.egov.fsm.web.model;

import java.util.List;
import java.util.Objects;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.egov.common.contract.response.ResponseInfo;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

/**
 * Response of the FSM
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-12-23T12:08:13.326Z[GMT]")

@Builder
@AllArgsConstructor
@NoArgsConstructor

public class FSMResponse   {
	
  @JsonProperty("totalCount")
  private Integer totalCount =null;
  
  @JsonProperty("responseInfo")
  private ResponseInfo responseInfo = null;

  @JsonProperty("fsm")
  private List<FSM> fsm = null;

  @JsonProperty("workflow")
  private Workflow workflow = null;

  public FSMResponse responseInfo(ResponseInfo responseInfo) {
    this.responseInfo = responseInfo;
    return this;
  }

  /**
   * Get responseInfo
   * @return responseInfo
   **/
      @NotNull

    @Valid
    public ResponseInfo getResponseInfo() {
    return responseInfo;
  }

  public void setResponseInfo(ResponseInfo responseInfo) {
    this.responseInfo = responseInfo;
  }

	public FSMResponse fsm(List<FSM> fsm) {
		this.fsm = fsm;
		return this;
	}

  /**
   * Get fsm
   * @return fsm
   **/
      @NotNull

    @Valid
    public List<FSM> getFsm() {
    return fsm;
  }

  public void setFsm(List<FSM> fsm) {
    this.fsm = fsm;
  }

  public FSMResponse workflow(Workflow workflow) {
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
    FSMResponse fsMResponse = (FSMResponse) o;
    return Objects.equals(this.responseInfo, fsMResponse.responseInfo) &&
        Objects.equals(this.fsm, fsMResponse.fsm) &&
        Objects.equals(this.workflow, fsMResponse.workflow);
  }

  @Override
  public int hashCode() {
    return Objects.hash(responseInfo, fsm, workflow);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class FSMResponse {\n");
    
    sb.append("    responseInfo: ").append(toIndentedString(responseInfo)).append("\n");
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

public Integer getTotalCount() {
	return totalCount;
}

public void setTotalCount(Integer totalCount) {
	this.totalCount = totalCount;
}
}
