package org.egov.user.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.egov.user.web.contract.auth.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class SecureUser implements UserDetails {
	private static final long serialVersionUID = -8756608845278722035L;
	private final org.egov.user.web.contract.auth.User user;
	private final List<SimpleGrantedAuthority> authorities = new ArrayList<>();

	public SecureUser(org.egov.user.web.contract.auth.User user) {
		if (user == null) {
			throw new UsernameNotFoundException("UserRequest not found");
		} else {
			this.user = user;
			user.getRoles().forEach(role -> this.authorities.add(new SimpleGrantedAuthority(role.getCode())));
		}
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return this.authorities;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return user.isActive();
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return this.user.isActive();
	}

	@Override
	public String getPassword() {
		return null;
	}

	@Override
	public String getUsername() {
		return this.user.getUserName();
	}

	public org.egov.user.web.contract.auth.User getUser() {
		return this.user;
	}

	@JsonIgnore
	public List<String> getRoleCodes() {
		return user.getRoles()
				.stream()
				.map(Role::getCode)
				.collect(Collectors.toList());
	}

	public String getTenantId() {
		return user.getTenantId();
	}
}