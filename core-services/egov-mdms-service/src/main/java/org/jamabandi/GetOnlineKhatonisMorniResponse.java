
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
 *         &lt;element name="GetOnlineKhatonisMorniResult" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "getOnlineKhatonisMorniResult"
})
@XmlRootElement(name = "GetOnlineKhatonisMorniResponse")
public class GetOnlineKhatonisMorniResponse {

    @XmlElement(name = "GetOnlineKhatonisMorniResult")
    protected String getOnlineKhatonisMorniResult;

    /**
     * Gets the value of the getOnlineKhatonisMorniResult property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGetOnlineKhatonisMorniResult() {
        return getOnlineKhatonisMorniResult;
    }

    /**
     * Sets the value of the getOnlineKhatonisMorniResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGetOnlineKhatonisMorniResult(String value) {
        this.getOnlineKhatonisMorniResult = value;
    }

}
