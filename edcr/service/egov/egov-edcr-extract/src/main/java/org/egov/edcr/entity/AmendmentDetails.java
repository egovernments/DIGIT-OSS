package org.egov.edcr.entity;
																																																														
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.egov.infra.exception.ApplicationRuntimeException;

/**
 * 
 * @author mani
 *
 */
public class AmendmentDetails implements Comparable<AmendmentDetails> {
	private static final Logger LOG = Logger.getLogger(AmendmentDetails.class);
	private String code;
	private Date dateOfBylaw;
	private Map<String, String> changes=new HashMap<>();
	private String description;
	private SimpleDateFormat amdDateFormat = new SimpleDateFormat("dd_mm_yyyy");

	public String getDateOfBylawString() {
		if (dateOfBylaw != null)
			return amdDateFormat.format(this.dateOfBylaw);
		else
			return null;
	}

	public AmendmentDetails() {
		// Invariant
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((changes == null) ? 0 : changes.hashCode());
		result = prime * result + ((code == null) ? 0 : code.hashCode());
		result = prime * result + ((dateOfBylaw == null) ? 0 : dateOfBylaw.hashCode());
		result = prime * result + ((description == null) ? 0 : description.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		AmendmentDetails other = (AmendmentDetails) obj;
		if (dateOfBylaw == null) {
			if (other.dateOfBylaw != null)
				return false;
		} else if (!dateOfBylaw.equals(other.dateOfBylaw))
			return false;
		return true;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Date getDateOfBylaw() {
		return dateOfBylaw;
	}

	public void setDateOfBylaw(Date dateOfBylaw) {
		this.dateOfBylaw = dateOfBylaw;
	}

	public void setDateOfBylaw(String amendmentDate) {

		try {
			this.dateOfBylaw = amdDateFormat.parse(amendmentDate);
		} catch (ParseException e) {
			throw new ApplicationRuntimeException("Invalid date format . It should be dd_mm_yyyy");
		}
	}

	

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Override
	public int compareTo(AmendmentDetails o) {
		if(o==null)
			return -1;
		LOG.info(this.dateOfBylaw);
		LOG.info(o.dateOfBylaw);
		return this.dateOfBylaw.compareTo(o.getDateOfBylaw());
		 
	}

	public Map<String, String> getChanges() {
		return changes;
	}

	public void setChanges(Map<String, String> changes) {
		this.changes = changes;
	}

}