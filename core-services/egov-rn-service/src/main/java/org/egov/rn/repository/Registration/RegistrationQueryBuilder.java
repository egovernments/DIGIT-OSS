package org.egov.rn.repository.Registration;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RegistrationQueryBuilder {

    private static final String BASE_VTR_QUERY = " SELECT vtr.id as vid, vtr.tenantid as vtenantid, vtr.assemblyconstituency as vassemblyconstituency, vtr.applicationnumber as vapplicationnumber, vtr.applicantid as vapplicantid, vtr.datesinceresidence as vdatesinceresidence, vtr.createdby as vcreatedby, vtr.lastmodifiedby as vlastmodifiedby, vtr.createdtime as vcreatedtime, vtr.lastmodifiedtime as vlastmodifiedtime, ";

    private static final String ADDRESS_SELECT_QUERY = " add.id as aid, add.tenantid as atenantid, add.doorno as adoorno, add.latitude as alatitude, add.longitude as alongitude, add.buildingname as abuildingname, add.addressid as aaddressid, add.addressnumber as aaddressnumber, add.type as atype, add.addressline1 as aaddressline1, add.addressline2 as aaddressline2, add.landmark as alandmark, add.street as astreet, add.city as acity, add.locality as alocality, add.pincode as apincode, add.detail as adetail, add.registrationid as aregistrationid ";

    private static final String FROM_TABLES = " FROM eg_vt_registration vtr LEFT JOIN eg_vt_address add ON vtr.id = add.registrationid ";

    private final String ORDERBY_CREATEDTIME = " ORDER BY vtr.createdtime DESC ";

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