package org.egov.persistence.repository;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.domain.exception.TokenUpdateException;
import org.egov.domain.model.Token;
import org.egov.domain.model.TokenSearchCriteria;
import org.egov.domain.model.Tokens;
import org.egov.domain.model.ValidateRequest;
import org.egov.persistence.repository.rowmapper.TokenRowMapper;
import org.egov.web.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class TokenRepository {

    private static final int UPDATED_ROWS_COUNT = 1;
    private static final String NO = "N";
    private static final String INSERT_TOKEN = "insert into eg_token(id,tenantid,tokennumber,tokenidentity,validated,ttlsecs,createddate,createdby,version,createddatenew) values (:id,:tenantId,:tokenNumber,:tokenIdentity,:validated,:ttlSecs,:createdDate,:createdBy,:version,:createddatenew);";
    private static final String GETTOKENS_BY_NUMBER_IDENTITY_TENANT = "select * from eg_token where tokenidentity=:tokenIdentity and tenantid=:tenantId and ((extract(epoch from now()) * 1000 - createddatenew)/1000)::int <= ttlsecs and validated = 'N'";
    private static final String UPDATE_TOKEN = "update eg_token set validated = 'Y' where id = :id";
    private static final String GETTOKEN_BYID = "select * from eg_token where id=:id";
    private static final String UPDATETOKEN_TLL_BYID = "update eg_token set ttlsecs = (extract (epoch from now()) - createddatenew / 1000)::int + :ttl where id = :id";

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    private OtpConfiguration otpConfiguration;

    public TokenRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    public Token save(Token token) {

        final Map<String, Object> tokenInputs = new HashMap<String, Object>();
        Date createdDate = new Date();
        tokenInputs.put("id", token.getUuid());
        tokenInputs.put("tenantId", token.getTenantId());
        tokenInputs.put("tokenNumber", token.getNumber());
        tokenInputs.put("tokenIdentity", token.getIdentity());
        tokenInputs.put("validated", NO);
        tokenInputs.put("ttlSecs", token.getTimeToLiveInSeconds());
        tokenInputs.put("createdDate", createdDate);
        tokenInputs.put("createdBy", 0l);
        tokenInputs.put("version", 0l);
        tokenInputs.put("createddatenew", System.currentTimeMillis());

        namedParameterJdbcTemplate.update(INSERT_TOKEN, tokenInputs);
        return token;
    }

    public Token markAsValidated(Token token) {
        token.setValidated(true);
        final boolean isUpdateSuccessful = markTokenAsValidated(token.getUuid()) == UPDATED_ROWS_COUNT;
        if (!isUpdateSuccessful) {
            throw new TokenUpdateException(token);
        }
        return token;
    }

    private int markTokenAsValidated(String id) {

        final Map<String, Object> tokenInputs = new HashMap<String, Object>();
        tokenInputs.put("id", id);
        return namedParameterJdbcTemplate.update(UPDATE_TOKEN, tokenInputs);
    }

    public Tokens findByIdentityAndTenantId(ValidateRequest request) {

        final Map<String, Object> tokenInputs = new HashMap<String, Object>();
        tokenInputs.put("tokenIdentity", request.getIdentity());
        tokenInputs.put("tenantId", request.getTenantId());
        List<Token> domainTokens = namedParameterJdbcTemplate.query(GETTOKENS_BY_NUMBER_IDENTITY_TENANT, tokenInputs,
                new TokenRowMapper());
        return new Tokens(domainTokens);
    }


    public Token findBy(TokenSearchCriteria searchCriteria) {

        Token token = null;
        final Map<String, Object> tokenInputs = new HashMap<String, Object>();
        tokenInputs.put("id", searchCriteria.getUuid());
        List<Token> domainTokens = namedParameterJdbcTemplate.query(GETTOKEN_BYID, tokenInputs, new TokenRowMapper());
        if (domainTokens != null && !domainTokens.isEmpty()) {
            token = domainTokens.get(0);
        }
        return token;
    }

    public int updateTTL(Token t) {
        final Map<String, Object> tokenInputs = new HashMap<String, Object>();
        tokenInputs.put("id", t.getUuid());
        tokenInputs.put("ttl", otpConfiguration.getTtl());
        return namedParameterJdbcTemplate.update(UPDATETOKEN_TLL_BYID, tokenInputs);
    }
}
