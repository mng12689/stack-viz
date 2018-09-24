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
COPY ./src /app
WORKDIR /app

RUN gcc -o server_udp server_udp.c && rm *.c
ENV PORT 8000

CMD ["sh", "-c", "/app/server_udp ${PORT}"]