FROM node:20
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
COPY prisma ./prisma/
RUN npx prisma generate
EXPOSE 4000
CMD ["npm", "run", "start:dev"]
