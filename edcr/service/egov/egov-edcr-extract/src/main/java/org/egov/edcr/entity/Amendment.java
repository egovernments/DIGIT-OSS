package org.egov.edcr.entity;

import java.util.Collections;
import java.util.Date;
import java.util.Set;
import java.util.TreeSet;

/**
 * 
 * @author mani
 *
 */

public class Amendment {

	protected Set<AmendmentDetails> details = new TreeSet<>(Collections.reverseOrder());

	public Set<AmendmentDetails> getDetails() {
		return details;
	}

	public void setDetails(Set<AmendmentDetails> details) {
		this.details = details;
	}
	
	

	public int getIndex(Date scrutinyDate) {
		int i = 0;
		for (AmendmentDetails detail : this.getDetails()) {
			if (detail.getDateOfBylaw().before(scrutinyDate))
				return i;
			else
				i++;
		}
     return -1;
	}

}
