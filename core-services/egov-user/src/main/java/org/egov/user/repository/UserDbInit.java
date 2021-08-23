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
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.egov.user.config.UserServiceConstants.*;

@Slf4j
@Component
public class UserDbInit {
    @Value("#{${user.service.default}}")
    private Map<String, String> serviceDefault;

    @Value("${user.default.active}")
    private boolean defaultActiveIndicator;

    @Value("${create.user.validate.name}")
    private boolean createUserValidateName;

    @Value("${user.default.user.creation}")
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
            Role urole = Role.builder().code(serviceDefault.get(ROLE_CODE))
                    .name(serviceDefault.get(ROLE_NAME))
                    .tenantId(serviceDefault.get(TENANT_ID))
                    .build();
            Set<Role> roleSet = new HashSet<Role>();
            roleSet.add(urole);
            UserType type = UserType.EMPLOYEE;
            User user = User.builder()
                    .mobileNumber(serviceDefault.get(MOBILE_NUMBER))
                    .tenantId(serviceDefault.get(TENANT_ID))
                    .uuid(UUID.randomUUID().toString())
                    .name(serviceDefault.get(NAME))
                    .otpReference(serviceDefault.get(OTP_REFERENCE))
                    .active(defaultActiveIndicator)
                    .type(type)
                    .username(serviceDefault.get(USER_NAME))
                    .password(serviceDefault.get(PASSWORD))
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