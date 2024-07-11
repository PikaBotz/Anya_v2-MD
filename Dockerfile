FROM quay.io/teamolduser/docker

COPY . /root/Anyav2
WORKDIR /root/Anyav2
RUN apt install ffmpeg
RUN yarn install --network-concurrency 1
EXPOSE 3000
CMD ["yarn", "start"]
