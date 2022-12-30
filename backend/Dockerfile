# here we're specifying the version of node
# we can use the :latest tag as well.
FROM node:16-alpine

# Adding nodemon
RUN yarn global add nodemon

# Create an application directory
RUN mkdir -p /backend

# here we're defining the working directory
WORKDIR /backend

# copying our dependencies to the container
COPY package.json /backend/

# installing all the dependencies that we copied 
RUN yarn install

# copying all the files inside the container
COPY . /backend/

# exposing the port so we can access it further
EXPOSE 8000

# starting the backend
CMD ["yarn", "dev"]