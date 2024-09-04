FROM node:lts-buster

RUN apt-get update && \
    apt-get install -y ffmpeg webp && \
    apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*

COPY package.json ./

RUN npm install --only=prod --legacy-peer-deps
RUN npm install pm2 -g

COPY . .

# CMD ["npm", "start"]
CMD ["npm", "startpm2"]
