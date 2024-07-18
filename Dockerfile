FROM node:18

COPY . /root/Anyav2
WORKDIR /root/Anyav2

RUN apt-get update && apt-get install -y ffmpeg

RUN npm install npm@latest --force
RUN npm install --force

EXPOSE 8080

CMD ["node", "index.js"]
