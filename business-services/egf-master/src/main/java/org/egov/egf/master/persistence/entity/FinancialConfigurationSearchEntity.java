package org.egov.egf.master.persistence.entity ;
import org.egov.egf.master.domain.model.FinancialConfiguration;
import org.egov.egf.master.domain.model.FinancialConfigurationSearch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class FinancialConfigurationSearchEntity extends FinancialConfigurationEntity { private String ids; 
private String  sortBy; 
private Integer pageSize; 
private Integer offset; 
public FinancialConfiguration toDomain(){ 
FinancialConfiguration financialConfiguration = new FinancialConfiguration (); 
super.toDomain( financialConfiguration);return financialConfiguration ;}
 
public FinancialConfigurationSearchEntity toEntity( FinancialConfigurationSearch financialConfigurationSearch){
super.toEntity(( FinancialConfiguration)financialConfigurationSearch);
this.pageSize=financialConfigurationSearch.getPageSize(); this.offset=financialConfigurationSearch.getOffset(); this.sortBy=financialConfigurationSearch.getSortBy(); this.ids=financialConfigurationSearch.getIds(); return this;} 
 
} 