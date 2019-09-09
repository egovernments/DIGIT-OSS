package org.egov.common.contract.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode
public class User {
    private Long id;

    private String userName;

    private String name;

    private String type;

    private String mobileNumber;

    private String emailId;

    private List<Role> roles;

    private String tenantId;
    
    private String uuid;
}

