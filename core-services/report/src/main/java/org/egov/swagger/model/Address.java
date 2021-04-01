package org.egov.swagger.model;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;

import javax.validation.constraints.*;


public class Address {
    @JsonProperty("tenantId")
    private String tenantId = null;

    @JsonProperty("latitude")
    private Double latitude = null;

    @JsonProperty("longitude")
    private Double longitude = null;

    @JsonProperty("addressId")
    private String addressId = null;

    @JsonProperty("addressNumber")
    private String addressNumber = null;

    @JsonProperty("addressLine1")
    private String addressLine1 = null;

    @JsonProperty("addressLine2")
    private String addressLine2 = null;

    @JsonProperty("landmark")
    private String landmark = null;

    @JsonProperty("city")
    private String city = null;

    @JsonProperty("pincode")
    private String pincode = null;

    @JsonProperty("detail")
    private String detail = null;

    public Address tenantId(String tenantId) {
        this.tenantId = tenantId;
        return this;
    }

    /**
     * Unique Identifier of the tenant to which user primarily belongs
     *
     * @return tenantId
     **/

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public Address latitude(Double latitude) {
        this.latitude = latitude;
        return this;
    }

    /**
     * latitude of the address
     *
     * @return latitude
     **/

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Address longitude(Double longitude) {
        this.longitude = longitude;
        return this;
    }

    /**
     * longitude of the address
     *
     * @return longitude
     **/

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Address addressId(String addressId) {
        this.addressId = addressId;
        return this;
    }

    /**
     * System generated id for the address
     *
     * @return addressId
     **/

    public String getAddressId() {
        return addressId;
    }

    public void setAddressId(String addressId) {
        this.addressId = addressId;
    }

    public Address addressNumber(String addressNumber) {
        this.addressNumber = addressNumber;
        return this;
    }

    /**
     * House, Door, Building number in the address
     *
     * @return addressNumber
     **/

    public String getAddressNumber() {
        return addressNumber;
    }

    public void setAddressNumber(String addressNumber) {
        this.addressNumber = addressNumber;
    }

    public Address addressLine1(String addressLine1) {
        this.addressLine1 = addressLine1;
        return this;
    }

    /**
     * Apartment, Block, Street of the address
     *
     * @return addressLine1
     **/

    public String getAddressLine1() {
        return addressLine1;
    }

    public void setAddressLine1(String addressLine1) {
        this.addressLine1 = addressLine1;
    }

    public Address addressLine2(String addressLine2) {
        this.addressLine2 = addressLine2;
        return this;
    }

    /**
     * Locality, Area, Zone, Ward of the address
     *
     * @return addressLine2
     **/

    public String getAddressLine2() {
        return addressLine2;
    }

    public void setAddressLine2(String addressLine2) {
        this.addressLine2 = addressLine2;
    }

    public Address landmark(String landmark) {
        this.landmark = landmark;
        return this;
    }

    /**
     * additional landmark to help locate the address
     *
     * @return landmark
     **/

    public String getLandmark() {
        return landmark;
    }

    public void setLandmark(String landmark) {
        this.landmark = landmark;
    }

    public Address city(String city) {
        this.city = city;
        return this;
    }

    /**
     * City of the address. Can be represented by the tenantid itself
     *
     * @return city
     **/

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Address pincode(String pincode) {
        this.pincode = pincode;
        return this;
    }

    /**
     * PIN code of the address. Indian pincodes will usually be all numbers.
     *
     * @return pincode
     **/

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public Address detail(String detail) {
        this.detail = detail;
        return this;
    }

    /**
     * more address detail as may be needed
     *
     * @return detail
     **/

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }


    @Override
    public boolean equals(java.lang.Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Address address = (Address) o;
        return Objects.equals(this.tenantId, address.tenantId) &&
                Objects.equals(this.latitude, address.latitude) &&
                Objects.equals(this.longitude, address.longitude) &&
                Objects.equals(this.addressId, address.addressId) &&
                Objects.equals(this.addressNumber, address.addressNumber) &&
                Objects.equals(this.addressLine1, address.addressLine1) &&
                Objects.equals(this.addressLine2, address.addressLine2) &&
                Objects.equals(this.landmark, address.landmark) &&
                Objects.equals(this.city, address.city) &&
                Objects.equals(this.pincode, address.pincode) &&
                Objects.equals(this.detail, address.detail);
    }

    @Override
    public int hashCode() {
        return Objects.hash(tenantId, latitude, longitude, addressId, addressNumber, addressLine1, addressLine2, landmark, city, pincode, detail);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class Address {\n");

        sb.append("    tenantId: ").append(toIndentedString(tenantId)).append("\n");
        sb.append("    latitude: ").append(toIndentedString(latitude)).append("\n");
        sb.append("    longitude: ").append(toIndentedString(longitude)).append("\n");
        sb.append("    addressId: ").append(toIndentedString(addressId)).append("\n");
        sb.append("    addressNumber: ").append(toIndentedString(addressNumber)).append("\n");
        sb.append("    addressLine1: ").append(toIndentedString(addressLine1)).append("\n");
        sb.append("    addressLine2: ").append(toIndentedString(addressLine2)).append("\n");
        sb.append("    landmark: ").append(toIndentedString(landmark)).append("\n");
        sb.append("    city: ").append(toIndentedString(city)).append("\n");
        sb.append("    pincode: ").append(toIndentedString(pincode)).append("\n");
        sb.append("    detail: ").append(toIndentedString(detail)).append("\n");
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

