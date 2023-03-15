package org.egov.bpa.web.model.landInfo;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.egov.bpa.web.model.landInfo.Address;
import org.egov.bpa.web.model.AuditDetails;
import org.egov.bpa.web.model.landInfo.Channel;
import org.egov.bpa.web.model.Document;
import org.egov.bpa.web.model.landInfo.Institution;
import org.egov.bpa.web.model.landInfo.OwnerInfo;
import org.egov.bpa.web.model.landInfo.Source;
import org.egov.bpa.web.model.landInfo.Status;
import org.egov.bpa.web.model.landInfo.Unit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

import org.egov.bpa.web.model.AuditDetails.AuditDetailsBuilder;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * LandInfo
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-06-23T05:52:32.717Z[GMT]")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LandInfo   {
  @SafeHtml
  @JsonProperty("id")
  private String id = null;

  @SafeHtml
  @JsonProperty("landUId")
  private String landUId = null;

  @SafeHtml
  @JsonProperty("landUniqueRegNo")
  private String landUniqueRegNo = null;

  @SafeHtml
  @JsonProperty("tenantId")
  private String tenantId = null;

  @JsonProperty("status")
  private Status status = null;

  @JsonProperty("address")
  private Address address = null;

  @SafeHtml
  @JsonProperty("ownershipCategory")
  private String ownershipCategory = null;

  @JsonProperty("owners")
  @Valid
  private List<OwnerInfo> owners = new ArrayList<OwnerInfo>();

  @JsonProperty("institution")
  private Institution institution = null;

  @JsonProperty("source")
  private Source source = null;

  @JsonProperty("channel")
  private Channel channel = null;

  @JsonProperty("documents")
  @Valid
  private List<Document> documents = null;

  @JsonProperty("unit")
  @Valid
  private List<Unit> unit = null;

  @JsonProperty("additionalDetails")
  private Object additionalDetails = null;

  @JsonProperty("auditDetails")
  private AuditDetails auditDetails = null;

  public LandInfo id(String id) {
    this.id = id;
    return this;
  }

  /**
   * Unique Identifier(UUID) of the land for internal reference.
   * @return id
  **/
  @ApiModelProperty(readOnly = true, value = "Unique Identifier(UUID) of the land for internal reference.")
  
  @Size(min=1,max=64)   public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public LandInfo landUId(String landUId) {
    this.landUId = landUId;
    return this;
  }

  /**
   * Unique formatted Identifier of the Land.
   * @return landUId
  **/
  @ApiModelProperty(readOnly = true, value = "Unique formatted Identifier of the Land.")
  
  @Size(min=1,max=64)   public String getLandUId() {
    return landUId;
  }

  public void setLandUId(String landUId) {
    this.landUId = landUId;
  }

  public LandInfo landUniqueRegNo(String landUniqueRegNo) {
    this.landUniqueRegNo = landUniqueRegNo;
    return this;
  }

  /**
   * Unique Identifier of the Land in municipal departmrnt (eg. registration no, survey no etc).
   * @return landUniqueRegNo
  **/
  @ApiModelProperty(value = "Unique Identifier of the Land in municipal departmrnt (eg. registration no, survey no etc).")
  
  @Size(min=1,max=64)   public String getLandUniqueRegNo() {
    return landUniqueRegNo;
  }

  public void setLandUniqueRegNo(String landUniqueRegNo) {
    this.landUniqueRegNo = landUniqueRegNo;
  }

  public LandInfo tenantId(String tenantId) {
    this.tenantId = tenantId;
    return this;
  }

  /**
   * tenant id of the Property
   * @return tenantId
  **/
  @ApiModelProperty(required = true, value = "tenant id of the Property")
      @NotNull

  @Size(min=2,max=256)   public String getTenantId() {
    return tenantId;
  }

  public void setTenantId(String tenantId) {
    this.tenantId = tenantId;
  }

  public LandInfo status(Status status) {
    this.status = status;
    return this;
  }

  /**
   * Get status
   * @return status
  **/
  @ApiModelProperty(value = "")
  
    @Valid
    public Status getStatus() {
    return status;
  }

  public void setStatus(Status status) {
    this.status = status;
  }

  public LandInfo address(Address address) {
    this.address = address;
    return this;
  }

  /**
   * Get address
   * @return address
  **/
  @ApiModelProperty(required = true, value = "")
      @NotNull

    @Valid
    public Address getAddress() {
    return address;
  }

  public void setAddress(Address address) {
    this.address = address;
  }

  public LandInfo ownershipCategory(String ownershipCategory) {
    this.ownershipCategory = ownershipCategory;
    return this;
  }

  /**
   * The type of ownership of the property.
   * @return ownershipCategory
  **/
  @ApiModelProperty(value = "The type of ownership of the property.")
  
  @Size(max=64)   public String getOwnershipCategory() {
    return ownershipCategory;
  }

  public void setOwnershipCategory(String ownershipCategory) {
    this.ownershipCategory = ownershipCategory;
  }

  public LandInfo owners(List<OwnerInfo> owners) {
    this.owners = owners;
    return this;
  }

  public LandInfo addOwnersItem(OwnerInfo ownersItem) {
    this.owners.add(ownersItem);
    return this;
  }

  /**
   * Property owners, these will be citizen users in system.
   * @return owners
  **/
  @ApiModelProperty(required = true, value = "Property owners, these will be citizen users in system.")
      @NotNull
    @Valid
    public List<OwnerInfo> getOwners() {
    return owners;
  }

  public void setOwners(List<OwnerInfo> owners) {
    this.owners = owners;
  }

  public LandInfo institution(Institution institution) {
    this.institution = institution;
    return this;
  }

  /**
   * Get institution
   * @return institution
  **/
  @ApiModelProperty(value = "")
  
    @Valid
    public Institution getInstitution() {
    return institution;
  }

  public void setInstitution(Institution institution) {
    this.institution = institution;
  }

  public LandInfo source(Source source) {
    this.source = source;
    return this;
  }

  /**
   * Get source
   * @return source
  **/
  @ApiModelProperty(value = "")
  
    @Valid
    public Source getSource() {
    return source;
  }

  public void setSource(Source source) {
    this.source = source;
  }

  public LandInfo channel(Channel channel) {
    this.channel = channel;
    return this;
  }

  /**
   * Get channel
   * @return channel
  **/
  @ApiModelProperty(value = "")
  
    @Valid
    public Channel getChannel() {
    return channel;
  }

  public void setChannel(Channel channel) {
    this.channel = channel;
  }

  public LandInfo documents(List<Document> documents) {
    this.documents = documents;
    return this;
  }

  public LandInfo addDocumentsItem(Document documentsItem) {
    if (this.documents == null) {
      this.documents = new ArrayList<Document>();
    }
    this.documents.add(documentsItem);
    return this;
  }

  /**
   * Attach the documents.
   * @return documents
  **/
  @ApiModelProperty(value = "Attach the documents.")
      @Valid
    public List<Document> getDocuments() {
    return documents;
  }

  public void setDocuments(List<Document> documents) {
    this.documents = documents;
  }

  public LandInfo unit(List<Unit> unit) {
    this.unit = unit;
    return this;
  }

  public LandInfo addUnitItem(Unit unitItem) {
    if (this.unit == null) {
      this.unit = new ArrayList<Unit>();
    }
    this.unit.add(unitItem);
    return this;
  }

  /**
   * Unit details of the plot.
   * @return unit
  **/
  @ApiModelProperty(value = "Unit details of the plot.")
      @Valid
    public List<Unit> getUnit() {
    return unit;
  }

  public void setUnit(List<Unit> unit) {
    this.unit = unit;
  }

  public LandInfo additionalDetails(Object additionalDetails) {
    this.additionalDetails = additionalDetails;
    return this;
  }

  /**
   * The json to capturing the custom fields
   * @return additionalDetails
  **/
  @ApiModelProperty(value = "The json to capturing the custom fields")
  
    public Object getAdditionalDetails() {
    return additionalDetails;
  }

  public void setAdditionalDetails(Object additionalDetails) {
    this.additionalDetails = additionalDetails;
  }

  public LandInfo auditDetails(AuditDetails auditDetails) {
    this.auditDetails = auditDetails;
    return this;
  }

  /**
   * Get auditDetails
   * @return auditDetails
  **/
  @ApiModelProperty(value = "")
  
    @Valid
    public AuditDetails getAuditDetails() {
    return auditDetails;
  }

  public void setAuditDetails(AuditDetails auditDetails) {
    this.auditDetails = auditDetails;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    LandInfo landInfo = (LandInfo) o;
    return Objects.equals(this.id, landInfo.id) &&
        Objects.equals(this.landUId, landInfo.landUId) &&
        Objects.equals(this.landUniqueRegNo, landInfo.landUniqueRegNo) &&
        Objects.equals(this.tenantId, landInfo.tenantId) &&
        Objects.equals(this.status, landInfo.status) &&
        Objects.equals(this.address, landInfo.address) &&
        Objects.equals(this.ownershipCategory, landInfo.ownershipCategory) &&
        Objects.equals(this.owners, landInfo.owners) &&
        Objects.equals(this.institution, landInfo.institution) &&
        Objects.equals(this.source, landInfo.source) &&
        Objects.equals(this.channel, landInfo.channel) &&
        Objects.equals(this.documents, landInfo.documents) &&
        Objects.equals(this.unit, landInfo.unit) &&
        Objects.equals(this.additionalDetails, landInfo.additionalDetails) &&
        Objects.equals(this.auditDetails, landInfo.auditDetails);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, landUId, landUniqueRegNo, tenantId, status, address, ownershipCategory, owners, institution, source, channel, documents, unit, additionalDetails, auditDetails);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class LandInfo {\n");
    
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    landUId: ").append(toIndentedString(landUId)).append("\n");
    sb.append("    landUniqueRegNo: ").append(toIndentedString(landUniqueRegNo)).append("\n");
    sb.append("    tenantId: ").append(toIndentedString(tenantId)).append("\n");
    sb.append("    status: ").append(toIndentedString(status)).append("\n");
    sb.append("    address: ").append(toIndentedString(address)).append("\n");
    sb.append("    ownershipCategory: ").append(toIndentedString(ownershipCategory)).append("\n");
    sb.append("    owners: ").append(toIndentedString(owners)).append("\n");
    sb.append("    institution: ").append(toIndentedString(institution)).append("\n");
    sb.append("    source: ").append(toIndentedString(source)).append("\n");
    sb.append("    channel: ").append(toIndentedString(channel)).append("\n");
    sb.append("    documents: ").append(toIndentedString(documents)).append("\n");
    sb.append("    unit: ").append(toIndentedString(unit)).append("\n");
    sb.append("    additionalDetails: ").append(toIndentedString(additionalDetails)).append("\n");
    sb.append("    auditDetails: ").append(toIndentedString(auditDetails)).append("\n");
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
