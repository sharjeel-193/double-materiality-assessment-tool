FROM node:20
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3000
ENV WATCHPACK_POLLING=true
CMD ["npm", "run", "dev"]
