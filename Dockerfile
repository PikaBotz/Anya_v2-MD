# Use a smaller base image for optimization
FROM node:14-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV YARN_CACHE_FOLDER /root/.cache/yarn

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# Expose the application port
EXPOSE 8000

# Start the application
CMD ["yarn", "start"]
