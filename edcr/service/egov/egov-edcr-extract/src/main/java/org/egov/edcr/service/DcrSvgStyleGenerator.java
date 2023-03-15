package org.egov.edcr.service;

 
	 
	import java.util.Map;
	import org.kabeja.dxf.DXFStyle;
	import org.kabeja.svg.SVGUtils;
	import org.kabeja.tools.FontManager;
	import org.xml.sax.ContentHandler;
	import org.xml.sax.SAXException;
	import org.xml.sax.helpers.AttributesImpl;

	public class DcrSvgStyleGenerator
	{

	    public DcrSvgStyleGenerator()
	    {
	    }

	    public static void toSAX(ContentHandler handler, Map svgContext, DXFStyle style)
	        throws SAXException
	    {
	        FontManager manager = FontManager.getInstance();
	        if(manager.hasFontDescription(style.getBigFontFile()))
	            generateSAXFontDescription(handler, style.getBigFontFile());
	        else
	        if(manager.hasFontDescription(style.getFontFile()))
	            generateSAXFontDescription(handler, style.getFontFile());
	       /* else
	            generateSAXFontDescription(handler, "romans");*/  
	    }

	    protected static void generateSAXFontDescription(ContentHandler handler, String font)
	        throws SAXException
	    {
	        font = font.toLowerCase();
	        if(font.endsWith(".shx"))
	            font = font.substring(0, font.indexOf(".shx"));
	        AttributesImpl attr = new AttributesImpl();
	        
	        SVGUtils.addAttribute(attr, "font-family", font);
	        SVGUtils.addAttribute(attr, "font-face", "Regular");
	        SVGUtils.startElement(handler, "font-face", attr);
	        attr = new AttributesImpl();
	        SVGUtils.startElement(handler, "font-face-src", attr);
	        attr = new AttributesImpl();
	        
	      //  String url = FontManager.getInstance().getFontDescription(font) + "#" + font;
	        String url = "file:///usr/share/fonts/truetype/msttcorefonts/Times_New_Roman.ttf" + "#" + font;
	        attr.addAttribute("", "", "xmlns:xlink", "CDATA", "http://www.w3.org/1999/xlink");
	        attr.addAttribute("http://www.w3.org/1999/xlink", "href", "xlink:href", "CDATA", url);
	        SVGUtils.emptyElement(handler, "font-face-uri", attr);
	        SVGUtils.endElement(handler, "font-face-src");
	        SVGUtils.endElement(handler, "font-face");
	    }
	}

 
 
