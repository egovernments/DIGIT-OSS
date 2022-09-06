package org.egov.rn.repository.Registration;

import lombok.extern.slf4j.Slf4j;
import org.egov.rn.web.models.RegistrationData;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Repository
public class RegistrationRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;



    @Autowired
    private RegistrationDataRowsMapper rowMapper;

    public List<RegistrationData> getRegistrations(){
        List<Object> preparedStmtList = new ArrayList<>();
        return (List<RegistrationData>) jdbcTemplate.query("SELECT * FROM eg_rn_household", preparedStmtList.toArray(), rowMapper);
    }

    public RegistrationData getRegistrationsBy(String registrationId){
        String sql = "SELECT * FROM eg_rn_household WHERE ID = ?";
        return (RegistrationData) jdbcTemplate.queryForObject(
                sql,
                new Object[]{registrationId},
                new BeanPropertyRowMapper(RegistrationData.class));
    }


    public List<RegistrationData> getRegistrationPast(Long lastModifiedTime) {
        String sql = "SELECT * FROM eg_rn_household WHERE  lastmodifiedtime > "+lastModifiedTime;
        List<Object> preparedStmtList = new ArrayList<>();
        return (List<RegistrationData>) jdbcTemplate.query(sql, preparedStmtList.toArray(), rowMapper);
    }
}
