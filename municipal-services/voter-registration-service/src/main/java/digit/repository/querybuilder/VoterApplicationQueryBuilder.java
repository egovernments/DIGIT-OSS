package digit.repository.querybuilder;

import digit.web.models.coremodels.VoterApplicationSearchCriteria;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import java.util.List;

@Component
public class VoterApplicationQueryBuilder {

    private static final String BASE_VTR_QUERY = " SELECT vtr.id as vid, vtr.tenantid as vtenantid, vtr.assemblyconstituency as vassemblyconstituency, vtr.applicationnumber as vapplicationnumber, vtr.applicantid as vapplicantid, vtr.datesinceresidence as vdatesinceresidence, vtr.createdby as vcreatedby, vtr.lastmodifiedby as vlastmodifiedby, vtr.createdtime as vcreatedtime, vtr.lastmodifiedtime as vlastmodifiedtime, ";

    private static final String ADDRESS_SELECT_QUERY = " add.id as aid, add.tenantid as atenantid, add.doorno as adoorno, add.latitude as alatitude, add.longitude as alongitude, add.buildingname as abuildingname, add.addressid as aaddressid, add.addressnumber as aaddressnumber, add.type as atype, add.addressline1 as aaddressline1, add.addressline2 as aaddressline2, add.landmark as alandmark, add.street as astreet, add.city as acity, add.locality as alocality, add.pincode as apincode, add.detail as adetail, add.registrationid as aregistrationid ";

    private static final String FROM_TABLES = " FROM eg_vt_registration vtr LEFT JOIN eg_vt_address add ON vtr.id = add.registrationid ";

    private final String ORDERBY_CREATEDTIME = " ORDER BY vtr.createdtime DESC ";

    public String getVoterApplicationSearchQuery(VoterApplicationSearchCriteria criteria, List<Object> preparedStmtList){
        StringBuilder query = new StringBuilder(BASE_VTR_QUERY);
        query.append(ADDRESS_SELECT_QUERY);
        query.append(FROM_TABLES);

        if(!ObjectUtils.isEmpty(criteria.getTenantId())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" vtr.tenantid = ? ");
            preparedStmtList.add(criteria.getTenantId());
        }
        if(!ObjectUtils.isEmpty(criteria.getStatus())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" vtr.status = ? ");
            preparedStmtList.add(criteria.getStatus());
        }
        if(!CollectionUtils.isEmpty(criteria.getIds())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" vtr.id IN ( ").append(createQuery(criteria.getIds())).append(" ) ");
            addToPreparedStatement(preparedStmtList, criteria.getIds());
        }
        if(!ObjectUtils.isEmpty(criteria.getApplicationNumber())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" vtr.applicationnumber = ? ");
            preparedStmtList.add(criteria.getApplicationNumber());
        }

        // order voter registration applications based on their createdtime in latest first manner
        query.append(ORDERBY_CREATEDTIME);

        return query.toString();
    }

    private void addClauseIfRequired(StringBuilder query, List<Object> preparedStmtList){
        if(preparedStmtList.isEmpty()){
            query.append(" WHERE ");
        }else{
            query.append(" AND ");
        }
    }

    private String createQuery(List<String> ids) {
        StringBuilder builder = new StringBuilder();
        int length = ids.size();
        for (int i = 0; i < length; i++) {
            builder.append(" ?");
            if (i != length - 1)
                builder.append(",");
        }
        return builder.toString();
    }

    private void addToPreparedStatement(List<Object> preparedStmtList, List<String> ids) {
        ids.forEach(id -> {
            preparedStmtList.add(id);
        });
    }
}
