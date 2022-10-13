package org.egov.user.avm.developer.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Entity
@Table(name = "DeveloperRegistration")
@TypeDef(name = "jsonb", typeClass = JsonBinaryType.class)
public class DeveloperRegistration {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="current_version")
	private float currentVersion;
	
	@Column(name="created_by")
	private String createdBy;
	
	@Column(name="created_date")
	private Date createdDate;
	
	@Column(name="updated_by")
	private String updateddBy;
	
	@Column(name="updated_date")
	private Date updatedDate;

	
	 //@JsonProperty("developerDetail")
	@Type(type = "jsonb")
	@Column(columnDefinition = "jsonb")
	private List<Developerdetail> developerDetail;

	
}
