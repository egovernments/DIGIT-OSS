package org.egov.egf.master.persistence.entity ;
import org.egov.egf.master.domain.model.BankBranch;
import org.egov.egf.master.domain.model.BankBranchSearch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class BankBranchSearchEntity extends BankBranchEntity { private String ids; 
private String  sortBy; 
private Integer pageSize; 
private Integer offset; 
public BankBranch toDomain(){ 
BankBranch bankBranch = new BankBranch (); 
super.toDomain( bankBranch);return bankBranch ;}
 
public BankBranchSearchEntity toEntity( BankBranchSearch bankBranchSearch){
super.toEntity(( BankBranch)bankBranchSearch);
this.pageSize=bankBranchSearch.getPageSize(); this.offset=bankBranchSearch.getOffset(); this.sortBy=bankBranchSearch.getSortBy(); this.ids=bankBranchSearch.getIds(); return this;} 
 
} 