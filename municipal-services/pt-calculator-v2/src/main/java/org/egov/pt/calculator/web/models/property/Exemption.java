package org.egov.pt.calculator.web.models.property;

import java.util.Objects;

import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonProperty;


/**
 * Exemption
 */

public class Exemption   {
  @JsonProperty("isEnabled")
  private Boolean isEnabled = null;

  @JsonProperty("rate")
  private Double rate = null;

  @JsonProperty("maxAmount")
  private Double maxAmount = null;

  @JsonProperty("flatAmount")
  private Double flatAmount = null;

  @JsonProperty("fromFY")
  private String fromFY = null;

  public Exemption isEnabled(Boolean isEnabled) {
    this.isEnabled = isEnabled;
    return this;
  }

  /**
   * if Exemption are applicable, the value will be true.
   * @return isEnabled
  **/


  public Boolean isIsEnabled() {
    return isEnabled;
  }

  public void setIsEnabled(Boolean isEnabled) {
    this.isEnabled = isEnabled;
  }

  public Exemption rate(Double rate) {
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

  public Exemption maxAmount(Double maxAmount) {
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

  public Exemption flatAmount(Double flatAmount) {
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

  public Exemption fromFY(String fromFY) {
    this.fromFY = fromFY;
    return this;
  }

  /**
   * Exemption are applicable from the defined date.
   * @return fromFY
  **/

@Size(min=2,max=128) 
  public String getFromFY() {
    return fromFY;
  }

  public void setFromFY(String fromFY) {
    this.fromFY = fromFY;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Exemption exemption = (Exemption) o;
    return Objects.equals(this.isEnabled, exemption.isEnabled) &&
        Objects.equals(this.rate, exemption.rate) &&
        Objects.equals(this.maxAmount, exemption.maxAmount) &&
        Objects.equals(this.flatAmount, exemption.flatAmount) &&
        Objects.equals(this.fromFY, exemption.fromFY);
  }

  @Override
  public int hashCode() {
    return Objects.hash(isEnabled, rate, maxAmount, flatAmount, fromFY);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Exemption {\n");
    
    sb.append("    isEnabled: ").append(toIndentedString(isEnabled)).append("\n");
    sb.append("    rate: ").append(toIndentedString(rate)).append("\n");
    sb.append("    maxAmount: ").append(toIndentedString(maxAmount)).append("\n");
    sb.append("    flatAmount: ").append(toIndentedString(flatAmount)).append("\n");
    sb.append("    fromFY: ").append(toIndentedString(fromFY)).append("\n");
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

