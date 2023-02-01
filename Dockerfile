#Build node image from Node Docker Hub
FROM node:16

#Make app directory in container
RUN mkdir /app

#Identify working directory
WORKDIR /app

#Copy package
COPY package.json /app

#Copy over app to app folder
COPY . /app

#Install npm packages from package.json
RUN npm install --force

# Run the app as a non-privileged user
RUN chown -R 1000690000:0 . && chmod -R g+s+rw .
USER 1000690000

#Expose server at port ( accessible outside of container)
EXPOSE 8080 

#Start app 
CMD ["node", "server/server.js"]