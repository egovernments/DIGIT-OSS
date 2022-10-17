
package org.jamabandi;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
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
 *         &lt;element name="isKhasraRCCMSPendingResult" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "isKhasraRCCMSPendingResult"
})
@XmlRootElement(name = "isKhasraRCCMSPendingResponse")
public class IsKhasraRCCMSPendingResponse {

    protected String isKhasraRCCMSPendingResult;

    /**
     * Gets the value of the isKhasraRCCMSPendingResult property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getIsKhasraRCCMSPendingResult() {
        return isKhasraRCCMSPendingResult;
    }

    /**
     * Sets the value of the isKhasraRCCMSPendingResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setIsKhasraRCCMSPendingResult(String value) {
        this.isKhasraRCCMSPendingResult = value;
    }

}
