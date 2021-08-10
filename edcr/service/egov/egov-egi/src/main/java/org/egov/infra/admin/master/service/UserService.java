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

package org.egov.infra.admin.master.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.egov.infra.admin.master.entity.Role;
import org.egov.infra.admin.master.entity.User;
import org.egov.infra.admin.master.repository.UserRepository;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.egov.infra.persistence.entity.enums.Gender;
import org.egov.infra.persistence.entity.enums.UserType;
import org.egov.infra.utils.ApplicationConstant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public User updateUser(User user) {
        return userRepository.saveAndFlush(user);
    }

    @Transactional
    public User createUser(User user) {
        user.setTenantId(ApplicationThreadLocals.getTenantID());
        User savedUser = userRepository.save(user);
        return savedUser;
    }

    public Set<Role> getRolesByUsername(String userName) {
        return userRepository.findUserRolesByUserNameAndTenantId(userName, ApplicationThreadLocals.getTenantID());
    }

    public User getUserById(Long id) {
        return userRepository.findOne(id);
    }

    public User getUserRefById(Long id) {
        return userRepository.getOne(id);
    }

    public User getCurrentUser() {
        return userRepository.findOne(ApplicationThreadLocals.getUserId());
    }

    public User getUserByUsername(String userName) {
        if (ApplicationConstant.ANONYMOUS_USERNAME.equals(userName))
            return userRepository.findByUsernameAndTenantId(userName, ApplicationConstant.STATE_TENANTID);
        else
            return userRepository.findByUsernameAndTenantId(userName, ApplicationThreadLocals.getTenantID());
    }

    public User getUserByUsernameAndTenantIdForLogin(String userName) {
        User user = null;
        user = userRepository.findByUsernameAndTenantId(userName, ApplicationThreadLocals.getTenantID());
        if (user == null)
            user = userRepository.findByUsernameAndTenantId(userName, ApplicationConstant.STATE_TENANTID);
        return user;
    }

    public User getUserByUsernameAndTenantId(String userName) {
        return userRepository.findByUsernameAndTenantId(userName, ApplicationThreadLocals.getTenantID());
    }

    public List<User> getUsersByNameLike(String userName) {
        return userRepository.findByNameContainingIgnoreCase(userName);
    }

    public User getUserByEmailId(String emailId) {
        return userRepository.findByEmailId(emailId);
    }

    public User getUserByAadhaarNumber(String aadhaarNumber) {
        return userRepository.findByAadhaarNumber(aadhaarNumber);
    }

    public List<User> getUserByAadhaarNumberAndType(String aadhaarNumber, UserType type) {
        return userRepository.findByAadhaarNumberAndType(aadhaarNumber, type);
    }

    public Optional<User> checkUserWithIdentity(String identity) {
        return Optional.ofNullable(getUserByUsername(identity));
    }

    public List<User> findAllByMatchingUserNameForType(String username, UserType type) {
        return userRepository.findByUsernameContainingIgnoreCaseAndTypeAndActiveTrue(username, type);
    }

    public List<User> findAllByMatchingUserNameAndTenantIdForType(String username, UserType type) {
        return userRepository.findByUsernameContainingIgnoreCaseAndTypeAndTenantIdAndActiveTrue(
                "%" + username.toUpperCase() + "%", type, ApplicationThreadLocals.getTenantID());
    }
    
    public List<User> getUsersByTypeAndTenants(UserType type) {
        return userRepository.findUsersByTypeAndTenants(type, ApplicationThreadLocals.getTenantID(),
                ApplicationConstant.STATE_TENANTID);
    }
    
    public List<User> getUsersByTypeAndTenantId(UserType type, String tenantId) {
        return userRepository.findUsersByTypeAndTenantId(type, tenantId);
    }


    public Set<User> getUsersByRoleName(String roleName) {
        return userRepository.findUsersByRoleName(roleName);
    }

    public List<User> getAllEmployeeNameLike(String name) {
        return userRepository.findByNameContainingIgnoreCaseAndTypeAndActiveTrue(name, UserType.EMPLOYEE);
    }

    public List<User> getUsersByUsernameAndRolename(String userName, String roleName) {
        return userRepository.findUsersByUserAndRoleName(userName, roleName);
    }

    public User getUserByNameAndMobileNumberForGender(String name, String mobileNumber, Gender gender) {
        return userRepository.findByNameAndMobileNumberAndGender(name, mobileNumber, gender);
    }

    public List<User> getUserByNameAndMobileNumberAndGenderForUserType(final String name, final String mobileNumber,
            final Gender gender, final UserType type) {
        return userRepository.findByNameAndMobileNumberAndGenderAndTypeOrderByIdDesc(name, mobileNumber, gender, type);
    }

    public List<User> getUserByMobileNumberAndType(final String mobileNumber, final UserType type) {
        return userRepository.findByMobileNumberAndTypeOrderById(mobileNumber, type);
    }

    public List<User> getUserByType(final UserType type) {
        return userRepository.findByTypeAndActiveTrue(type);
    }

    public List<User> getUserByTypeInOrder(final UserType type) {
        return userRepository.findByTypeAndActiveTrueOrderByUsername(type);
    }

    public List<User> getUsersByTypeAndEmailId(final String emailId, final UserType type) {
        return userRepository.findByEmailIdAndTypeOrderById(emailId, type);
    }

    public User getUserByPan(String panNumber) {
        return userRepository.findByPan(panNumber);
    }

}