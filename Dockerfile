FROM node:18

COPY . /root/Anyav2
WORKDIR /root/Anyav2

RUN apt-get update && apt-get install -y ffmpeg

RUN yarn global add npm@latest
RUN yarn install

CMD ["npm", "start"]
