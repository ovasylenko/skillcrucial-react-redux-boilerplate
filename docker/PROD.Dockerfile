#--------------------------------------STAGE 1-----------------------------
FROM node:alpine AS nodeServer
CMD [ "yarn","start" ]
WORKDIR /app
COPY package*.json ./
RUN npm config set scripts-prepend-node-path true && yarn install
COPY . .
RUN yarn build --silent --only=production --ignore-optional
#--------------------------------------STAGE 2-----------------------------
FROM nginx:alpine AS webServer
WORKDIR /app
COPY --from=nodeServer /app/dist/ /app/public/
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
