FROM node:14

RUN git clone https://github.com/PikaBotz /root/PikaBotz
WORKDIR /root/PikaBotz/
RUN npm install npm@latest
RUN npm install
EXPOSE 8000
CMD ["npm", "start"]
