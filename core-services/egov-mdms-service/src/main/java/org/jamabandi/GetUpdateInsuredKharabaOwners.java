
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
 *         &lt;element name="Key" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="DCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="TCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="NVCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="jamperiod" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="khewat" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="khatoni" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="kashat" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="block" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="nameid" type="{http://www.w3.org/2001/XMLSchema}int"/&gt;
 *         &lt;element name="chk" type="{http://www.w3.org/2001/XMLSchema}boolean"/&gt;
 *         &lt;element name="remarks" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
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
    "key",
    "dCode",
    "tCode",
    "nvCode",
    "jamperiod",
    "khewat",
    "khatoni",
    "kashat",
    "block",
    "nameid",
    "chk",
    "remarks"
})
@XmlRootElement(name = "GetUpdateInsuredKharabaOwners")
public class GetUpdateInsuredKharabaOwners {

    @XmlElement(name = "Key")
    protected String key;
    @XmlElement(name = "DCode")
    protected String dCode;
    @XmlElement(name = "TCode")
    protected String tCode;
    @XmlElement(name = "NVCode")
    protected String nvCode;
    protected String jamperiod;
    protected String khewat;
    protected String khatoni;
    protected String kashat;
    protected int block;
    protected int nameid;
    protected boolean chk;
    protected String remarks;

    /**
     * Gets the value of the key property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getKey() {
        return key;
    }

    /**
     * Sets the value of the key property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setKey(String value) {
        this.key = value;
    }

    /**
     * Gets the value of the dCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDCode() {
        return dCode;
    }

    /**
     * Sets the value of the dCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDCode(String value) {
        this.dCode = value;
    }

    /**
     * Gets the value of the tCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTCode() {
        return tCode;
    }

    /**
     * Sets the value of the tCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTCode(String value) {
        this.tCode = value;
    }

    /**
     * Gets the value of the nvCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getNVCode() {
        return nvCode;
    }

    /**
     * Sets the value of the nvCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setNVCode(String value) {
        this.nvCode = value;
    }

    /**
     * Gets the value of the jamperiod property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getJamperiod() {
        return jamperiod;
    }

    /**
     * Sets the value of the jamperiod property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setJamperiod(String value) {
        this.jamperiod = value;
    }

    /**
     * Gets the value of the khewat property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getKhewat() {
        return khewat;
    }

    /**
     * Sets the value of the khewat property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setKhewat(String value) {
        this.khewat = value;
    }

    /**
     * Gets the value of the khatoni property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getKhatoni() {
        return khatoni;
    }

    /**
     * Sets the value of the khatoni property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setKhatoni(String value) {
        this.khatoni = value;
    }

    /**
     * Gets the value of the kashat property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getKashat() {
        return kashat;
    }

    /**
     * Sets the value of the kashat property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setKashat(String value) {
        this.kashat = value;
    }

    /**
     * Gets the value of the block property.
     * 
     */
    public int getBlock() {
        return block;
    }

    /**
     * Sets the value of the block property.
     * 
     */
    public void setBlock(int value) {
        this.block = value;
    }

    /**
     * Gets the value of the nameid property.
     * 
     */
    public int getNameid() {
        return nameid;
    }

    /**
     * Sets the value of the nameid property.
     * 
     */
    public void setNameid(int value) {
        this.nameid = value;
    }

    /**
     * Gets the value of the chk property.
     * 
     */
    public boolean isChk() {
        return chk;
    }

    /**
     * Sets the value of the chk property.
     * 
     */
    public void setChk(boolean value) {
        this.chk = value;
    }

    /**
     * Gets the value of the remarks property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRemarks() {
        return remarks;
    }

    /**
     * Sets the value of the remarks property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRemarks(String value) {
        this.remarks = value;
    }

}
