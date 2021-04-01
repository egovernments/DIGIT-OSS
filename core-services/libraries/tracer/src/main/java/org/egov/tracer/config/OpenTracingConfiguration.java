package org.egov.tracer.config;

import io.opentracing.Span;
import io.opentracing.contrib.spring.tracer.configuration.TracerAutoConfiguration;
import io.opentracing.contrib.web.servlet.filter.ServletFilterSpanDecorator;
import org.slf4j.MDC;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

import static org.egov.tracer.constants.TracerConstants.CORRELATION_ID_OPENTRACING_FORMAT;
import static org.egov.tracer.constants.TracerConstants.CORRELATION_ID_MDC;

@Configuration
@ConditionalOnWebApplication
@AutoConfigureAfter({TracerAutoConfiguration.class})
@ConditionalOnClass({WebMvcConfigurerAdapter.class})
@ConditionalOnProperty(
    name = {"tracer.opentracing.enabled"},
    havingValue = "true",
    matchIfMissing = false
)
public class OpenTracingConfiguration {

    /**
     * Jaeger Tracer instance configured via environment variables
     *
     * @return Tracer implementation
     */
    @Bean
    public io.opentracing.Tracer jaegerTracer() {
        return io.jaegertracing.Configuration.fromEnv()
            .getTracer();
    }

    /**
     * Use span decorator to add a correlation id span tag
     *
     * Filter order configured to run after Tracer Filter
     *
     * @return span decorators
     */
    @Bean
    public List<ServletFilterSpanDecorator> spanDecorator(){
        List<ServletFilterSpanDecorator> decorators = new ArrayList<>();
        decorators.add(ServletFilterSpanDecorator.STANDARD_TAGS);
        decorators.add(new ServletFilterSpanDecorator() {
            @Override
            public void onRequest(HttpServletRequest httpServletRequest, Span span) {
                span.setTag(CORRELATION_ID_OPENTRACING_FORMAT, MDC.get(CORRELATION_ID_MDC));
            }

            @Override
            public void onResponse(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Span span) {

            }

            @Override
            public void onError(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Throwable throwable, Span span) {

            }

            @Override
            public void onTimeout(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, long l, Span span) {

            }
        });

        return decorators;
    }

}
