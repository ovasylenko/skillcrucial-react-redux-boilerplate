FROM node
CMD [ "yarn","dev" ]
WORKDIR /app
ADD ./*.* ./
ADD webpack.development.config.js ./
RUN npm config set scripts-prepend-node-path true && yarn install
