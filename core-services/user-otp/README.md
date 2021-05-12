# User-OTP Service
### User-OTP
User-OTP service handles the OTP for user registration, user login and password reset for a particular user.

### DB UML Diagram

- NA

### Service Dependencies
- egov-user
- egov-localization
- egov-otp

### Swagger API Contract
- NA

## Service Details
The user-otp service send the OTP to user on login request, on password change request and during new user registration.

| Environment Variable                              | Description                                                                                                          |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------|
| `egov.localisation.tenantid.strip.suffix.count`   | Depend on the value of tenantIdStripSuffixCount, the level of tenantid is removed from suffix of provided tenantid   |


### API Details

`BasePath` /user-otp/v1/[API endpoint]

##### Method
a) `POST /_send`

This method send the OTP to user via sms or email based on the below parameter

| Input Field                               | Description                                                       | Mandatory  |   Data Type      |
| ----------------------------------------- | ------------------------------------------------------------------| -----------|------------------|
| `tenantId`                                | Unique id for a tenant.                                           | Yes        | String           |
| `mobileNumber`                            | Mobile number of the user                                         | Yes        | String           |
| `type`                                    | OTP type ex: login/register/password reset                        | Yes        | String           |
| `userType`                                | Type of user ex: Citizen/Employee                                 | No         | String           |


### Kafka Consumers

- NA

### Kafka Producers

- Following are the Producer topic.
    - `egov.core.notification.sms.otp` :- This topic is used to send OTP to user mobile number.
    - `org.egov.core.notification.email` :- This topic is used to send OTP to user email id.
