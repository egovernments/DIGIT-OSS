package org.egov.egf.web.controller.microservice;

import javax.servlet.http.HttpServletRequest;

import org.egov.infra.microservice.models.RequestInfoWrapper;
import org.egov.infra.microservice.utils.MicroserviceUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.session.data.redis.RedisOperationsSessionRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

@RestController
public class MSLogoutController {

	private static final Logger LOGGER = LoggerFactory.getLogger(MSLogoutController.class);

	@Autowired
	RedisOperationsSessionRepository redisRepository;

	@Autowired
	MicroserviceUtils microserviceUtils;

	@PostMapping(value = "/rest/logout")
	@ResponseBody
	public ResponseEntity<Object> logout(@RequestBody RequestInfoWrapper request, HttpServletRequest httpReq) {
		LOGGER.info("***Logout initiated***");
		try {
			String accessToken = request.getRequestInfo().getAuthToken();
			String sessionId = httpReq.getSession().getId();
			LOGGER.info("********* Retrieved session::authtoken******** {}::{}", sessionId, accessToken);
                        if (sessionId != null && !sessionId.equalsIgnoreCase("null") && redisRepository != null) {
                            LOGGER.info("*********** Deleting the session for redisrepository {}", sessionId);
                            microserviceUtils.removeSessionFromRedis(accessToken, sessionId);
                        }

		} catch (HttpClientErrorException ex) {

			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}

}
