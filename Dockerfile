FROM node:18

# Set environment variable to limit Node.js memory usage
#ENV NODE_OPTIONS=--max-old-space-size=512

COPY . /root/Anyav2
WORKDIR /root/Anyav2

RUN apt-get update && apt-get install -y ffmpeg

# Install dependencies with additional flags to disable optional dependencies
RUN npm install
#--network-timeout 1000000 --frozen-lockfile --ignore-optional --verbose

CMD ["npm", "start"]
