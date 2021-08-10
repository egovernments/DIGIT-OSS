/*
 *    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) 2017  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *            Further, all user interfaces, including but not limited to citizen facing interfaces,
 *            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *            derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *            For any further queries on attribution, including queries on brand guidelines,
 *            please contact contact@egovernments.org
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 *
 */
package org.egov.infra.microservice.models;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

public class CustomUserDetails implements Serializable{
	private Long id;
	private String userName;
	private String name;
	private String mobileNumber;
	private String emailId;
	private String locale;
	private String type;
	private List<Role> roles;
	private boolean active;
	private List<Action> actions;
	private String tenantId;
	private String uuid;

//	public CustomUserDetails(UserDetail userDetail) {
//		final SecureUser secureUser = userDetail.getSecureUser();
//		this.id = secureUser.getUser().getId();
//		this.userName = secureUser.getUser().getUserName();
//		this.name = secureUser.getUser().getName();
//		this.mobileNumber = secureUser.getUser().getMobileNumber();
//		this.emailId = secureUser.getUser().getEmailId();
//		this.locale = secureUser.getUser().getLocale();
//		this.type = secureUser.getUser().getType();
//		this.roles = secureUser.getUser().getRoles();
//		this.active = secureUser.getUser().isActive();
//		this.tenantId = secureUser.getUser().getTenantId();
//		this.uuid = secureUser.getUser().getUuid();
//		this.actions = userDetail.getActions().stream().map(Action::new).collect(Collectors.toList());
//	}
	
	public CustomUserDetails(){}

	public CustomUserDetails(Long id, String userName, String name, String mobileNumber, String emailId, String locale,
			String type, List<Role> roles, boolean active, List<Action> actions, String tenantId, String uuid) {
		this.id = id;
		this.userName = userName;
		this.name = name;
		this.mobileNumber = mobileNumber;
		this.emailId = emailId;
		this.locale = locale;
		this.type = type;
		this.roles = roles;
		this.active = active;
		this.actions = actions;
		this.tenantId = tenantId;
		this.uuid = uuid;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getLocale() {
		return locale;
	}

	public void setLocale(String locale) {
		this.locale = locale;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public List<Role> getRoles() {
		return roles;
	}

	public void setRoles(List<Role> roles) {
		this.roles = roles;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public List<Action> getActions() {
		return actions;
	}

	public void setActions(List<Action> actions) {
		this.actions = actions;
	}

	public String getTenantId() {
		return tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	@Override
	public String toString() {
		return "CustomUserDetails [id=" + id + ", userName=" + userName + ", name=" + name + ", mobileNumber="
				+ mobileNumber + ", emailId=" + emailId + ", locale=" + locale + ", type=" + type + ", roles=" + roles
				+ ", active=" + active + ", actions=" + actions + ", tenantId=" + tenantId + ", uuid=" + uuid + "]";
	}
	
	
}

