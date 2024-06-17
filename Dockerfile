FROM node:20.14.0-alpine3.20

# Copy Node.js application to the /app directory in the container
COPY ./DocInSightBE ./app

# Set working directory
WORKDIR /app

# Add Python and pip to the container
RUN apk add --no-cache python3 py3-pip

# Create a virtual environment and activate it
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Node.js dependencies
RUN npm install --legacy-peer-deps

# Activate the virtual environment to install Python libraries
SHELL ["/bin/sh", "-c", "source /opt/venv/bin/activate && pip install -r ./pythonFile/requirements.txt"]

# Prepare for production
ENV NODE_ENV production
EXPOSE 80

# Start the application

CMD [ "npm", "start", "--host=0.0.0.0"]
