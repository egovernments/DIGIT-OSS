package org.egov.swagger.model;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;


import javax.validation.constraints.*;

/**
 * This is the column definition for the purpose of defining the search columns
 */


public class SearchColumn extends ColumnDetail {
    @JsonProperty("source")
    private String source = null;

    @JsonProperty("colName")
    private String colName = null;


    @JsonProperty("pattern")
    private String pattern = null;

    @JsonProperty("searchClause")
    private String searchClause = null;

    @JsonProperty("wrapper")
    private Boolean wrapper = false;

    @JsonProperty("stateData")
    private Boolean stateData = false;


    public Boolean getStateData() {
        return stateData;
    }

    public void setStateData(Boolean stateData) {
        this.stateData = stateData;
    }

    public Boolean getWrapper() {
        return wrapper;
    }

    public void setWrapper(Boolean wrapper) {
        this.wrapper = wrapper;
    }

    public String getSearchClause() {
        return searchClause;
    }

    public void setSearchClause(String searchClause) {
        this.searchClause = searchClause;
    }

    public SearchColumn source(String source) {
        this.source = source;
        return this;
    }

    /**
     * Table/Index path to which the column belongsor the URL from which to fecth the data if it is a singlevalue or multivalue list
     *
     * @return source
     **/

    @NotNull
    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public SearchColumn colName(String colName) {
        this.colName = colName;
        return this;
    }

    /**
     * column name in the table/index
     *
     * @return colName
     **/

    @NotNull
    public String getColName() {
        return colName;
    }

    public void setColName(String colName) {
        this.colName = colName;
    }


    public SearchColumn pattern(String pattern) {
        this.pattern = pattern;
        return this;
    }

    /**
     * 1. display format for the column - in case of epoch type datatypes.  2. In case of single/multivalue list this will be pipe separated url|keyJSONPath|valueJSONPath (URL to fetch the list values, jsonPath of the key value, jsonPath of what to display)   2.1 In case the URL wants the values to be statically defined as a list use list://pipe_separated_values! 3. In case the other datatype - this will be the parametarized URL that consumer can then use to call the next drill down/action - for drill down use _parent?key=value&key=value (where key would be name of additional params and value search value to construct new search params)
     *
     * @return pattern
     **/

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }


    @Override
    public boolean equals(java.lang.Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        SearchColumn searchColumn = (SearchColumn) o;
        return Objects.equals(this.source, searchColumn.source) &&
                Objects.equals(this.colName, searchColumn.colName) &&
                Objects.equals(this.pattern, searchColumn.pattern) &&
                super.equals(o);
    }

    @Override
    public int hashCode() {
        return Objects.hash(source, colName, pattern, super.hashCode());
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class SearchColumn {\n");
        sb.append("    ").append(toIndentedString(super.toString())).append("\n");
        sb.append("    source: ").append(toIndentedString(source)).append("\n");
        sb.append("    colName: ").append(toIndentedString(colName)).append("\n");
        sb.append("    pattern: ").append(toIndentedString(pattern)).append("\n");
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

