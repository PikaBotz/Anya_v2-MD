FROM node:18

COPY . /root/Anyav2
WORKDIR /root/Anyav2

RUN apt-get update && apt-get install -y ffmpeg

RUN npm install npm@latest
RUN npm install

EXPOSE 8080

# Specify the command to run your application
CMD ["node", "index.js"]
