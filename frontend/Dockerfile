# here we're specifying the version of node
# we can use the :latest tag as well.
FROM node:16-alpine

# Create an application directory
RUN mkdir -p /frontend

# here we're defining the working directory
WORKDIR /frontend

# copying our dependencies to the container
COPY package.json /frontend/

# installing all the dependencies that we copied 
RUN yarn install

# copying all the files inside the container
COPY . /frontend/

# Build the application
RUN yarn build

# exposing the port so we can access it further
EXPOSE 3000

# starting the server
CMD [ "yarn", "start" ]