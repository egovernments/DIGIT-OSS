package org.egov.swagger.model;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import javax.validation.constraints.*;

import org.egov.common.contract.request.RequestInfo;

/**
 * ResponseInfo should be used to carry metadata information about the response from the server. apiId, ver and msgId in ResponseInfo should always correspond to the same values in respective request&#39;s RequestInfo.
 */


public class ResponseInfo {
    @JsonProperty("apiId")
    private String apiId = null;

    @JsonProperty("ver")
    private String ver = null;

    @JsonProperty("ts")
    private Long ts = null;

    @JsonProperty("resMsgId")
    private String resMsgId = null;

    @JsonProperty("msgId")
    private String msgId = null;

    /**
     * status of request processing - to be enhanced in futuer to include INPROGRESS
     */
    public enum StatusEnum {
        SUCCESSFUL("SUCCESSFUL"),

        FAILED("FAILED");

        private String value;

        StatusEnum(String value) {
            this.value = value;
        }

        @Override
        @JsonValue
        public String toString() {
            return String.valueOf(value);
        }

        @JsonCreator
        public static StatusEnum fromValue(String text) {
            for (StatusEnum b : StatusEnum.values()) {
                if (String.valueOf(b.value).equals(text)) {
                    return b;
                }
            }
            return null;
        }
    }

    @JsonProperty("status")
    private StatusEnum status = null;

    public ResponseInfo apiId(String apiId) {
        this.apiId = apiId;
        return this;
    }

    /**
     * unique API ID
     *
     * @return apiId
     **/

    @NotNull
    @Size(max = 128)
    public String getApiId() {
        return apiId;
    }

    public void setApiId(String apiId) {
        this.apiId = apiId;
    }

    public ResponseInfo ver(String ver) {
        this.ver = ver;
        return this;
    }

    /**
     * API version
     *
     * @return ver
     **/

    @NotNull
    @Size(max = 32)
    public String getVer() {
        return ver;
    }

    public void setVer(String ver) {
        this.ver = ver;
    }

    public ResponseInfo ts(Long ts) {
        this.ts = ts;
        return this;
    }

    /**
     * response time in epoch
     *
     * @return ts
     **/

    @NotNull
    public Long getTs() {
        return ts;
    }

    public void setTs(Long ts) {
        this.ts = ts;
    }

    public ResponseInfo resMsgId(String resMsgId) {
        this.resMsgId = resMsgId;
        return this;
    }

    /**
     * unique response message id (UUID) - will usually be the correlation id from the server
     *
     * @return resMsgId
     **/

    @Size(max = 256)
    public String getResMsgId() {
        return resMsgId;
    }

    public void setResMsgId(String resMsgId) {
        this.resMsgId = resMsgId;
    }

    public ResponseInfo msgId(String msgId) {
        this.msgId = msgId;
        return this;
    }

    /**
     * message id of the request
     *
     * @return msgId
     **/

    @Size(max = 256)
    public String getMsgId() {
        return msgId;
    }

    public void setMsgId(String msgId) {
        this.msgId = msgId;
    }

    public ResponseInfo status(StatusEnum status) {
        this.status = status;
        return this;
    }

    /**
     * status of request processing - to be enhanced in futuer to include INPROGRESS
     *
     * @return status
     **/

    @NotNull
    public StatusEnum getStatus() {
        return status;
    }

    public void setStatus(StatusEnum status) {
        this.status = status;
    }


    @Override
    public boolean equals(java.lang.Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ResponseInfo responseInfo = (ResponseInfo) o;
        return Objects.equals(this.apiId, responseInfo.apiId) &&
                Objects.equals(this.ver, responseInfo.ver) &&
                Objects.equals(this.ts, responseInfo.ts) &&
                Objects.equals(this.resMsgId, responseInfo.resMsgId) &&
                Objects.equals(this.msgId, responseInfo.msgId) &&
                Objects.equals(this.status, responseInfo.status);
    }

    @Override
    public int hashCode() {
        return Objects.hash(apiId, ver, ts, resMsgId, msgId, status);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class ResponseInfo {\n");

        sb.append("    apiId: ").append(toIndentedString(apiId)).append("\n");
        sb.append("    ver: ").append(toIndentedString(ver)).append("\n");
        sb.append("    ts: ").append(toIndentedString(ts)).append("\n");
        sb.append("    resMsgId: ").append(toIndentedString(resMsgId)).append("\n");
        sb.append("    msgId: ").append(toIndentedString(msgId)).append("\n");
        sb.append("    status: ").append(toIndentedString(status)).append("\n");
        sb.append("}");
        return sb.toString();
    }

    /**
     * Convert the given object to string with each line indented by 4 spaces
     * (except the first line).
     */
    private String toIndentedString(java.lang.Object o) {
        if (o == null) {
            return "null";
        }
        return o.toString().replace("\n", "\n    ");
    }

}

