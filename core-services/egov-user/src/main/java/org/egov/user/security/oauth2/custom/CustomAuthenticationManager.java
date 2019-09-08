package org.egov.user.security.oauth2.custom;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.CredentialsContainer;
import org.springframework.security.oauth2.common.exceptions.OAuth2Exception;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class CustomAuthenticationManager implements AuthenticationManager {

    private boolean eraseCredentialsAfterAuthentication = true;


    @Autowired
    private List<AuthenticationProvider> authenticationProviders;

    @Autowired
    CustomAuthenticationManager(List<AuthenticationProvider> authenticationProviders){
        this.authenticationProviders = authenticationProviders;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        Class<? extends Authentication> toTest = authentication.getClass();
        Authentication result = null;

        for (AuthenticationProvider provider : authenticationProviders) {
            if (!provider.supports(toTest)) {
                continue;
            }
                log.debug("Authentication attempt using "+ provider.getClass().getName());

            try {
                result = provider.authenticate(authentication);

                if (result != null) {
                    copyDetails(authentication, result);
                    break;
                }
            }
            catch (AccountStatusException | InternalAuthenticationServiceException e) {
                // SEC-546: Avoid polling additional providers if auth failure is due to
                // invalid account status
                throw e;
            } catch (AuthenticationException e) {
                log.error("Unable to authenticate", e);
            }
        }


        if (result != null) {
            if (eraseCredentialsAfterAuthentication
                    && (result instanceof CredentialsContainer)) {
                // Authentication is complete. Remove credentials and other secret data
                // from authentication
                ((CredentialsContainer) result).eraseCredentials();
            }

            return result;
        } else
            throw new OAuth2Exception("AUTHENTICATION_FAILURE, unable to authenticate user");

    }



    /**
     * Copies the authentication details from a source Authentication object to a
     * destination one, provided the latter does not already have one set.
     *
     * @param source source authentication
     * @param dest the destination authentication object
     */
    private void copyDetails(Authentication source, Authentication dest) {
        if ((dest instanceof AbstractAuthenticationToken) && (dest.getDetails() == null)) {
            AbstractAuthenticationToken token = (AbstractAuthenticationToken) dest;

            token.setDetails(source.getDetails());
        }
    }

}
