package org.egov.egf.master.web.contract ;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class FiscalPeriodSearchContract extends FiscalPeriodContract { private String ids; 
private String  sortBy;

// pageSize not used
private Integer pageSize;

//not used
private Integer offset; 
} 