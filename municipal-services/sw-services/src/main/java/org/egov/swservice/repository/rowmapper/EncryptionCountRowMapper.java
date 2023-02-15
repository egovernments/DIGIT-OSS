package org.egov.swservice.repository.rowmapper;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.swservice.web.models.EncryptionCount;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class EncryptionCountRowMapper implements ResultSetExtractor<EncryptionCount> {

    @Autowired
    private ObjectMapper mapper;

    @Override
    public EncryptionCount extractData(ResultSet rs) throws SQLException, DataAccessException {

        EncryptionCount encryptionCount = new EncryptionCount();

        while (rs.next()) {
            encryptionCount = EncryptionCount.builder().id(rs.getString("id"))
                    .batchOffset(rs.getLong("batchOffset"))
                    .recordCount(rs.getLong("recordCount"))
                    .createdTime(rs.getLong("createdtime"))
                    .tenantid(rs.getString("tenantid"))
                    .message(rs.getString("message"))
                    .encryptiontime(rs.getLong("encryptiontime")).build();
        }
        return encryptionCount;
    }

}
