# base image
FROM node:9.6.1

# install and cache app dependencies
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
WORKDIR /app

RUN npm install --production

# install app
COPY src /app/src
WORKDIR /app

ENV INGRESS_PORT 8000
ENV WS_PORT 8080 

# start app
CMD ["npm", "start"]