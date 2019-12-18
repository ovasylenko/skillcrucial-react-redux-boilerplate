FROM node
CMD [ "yarn","dev" ]
WORKDIR /app
COPY package*.json ./
RUN npm config set scripts-prepend-node-path true && yarn install
COPY . .