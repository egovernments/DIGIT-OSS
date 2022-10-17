
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
 *         &lt;element name="GetKhasraListByNVCODE2Result" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "getKhasraListByNVCODE2Result"
})
@XmlRootElement(name = "GetKhasraListByNVCODE2Response")
public class GetKhasraListByNVCODE2Response {

    @XmlElement(name = "GetKhasraListByNVCODE2Result")
    protected String getKhasraListByNVCODE2Result;

    /**
     * Gets the value of the getKhasraListByNVCODE2Result property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGetKhasraListByNVCODE2Result() {
        return getKhasraListByNVCODE2Result;
    }

    /**
     * Sets the value of the getKhasraListByNVCODE2Result property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGetKhasraListByNVCODE2Result(String value) {
        this.getKhasraListByNVCODE2Result = value;
    }

}
