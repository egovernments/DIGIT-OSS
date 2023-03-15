package org.egov.pt.models.event;

import lombok.*;
import org.springframework.validation.annotation.Validated;

import java.math.BigDecimal;

@Validated
@AllArgsConstructor
@EqualsAndHashCode
@Getter
@NoArgsConstructor
@Setter
@ToString
@Builder
public class EventDetails {
	
	private String id;
	
	private String eventId;

	private Long fromDate;
	
	private Long toDate;
	
	private BigDecimal latitude;
	
	private BigDecimal longitude;
	
	private String address;
	
	
	public boolean isEmpty(EventDetails details) {
		if(null == details.getFromDate() || null == details.getToDate() || null == details.getLatitude() || null == details.getLongitude()) {
			return true;
		}
		return false;
	}
	
}
