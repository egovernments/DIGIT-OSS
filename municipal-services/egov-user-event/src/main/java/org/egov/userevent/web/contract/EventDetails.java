package org.egov.userevent.web.contract;

import java.math.BigDecimal;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.egov.userevent.model.Document;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.validation.annotation.Validated;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Validated
@AllArgsConstructor
@EqualsAndHashCode
@Getter
@NoArgsConstructor
@Setter
@ToString
@Builder
public class EventDetails {

	@SafeHtml
	private String id;

	@SafeHtml
	private String eventId;

	@SafeHtml
	private String organizer;

	private Long fromDate;
	
	private Long toDate;
	
	private BigDecimal latitude;
	
	private BigDecimal longitude;

	@SafeHtml
	private String address;
	
	private List<Document> documents;
	
	private BigDecimal fees;
	
	public boolean isEmpty(EventDetails details) {
		if(null != details.getFromDate() && null != details.getToDate() && 
				(!StringUtils.isEmpty(details.getAddress()) || (null != details.getLatitude() && null != details.getLongitude()))) {
			return false;
		}
		return true;
	}
	
}
