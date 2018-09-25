# base image
FROM node:9.6.1

# install and cache app dependencies
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
WORKDIR /app

RUN npm install
RUN npm install react-scripts@1.1.1 -g

# install app
COPY src /app/src
COPY public /app/public
RUN mkdir /etc/stack-viz.d && mv /app/src/config/default.json /etc/stack-viz.d/default.json

WORKDIR /app/src
ENV PATH /app/node_modules/.bin:$PATH

# start app
CMD ["npm", "start"]