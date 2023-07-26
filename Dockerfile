FROM node:lts-buster

RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  npm i pm2 -g && \
  rm -rf /var/lib/apt/lists/*

COPY package.json .

RUN npm install

RUN npm install -g npm@latest

COPY . .

CMD ["pm2-runtime", "."]
