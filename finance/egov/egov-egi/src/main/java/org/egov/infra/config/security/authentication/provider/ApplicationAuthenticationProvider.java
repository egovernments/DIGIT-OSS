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

package org.egov.infra.config.security.authentication.provider;

import static java.lang.String.format;
import static org.egov.infra.security.utils.SecurityConstants.MAX_LOGIN_ATTEMPT_ALLOWED;

import java.util.Optional;

import org.egov.infra.security.audit.entity.LoginAttempt;
import org.egov.infra.security.audit.service.LoginAttemptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

public class ApplicationAuthenticationProvider extends DaoAuthenticationProvider {

	private static final String ACCOUNT_LOCKED_MSG_KEY = "AbstractUserDetailsAuthenticationProvider.locked";
	private static final String ACCOUNT_LOCKED_DEFAULT_MSG = "User account is locked";
	private static final String TOO_MANY_ATTEMPTS_MSG_FORMAT = "Too many attempts [%d]";

	@Autowired
	private LoginAttemptService loginAttemptService;

	@Override
	public Authentication authenticate(Authentication authentication) {
		try {
			return super.authenticate(authentication);
		} catch (BadCredentialsException ex) {
			lockAccount(authentication);
			throw ex;
		} catch (LockedException le) {
			return unlockAccount(le);
		}
	}

	private Authentication unlockAccount(LockedException le) {
		throw le;
	}

	private void lockAccount(Authentication authentication) {
		Optional<LoginAttempt> loginAttempt = loginAttemptService.updateFailedAttempt(authentication.getName());
		if (loginAttempt.isPresent()) {
			if (loginAttempt.get().getFailedAttempts() == MAX_LOGIN_ATTEMPT_ALLOWED) {
				throw new LockedException(messages.getMessage(ACCOUNT_LOCKED_MSG_KEY, ACCOUNT_LOCKED_DEFAULT_MSG));
			} else if (loginAttempt.get().getFailedAttempts() > 2) {
				throw new BadCredentialsException(format(TOO_MANY_ATTEMPTS_MSG_FORMAT,
						MAX_LOGIN_ATTEMPT_ALLOWED - loginAttempt.get().getFailedAttempts()));
			}
		}
	}

	@Override
	protected void additionalAuthenticationChecks(UserDetails userDetails,
			UsernamePasswordAuthenticationToken authentication) {
	}
}
