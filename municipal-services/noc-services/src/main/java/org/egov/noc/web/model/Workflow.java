package org.egov.noc.web.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * BPA application object to capture the details of land, land owners, and address of the land.
 */
@ApiModel(description = "BPA application object to capture the details of land, land owners, and address of the land.")
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-07-30T05:26:25.138Z[GMT]")
public class Workflow   {
  @SafeHtml
  @JsonProperty("action")
  private String action = null;

  @JsonProperty("assignes")
  @Valid
  private List<String> assignes = null;

  @SafeHtml
  @JsonProperty("comment")
  private String comment = null;

  @JsonProperty("documents")
  @Valid
  private List<Document> documents = null;

  public Workflow action(String action) {
    this.action = action;
    return this;
  }

  /**
   * Action on the application in certain
   * @return action
  **/
  @ApiModelProperty(value = "Action on the application in certain")
  
  @Size(min=1,max=64)   public String getAction() {
    return action;
  }

  public void setAction(String action) {
    this.action = action;
  }

  public Workflow assignes(List<String> assignes) {
    this.assignes = assignes;
    return this;
  }

  public Workflow addAssignesItem(String assignesItem) {
    if (this.assignes == null) {
      this.assignes = new ArrayList<String>();
    }
    this.assignes.add(assignesItem);
    return this;
  }

  /**
   * Get assignes
   * @return assignes
  **/
  @ApiModelProperty(value = "")
  
    public List<String> getAssignes() {
    return assignes;
  }

  public void setAssignes(List<String> assignes) {
    this.assignes = assignes;
  }

  public Workflow comment(String comment) {
    this.comment = comment;
    return this;
  }

  /**
   * Comment by actor.
   * @return comment
  **/
  @ApiModelProperty(value = "Comment by actor.")
  
  @Size(min=1,max=64)   public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }

  public Workflow documents(List<Document> documents) {
    this.documents = documents;
    return this;
  }

  public Workflow addDocumentsItem(Document documentsItem) {
    if (this.documents == null) {
      this.documents = new ArrayList<Document>();
    }
    this.documents.add(documentsItem);
    return this;
  }

  /**
   * Attach the workflow varification documents.
   * @return documents
  **/
  @ApiModelProperty(value = "Attach the workflow varification documents.")
      @Valid
    public List<Document> getDocuments() {
    return documents;
  }

  public void setDocuments(List<Document> documents) {
    this.documents = documents;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Workflow workflow = (Workflow) o;
    return Objects.equals(this.action, workflow.action) &&
        Objects.equals(this.assignes, workflow.assignes) &&
        Objects.equals(this.comment, workflow.comment) &&
        Objects.equals(this.documents, workflow.documents);
  }

  @Override
  public int hashCode() {
    return Objects.hash(action, assignes, comment, documents);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Workflow {\n");
    
    sb.append("    action: ").append(toIndentedString(action)).append("\n");
    sb.append("    assignes: ").append(toIndentedString(assignes)).append("\n");
    sb.append("    comment: ").append(toIndentedString(comment)).append("\n");
    sb.append("    documents: ").append(toIndentedString(documents)).append("\n");
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
