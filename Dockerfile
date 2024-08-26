FROM node:14

COPY . /root/Anyav2
WORKDIR /root/Anyav2

RUN apt-get update && apt-get install -y ffmpeg

RUN yarn cache clean --force && yarn install
RUN yarn global add npm@latest
RUN yarn install

CMD ["npm", "start"]
