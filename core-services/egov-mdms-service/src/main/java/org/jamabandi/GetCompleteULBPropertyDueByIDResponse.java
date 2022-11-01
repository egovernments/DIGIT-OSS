
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
 *         &lt;element name="GetCompleteULBPropertyDueByIDResult" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "getCompleteULBPropertyDueByIDResult"
})
@XmlRootElement(name = "GetCompleteULBPropertyDueByIDResponse")
public class GetCompleteULBPropertyDueByIDResponse {

    @XmlElement(name = "GetCompleteULBPropertyDueByIDResult")
    protected String getCompleteULBPropertyDueByIDResult;

    /**
     * Gets the value of the getCompleteULBPropertyDueByIDResult property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGetCompleteULBPropertyDueByIDResult() {
        return getCompleteULBPropertyDueByIDResult;
    }

    /**
     * Sets the value of the getCompleteULBPropertyDueByIDResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGetCompleteULBPropertyDueByIDResult(String value) {
        this.getCompleteULBPropertyDueByIDResult = value;
    }

}
