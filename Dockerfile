FROM node:14

COPY . /root/Anyav2
WORKDIR /root/Anyav2
RUN apt install ffmpeg
RUN npm install npm@latest
RUN npm install
EXPOSE 8000
CMD ["npm", "start"]
