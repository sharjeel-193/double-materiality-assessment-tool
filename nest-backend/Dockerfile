FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/


COPY . .
EXPOSE 4000
ENV WATCHPACK_POLLING=true
CMD npx prisma generate && npm run start:dev
