package org.egov.boundary.web.contract;

import org.hibernate.validator.constraints.Length;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Size;

@Getter
@Setter
public class HierarchyType {

	private static final long serialVersionUID = -7131667806935923935L;

	private Long id;
	@Length(max = 128)
	private String name;
	@Length(max = 50)
	private String code;
	@Length(max = 256)
	private String localName;
	@Size(max = 256)
	private String tenantId;
	private Long createdBy;
	private Long createdDate;
	private Long lastModifiedBy;
	private Long lastModifiedDate;
	private int version;
	private boolean isNew;
	
	 @Override
	    public int hashCode() {
	        final int prime = 31;
	        int result = 1;
	        result = prime * result + (code == null ? 0 : code.hashCode());
	        result = prime * result + (id == null ? 0 : id.hashCode());
	        result = prime * result + (name == null ? 0 : name.hashCode());
	        return result;
	    }

	    @Override
	    public boolean equals(final Object obj) {
	        if (this == obj)
	            return true;
	        if (obj == null)
	            return false;
	        if (getClass() != obj.getClass())
	            return false;
	        final HierarchyType other = (HierarchyType) obj;
	        if (code == null) {
	            if (other.code != null)
	                return false;
	        } else if (!code.equals(other.code))
	            return false;
	        if (id == null) {
	            if (other.id != null)
	                return false;
	        } else if (!id.equals(other.id))
	            return false;
	        if (name == null) {
	            if (other.name != null)
	                return false;
	        } else if (!name.equals(other.name))
	            return false;
	        return true;
	    }


}
