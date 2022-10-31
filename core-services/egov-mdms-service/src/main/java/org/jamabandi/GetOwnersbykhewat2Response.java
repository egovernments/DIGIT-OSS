
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
 *         &lt;element name="GetOwnersbykhewat2Result" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "getOwnersbykhewat2Result"
})
@XmlRootElement(name = "GetOwnersbykhewat2Response")
public class GetOwnersbykhewat2Response {

    @XmlElement(name = "GetOwnersbykhewat2Result")
    protected String getOwnersbykhewat2Result;

    /**
     * Gets the value of the getOwnersbykhewat2Result property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGetOwnersbykhewat2Result() {
        return getOwnersbykhewat2Result;
    }

    /**
     * Sets the value of the getOwnersbykhewat2Result property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGetOwnersbykhewat2Result(String value) {
        this.getOwnersbykhewat2Result = value;
    }

}
