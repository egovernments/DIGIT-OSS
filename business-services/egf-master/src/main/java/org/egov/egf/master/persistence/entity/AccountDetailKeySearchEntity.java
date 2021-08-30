package org.egov.egf.master.persistence.entity ;
import org.egov.egf.master.domain.model.AccountDetailKey;
import org.egov.egf.master.domain.model.AccountDetailKeySearch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class AccountDetailKeySearchEntity extends AccountDetailKeyEntity { private String ids; 
private String  sortBy; 
private Integer pageSize; 
private Integer offset; 
public AccountDetailKey toDomain(){ 
AccountDetailKey accountDetailKey = new AccountDetailKey (); 
super.toDomain( accountDetailKey);return accountDetailKey ;}
 
public AccountDetailKeySearchEntity toEntity( AccountDetailKeySearch accountDetailKeySearch){
super.toEntity(( AccountDetailKey)accountDetailKeySearch);
this.pageSize=accountDetailKeySearch.getPageSize(); this.offset=accountDetailKeySearch.getOffset(); this.sortBy=accountDetailKeySearch.getSortBy(); this.ids=accountDetailKeySearch.getIds(); return this;} 
 
} 