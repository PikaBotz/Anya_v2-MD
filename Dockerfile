FROM node:lts-buster

# Install required packages and clean up
RUN apt-get update && \
    apt-get install -y ffmpeg webp && \
    apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install --only=prod

# Copy all other files
COPY . .
# Start the application
CMD ["npm", "start"]
