package org.egov.collection.model;

import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class SurrenderReason{
	/**
	 * id is the unique Identifier of the reason
	 */
	private String id;
	/**
	 * name is the reason of instrument surrender. Example "Damaged cheque","Cheque to be scrapped" etc
	 */
	@NotBlank
	@Size(max=50,min=5)
	private String name;
	/**
	 * description is detailed description of the surrender of a instrument
	 */
	@NotBlank
	@Size(max=250)
	private String description;

}
