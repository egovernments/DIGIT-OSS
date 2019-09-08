package org.egov.pt.calculator.web.models.property;

import java.util.Objects;

import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Rebate
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.languages.SpringCodegen", date = "2018-07-04T08:40:17.507Z")

public class Rebate   {
  @JsonProperty("rate")
  private Double rate = null;

  @JsonProperty("maxAmount")
  private Double maxAmount = null;

  @JsonProperty("flatAmount")
  private Double flatAmount = null;

  @JsonProperty("fromFY")
  private String fromFY = null;

  @JsonProperty("endDate")
  private String endDate = null;

  public Rebate rate(Double rate) {
    this.rate = rate;
    return this;
  }

  /**
   * Exemption rate in percentage.
   * @return rate
  **/

  public Double getRate() {
    return rate;
  }

  public void setRate(Double rate) {
    this.rate = rate;
  }

  public Rebate maxAmount(Double maxAmount) {
    this.maxAmount = maxAmount;
    return this;
  }

  /**
   * Maximum exemption amount, it is applicable if exemption are applied using exemptionRate.
   * @return maxAmount
  **/

  public Double getMaxAmount() {
    return maxAmount;
  }

  public void setMaxAmount(Double maxAmount) {
    this.maxAmount = maxAmount;
  }

  public Rebate flatAmount(Double flatAmount) {
    this.flatAmount = flatAmount;
    return this;
  }

  /**
   * exemption in Flat amount incase of absence of rate.
   * @return flatAmount
  **/


  public Double getFlatAmount() {
    return flatAmount;
  }

  public void setFlatAmount(Double flatAmount) {
    this.flatAmount = flatAmount;
  }

  public Rebate fromFY(String fromFY) {
    this.fromFY = fromFY;
    return this;
  }

  /**
   * Exemption are applicable from the defined financial year.
   * @return fromFY
  **/

@Size(min=2,max=128) 
  public String getFromFY() {
    return fromFY;
  }

  public void setFromFY(String fromFY) {
    this.fromFY = fromFY;
  }

  public Rebate endDate(String endDate) {
    this.endDate = endDate;
    return this;
  }

  /**
   * this is the rebate end date, this will be date and month.
   * @return endDate
  **/

  public String getEndDate() {
    return endDate;
  }

  public void setEndDate(String endDate) {
    this.endDate = endDate;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Rebate rebate = (Rebate) o;
    return Objects.equals(this.rate, rebate.rate) &&
        Objects.equals(this.maxAmount, rebate.maxAmount) &&
        Objects.equals(this.flatAmount, rebate.flatAmount) &&
        Objects.equals(this.fromFY, rebate.fromFY) &&
        Objects.equals(this.endDate, rebate.endDate);
  }

  @Override
  public int hashCode() {
    return Objects.hash(rate, maxAmount, flatAmount, fromFY, endDate);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Rebate {\n");
    
    sb.append("    rate: ").append(toIndentedString(rate)).append("\n");
    sb.append("    maxAmount: ").append(toIndentedString(maxAmount)).append("\n");
    sb.append("    flatAmount: ").append(toIndentedString(flatAmount)).append("\n");
    sb.append("    fromFY: ").append(toIndentedString(fromFY)).append("\n");
    sb.append("    endDate: ").append(toIndentedString(endDate)).append("\n");
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

