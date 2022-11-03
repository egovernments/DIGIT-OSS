
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
 *         &lt;element name="GetOwnerList4Result" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "getOwnerList4Result"
})
@XmlRootElement(name = "GetOwnerList4Response")
public class GetOwnerList4Response {

    @XmlElement(name = "GetOwnerList4Result")
    protected String getOwnerList4Result;

    /**
     * Gets the value of the getOwnerList4Result property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGetOwnerList4Result() {
        return getOwnerList4Result;
    }

    /**
     * Sets the value of the getOwnerList4Result property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGetOwnerList4Result(String value) {
        this.getOwnerList4Result = value;
    }

}
