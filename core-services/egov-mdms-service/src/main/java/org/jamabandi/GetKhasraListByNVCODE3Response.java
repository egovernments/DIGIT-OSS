
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
 *         &lt;element name="GetKhasraListByNVCODE3Result" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "getKhasraListByNVCODE3Result"
})
@XmlRootElement(name = "GetKhasraListByNVCODE3Response")
public class GetKhasraListByNVCODE3Response {

    @XmlElement(name = "GetKhasraListByNVCODE3Result")
    protected String getKhasraListByNVCODE3Result;

    /**
     * Gets the value of the getKhasraListByNVCODE3Result property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGetKhasraListByNVCODE3Result() {
        return getKhasraListByNVCODE3Result;
    }

    /**
     * Sets the value of the getKhasraListByNVCODE3Result property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGetKhasraListByNVCODE3Result(String value) {
        this.getKhasraListByNVCODE3Result = value;
    }

}
