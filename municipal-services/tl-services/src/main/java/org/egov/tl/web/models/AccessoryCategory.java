package org.egov.tl.web.models;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.egov.tl.web.models.Uom;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

/**
 * 1. This is the master data for accessory. 2. We can add accessories only for active AccessoryCategory . 4. This is the master data for trade license, it&#39;s defined under mdms service. 5. To get data from mdms &#39;moduleName&#x3D;tradelicense, masterName&#x3D;AccessoryCategory and tradeSubCategory&#x3D;{code of trade sub category master}&#39;. 6. Multiple TradeCategoryDetail can be defined under single TradeSubCategory 7. Cobination of tradeSubCategory and code is unique. 8. License Fees is defined at tradeCategoryDetail level. 9. Each tradeCategoryDetail is map to a single TradeCategoryUOM
 */
@ApiModel(description = "1. This is the master data for accessory. 2. We can add accessories only for active AccessoryCategory . 4. This is the master data for trade license, it's defined under mdms service. 5. To get data from mdms 'moduleName=tradelicense, masterName=AccessoryCategory and tradeSubCategory={code of trade sub category master}'. 6. Multiple TradeCategoryDetail can be defined under single TradeSubCategory 7. Cobination of tradeSubCategory and code is unique. 8. License Fees is defined at tradeCategoryDetail level. 9. Each tradeCategoryDetail is map to a single TradeCategoryUOM")
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-09-18T17:06:11.263+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccessoryCategory   {
        @JsonProperty("name")
        private String name = null;

        @JsonProperty("code")
        private String code = null;

        @JsonProperty("uom")
        private Uom uom = null;

        @JsonProperty("active")
        private Boolean active = null;


}

