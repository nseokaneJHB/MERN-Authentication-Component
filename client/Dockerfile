FROM node:16-alpine
# Create app directory
WORKDIR /client
COPY package.json yarn.lock ./
COPY . .
# Install app dependencies
RUN yarn install
ENV NODE_ENV=development
CMD [ "yarn", "start" ]