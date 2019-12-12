#--------------------------------------STAGE 1-----------------------------
FROM node:latest
CMD [ "yarn","dev" ]
WORKDIR /app
ADD package*.json ./
RUN npm config set scripts-prepend-node-path true && yarn
# COPY . .
