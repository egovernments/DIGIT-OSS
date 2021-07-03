package org.egov.pgr.repository.rowmapper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.pgr.model.ActionInfo;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import java.sql.Array;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@Slf4j
public class ActionInfoRowMapper implements ResultSetExtractor<List<ActionInfo>> {

    @Autowired
    ObjectMapper objectMapper;

    public List<ActionInfo> extractData(ResultSet rs) throws SQLException, DataAccessException {
        List<ActionInfo> actionInfoList = new ArrayList<>();
        while(rs.next()){
            List<String> media = null;
            try {

            PGobject pgObj = (PGobject) rs.getObject("media");
            String content = null;
            if(pgObj!=null)
                content =  pgObj.getValue();

                if(content!=null && !content.equalsIgnoreCase("null")){
                    String[] urls = content.substring(1,content.length()-1).split(",");
                    media = Arrays.asList(urls);
                    media = media.stream().map(x -> x.replace("\"", "").trim()).collect(Collectors.toList());
                }
            }
            catch (Exception e){
                e.printStackTrace();
                log.error("MEDIA ERROR","Error parsing media");
            }


            ActionInfo actionInfo = ActionInfo.builder()
                    .uuid(rs.getString("uuid"))
                    .tenantId(rs.getString("tenantid"))
                    .by(rs.getString("by"))
                    .isInternal(rs.getBoolean("isinternal"))
                    .when(rs.getLong("when"))
                    .businessKey(rs.getString("businesskey"))
                    .action(rs.getString("action"))
                    .status(rs.getString("status"))
                    .assignee(rs.getString("assignee"))
                    .media(media)
                    .comment(rs.getString("comments"))
                    .build();
            actionInfoList.add(actionInfo);
        }
        return actionInfoList;
    }
}
