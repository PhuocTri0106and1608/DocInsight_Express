FROM node:20.14.0-alpine3.20

# Copy Node.js application to the /app directory in the container
COPY ./DocInSightBE ./app

# Set working directory
WORKDIR /app

# Install Node.js dependencies
RUN npm install --legacy-peer-deps

# Prepare for production
ENV NODE_ENV production
EXPOSE 80

# Start the application
CMD [ "npm", "start", "--host=0.0.0.0"]
