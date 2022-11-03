
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
 *         &lt;element name="GetUrbanOutsideMCVillagesforRegistrationResult" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "getUrbanOutsideMCVillagesforRegistrationResult"
})
@XmlRootElement(name = "GetUrbanOutsideMCVillagesforRegistrationResponse")
public class GetUrbanOutsideMCVillagesforRegistrationResponse {

    @XmlElement(name = "GetUrbanOutsideMCVillagesforRegistrationResult")
    protected String getUrbanOutsideMCVillagesforRegistrationResult;

    /**
     * Gets the value of the getUrbanOutsideMCVillagesforRegistrationResult property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGetUrbanOutsideMCVillagesforRegistrationResult() {
        return getUrbanOutsideMCVillagesforRegistrationResult;
    }

    /**
     * Sets the value of the getUrbanOutsideMCVillagesforRegistrationResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGetUrbanOutsideMCVillagesforRegistrationResult(String value) {
        this.getUrbanOutsideMCVillagesforRegistrationResult = value;
    }

}
