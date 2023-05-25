package org.egov.egf.master.persistence.entity ;
import org.egov.egf.master.domain.model.SubScheme;
import org.egov.egf.master.domain.model.SubSchemeSearch;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class SubSchemeSearchEntity extends SubSchemeEntity { private String ids; 
private String  sortBy; 
private Integer pageSize; 
private Integer offset; 
public SubScheme toDomain(){ 
SubScheme subScheme = new SubScheme (); 
super.toDomain( subScheme);return subScheme ;}
 
public SubSchemeSearchEntity toEntity( SubSchemeSearch subSchemeSearch){
super.toEntity(( SubScheme)subSchemeSearch);
this.pageSize=subSchemeSearch.getPageSize(); this.offset=subSchemeSearch.getOffset(); this.sortBy=subSchemeSearch.getSortBy(); this.ids=subSchemeSearch.getIds(); return this;} 
 
} 