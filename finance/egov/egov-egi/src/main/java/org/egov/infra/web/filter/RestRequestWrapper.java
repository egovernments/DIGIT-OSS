package org.egov.infra.web.filter;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Collections;
import java.util.Enumeration;
import java.util.Map;
import java.util.TreeMap;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import org.apache.commons.io.IOUtils;

public class RestRequestWrapper extends HttpServletRequestWrapper {
    
    private String  strBody;
    private Map<String,String[]> reqParamMap;
    
    public RestRequestWrapper(HttpServletRequest request) throws IOException {
        super(request);
        
        strBody =  IOUtils.toString(request.getInputStream());
        reqParamMap = new TreeMap<String,String[]>();
        reqParamMap.putAll(request.getParameterMap());
    }
    
    @Override
    public ServletInputStream getInputStream() throws IOException{
        final ByteArrayInputStream bsiStream = new ByteArrayInputStream(strBody.getBytes("UTF-8"));
        System.out.println("********** getinputstream request************* ");
        
        return new ServletInputStream() {
            
            @Override
            public int read() throws IOException {
                
             /*   System.out.println("**************** read() ***************");
                System.out.println(strBody);*/
                return bsiStream.read();
            }
            
            @Override
            public void setReadListener(ReadListener readListener) {
                throw new RuntimeException("Not implemented");
            }
            
            @Override
            public boolean isReady() {
                return true;
            }
            
            @Override
            public boolean isFinished() {
              return  bsiStream.available() == 0;
//                return false;
            }
        };
    }
    
    @Override
    public BufferedReader getReader()throws IOException{
        return new BufferedReader(new InputStreamReader(this.getInputStream()));
    }
    
    @Override
    public String getParameter(final String name){
      String[] strings = reqParamMap.get(name);
      if(strings!=null){
          return strings[0];
      }
      
      return super.getParameter(name);
  }
    
  @Override
  public Map<String,String[]> getParameterMap(){
      
      return Collections.unmodifiableMap(reqParamMap);
  }
  
  @Override
  public Enumeration<String> getParameterNames()
  {
      return Collections.enumeration(getParameterMap().keySet());
  }

  @Override
  public String[] getParameterValues(final String name)
  {
      return getParameterMap().get(name);
  }

}
