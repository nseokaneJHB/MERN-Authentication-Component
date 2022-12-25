FROM node:16
# Create a directory for the app
WORKDIR /server
# Install VI editor incase a file needs to be edited.
RUN apt-get update && apt-get install -y vim
# Install app dependencies
COPY package*.json ./
RUN npm install
# Install nodemon for auto-restart capability
RUN npm i --location=global nodemon
# Copy source directory
COPY . .
CMD [ "yarn", "dev" ]