package org.egov.swagger.model;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import org.egov.swagger.model.ColumnDef;

import javax.validation.constraints.*;

/**
 * ColumnDetail
 */
@javax.annotation.Generated(value = "io.swagger.codegen.languages.SpringCodegen", date = "2017-07-15T07:36:10.744Z")

public class ColumnDetail extends ColumnDef {

    public ColumnDetail() {

    }

    public ColumnDetail(Boolean showColumn, String label, TypeEnum type, Object defaultValue, Boolean total, String name, Boolean isLocalisationRequired, String localisationPrefix, Boolean isMandatory, String rowTotal, String columnTotal, String initialValue, String minValue, String maxValue) {

        super();
        this.showColumn = showColumn;
        this.label = label;
        this.type = type;
        this.defaultValue = defaultValue;
        this.total = total;
        this.name(name);
        this.isMandatory = isMandatory;
        this.rowTotal = rowTotal;
        this.columnTotal = columnTotal;
        this.initialValue = initialValue;
        this.maxValue = maxValue;
        this.minValue = minValue;
        this.isLocalisationRequired = isLocalisationRequired;
        this.localisationPrefix = localisationPrefix;
    }

    public String getRowTotal() {
        return rowTotal;
    }

    public void setRowTotal(String rowTotal) {
        this.rowTotal = rowTotal;
    }

    public String getColumnTotal() {
        return columnTotal;
    }

    public void setColumnTotal(String columnTotal) {
        this.columnTotal = columnTotal;
    }

    public ColumnDetail(String label, TypeEnum type, String name) {
        super();
        this.label = label;
        this.type = type;
        this.name(name);
    }

    public ColumnDetail(String label, TypeEnum type) {
        super();
        this.label = label;
        this.type = type;
    }

    @JsonProperty("label")
    private String label = null;

    /**
     * column type to help the consumer. EPOCH means time being carried over in epoch format, while date means time in given display format URL - will be used to indicate taht the column value is basically a URL to some other resource
     */
    public enum TypeEnum {
        NUMBER("number"),

        STRING("string"),

        DATE("date"),

        DATETIME("datetime"),

        CHECKBOX("checkbox"),

        EPOCH("epoch"),

        URL("url"),

        CURRENCY("currency"),

        SINGLEVALUELIST("singlevaluelist"),
        SINGLEVALUELISTAC("singlevaluelistac"),
        MULTIVALUELIST("multivaluelist"),
        MULTIVALUELISTAC("multivaluelistac"),
        BOUNDARYLIST("boundarylist"),

        STRINGARRAY("stringarray");

        private String value;

        TypeEnum(String value) {
            this.value = value;
        }

        @Override
        @JsonValue
        public String toString() {
            return String.valueOf(value);
        }

        @JsonCreator
        public static TypeEnum fromValue(String text) {
            for (TypeEnum b : TypeEnum.values()) {
                if (String.valueOf(b.value).equals(text)) {
                    return b;
                }
            }
            return null;
        }
    }

    @JsonProperty("type")
    private TypeEnum type = null;

    @JsonProperty("defaultValue")
    private Object defaultValue = null;

    @JsonProperty("isMandatory")
    private Boolean isMandatory = false;

    @JsonProperty("isLocalisationRequired")
    private Boolean isLocalisationRequired = false;

    @JsonProperty("localisationPrefix")
    private String localisationPrefix = "";

    @JsonProperty("showColumn")
    private Boolean showColumn = true;

    @JsonProperty("total")
    private Boolean total = false;

    @JsonProperty("rowTotal")
    private String rowTotal = null;

    @JsonProperty("columnTotal")
    private String columnTotal = null;

    @JsonProperty("initialValue")
    private String initialValue = null;

    @JsonProperty("minValue")
    private String minValue = null;

    @JsonProperty("maxValue")
    private String maxValue = null;


    public Boolean getTotal() {
        return total;
    }

