package org.egov.dataupload.property.models;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import javax.validation.Valid;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * OwnerInfo
 */
@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-05-11T14:12:44.497+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OwnerInfo extends User  {

        @JsonProperty("isPrimaryOwner")
        private Boolean isPrimaryOwner;

        @JsonProperty("ownerShipPercentage")
        private Double ownerShipPercentage;

        @Size(max=64)
        @JsonProperty("ownerType")
        private String ownerType;

        @Size(max=64)
        @JsonProperty("institutionId")
        private String institutionId;

        @JsonProperty("documents")
        @Valid
        private Set<Document> documents;

        public enum RelationshipEnum {
                FATHER("FATHER"),

                HUSBAND("HUSBAND");

                private String value;

                RelationshipEnum(String value) {
                        this.value = value;
                }

                @Override
                @JsonValue
                public String toString() {
                        return String.valueOf(value);
                }

                @JsonCreator
                public static RelationshipEnum fromValue(String text) {
                        for (RelationshipEnum b : RelationshipEnum.values()) {
                                if (String.valueOf(b.value).equals(text)) {
                                        return b;
                                }
                        }
                        return null;
                }
        }

        @JsonProperty("relationship")
        private RelationshipEnum relationship;



        @Builder
        public OwnerInfo(Long id, String uuid, String userName, String password, String salutation, String name, String gender, String mobileNumber, String emailId, String altContactNumber, String pan, String aadhaarNumber, String permanentAddress, String permanentCity, String permanentPincode, String correspondenceCity, String correspondencePincode, String correspondenceAddress, Boolean active, Long dob, Long pwdExpiryDate, String locale, String type, String signature, Boolean accountLocked, List<Role> roles, String fatherOrHusbandName, String bloodGroup, String identificationMark, String photo, String createdBy, Long createdDate, String lastModifiedBy, Long lastModifiedDate, String otpReference, String tenantId, Boolean isPrimaryOwner, Double ownerShipPercentage, String ownerType,String institutionId,Set<Document> documents,RelationshipEnum relationship) {
                super(id,uuid, userName, password, salutation, name, gender, mobileNumber, emailId, altContactNumber, pan, aadhaarNumber, permanentAddress, permanentCity, permanentPincode, correspondenceCity, correspondencePincode, correspondenceAddress, active, dob, pwdExpiryDate, locale, type, signature, accountLocked, roles, fatherOrHusbandName, bloodGroup, identificationMark, photo, createdBy, createdDate, lastModifiedBy, lastModifiedDate, otpReference, tenantId);
                this.isPrimaryOwner = isPrimaryOwner;
                this.ownerShipPercentage = ownerShipPercentage;
                this.ownerType = ownerType;
                this.relationship=relationship;
                this.institutionId=institutionId;
                this.documents=documents;
        }

        public OwnerInfo addDocumentsItem(Document documentsItem) {
                if (this.documents == null) {
                        this.documents = new HashSet<>();
                }
                this.documents.add(documentsItem);
                return this;
        }

        /**
         * Populates Owner fields from the given User object
         * @param user User object obtained from user service
         */
        public void addUserDetail(User user){
                this.setLastModifiedDate(user.getLastModifiedDate());
                this.setLastModifiedBy(user.getLastModifiedBy());
                this.setCreatedBy(user.getCreatedBy());
                this.setCreatedDate(user.getCreatedDate());
                this.setUserName(user.getUserName());
                this.setPassword(user.getPassword());
                this.setSalutation(user.getSalutation());
                this.setName(user.getName());
                this.setGender(user.getGender());
                this.setMobileNumber(user.getMobileNumber());
                this.setEmailId(user.getEmailId());
                this.setAltContactNumber(user.getAltContactNumber());
                this.setPan(user.getPan());
                this.setAadhaarNumber(user.getAadhaarNumber());
                this.setPermanentAddress(user.getPermanentAddress());
                this.setPermanentCity(user.getPermanentCity());
                this.setPermanentPincode(user.getPermanentPincode());
                this.setCorrespondenceAddress(user.getCorrespondenceAddress());
                this.setCorrespondenceCity(user.getCorrespondenceCity());
                this.setCorrespondencePincode(user.getCorrespondencePincode());
                this.setActive(user.getActive());
                this.setDob(user.getDob());
                this.setPwdExpiryDate(user.getPwdExpiryDate());
                this.setLocale(user.getLocale());
                this.setType(user.getType());
                this.setAccountLocked(user.getAccountLocked());
                this.setRoles(user.getRoles());
                this.setFatherOrHusbandName(user.getFatherOrHusbandName());
                this.setBloodGroup(user.getBloodGroup());
                this.setIdentificationMark(user.getIdentificationMark());
                this.setPhoto(user.getPhoto());
                this.setTenantId(user.getTenantId());
        }

        public OwnerInfo(User user){
                this.setTenantId(user.getTenantId());
                this.setUserName(user.getUserName());
                this.setId(user.getId());
                this.setName(user.getName());
                this.setType(user.getType());
                this.setMobileNumber(user.getMobileNumber());
                this.setEmailId(user.getEmailId());
                this.setRoles(addRoles(user.getRoles()));
                this.setUuid(user.getUuid());
        }

        public void addCitizenDetail(User user){
                this.setTenantId(user.getTenantId());
                this.setUserName(user.getUserName());
                this.setId(user.getId());
                this.setName(user.getName());
                this.setType(user.getType());
                this.setMobileNumber(user.getMobileNumber());
                this.setEmailId(user.getEmailId());
                this.setRoles(user.getRoles());
                this.setUuid(user.getUuid());
        }

        private List<Role> addRoles(List<Role> Roles){
                LinkedList<Role> addroles = new LinkedList<>();
                Roles.forEach(role -> {
                        Role addrole = new Role();
                        addrole.setId(role.getId());
                        addrole.setName(role.getName());
                        addrole.setCode(role.getCode());
                        addroles.add(addrole);
                });
                return addroles;
        }


        @Override
        public boolean equals(Object o) {
                if (this == o) return true;
                if (o == null || getClass() != o.getClass()) return false;
                if (!super.equals(o)) return false;

                User user = (User) o;

                return Objects.equals(this.getUuid(), user.getUuid()) &&
                        Objects.equals(this.getName(), user.getName()) &&
                        Objects.equals(this.getMobileNumber(), user.getMobileNumber());
        }

        @Override
        public int hashCode() {

                return super.hashCode();
        }
}

