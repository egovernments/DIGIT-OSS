package org.egov.tl.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.hibernate.validator.constraints.SafeHtml;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class Institution {

  @Size(max=64)
  @SafeHtml
  @JsonProperty("id")
  private String id;

  @Size(max=256)
  @SafeHtml
  @JsonProperty("tenantId")
  private String tenantId;

  @Size(max=64)
  @SafeHtml
  @JsonProperty("name")
  private String name;

  @Size(max=64)
  @SafeHtml
  @JsonProperty("type")
  private String type;

  @Size(max=64)
  @SafeHtml
  @JsonProperty("designation")
  private String designation;

  @JsonProperty("active")
  private Boolean active = null;

  @Size(max=256)
  @SafeHtml
  @JsonProperty("instituionName")
  private String instituionName;

  @Size(max=64)
  @SafeHtml
  @JsonProperty("contactNo")
  private String contactNo;


  @Size(max=64)
  @SafeHtml
  @JsonProperty("organisationRegistrationNo")
  private String organisationRegistrationNo;

  @Size(max=512)
  @SafeHtml
  @JsonProperty("address")
  private String address;
}
