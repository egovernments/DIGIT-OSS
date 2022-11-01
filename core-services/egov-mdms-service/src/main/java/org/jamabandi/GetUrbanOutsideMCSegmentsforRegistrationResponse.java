
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
 *         &lt;element name="GetUrbanOutsideMCSegmentsforRegistrationResult" minOccurs="0"&gt;
 *           &lt;complexType&gt;
 *             &lt;complexContent&gt;
 *               &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *                 &lt;sequence&gt;
 *                 &lt;/sequence&gt;
 *               &lt;/restriction&gt;
 *             &lt;/complexContent&gt;
 *           &lt;/complexType&gt;
 *         &lt;/element&gt;
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
    "getUrbanOutsideMCSegmentsforRegistrationResult"
})
@XmlRootElement(name = "GetUrbanOutsideMCSegmentsforRegistrationResponse")
public class GetUrbanOutsideMCSegmentsforRegistrationResponse {

    @XmlElement(name = "GetUrbanOutsideMCSegmentsforRegistrationResult")
    protected GetUrbanOutsideMCSegmentsforRegistrationResponse.GetUrbanOutsideMCSegmentsforRegistrationResult getUrbanOutsideMCSegmentsforRegistrationResult;

    /**
     * Gets the value of the getUrbanOutsideMCSegmentsforRegistrationResult property.
     * 
     * @return
     *     possible object is
     *     {@link GetUrbanOutsideMCSegmentsforRegistrationResponse.GetUrbanOutsideMCSegmentsforRegistrationResult }
     *     
     */
    public GetUrbanOutsideMCSegmentsforRegistrationResponse.GetUrbanOutsideMCSegmentsforRegistrationResult getGetUrbanOutsideMCSegmentsforRegistrationResult() {
        return getUrbanOutsideMCSegmentsforRegistrationResult;
    }

    /**
     * Sets the value of the getUrbanOutsideMCSegmentsforRegistrationResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link GetUrbanOutsideMCSegmentsforRegistrationResponse.GetUrbanOutsideMCSegmentsforRegistrationResult }
     *     
     */
    public void setGetUrbanOutsideMCSegmentsforRegistrationResult(GetUrbanOutsideMCSegmentsforRegistrationResponse.GetUrbanOutsideMCSegmentsforRegistrationResult value) {
        this.getUrbanOutsideMCSegmentsforRegistrationResult = value;
    }


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
     *       &lt;/sequence&gt;
     *     &lt;/restriction&gt;
     *   &lt;/complexContent&gt;
     * &lt;/complexType&gt;
     * </pre>
     * 
     * 
     */
    @XmlAccessorType(XmlAccessType.FIELD)
    @XmlType(name = "")
    public static class GetUrbanOutsideMCSegmentsforRegistrationResult {


    }

}
