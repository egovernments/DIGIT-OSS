
package org.egov.rn.service.dhis2.responses;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "imported",
    "updated",
    "ignored",
    "deleted"
})
@Generated("jsonschema2pojo")
public class ImportCount {

    @JsonProperty("imported")
    private int imported;
    @JsonProperty("updated")
    private int updated;
    @JsonProperty("ignored")
    private int ignored;
    @JsonProperty("deleted")
    private int deleted;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    /**
     * No args constructor for use in serialization
     * 
     */
    public ImportCount() {
    }

    /**
     * 
     * @param ignored
     * @param deleted
     * @param imported
     * @param updated
     */
    public ImportCount(int imported, int updated, int ignored, int deleted) {
        super();
        this.imported = imported;
        this.updated = updated;
        this.ignored = ignored;
        this.deleted = deleted;
    }

    @JsonProperty("imported")
    public int getImported() {
        return imported;
    }

    @JsonProperty("imported")
    public void setImported(int imported) {
        this.imported = imported;
    }

    public ImportCount withImported(int imported) {
        this.imported = imported;
        return this;
    }

    @JsonProperty("updated")
    public int getUpdated() {
        return updated;
    }

    @JsonProperty("updated")
    public void setUpdated(int updated) {
        this.updated = updated;
    }

    public ImportCount withUpdated(int updated) {
        this.updated = updated;
        return this;
    }

    @JsonProperty("ignored")
    public int getIgnored() {
        return ignored;
    }

    @JsonProperty("ignored")
    public void setIgnored(int ignored) {
        this.ignored = ignored;
    }

    public ImportCount withIgnored(int ignored) {
        this.ignored = ignored;
        return this;
    }

    @JsonProperty("deleted")
    public int getDeleted() {
        return deleted;
    }

    @JsonProperty("deleted")
    public void setDeleted(int deleted) {
        this.deleted = deleted;
    }

    public ImportCount withDeleted(int deleted) {
        this.deleted = deleted;
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

    public ImportCount withAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
        return this;
    }

}
