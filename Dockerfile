FROM quay.io/teamolduser/docker

COPY . /root/Anyav2
WORKDIR /root/Anyav2

RUN yarn install
CMD ["yarn", "start"]
