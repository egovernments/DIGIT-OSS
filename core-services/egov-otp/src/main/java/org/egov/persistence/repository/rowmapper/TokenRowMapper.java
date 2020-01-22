package org.egov.persistence.repository.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.egov.domain.model.Token;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

@Component
public class TokenRowMapper implements RowMapper<Token> {

    private static final String YES = "Y";

    @Override
    public Token mapRow(final ResultSet rs, final int rowNum) throws SQLException {

        Token token = Token.builder().uuid(rs.getString("id")).identity(rs.getString("tokenidentity"))
                .timeToLiveInSeconds(rs.getLong("ttlsecs")).number(rs.getString("tokennumber")).createdDate(rs.getDate("createddate"))
                .tenantId(rs.getString("tenantid")).createdTime(rs.getLong("createddatenew")).build();
        token.setValidated(isValidated(rs.getString("validated")));

        return token;
    }

    public boolean isValidated(String validated) {
        return YES.equalsIgnoreCase(validated);
    }

}
