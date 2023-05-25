package org.egov.egf.master.persistence.entity ;
import org.egov.egf.master.domain.model.FinancialStatus;
import org.egov.egf.master.domain.model.FinancialStatusSearch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class FinancialStatusSearchEntity extends FinancialStatusEntity { private String ids; 
private String  sortBy; 
private Integer pageSize; 
private Integer offset; 
public FinancialStatus toDomain(){ 
FinancialStatus financialStatus = new FinancialStatus (); 
super.toDomain( financialStatus);return financialStatus ;}
 
public FinancialStatusSearchEntity toEntity( FinancialStatusSearch financialStatusSearch){
super.toEntity(( FinancialStatus)financialStatusSearch);
this.pageSize=financialStatusSearch.getPageSize(); this.offset=financialStatusSearch.getOffset(); this.sortBy=financialStatusSearch.getSortBy(); this.ids=financialStatusSearch.getIds(); return this;} 
 
} 