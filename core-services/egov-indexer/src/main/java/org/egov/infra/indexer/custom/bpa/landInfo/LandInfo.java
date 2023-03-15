package org.egov.infra.indexer.custom.bpa.landInfo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.egov.infra.indexer.custom.bpa.AuditDetails;
import org.egov.infra.indexer.custom.bpa.Document;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * LandInfo
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2020-06-23T05:52:32.717Z[GMT]")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LandInfo   {
  @JsonProperty("id")
  private String id = null;

  @JsonProperty("landUId")
  private String landUId = null;

  @JsonProperty("landUniqueRegNo")
  private String landUniqueRegNo = null;

  @JsonProperty("tenantId")
  private String tenantId = null;

  @JsonProperty("status")
  private Status status = null;

  @JsonProperty("address")
  private Address address = null;

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

    @Valid
    public AuditDetails getAuditDetails() {
    return auditDetails;
  }

  public void setAuditDetails(AuditDetails auditDetails) {
    this.auditDetails = auditDetails;
  }


  @Override
  public boolean equals(Object o) {
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
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}
