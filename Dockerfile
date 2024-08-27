FROM node:18

# Set a memory swap limit to prevent OOM errors (optional)
ENV NODE_OPTIONS=--max-old-space-size=512

COPY . /root/Anyav2
WORKDIR /root/Anyav2

RUN apt-get update && apt-get install -y ffmpeg

RUN yarn global add npm@latest
RUN yarn install --network-timeout 1000000 --frozen-lockfile

CMD ["npm", "start"]
