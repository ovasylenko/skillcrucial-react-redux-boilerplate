FROM node
# CMD [ "yarn","run","dev" ]
WORKDIR /app
# ADD package*.json ./
RUN npm config set scripts-prepend-node-path true && yarn install
# COPY . .
