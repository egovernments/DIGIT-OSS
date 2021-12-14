/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) <2015>  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */
package org.egov.user.repository.builder;

import lombok.extern.slf4j.Slf4j;
import org.egov.user.domain.model.UserSearchCriteria;
import org.egov.user.persistence.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.Iterator;
import java.util.List;

import static java.util.Objects.isNull;
import static org.springframework.util.CollectionUtils.isEmpty;

@Component
@Slf4j
public class UserTypeQueryBuilder {

    @Autowired
    private RoleRepository roleRepository;

    private static final String SELECT_USER_QUERY = "SELECT userdata.title, userdata.salutation, userdata.dob, userdata.locale, userdata.username, userdata" +
            ".password, userdata.pwdexpirydate,  userdata.mobilenumber, userdata.altcontactnumber, userdata.emailid, userdata.createddate, userdata" +
            ".lastmodifieddate,  userdata.createdby, userdata.lastmodifiedby, userdata.active, userdata.name, userdata.gender, userdata.pan, userdata.aadhaarnumber, userdata" +
            ".type,  userdata.version, userdata.guardian, userdata.guardianrelation, userdata.signature, userdata.accountlocked, userdata.accountlockeddate, userdata" +
            ".bloodgroup, userdata.photo, userdata.identificationmark,  userdata.tenantid, userdata.id, userdata.uuid, userdata.alternatemobilenumber, addr.id as addr_id, addr.type as " +
            "addr_type, addr .address as addr_address,  addr.city as addr_city, addr.pincode as addr_pincode, addr" +
            ".tenantid as " +
            "addr_tenantid, addr.userid as addr_userid, ur.role_code as role_code, ur.role_tenantid as role_tenantid \n" +
            "\tFROM eg_user userdata LEFT OUTER JOIN eg_user_address addr ON userdata.id = addr.userid AND userdata.tenantid = addr" +
            ".tenantid LEFT OUTER JOIN eg_userrole_v1 ur ON userdata.id = ur.user_id AND userdata.tenantid = ur.user_tenantid  ";

    private static final String PAGINATION_WRAPPER = "SELECT * FROM " +
            "(SELECT *, DENSE_RANK() OVER (ORDER BY id) offset_ FROM " +
            "({baseQuery})" +
            " result) result_offset " +
            "WHERE offset_ > ? AND offset_ <= ?";

    public static final String SELECT_NEXT_SEQUENCE_USER = "select nextval('seq_eg_user')";

    public static final String SELECT_FAILED_ATTEMPTS_BY_USER_SQL = "select user_uuid, ip, attempt_date, active from " +
            "eg_user_login_failed_attempts WHERE user_uuid = :user_uuid AND attempt_date >= :attempt_date AND active " +
            "= 'true' ";

    public static final String INSERT_FAILED_ATTEMPTS_SQL = " INSERT INTO eg_user_login_failed_attempts (user_uuid, " +
            "ip, attempt_date, active) VALUES ( :user_uuid, :ip , :attempt_date, :active ) ";

    public static final String UPDATE_FAILED_ATTEMPTS_SQL = " UPDATE eg_user_login_failed_attempts SET active = " +
            "'false' WHERE user_uuid = :user_uuid";

    private static final String SELECT_USER_ROLE_QUERY = "SELECT distinct(user_id) from eg_userrole_v1 ur";

    @SuppressWarnings("rawtypes")
    public String getQuery(final UserSearchCriteria userSearchCriteria, final List preparedStatementValues) {
        final StringBuilder selectQuery = new StringBuilder(SELECT_USER_QUERY);

        addWhereClause(selectQuery, preparedStatementValues, userSearchCriteria);


        addOrderByClause(selectQuery, userSearchCriteria);
        return addPagingClause(selectQuery, preparedStatementValues, userSearchCriteria);
    }

    @SuppressWarnings("rawtypes")
    public String getQueryUserRoleSearch(final UserSearchCriteria userSearchCriteria, final List preparedStatementValues) {
        final StringBuilder selectQuery = new StringBuilder(SELECT_USER_ROLE_QUERY);

        addWhereClauseUserRoles(selectQuery, preparedStatementValues, userSearchCriteria);
        return selectQuery.toString();

    }


