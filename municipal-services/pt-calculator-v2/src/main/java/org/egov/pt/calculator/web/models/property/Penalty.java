package org.egov.pt.calculator.web.models.property;

import java.util.Objects;

import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Penalty
 */

public class Penalty   {
  @JsonProperty("rate")
  private Double rate = null;

  @JsonProperty("minAmount")
  private Double minAmount = null;

  @JsonProperty("flatAmount")
  private Double flatAmount = null;

  @JsonProperty("fromFY")
  private String fromFY = null;

  @JsonProperty("startDate")
  private String startDate = null;

  public Penalty rate(Double rate) {
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

  public Penalty minAmount(Double minAmount) {
    this.minAmount = minAmount;
    return this;
  }

  /**
   * Maximum exemption amount, it is applicable if exemption are applied using exemptionRate.
   * @return minAmount
  **/

  public Double getMinAmount() {
    return minAmount;
  }

  public void setMinAmount(Double minAmount) {
    this.minAmount = minAmount;
  }

  public Penalty flatAmount(Double flatAmount) {
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

  public Penalty fromFY(String fromFY) {
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

  public Penalty startDate(String startDate) {
    this.startDate = startDate;
    return this;
  }

  /**
   * this is the rebate end date, this will be date and month.
   * @return startDate
  **/

  public String getStartDate() {
    return startDate;
  }

  public void setStartDate(String startDate) {
    this.startDate = startDate;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Penalty penalty = (Penalty) o;
    return Objects.equals(this.rate, penalty.rate) &&
        Objects.equals(this.minAmount, penalty.minAmount) &&
        Objects.equals(this.flatAmount, penalty.flatAmount) &&
        Objects.equals(this.fromFY, penalty.fromFY) &&
        Objects.equals(this.startDate, penalty.startDate);
  }

  @Override
  public int hashCode() {
    return Objects.hash(rate, minAmount, flatAmount, fromFY, startDate);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Penalty {\n");
    
    sb.append("    rate: ").append(toIndentedString(rate)).append("\n");
    sb.append("    minAmount: ").append(toIndentedString(minAmount)).append("\n");
    sb.append("    flatAmount: ").append(toIndentedString(flatAmount)).append("\n");
    sb.append("    fromFY: ").append(toIndentedString(fromFY)).append("\n");
    sb.append("    startDate: ").append(toIndentedString(startDate)).append("\n");
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

