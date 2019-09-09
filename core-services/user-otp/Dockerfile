FROM egovio/apline-jre:8u121

EXPOSE 8088

COPY /target/user-otp-0.0.1-SNAPSHOT.jar /opt/egov/user-otp.jar
COPY start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh

CMD ["/usr/bin/start.sh"]
