FROM node:lts-buster
RUN apt-get update && \
    apt-get install -y ffmpeg
RUN git clone https://github.com/PikaBotz/Anya_v2-MD /root/PikaBotz
WORKDIR /root/PikaBotz/
COPY package.json yarn.lock ./
RUN npm install -g npm@latest
RUN yarn install --network-concurrency 1
COPY . .
EXPOSE 8000
CMD ["yarn", "start"]
