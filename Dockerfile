FROM node:18-alpine

ARG BOT_TOKEN
ENV BOT_TOKEN=${BOT_TOKEN}
ENV PORT=3000

WORKDIR /app
COPY package*.json ./
RUN npm i
RUN npm i -g typescript
COPY . .
RUN npm run build
COPY . .
RUN rm -rf src
CMD ["node", "dist/index.js"]
EXPOSE 3000