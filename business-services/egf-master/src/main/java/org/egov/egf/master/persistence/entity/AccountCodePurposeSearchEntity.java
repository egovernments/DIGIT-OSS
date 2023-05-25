package org.egov.egf.master.persistence.entity ;
import org.egov.egf.master.domain.model.AccountCodePurpose;
import org.egov.egf.master.domain.model.AccountCodePurposeSearch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class AccountCodePurposeSearchEntity extends AccountCodePurposeEntity { private String ids; 
private String  sortBy; 
private Integer pageSize; 
private Integer offset; 
public AccountCodePurpose toDomain(){ 
AccountCodePurpose accountCodePurpose = new AccountCodePurpose (); 
super.toDomain( accountCodePurpose);return accountCodePurpose ;}
 
public AccountCodePurposeSearchEntity toEntity( AccountCodePurposeSearch accountCodePurposeSearch){
super.toEntity(( AccountCodePurpose)accountCodePurposeSearch);
this.pageSize=accountCodePurposeSearch.getPageSize(); this.offset=accountCodePurposeSearch.getOffset(); this.sortBy=accountCodePurposeSearch.getSortBy(); this.ids=accountCodePurposeSearch.getIds(); return this;} 
 
} 