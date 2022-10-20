
package org.jamabandi;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="GetAbadiKhasraListByKhewatOnlineResult" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "getAbadiKhasraListByKhewatOnlineResult"
})
@XmlRootElement(name = "GetAbadiKhasraListByKhewatOnlineResponse")
public class GetAbadiKhasraListByKhewatOnlineResponse {

    @XmlElement(name = "GetAbadiKhasraListByKhewatOnlineResult")
    protected String getAbadiKhasraListByKhewatOnlineResult;

    /**
     * Gets the value of the getAbadiKhasraListByKhewatOnlineResult property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGetAbadiKhasraListByKhewatOnlineResult() {
        return getAbadiKhasraListByKhewatOnlineResult;
    }

    /**
     * Sets the value of the getAbadiKhasraListByKhewatOnlineResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGetAbadiKhasraListByKhewatOnlineResult(String value) {
        this.getAbadiKhasraListByKhewatOnlineResult = value;
    }

}
