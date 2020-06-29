package org.egov.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class TaxDetail {


    @NotNull
    @JsonProperty("entityId")
    private String entityId = null;

    @JsonProperty("amountPaid")
    private BigDecimal amountPaid = null;

    @JsonProperty("amountToBePaid")
    private BigDecimal amountToBePaid = null;

    @JsonProperty("fromPeriod")
    private Long fromPeriod = null;

    @JsonProperty("buckets")
    private List<Bucket> buckets = null;

    public void addBucket(Bucket bucket){
        if(this.buckets==null){
            this.buckets = new ArrayList<>();
            this.buckets.add(bucket);
        }
        else this.getBuckets().add(bucket);

    }

}
