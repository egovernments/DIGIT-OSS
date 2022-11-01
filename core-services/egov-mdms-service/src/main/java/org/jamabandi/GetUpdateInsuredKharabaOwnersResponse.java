
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
 *         &lt;element name="GetUpdateInsuredKharabaOwnersResult" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "getUpdateInsuredKharabaOwnersResult"
})
@XmlRootElement(name = "GetUpdateInsuredKharabaOwnersResponse")
public class GetUpdateInsuredKharabaOwnersResponse {

    @XmlElement(name = "GetUpdateInsuredKharabaOwnersResult")
    protected String getUpdateInsuredKharabaOwnersResult;

    /**
     * Gets the value of the getUpdateInsuredKharabaOwnersResult property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGetUpdateInsuredKharabaOwnersResult() {
        return getUpdateInsuredKharabaOwnersResult;
    }

    /**
     * Sets the value of the getUpdateInsuredKharabaOwnersResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGetUpdateInsuredKharabaOwnersResult(String value) {
        this.getUpdateInsuredKharabaOwnersResult = value;
    }

}