    @SuppressWarnings({"unchecked", "rawtypes"})
    private void addWhereClause(final StringBuilder selectQuery, final List preparedStatementValues,
                                final UserSearchCriteria userSearchCriteria) {

        if (CollectionUtils.isEmpty(userSearchCriteria.getId()) && userSearchCriteria.getUserName() == null
                && userSearchCriteria.getName() == null && userSearchCriteria.getEmailId() == null
                && userSearchCriteria.getActive() == null && userSearchCriteria.getTenantId() == null
                && userSearchCriteria.getType() == null && userSearchCriteria.getUuid() == null)
            return;

        selectQuery.append(" WHERE");
        boolean isAppendAndClause = false;

        if (userSearchCriteria.getId() != null && !userSearchCriteria.getId().isEmpty()) {
            isAppendAndClause = addAndClauseIfRequired(false, selectQuery);
            selectQuery.append(" userdata.id IN ( ").append(getQueryForCollection(userSearchCriteria.getId(),
                    preparedStatementValues)).append(" )");
        }

        if (userSearchCriteria.getTenantId() != null) {
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" userdata.tenantid = ?");
            preparedStatementValues.add(userSearchCriteria.getTenantId().trim());
        }

        if (userSearchCriteria.getUserName() != null) {
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" userdata.username = ?");
            preparedStatementValues.add(userSearchCriteria.getUserName().trim());
        }

        if (!userSearchCriteria.isFuzzyLogic() && userSearchCriteria.getName() != null) {
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" userdata.name = ?");
            preparedStatementValues.add(userSearchCriteria.getName().trim());
        }

        if (userSearchCriteria.getActive() != null) {
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" userdata.active = ?");
            preparedStatementValues.add(userSearchCriteria.getActive());
        }

        if (userSearchCriteria.getEmailId() != null) {
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" userdata.emailid = ?");
            preparedStatementValues.add(userSearchCriteria.getEmailId().trim());
        }
//
//        if (userSearchCriteria.getAadhaarNumber() != null) {
//            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
//            selectQuery.append(" user.aadhaarnumber = ?");
//            preparedStatementValues.add(userSearchCriteria.getAadhaarNumber().trim());
//        }

        if (userSearchCriteria.getMobileNumber() != null && userSearchCriteria.getAlternatemobilenumber()!=null) {
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" ( userdata.mobilenumber = ? OR ");
            preparedStatementValues.add(userSearchCriteria.getMobileNumber().trim());
            selectQuery.append(" userdata.alternatemobilenumber = ? )");
            preparedStatementValues.add(userSearchCriteria.getAlternatemobilenumber().trim());
        }
        
        else if(userSearchCriteria.getMobileNumber() != null) {
        	isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" userdata.mobilenumber = ? ");
            preparedStatementValues.add(userSearchCriteria.getMobileNumber().trim());
        }

//        if (userSearchCriteria.getPan() != null) {
//            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
//            selectQuery.append(" user.pan = ?");
//            preparedStatementValues.add(userSearchCriteria.getPan().trim());
//        }

        if (userSearchCriteria.getType() != null) {
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" userdata.type = ?");
            preparedStatementValues.add(userSearchCriteria.getType().toString());
        }

        if (userSearchCriteria.isFuzzyLogic() && userSearchCriteria.getName() != null) {
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" userdata.name like " + "'%").append(userSearchCriteria.getName().trim()).append("%'");
        }

        if (!isEmpty(userSearchCriteria.getUuid())) {
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" userdata.uuid IN (").append(getQueryForCollection(userSearchCriteria.getUuid(),
                    preparedStatementValues)).append(" )");
        }

