package org.egov.waterconnection.util;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.egov.common.contract.request.PlainAccessRequest;
import org.egov.common.contract.request.RequestInfo;
import org.egov.waterconnection.web.models.OwnerInfo;
import org.egov.waterconnection.service.UserService;
import org.egov.waterconnection.web.models.PlumberInfo;
import org.egov.waterconnection.web.models.WaterConnection;
import org.egov.waterconnection.web.models.users.UserDetailResponse;
import org.egov.waterconnection.web.models.users.UserSearchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

@Component
public class UnmaskingUtil {

    private static List<String> plainRequestFieldsList;

    @Autowired
    private UserService userService;

    public void getOwnerDetailsUnmasked(WaterConnection waterConnection, RequestInfo requestInfo) {

        PlainAccessRequest apiPlainAccessRequest = requestInfo.getPlainAccessRequest();

        List<String> plainRequestFieldsList = getAllFieldsPlainAccessList();
        PlainAccessRequest plainAccessRequest = PlainAccessRequest.builder()
                .plainRequestFields(plainRequestFieldsList)
                .build();
        requestInfo.setPlainAccessRequest(plainAccessRequest);

        UserSearchRequest userSearchRequest = userService.getBaseUserSearchRequest(waterConnection.getTenantId(), requestInfo);

        Set<String> ownerIds = new HashSet<>();

        for (OwnerInfo ownerInfo : waterConnection.getConnectionHolders()) {

            String currentOwnerId = ownerInfo.getUuid();

            /*
             * once user module is updated to handle masked update
             * users will be unmasked on need, currently all.
             */
            ownerIds.clear();
            ownerIds.add(currentOwnerId);
            userSearchRequest.setUuid(ownerIds);
            plainAccessRequest.setRecordId(currentOwnerId);

            UserDetailResponse userDetailResponse = userService.getUser(userSearchRequest);

            if(!ObjectUtils.isEmpty(userDetailResponse.getUser())) {
                OwnerInfo unmaskedUser = userDetailResponse.getUser().get(0);
                updateMaskedOwnerInfoWithUnmaskedFields(ownerInfo, unmaskedUser);
            }
            requestInfo.setPlainAccessRequest(apiPlainAccessRequest);
        }

    }

    private void updateMaskedOwnerInfoWithUnmaskedFields(OwnerInfo ownerInfo, OwnerInfo unmaskedUser) {

        if (!StringUtils.isEmpty(ownerInfo.getFatherOrHusbandName()) && ownerInfo.getFatherOrHusbandName().contains("*")) {
            ownerInfo.setFatherOrHusbandName(unmaskedUser.getFatherOrHusbandName());
        }
        if (ownerInfo.getMobileNumber().contains("*")) {
            ownerInfo.setMobileNumber(unmaskedUser.getMobileNumber());
        }
        if (!StringUtils.isEmpty(ownerInfo.getCorrespondenceAddress()) && ownerInfo.getCorrespondenceAddress().contains("*")) {
            ownerInfo.setCorrespondenceAddress(unmaskedUser.getCorrespondenceAddress());
        }
        if (ownerInfo.getUserName().contains("*")) {
            ownerInfo.setUserName(unmaskedUser.getUserName());
        }
        if (ownerInfo.getName().contains("*")) {
            ownerInfo.setName(unmaskedUser.getName());
        }
        if (ownerInfo.getGender().contains("*")) {
            ownerInfo.setGender(unmaskedUser.getGender());
        }
    }

    public static List<String> getAllFieldsPlainAccessList() {

        if (plainRequestFieldsList == null) {

            plainRequestFieldsList = new ArrayList<>();
            plainRequestFieldsList.add("mobileNumber");
            plainRequestFieldsList.add("guardian");
            plainRequestFieldsList.add("fatherOrHusbandName");
            plainRequestFieldsList.add("correspondenceAddress");
            plainRequestFieldsList.add("userName");
            plainRequestFieldsList.add("name");
            plainRequestFieldsList.add("gender");
        }
        return plainRequestFieldsList;
    }

    /**
     * Method returns true then owner info is modified for update,
     * it should be unmasked for unchanged field updates
     *
     * @param ownerInfo
     * @return Boolean
     */
    private Boolean shouldOwnerBeUnmaksed(OwnerInfo ownerInfo) {

        return !(ownerInfo.getFatherOrHusbandName().contains("*") &&

                ownerInfo.getMobileNumber().contains("*") &&

                ownerInfo.getCorrespondenceAddress().contains("*") &&

                ownerInfo.getUserName().contains("*") &&

                ownerInfo.getName().contains("*") &&

                ownerInfo.getGender().contains("*"));

    }


    /**
     * Method returns unmasked PlumberInfo,
     * it should be unmasked for unchanged field updates
     *
     * @param plumberInfos
     * @param unmaskedPlumberInfos
     */
    public boolean getUnmaskedPlumberInfo(List<PlumberInfo> plumberInfos, List<PlumberInfo> unmaskedPlumberInfos) {
        Map<String, PlumberInfo> unmaskedPlumberInfoMap;
        boolean isPlumberSwapped = false;
        if (!ObjectUtils.isEmpty(unmaskedPlumberInfos)) {
            unmaskedPlumberInfoMap = unmaskedPlumberInfos.stream().collect(Collectors.toMap(PlumberInfo::getId, Function.identity()));
            if (!ObjectUtils.isEmpty(plumberInfos)) {
                for (PlumberInfo plumberInfo : plumberInfos) {
                    if (!StringUtils.isEmpty(plumberInfo.getMobileNumber()) && plumberInfo.getMobileNumber().contains("*")) {
                        if (!StringUtils.isEmpty(unmaskedPlumberInfoMap.get(plumberInfo.getId()))) {
                            plumberInfo.setMobileNumber(unmaskedPlumberInfoMap.get(plumberInfo.getId()).getMobileNumber());
                            isPlumberSwapped = true;
                        }
                    }
                }
            }
        }
        return isPlumberSwapped;
    }

}
