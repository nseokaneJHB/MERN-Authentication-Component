# here we're specifying the version of node
# we can use the :latest tag as well.
FROM node:16-alpine

# Adding nodemon
RUN yarn global add nodemon

# Create an application directory
RUN mkdir -p /server

# here we're defining the working directory
WORKDIR /server

# copying our dependencies to the container
COPY ./package.json /server

# installing all the dependencies that we copied 
RUN yarn install

# copying all the files inside the container
COPY . /server

# exposing the port so we can access it further
EXPOSE 8000

# starting the server
CMD ["yarn", "dev"]