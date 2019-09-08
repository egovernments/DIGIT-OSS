package org.egov.infra.indexer.custom.pgr;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.validation.Valid;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Each Object of action History will point to the Service.
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.languages.SpringCodegen", date = "2018-03-23T08:00:37.661Z")

@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@ToString
public class ActionHistory   {
  @JsonProperty("actions")
  @Valid
  private List<ActionInfo> actions = null;

  public ActionHistory actions(List<ActionInfo> actions) {
    this.actions = actions;
    return this;
  }

  public ActionHistory addActionsItem(ActionInfo actionsItem) {
    if (this.actions == null) {
      this.actions = new ArrayList<ActionInfo>();
    }
    this.actions.add(actionsItem);
    return this;
  }

  /**
   * Get actions
   * @return actions
  **/
  @Valid

  public List<ActionInfo> getActions() {
    return actions;
  }

  public void setActions(List<ActionInfo> actions) {
    this.actions = actions;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ActionHistory actionHistory = (ActionHistory) o;
    return Objects.equals(this.actions, actionHistory.actions);
  }

  @Override
  public int hashCode() {
    return Objects.hash(actions);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ActionHistory {\n");
    
    sb.append("    actions: ").append(toIndentedString(actions)).append("\n");
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

