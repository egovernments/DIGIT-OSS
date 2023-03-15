package org.egov.chat.models;

import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    private String userId;

    private String mobileNumber;

    private String authToken;

    private String refreshToken;

    private String userInfo;

    private Long expiresAt;

}
