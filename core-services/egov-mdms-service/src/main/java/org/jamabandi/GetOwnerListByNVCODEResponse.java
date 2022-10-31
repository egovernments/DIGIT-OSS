
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
 *         &lt;element name="GetOwnerListByNVCODEResult" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "getOwnerListByNVCODEResult"
})
@XmlRootElement(name = "GetOwnerListByNVCODEResponse")
public class GetOwnerListByNVCODEResponse {

    @XmlElement(name = "GetOwnerListByNVCODEResult")
    protected String getOwnerListByNVCODEResult;

    /**
     * Gets the value of the getOwnerListByNVCODEResult property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGetOwnerListByNVCODEResult() {
        return getOwnerListByNVCODEResult;
    }

    /**
     * Sets the value of the getOwnerListByNVCODEResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGetOwnerListByNVCODEResult(String value) {
        this.getOwnerListByNVCODEResult = value;
    }

}
