FROM alpine:3.4

##################################
# INSTALL base environment
##################################
RUN apk add --update \
      musl-dev \
      libc6-compat \
      curl \
      gcc \
  && rm -rf /var/cache/apk/*
COPY . /app
WORKDIR /app

RUN gcc -o client_udp client_udp.c && rm client_udp.c
ENV DEST_HOST 0.0.0.0
ENV DEST_PORT 8000

CMD ["sh", "-c", "/app/client_udp ${DEST_HOST} ${DEST_PORT}"]
