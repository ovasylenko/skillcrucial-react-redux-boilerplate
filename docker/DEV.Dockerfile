FROM node:alpine
CMD yarn dev
WORKDIR /app
COPY package*.json ./
RUN yarn install
# npm config set scripts-prepend-node-path true &&
# COPY . .