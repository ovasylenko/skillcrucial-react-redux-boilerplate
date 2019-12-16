#--------------------------------------STAGE 1-----------------------------
FROM node
# CMD [ "yarn","dev" ]
WORKDIR /app
VOLUME . /app
# ADD package*.json ./
RUN npm config set scripts-prepend-node-path true && yarn
# COPY . .
