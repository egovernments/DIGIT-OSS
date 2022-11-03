
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
 *         &lt;element name="GetUELitigationsResult" minOccurs="0"&gt;
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
    "getUELitigationsResult"
})
@XmlRootElement(name = "GetUELitigationsResponse")
public class GetUELitigationsResponse {

    @XmlElement(name = "GetUELitigationsResult")
    protected GetUELitigationsResponse.GetUELitigationsResult getUELitigationsResult;

    /**
     * Gets the value of the getUELitigationsResult property.
     * 
     * @return
     *     possible object is
     *     {@link GetUELitigationsResponse.GetUELitigationsResult }
     *     
     */
    public GetUELitigationsResponse.GetUELitigationsResult getGetUELitigationsResult() {
        return getUELitigationsResult;
    }

    /**
     * Sets the value of the getUELitigationsResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link GetUELitigationsResponse.GetUELitigationsResult }
     *     
     */
    public void setGetUELitigationsResult(GetUELitigationsResponse.GetUELitigationsResult value) {
        this.getUELitigationsResult = value;
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
    public static class GetUELitigationsResult {


    }

}
