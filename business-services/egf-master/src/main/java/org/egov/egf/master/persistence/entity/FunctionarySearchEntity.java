package org.egov.egf.master.persistence.entity ;
import org.egov.egf.master.domain.model.Functionary;
import org.egov.egf.master.domain.model.FunctionarySearch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class FunctionarySearchEntity extends FunctionaryEntity { private String ids; 
private String  sortBy; 
private Integer pageSize; 
private Integer offset; 
public Functionary toDomain(){ 
Functionary functionary = new Functionary (); 
super.toDomain( functionary);return functionary ;}
 
public FunctionarySearchEntity toEntity( FunctionarySearch functionarySearch){
super.toEntity(( Functionary)functionarySearch);
this.pageSize=functionarySearch.getPageSize(); this.offset=functionarySearch.getOffset(); this.sortBy=functionarySearch.getSortBy(); this.ids=functionarySearch.getIds(); return this;} 
 
} 