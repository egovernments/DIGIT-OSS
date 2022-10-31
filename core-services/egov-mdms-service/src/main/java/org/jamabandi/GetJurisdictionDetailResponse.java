
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
 *         &lt;element name="GetJurisdictionDetailResult" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "getJurisdictionDetailResult"
})
@XmlRootElement(name = "GetJurisdictionDetailResponse")
public class GetJurisdictionDetailResponse {

    @XmlElement(name = "GetJurisdictionDetailResult")
    protected String getJurisdictionDetailResult;

    /**
     * Gets the value of the getJurisdictionDetailResult property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGetJurisdictionDetailResult() {
        return getJurisdictionDetailResult;
    }

    /**
     * Sets the value of the getJurisdictionDetailResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGetJurisdictionDetailResult(String value) {
        this.getJurisdictionDetailResult = value;
    }

}
