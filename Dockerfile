FROM node:18

# Set environment variable to limit Node.js memory usage
ENV NODE_OPTIONS=--max-old-space-size=512

COPY . /root/Anyav2
WORKDIR /root/Anyav2

RUN apt-get update && apt-get install -y ffmpeg

# Skip npm global install to reduce memory usage
# RUN yarn global add npm@latest

# Install dependencies with network timeout and frozen lockfile options
RUN yarn install --network-timeout 1000000 --frozen-lockfile

CMD ["npm", "start"]
