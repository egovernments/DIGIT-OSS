package org.egov.user.repository;

import lombok.extern.slf4j.Slf4j;
import org.egov.tracer.model.CustomException;
import org.egov.user.domain.exception.DuplicateUserNameException;
import org.egov.user.domain.model.Address;
import org.egov.user.domain.model.Role;
import org.egov.user.domain.model.User;
import org.egov.user.domain.model.UserSearchCriteria;
import org.egov.user.domain.model.enums.AddressType;
import org.egov.user.domain.model.enums.UserType;
import org.egov.user.domain.service.UserService;
import org.egov.user.domain.service.utils.EncryptionDecryptionUtil;
import org.egov.user.persistence.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Component
public class UserDbInit {
    @Value("${user.service.default.username}")
    private String defaultUsername;

    @Value("${user.service.default.password}")
    private String defaultPassword;

    @Value("${user.service.default.name}")
    private String defaultName;

    @Value("${user.service.default.mobilenumber}")
    private String defaultMobileNumber;

    @Value("${user.service.default.tenantid}")
    private String defaultTenantId;

    @Value("${user.service.default.otpreference}")
    private String defaultOtpReference;

    @Value("${user.service.default.city}")
    private String defaultCity;

    @Value("${user.service.default.pincode}")
    private String defaultPinCode;

    @Value("${user.service.default.role}")
    private String defaultRole;

    @Value("${user.service.default.rolecode}")
    private String defaultRoleCode;

    @Value("${user.service.default.rolename}")
    private String defaultRoleName;

    @Value("${user.service.default.active}")
    private boolean defaultActiveIndicator;

    @Value("${create.user.validate.name}")
    private boolean createUserValidateName;

    @Value("${user.service.default.user.creation}")
    private boolean createDefaultUser;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;

    @Autowired
    private EncryptionDecryptionUtil encryptionDecryptionUtil;

    @PostConstruct
    private void initSeedUser() {
        if (createDefaultUser) {
            Role urole = Role.builder().code(defaultRoleCode)
                    .name(defaultRoleName)
                    .tenantId(defaultTenantId)
                    .build();
            Set<Role> roleSet = new HashSet<Role>();
            roleSet.add(urole);
            UserType type = UserType.EMPLOYEE;
            User user = User.builder()
                    .mobileNumber(defaultMobileNumber)
                    .tenantId(defaultTenantId)
                    .uuid(UUID.randomUUID().toString())
                    .name(defaultName)
                    .otpReference(defaultOtpReference)
                    .active(defaultActiveIndicator)
                    .type(type)
                    .username(defaultUsername)
                    .password(defaultPassword)
                    .roles(roleSet)
                    .build();
            user.validateNewUser(createUserValidateName);
            user = encryptionDecryptionUtil.encryptObject(user, "User", User.class);
            if (userRepository.isUserPresent(user.getUsername(), user.getTenantId(), user.getType())) {
                log.info("EG_SYSTEM_USER_ALREADY_EXISTS: " + "System user already exists");
            } else {
                userRepository.create(user);
            }
        }
    }
}