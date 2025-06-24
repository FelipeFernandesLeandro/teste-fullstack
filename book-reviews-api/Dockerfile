FROM node:20

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]
