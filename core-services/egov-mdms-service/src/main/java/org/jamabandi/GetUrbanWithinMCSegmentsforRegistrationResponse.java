
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
 *         &lt;element name="GetUrbanWithinMCSegmentsforRegistrationResult" minOccurs="0"&gt;
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
    "getUrbanWithinMCSegmentsforRegistrationResult"
})
@XmlRootElement(name = "GetUrbanWithinMCSegmentsforRegistrationResponse")
public class GetUrbanWithinMCSegmentsforRegistrationResponse {

    @XmlElement(name = "GetUrbanWithinMCSegmentsforRegistrationResult")
    protected GetUrbanWithinMCSegmentsforRegistrationResponse.GetUrbanWithinMCSegmentsforRegistrationResult getUrbanWithinMCSegmentsforRegistrationResult;

    /**
     * Gets the value of the getUrbanWithinMCSegmentsforRegistrationResult property.
     * 
     * @return
     *     possible object is
     *     {@link GetUrbanWithinMCSegmentsforRegistrationResponse.GetUrbanWithinMCSegmentsforRegistrationResult }
     *     
     */
    public GetUrbanWithinMCSegmentsforRegistrationResponse.GetUrbanWithinMCSegmentsforRegistrationResult getGetUrbanWithinMCSegmentsforRegistrationResult() {
        return getUrbanWithinMCSegmentsforRegistrationResult;
    }

    /**
     * Sets the value of the getUrbanWithinMCSegmentsforRegistrationResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link GetUrbanWithinMCSegmentsforRegistrationResponse.GetUrbanWithinMCSegmentsforRegistrationResult }
     *     
     */
    public void setGetUrbanWithinMCSegmentsforRegistrationResult(GetUrbanWithinMCSegmentsforRegistrationResponse.GetUrbanWithinMCSegmentsforRegistrationResult value) {
        this.getUrbanWithinMCSegmentsforRegistrationResult = value;
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
    public static class GetUrbanWithinMCSegmentsforRegistrationResult {


    }

}
