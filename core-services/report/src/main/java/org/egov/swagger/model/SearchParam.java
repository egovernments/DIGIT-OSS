package org.egov.swagger.model;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;

import javax.validation.constraints.*;

/**
 * SearchParam
 */


public class SearchParam extends ColumnDef {
    @JsonProperty("input")
    private Object input = null;


    public SearchParam input(Object input) {
        this.input = input;
        return this;
    }

    /**
     * User provided input of this parameter that will be used in query. Please note that value will be format checked against the value definition of this parameter in report definition. This field has been made an object so that multiple values from things like multivalue list can be accepted.
     *
     * @return input
     **/

    public Object getInput() {
        return input;
    }

    public void setInput(Object input) {
        this.input = input;
    }

    @Override
    public boolean equals(java.lang.Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        SearchParam searchParam = (SearchParam) o;
        return Objects.equals(this.input, searchParam.input) &&
                super.equals(o);
    }

    @Override
    public int hashCode() {
        return Objects.hash(input, super.hashCode());
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class SearchParam {\n");
        sb.append("    ").append(toIndentedString(super.toString())).append("\n");
        sb.append("    input: ").append(toIndentedString(input)).append("\n");
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
