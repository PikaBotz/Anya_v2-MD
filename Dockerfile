FROM node:lts-buster

RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*

COPY package.json .

RUN yarn global add npm

RUN yarn global add yarn

RUN yarn global add pm2

RUN yarn global add forever

RUN yarn install

RUN rm -rf yarn*

COPY . .

RUN yarn install

CMD ["node", "Anyaindex.js"]
