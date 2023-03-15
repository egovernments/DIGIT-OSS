package org.egov.demand.helper;

import com.fasterxml.jackson.annotation.JsonIgnore;

public abstract class JsonIgnoreHelper {

	@JsonIgnore abstract int getTs(); 
}