    public void setTotal(Boolean total) {
        this.total = total;
    }

    public ColumnDetail label(String label) {
        this.label = label;
        return this;
    }

    /**
     * localization label for the column. In case label is not provided, name would be used as a label.
     *
     * @return label
     **/

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public ColumnDetail type(TypeEnum type) {
        this.type = type;
        return this;
    }

    /**
     * column type to help the consumer. EPOCH means time being carried over in epoch format, while date means time in given display format URL - will be used to indicate taht the column value is basically a URL to some other resource
     *
     * @return type
     **/

    @NotNull
    public TypeEnum getType() {
        return type;
    }

    public void setType(TypeEnum type) {
        this.type = type;
    }

    public ColumnDetail defaultValue(Object defaultValue) {
        this.defaultValue = defaultValue;
        return this;
    }

    /**
     * any default value for the column if the column type is number, string, date, datetime, epoch or URL collection contaning possible list value pairs for singlevaluelist and multivaluelist the parameterized next click URL in case of drill down - the value inside {} needs to be replaced with the actual value of the column with that name
     *
     * @return defaultValue
     **/

    public Object getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(Object defaultValue) {
        this.defaultValue = defaultValue;
    }

    public ColumnDetail isMandatory(Boolean isMandatory) {
        this.isMandatory = isMandatory;
        return this;
    }

    /**
     * Get isMandatory
     *
     * @return isMandatory
     **/

    public Boolean getIsMandatory() {
        return isMandatory;
    }

    public void setIsMandatory(Boolean isMandatory) {
        this.isMandatory = isMandatory;
    }

    public ColumnDetail showColumn(Boolean showColumn) {
        this.showColumn = showColumn;
        return this;
    }

    /**
     * whether to display the column value on the page, useful in cases like drill downs where teh value is needed for next search but is not meaningful to be shown to the user
     *
     * @return showColumn
     **/

    public Boolean getShowColumn() {
        return showColumn;
    }

    public void setShowColumn(Boolean showColumn) {
        this.showColumn = showColumn;
    }


    @Override
    public boolean equals(java.lang.Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ColumnDetail columnDetail = (ColumnDetail) o;
        return Objects.equals(this.label, columnDetail.label) &&
                Objects.equals(this.type, columnDetail.type) &&
                Objects.equals(this.defaultValue, columnDetail.defaultValue) &&
                Objects.equals(this.isMandatory, columnDetail.isMandatory) &&
                Objects.equals(this.showColumn, columnDetail.showColumn) &&
                super.equals(o);
    }

    @Override
    public int hashCode() {
        return Objects.hash(label, type, defaultValue, isMandatory, showColumn, super.hashCode());
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class ColumnDetail {\n");
        sb.append("    ").append(toIndentedString(super.toString())).append("\n");
        sb.append("    label: ").append(toIndentedString(label)).append("\n");
        sb.append("    type: ").append(toIndentedString(type)).append("\n");
        sb.append("    defaultValue: ").append(toIndentedString(defaultValue)).append("\n");
        sb.append("    isMandatory: ").append(toIndentedString(isMandatory)).append("\n");
        sb.append("    showColumn: ").append(toIndentedString(showColumn)).append("\n");
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

    public String getInitialValue() {
        return initialValue;
    }

    public void setInitialValue(String initialValue) {
        this.initialValue = initialValue;
    }

    public String getMinValue() {
        return minValue;
    }

    public void setMinValue(String minValue) {
        this.minValue = minValue;
    }

    public String getMaxValue() {
        return maxValue;
    }

    public void setMaxValue(String maxValue) {
        this.maxValue = maxValue;
    }

    public Boolean getLocalisationRequired() {
        return isLocalisationRequired;
    }

    public void setIsLocalisationRequired(Boolean isLocalisationRequired) {
        this.isLocalisationRequired = isLocalisationRequired;
    }

    public String getLocalisationPrefix() {
        return localisationPrefix;
    }
}
