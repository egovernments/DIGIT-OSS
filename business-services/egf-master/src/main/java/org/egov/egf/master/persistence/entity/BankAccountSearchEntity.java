package org.egov.egf.master.persistence.entity ;
import org.egov.egf.master.domain.model.BankAccount;
import org.egov.egf.master.domain.model.BankAccountSearch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class BankAccountSearchEntity extends BankAccountEntity { private String ids; 
private String  sortBy; 
private Integer pageSize; 
private Integer offset; 
public BankAccount toDomain(){ 
BankAccount bankAccount = new BankAccount (); 
super.toDomain( bankAccount);return bankAccount ;}
 
public BankAccountSearchEntity toEntity( BankAccountSearch bankAccountSearch){
super.toEntity(( BankAccount)bankAccountSearch);
this.pageSize=bankAccountSearch.getPageSize(); this.offset=bankAccountSearch.getOffset(); this.sortBy=bankAccountSearch.getSortBy(); this.ids=bankAccountSearch.getIds(); return this;} 
 
} 