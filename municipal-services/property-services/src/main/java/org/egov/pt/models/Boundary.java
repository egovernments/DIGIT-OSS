package org.egov.pt.models;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Boundary {
	
        @JsonProperty("code")
        @NotNull
        private String code ;

        @JsonProperty("name")
        private String name ;

        @JsonProperty("label")
        private String label ;

        @JsonProperty("latitude")
        private String latitude ;

        @JsonProperty("longitude")
        private String longitude ;
        
        @JsonProperty("area")
        private String area;

        @JsonProperty("children")
        @Valid
        private List<Boundary> children ;

        @JsonProperty("materializedPath")
        private String materializedPath ;


        public Boundary addChildrenItem(Boundary childrenItem) {
            if (this.children == null) {
            this.children = new ArrayList<>();
            }
        this.children.add(childrenItem);
        return this;
        }

}

