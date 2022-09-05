
package org.egov.rn.service.dhis2.requests;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "orgUnit",
    "period",
    "form"
})
@Generated("jsonschema2pojo")
public class CampaginDataEntryRequest {

    @Override
    public String toString() {
        return "CampaginDataEntryRequest{" +
                "orgUnit='" + orgUnit + '\'' +
                ", period='" + period + '\'' +
                ", form=" + form +
                ", additionalProperties=" + additionalProperties +
                '}';
    }

    @JsonProperty("orgUnit")
    private String orgUnit;
    @JsonProperty("period")
    private String period;
    @JsonProperty("form")
    private List<Form> form = new ArrayList<Form>();
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    /**
     * No args constructor for use in serialization
     * 
     */
    public CampaginDataEntryRequest() {
    }

    /**
     * 
     * @param period
     * @param form
     * @param orgUnit
     */
    public CampaginDataEntryRequest(String orgUnit, String period, List<Form> form) {
        super();
        this.orgUnit = orgUnit;
        this.period = period;
        this.form = form;
    }

    @JsonProperty("orgUnit")
    public String getOrgUnit() {
        return orgUnit;
    }

    @JsonProperty("orgUnit")
    public void setOrgUnit(String orgUnit) {
        this.orgUnit = orgUnit;
    }

    public CampaginDataEntryRequest withOrgUnit(String orgUnit) {
        this.orgUnit = orgUnit;
        return this;
    }

    @JsonProperty("period")
    public String getPeriod() {
        return period;
    }

    @JsonProperty("period")
    public void setPeriod(String period) {
        this.period = period;
    }

    public CampaginDataEntryRequest withPeriod(String period) {
        this.period = period;
        return this;
    }

    @JsonProperty("form")
    public List<Form> getForm() {
        return form;
    }

    @JsonProperty("form")
    public void setForm(List<Form> form) {
        this.form = form;
    }

    public CampaginDataEntryRequest withForm(List<Form> form) {
        this.form = form;
        return this;
    }

    @JsonAnyGetter
    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    @JsonAnySetter
    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }

    public CampaginDataEntryRequest withAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
        return this;
    }

    public Dhis2DataEntryRequest getDhis2DataEntryRequest(String campaginId) {
        List<DataValue> dataValues = new ArrayList<DataValue>();
        this.getForm().forEach(form -> {
            DataValue dataValue = new DataValue();
            dataValue.setValue(form.getValue());
            dataValue.setDataSet(campaginId);
            dataValue.setComment(form.getComment());
            dataValue.setDataElement(form.getDataElement());
            dataValue.setPeriod(this.getPeriod());
            dataValue.setOrgUnit(this.getOrgUnit());
            dataValues.add(dataValue);
        });
        Dhis2DataEntryRequest dhis2DataEntryRequest = new Dhis2DataEntryRequest();
        dhis2DataEntryRequest.setDataValues(dataValues);
        return dhis2DataEntryRequest;
    }


}
