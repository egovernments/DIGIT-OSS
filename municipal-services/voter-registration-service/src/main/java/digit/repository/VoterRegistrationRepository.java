package digit.repository;

import digit.repository.querybuilder.VoterApplicationQueryBuilder;
import digit.repository.rowmapper.VoterApplicationRowMapper;
import digit.web.models.coremodels.VoterApplicationSearchCriteria;
import digit.web.models.VoterRegistrationApplication;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Repository
public class VoterRegistrationRepository {

    @Autowired
    private VoterApplicationQueryBuilder queryBuilder;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private VoterApplicationRowMapper rowMapper;

    public List<VoterRegistrationApplication> getApplications(VoterApplicationSearchCriteria searchCriteria){
        List<Object> preparedStmtList = new ArrayList<>();
        String query = queryBuilder.getVoterApplicationSearchQuery(searchCriteria, preparedStmtList);
        log.info("Final query: " + query);
        return jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);

    }
}
