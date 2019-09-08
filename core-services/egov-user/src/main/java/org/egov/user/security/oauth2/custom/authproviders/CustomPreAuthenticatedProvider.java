package org.egov.user.security.oauth2.custom.authproviders;

import lombok.extern.slf4j.Slf4j;
import org.egov.user.domain.exception.DuplicateUserNameException;
import org.egov.user.domain.exception.UserNotFoundException;
import org.egov.user.domain.model.SecureUser;
import org.egov.user.domain.model.User;
import org.egov.user.domain.model.enums.UserType;
import org.egov.user.domain.service.UserService;
import org.egov.user.web.contract.auth.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.common.exceptions.OAuth2Exception;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;
import static org.springframework.util.StringUtils.isEmpty;

@Component
@Slf4j
public class CustomPreAuthenticatedProvider implements AuthenticationProvider {

    @Autowired
    private UserService userService;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) authentication.getPrincipal();

        SecureUser secureUser = (SecureUser) token.getPrincipal();
        String userName = secureUser.getUsername();

        final LinkedHashMap<String, String> details = (LinkedHashMap<String, String>) token.getDetails();

        String tenantId = details.get("tenantId");
        String userType = details.get("userType");

        if (isEmpty(tenantId)) {
            throw new OAuth2Exception("TenantId is mandatory");
        }
        if (isEmpty(userType) || isNull(UserType.fromValue(userType))) {
            throw new OAuth2Exception("User Type is mandatory and has to be a valid type");
        }

        User user;
        try {
            user = userService.getUniqueUser(userName, tenantId, UserType.fromValue(userType));
        } catch (UserNotFoundException e) {
            log.error("User not found", e);
            throw new OAuth2Exception("Invalid login credentials");
        } catch (DuplicateUserNameException e) {
            log.error("Fatal error, user conflict, more than one user found", e);
            throw new OAuth2Exception("Invalid login credentials");

        }

        if (user.getAccountLocked() == null || user.getAccountLocked()) {
            throw new OAuth2Exception("Account locked");
        }

        List<GrantedAuthority> grantedAuths = new ArrayList<>();
        grantedAuths.add(new SimpleGrantedAuthority("ROLE_" + user.getType()));
        final SecureUser finalUser = new SecureUser(getUser(user));
        return new PreAuthenticatedAuthenticationToken(finalUser,
                null, grantedAuths);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return PreAuthenticatedAuthenticationToken.class.isAssignableFrom(authentication);
    }


    private org.egov.user.web.contract.auth.User getUser(User user) {
        return org.egov.user.web.contract.auth.User.builder().id(user.getId()).userName(user.getUsername()).uuid(user.getUuid())
                .name(user.getName()).mobileNumber(user.getMobileNumber()).emailId(user.getEmailId())
                .locale(user.getLocale()).active(user.getActive()).type(user.getType().name())
                .roles(toAuthRole(user.getRoles())).tenantId(user.getTenantId()).build();
    }

    private Set<Role> toAuthRole(Set<org.egov.user.domain.model.Role> domainRoles) {
        if (domainRoles == null)
            return new HashSet<>();
        return domainRoles.stream().map(org.egov.user.web.contract.auth.Role::new).collect(Collectors.toSet());
    }
}