//        if(!isEmpty(userSearchCriteria.getRoleCodes())){
//            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
//            selectQuery.append(" ur.role_code IN (").append(getQueryForCollection(userSearchCriteria.getRoleCodes(),
//                    preparedStatementValues)).append(" )");
//        }
    }

    private void addOrderByClause(final StringBuilder selectQuery, final UserSearchCriteria userSearchCriteria) {
        final String sortBy = userSearchCriteria.getSort() != null && !userSearchCriteria.getSort().isEmpty()
                ? " userdata." + userSearchCriteria.getSort().get(0) : "userdata.name";
        selectQuery.append(" ORDER BY ").append(sortBy);
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    private String addPagingClause(final StringBuilder selectQuery, final List preparedStatementValues,
                                   final UserSearchCriteria criteria) {

        if (isNull(criteria.getOffset()))
            criteria.setOffset(0);

        if (criteria.getLimit() != null && criteria.getLimit() != 0) {
            String finalQuery = PAGINATION_WRAPPER.replace("{baseQuery}", selectQuery);
            preparedStatementValues.add(criteria.getOffset());
            preparedStatementValues.add(criteria.getOffset() + criteria.getLimit());

            return finalQuery;
        } else
            return selectQuery.toString();

    }

    private void addWhereClauseUserRoles(final StringBuilder selectQuery, final List preparedStatementValues,
                                         final UserSearchCriteria userSearchCriteria) {


        selectQuery.append(" WHERE");
        boolean isAppendAndClause = false;

        if (userSearchCriteria.getTenantId() != null) {
            isAppendAndClause = addAndClauseIfRequired(false, selectQuery);
            selectQuery.append(" ur.role_tenantid = ?");
            preparedStatementValues.add(userSearchCriteria.getTenantId().trim());
        }


        if (!isEmpty(userSearchCriteria.getRoleCodes())) {
            isAppendAndClause = addAndClauseIfRequired(isAppendAndClause, selectQuery);
            selectQuery.append(" ur.role_code IN (").append(getQueryForCollection(userSearchCriteria.getRoleCodes(),
                    preparedStatementValues)).append(" )");
        }

    }

    private String getQueryForCollection(List<?> ids, List<Object> preparedStmtList) {
        StringBuilder builder = new StringBuilder();
        Iterator<?> iterator = ids.iterator();
        while (iterator.hasNext()) {
            builder.append(" ?");
            preparedStmtList.add(iterator.next());

            if (iterator.hasNext())
                builder.append(",");
        }
        return builder.toString();
    }

    /**
     * This method is always called at the beginning of the method so that and
     * is prepended before the field's predicate is handled.
     *
     * @param appendAndClauseFlag
     * @param queryString
     * @return boolean indicates if the next predicate should append an "AND"
     */
    private boolean addAndClauseIfRequired(final boolean appendAndClauseFlag, final StringBuilder queryString) {
        if (appendAndClauseFlag)
            queryString.append(" AND");

        return true;
    }

    public String getInsertUserQuery() {
        return "insert into eg_user (id,uuid,tenantid,salutation,dob,locale,username,password,pwdexpirydate,mobilenumber,altcontactnumber,emailid,active,name,gender,pan,aadhaarnumber,"
                + "type,guardian,guardianrelation,signature,accountlocked,bloodgroup,photo,identificationmark,createddate,lastmodifieddate,createdby,lastmodifiedby,alternatemobilenumber) values (:id,:uuid,:tenantid,:salutation,"
                + ":dob,:locale,:username,:password,:pwdexpirydate,:mobilenumber,:altcontactnumber,:emailid,:active,:name,:gender,:pan,:aadhaarnumber,:type,:guardian,:guardianrelation,:signature,"
                + ":accountlocked,:bloodgroup,:photo,:identificationmark,:createddate,:lastmodifieddate,:createdby,:lastmodifiedby,:alternatemobilenumber) ";
    }

    public String getUpdateUserQuery() {
        return "update eg_user set salutation=:Salutation,dob=:Dob,locale=:Locale,password=:Password,pwdexpirydate=:PasswordExpiryDate,mobilenumber=:MobileNumber,altcontactnumber=:AltContactNumber,emailid=:EmailId,active=:Active,name=:Name,gender=:Gender,pan=:Pan,aadhaarnumber=:AadhaarNumber,"
                + "type=:Type,guardian=:Guardian,guardianrelation=:GuardianRelation,signature=:Signature," +
                "accountlocked=:AccountLocked, accountlockeddate=:AccountLockedDate, bloodgroup=:BloodGroup," +
                "photo=:Photo, identificationmark=:IdentificationMark,lastmodifieddate=:LastModifiedDate," +
                "lastmodifiedby=:LastModifiedBy, alternatemobilenumber=:alternatemobilenumber where username=:username and tenantid=:tenantid and type=:type";
    }


    public String getUserPresentByUserNameAndTenant() {
        return "select count(*) from eg_user where username =:userName and tenantId =:tenantId and type = :userType ";
    }

}
