package org.egov.egf.master.persistence.entity ;
import org.egov.egf.master.domain.model.FiscalPeriod;
import org.egov.egf.master.domain.model.FiscalPeriodSearch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class FiscalPeriodSearchEntity extends FiscalPeriodEntity { private String ids; 
private String  sortBy; 
private Integer pageSize; 
private Integer offset; 
public FiscalPeriod toDomain(){ 
FiscalPeriod fiscalPeriod = new FiscalPeriod (); 
super.toDomain( fiscalPeriod);return fiscalPeriod ;}
 
public FiscalPeriodSearchEntity toEntity( FiscalPeriodSearch fiscalPeriodSearch){
super.toEntity(( FiscalPeriod)fiscalPeriodSearch);
this.pageSize=fiscalPeriodSearch.getPageSize(); this.offset=fiscalPeriodSearch.getOffset(); this.sortBy=fiscalPeriodSearch.getSortBy(); this.ids=fiscalPeriodSearch.getIds(); return this;} 
 
} 