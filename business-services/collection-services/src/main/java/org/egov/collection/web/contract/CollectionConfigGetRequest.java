package org.egov.collection.web.contract;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class CollectionConfigGetRequest {
	private List<Long> id;

	@Size(min=3, max=50)
	private String name;

	@JsonFormat(pattern = "dd/MM/yyyy")
	private Date effectiveFrom;

	private String sortBy;

	private String sortOrder;

	@NotNull
	private String tenantId;

	@Min(1)
	@Max(500)
	private Short pageSize;

	private Short pageNumber;
}
