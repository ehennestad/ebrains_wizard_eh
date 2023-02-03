# Build node image from Node Docker Hub
FROM node:16

# Make app directory in container
RUN mkdir /app

# Identify working directory
WORKDIR /app

# Copy over app to app folder
COPY . /app

# Install rpm packages from package.json
RUN npm install --force

# Run the app as a non-privileged user
RUN chown -R 1001:0 . && chmod -R gu+s+rw .
USER 1001

# Expose server at port ( accessible outside of container)
EXPOSE 8080 

# Start app. Need to run setup first to prepare the app for production
CMD node setup.js && node server/server.js

# To build, use the following command:
# docker build .

# To build for Open Shift (from Apple Pro M1), use the following command:
# docker build --platform=linux/amd64 .

# To run, use the following command:
# docker run -it -d -P --name wizard --env OIDC_CLIENT_SECRET=$OIDC_CLIENT_SECRET <IMAGE ID>

# To push to EBRAINS Docker registry
# docker login docker-registry.ebrains.eu

# docker image tag <image id> docker-registry.ebrains.eu/<project_name>/<repository_name>:<tag>
# docker push docker-registry.ebrains.eu/<project_name>/<repository_name>:<tag>

# Example:
# docker image tag ddb2fe9a8083 docker-registry.ebrains.eu/ebrains_wizard_test/wizard_dev:0.1.2
# docker push docker-registry.ebrains.eu/ebrains_wizard_test/wizard_dev:0.1.2
